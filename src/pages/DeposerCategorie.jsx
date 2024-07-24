import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';

const DeposerCategorie = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    photo: null,
  });

  const { token } = useContext(AuthContext);
  const user = useContext(UserContext);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user) {
        console.error('Erreur : ID utilisateur non disponible');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('nom', formData.nom);
      

      await axios.post(
        'http://127.0.0.1:8000/api/categories',
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      Notification.success('Categorie ajouter avec succès !');
      navigate('/dashboard');
      //console.log('Réponse de création de categorie :', response.data);

      setFormData({
        nom: '',
      
      });

    } catch (error) {
      console.error('Erreur lors de la création de la catégorie :', error.response);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, 
    });
  };
  

  return (
    <div className="container mx-auto px-4 py-8 mt-20 mb-72">
      <h1 className="text-3xl font-bold mb-8 text-black">Déposer une Categorie</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Nom Catégorie
          </label>
          <input
  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  id="nom"
  type="text" 
  placeholder="Nom de la catégorie"
  name="nom"
  value={formData.nom}
  onChange={handleChange}
  required
/>

        </div>
        
        <div className="flex items-center justify-between">
          <button 
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Déposer categorie
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeposerCategorie;
