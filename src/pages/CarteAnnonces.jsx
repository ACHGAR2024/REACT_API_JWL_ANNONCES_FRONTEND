import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { getCityCoordinates } from '../utils/geocode'; // Assurez-vous que le chemin d'importation est correct

const MyMap = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/announcements');
        const announcementsData = response.data.announcements || [];

        // Obtenez les coordonnées pour chaque ville et mettez à jour les markers
        const markersWithCoordinates = await Promise.all(
          announcementsData.map(async (announcement) => {
            try {
              const { lat, lon } = await getCityCoordinates(announcement.place);
              return {
                position: [lat, lon],
                popup: (`${announcement.title}     -      ${announcement.price}€ `),
                
                
              };
            } catch (error) {
              console.error(`Erreur pour ${announcement.place}: ${error.message}`);
              return null;
            }
          })
        );

        // Filtrez les markers non trouvés (null) et mettez à jour les états
        setMarkers(markersWithCoordinates.filter(marker => marker !== null));
      } catch (error) {
        console.error('Erreur lors de la récupération des annonces', error);
      }
    };

    fetchAnnouncements();
  }, []);

  // Filtrer les annonces en fonction du terme de recherche
  const filteredMarkers = markers.filter(marker =>
    marker.popup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          zIndex: 1000
        }}
      />
      <MapContainer center={[48.8566, 2.3522]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredMarkers.map((marker, index) => (
          <Marker key={index} position={marker.position}>
            <Popup>{marker.popup}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MyMap;
