import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';


const LieuAnnoncesRecherche = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchRegion, setSearchRegion] = useState('');
  const { token } = useContext(AuthContext);
  // const user = useContext(UserContext); // Supprimer cette ligne si `user` n'est pas utilisé

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/announcements', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        setAnnouncements(response.data.announcements || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des annonces', error);
      }
    };

    fetchAnnouncements();
  }, [token]);

  const handleSearch = (event) => {
    setSearchRegion(event.target.value);
  };

  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.place.toLowerCase().includes(searchRegion.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 mt-20 mb-40">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par région"
          value={searchRegion}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full"
        />
      </div>
      {filteredAnnouncements.length > 0 ? (
        filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className="mb-4 p-4 border border-gray-300 rounded-md shadow-sm">
            <a href={`/fiche-annonce/${announcement.id}`} className="text-blue-500 hover:text-blue-700">
              <img src={`http://127.0.0.1:8000${announcement.photo}`} alt={announcement.title} className="w-full h-64 object-cover mb-4" />
              <h2 className="text-xl font-semibold">{announcement.title}</h2>
              <p className="text-gray-500">Lieu : {announcement.place}</p>
              <p className="text-gray-700 font-bold">Prix : {announcement.price} €</p>
            </a>
          </div>
        ))
      ) : (
        <p>Aucune annonce trouvée pour cette région.</p>
      )}
    </div>
  );
};

export default LieuAnnoncesRecherche;
