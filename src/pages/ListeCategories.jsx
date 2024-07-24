import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

import { Link } from 'react-router-dom';
import Notiflix from 'notiflix';

const ListeCategories = () => {
  const [categories, setCategories] = useState([]);
  const { token } = useContext(AuthContext);

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

        //console.log('Categories:', response.data);
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories', error);
      }
    };
    
    fetchCategories();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setCategories(categories.filter(categorie => categorie.id !== id));
      //console.log(`Catégorie ${id} supprimée.`);
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie', error);
    }
  };

  const confirmDelete = (id) => {
    Notiflix.Confirm.show(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette catégorie ?',
      'Oui',
      'Non',
      () => {
        handleDelete(id);
      },
      () => {
        // Action à prendre si l'utilisateur annule la suppression
      }
    );
  };

  return (
    <div id="categories" className="mt-8 bg-white rounded-lg shadow-md p-6 animate-slideIn">
      <h2 className="text-2xl font-bold mb-4">Liste des catégories</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Nom</th>
             
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {categories.map(categorie => (
              <tr key={categorie.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <span className="font-medium">{categorie.id}</span>
                </td>
                <td className="py-3 px-6 text-left">
                  <span>{categorie.nom}</span>
                </td>
                
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <Link to={`/edit-categorie/${categorie.id}`} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                      <i className="fa fa-pencil"></i>
                    </Link>
                    <button
                      onClick={() => confirmDelete(categorie.id)}
                      className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                    >
                      <i className="fa fa-trash-o"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListeCategories;
