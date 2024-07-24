import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';

const DeposerAnnonce = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    place: '',
    photo: null,
  });

  const [categories, setCategories] = useState([]);
  const [suggestedCities, setSuggestedCities] = useState([]); // État pour stocker les suggestions de villes
  const { token } = useContext(AuthContext);
  const user = useContext(UserContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories', error);
      }
    };

    if (token) {
      fetchCategories();
    }
  }, [token]);

  const handlePlaceSearch = async (e) => {
    const searchQuery = e.target.value;
    setFormData({
      ...formData,
      place: searchQuery,
    });

    if (searchQuery.length >= 3) { // Rechercher les villes après 3 caractères
      try {
        const response = await axios.get(`https://geo.api.gouv.fr/communes?nom=${searchQuery}&fields=nom&format=json`);
        setSuggestedCities(response.data || []);
      } catch (error) {
        console.error('Erreur lors de la recherche de villes', error);
      }
    } else {
      setSuggestedCities([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user) {
        console.error('Erreur : ID utilisateur non disponible');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('place', formData.place); // Ajout de la ville sélectionnée
      formDataToSend.append('photo', formData.photo);

      const user_id = user.id;

      const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      formDataToSend.append('publication_date', currentDate);
      formDataToSend.append('user_id', user_id);

      await axios.post(
        'http://127.0.0.1:8000/api/announcements',
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      Notification.success('Annonce ajoutée avec succès !');
      navigate('/dashboard');
      //console.log('Réponse de création d\'annonce :', response.data);

      setFormData({
        title: '',
        description: '',
        price: '',
        category_id: '',
        place: '',
        photo: null,
      });

    } catch (error) {
      console.error('Erreur lors de la création de l\'annonce :', error.response);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'photo') {
      setFormData({
        ...formData,
        photo: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20 mb-72 w-1/2">
      <h1 className="text-3xl font-bold mb-8 text-black">Déposer une annonce</h1>

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
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category_id">
            Catégorie
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="place">
            Ville
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="place"
            type="text"
            placeholder="Rechercher une commune…"
            name="place"
            value={formData.place}
            onChange={handlePlaceSearch}
            required
          />
          {suggestedCities.length > 0 && (
            <ul className="shadow border rounded mt-2 w-full bg-white">
              {suggestedCities.map((ville) => (
                <li
                  key={ville.code}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setFormData({ ...formData, place: ville.nom });
                    setSuggestedCities([]);
                  }}
                >
                  {ville.nom}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
            Photo
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="photo"
            type="file"
            accept="image/*"
            name="photo"
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button 
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Déposer annonce
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeposerAnnonce;
