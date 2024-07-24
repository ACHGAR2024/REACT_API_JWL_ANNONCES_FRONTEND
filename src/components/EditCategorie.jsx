import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';

const EditCategorieForm = () => {
  const { id } = useParams();
  const [categorie, setCategorie] = useState({ nom: '' });
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const user = useContext(UserContext);
  useEffect(() => {
    const fetchCategorie = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        //console.log('Réponse de l\'API:', response.data); // journal pour vérifier la structure de la réponse

        if (response.data && response.data.category) {
          setCategorie({ nom: response.data.category.nom }); // mise à jour l'état avec les données de la catégorie
        } else {
          console.error('Données de catégorie non trouvées ou incorrectes');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la catégorie', error);
      }
    };

    if (token) {
      fetchCategorie();
    } else {
      console.error('Token non disponible');
    }
  }, [id, token]);

  const handleChange = (e) => {
    setCategorie({ ...categorie, [e.target.name]: e.target.value });
  };

  if (categorie && user && user.role !== "admin") {
    return <div>Vous n êtes pas autorisé à modifier cette annonce.</div>;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/categories/${id}`, categorie, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      // Affichage de message de succès avec Notiflix
      Notification.success('Annonce modifiée avec succès !');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000); // Redirection après 2 secondes // Redirige vers la page dashboard après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20 mb-72 w-1/3">
      <h1 className="text-3xl font-bold mb-8 text-black">Modifier catégorie</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nom">
            Nom
          </label>
          <input
            type="text"
            name="nom"
            value={categorie.nom}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
         
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default EditCategorieForm;
