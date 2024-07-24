import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getCityCoordinates } from '../utils/geocode';
import PropTypes from 'prop-types';
import Notification from '../components/Notification';
import { AuthContext } from '../context/AuthContext';
import SellerInfo from '../components/SellerInfo';

// Configuration de l'icône par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const FicheAnnonce = () => {
  const [position, setPosition] = useState(null);
  const [announcement, setAnnouncement] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/announcements/${id}`);
        setAnnouncement(response.data.announcement);
        const { place } = response.data.announcement;

        if (place) {
          const { lat, lon } = await getCityCoordinates(place);
          setPosition([lat, lon]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'annonce', error);
        setError('Erreur lors de la récupération de l\'annonce. Veuillez vérifier l\'ID ou l\'URL.');
      }
    };

    fetchAnnouncement();
  }, [id]);

  const handleSendMessage = async () => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/messages',
        { announcement_id: id, content: message },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      Notification.success('Message envoyé avec succès !');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message', error);
    }
  };

  const handleFavorite = async () => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/messages/favorite',
        { announcement_id: id, content: 'Favoris Ajouté', status: 'En attente' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setIsFavorite(true);
      Notification.success('Annonce ajoutée aux favoris avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris', error);
      Notification.error('Erreur lors de l\'ajout aux favoris');
    }
  };

  const handleReport = async () => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/messages/report',
        { announcement_id: id, content: 'Signalement Ajouté', status: 'En attente' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setIsReported(true);
      Notification.success('Annonce signalée avec succès !');
    } catch (error) {
      console.error('Erreur lors du signalement', error);
    }
  };

  if (error) return <div>{error}</div>;
  if (!announcement) return <div>Chargement des données...</div>;

  const { title, price, description, photo, place, user_id } = announcement;

  const formatTarifsWithSpaces = (tarifs) => {
    return tarifs.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const TarifsComponent = ({ tarifs }) => {
    const formattedTarifs = formatTarifsWithSpaces(parseFloat(tarifs));
    return <p className="mt-2 text-gray-600 text-2xl font-extrabold">{formattedTarifs} €</p>;
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20 mb-40 z-40">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 p-4">
            <img className="w-full object-cover" src={`http://127.0.0.1:8000${photo}`} alt={title} />
            <div className="h-64 mb-4 mt-5">
              {position ? (
                <MapContainer center={position} zoom={13} className="h-full z-30">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={position}>
                    <Popup>{place}</Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <p className="mt-6 text-gray-500 text-2xl font-extrabold">Lieu : {place}</p>
            <SellerInfo sellerId={user_id} />
          </div>
          <div className="md:w-1/2 p-4">
            <div className="uppercase tracking-wide text-green-700 font-semibold text-lg ">
              {new Date().toLocaleDateString()}
            </div>
            <h1 className="mt-1 text-3xl font-semibold text-gray-900">{title}</h1>
            <TarifsComponent tarifs={price.toString()} />
            <p className="mt-4 text-gray-500">{description}</p>
            <div className="mt-6">
              <button
                onClick={handleFavorite}
                disabled={isFavorite}
                className={`mr-3 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isFavorite ? 'bg-gray-200' : ''}`}
              >
                <i className="fas fa-heart mr-2"></i> {isFavorite ? 'Ajouté aux favoris' : 'Ajouter aux favoris'}
              </button>
              <button
                onClick={handleReport}
                disabled={isReported}
                className={`inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isReported ? 'bg-gray-200' : ''}`}
              >
                <i className="fas fa-flag mr-2"></i> {isReported ? 'Signalé' : 'Signaler'}
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="mt-6"
            >
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Votre message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 sm:text-sm"
                  placeholder="Écrivez votre message ici..."
                ></textarea>
              </div>
              {isAuthenticated ? (
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Envoyer
                </button>
              ) : (
                <div className="m-6">
                  <a href="/login" className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                    Connectez-vous pour envoyer un message
                  </a>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

FicheAnnonce.propTypes = {
  tarifs: PropTypes.number,
};

export default FicheAnnonce;
