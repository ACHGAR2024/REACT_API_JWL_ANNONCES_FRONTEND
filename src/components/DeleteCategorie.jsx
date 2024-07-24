import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Notification from '../components/Notification'; // Assurez-vous que ce chemin est correct

const DeleteCategorie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const deleteCategorie = async () => {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        Notification.success('Catégorie supprimée avec succès !');
        navigate('/categories');
      } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie :', error.response);
        setError('Erreur lors de la suppression de la catégorie. Veuillez réessayer.');
      }
    };

    deleteCategorie();
  }, [id, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 mt-20 mb-72">
      <h1 className="text-3xl font-bold mb-8 text-black">Supprimer catégorie</h1>
      <p>Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.</p>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default DeleteCategorie;
