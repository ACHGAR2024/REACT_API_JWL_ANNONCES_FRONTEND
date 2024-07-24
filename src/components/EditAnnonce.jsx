import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import Notification from './Notification';

const EditAnnonce = () => {
  const { id } = useParams(); // Récupère l'ID de l'annonce depuis l'URL
  const navigate = useNavigate(); // rediriger l'utilisateur
  const [announcement, setAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    user_id: '',
    photo: null,
  });

  const { token } = useContext(AuthContext);
  const user = useContext(UserContext);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/announcements/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        const { announcement } = response.data;
        setAnnouncement(announcement);
        setFormData({
          title: announcement.title,
          description: announcement.description,
          price: announcement.price,
          user_id: announcement.user_id,
          photo: null,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération de l'annonce", error);
      }
    };

    fetchAnnouncement();
  }, [id, token]);

  // Vérification si l'utilisateur connecté est propriétaire de l'annonce
  if (announcement && user && user.id !== announcement.user_id) {
    return <div>Vous n êtes pas autorisé à modifier cette annonce.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('user_id', formData.user_id);
      formDataToSend.append('_method', 'PUT'); // Ajout champ _method pour indiquer une méthode PUT
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      await axios.post(`http://127.0.0.1:8000/api/announcements/${id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      //console.log("Réponse de modification d'annonce :", response.data);

      // Affichage dee message de succès avec Notiflix
      Notification.success('Annonce modifiée avec succès !');

      // Rediriction de l'utilisateur vers une autre page après un court délai
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000); // Redirection après 2 secondes
    } catch (error) {
      Notification.failure("Erreur lors de la modification de l'annonce");
      console.error("Erreur lors de la modification de l'annonce :", error.response);
      // Gérez les erreurs de modification d'annonce
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: files ? files[0] : value,
    }));
  };

  if (!announcement) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20 mb-72 w-1/3">
      <h1 className="text-3xl font-bold mb-8 text-black">Modifier annonce</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Titre annonce
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Titre de votre annonce"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Décrivez votre annonce en détail"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Prix
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            type="number"
            placeholder="Prix en euros"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
            Photo
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="photo"
            type="file"
            name="photo"
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Modifier annonce
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAnnonce;
