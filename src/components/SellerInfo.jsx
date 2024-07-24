import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const SellerInfo = ({ sellerId }) => {
  const [sellerInfo, setSellerInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        // Requête de infos du vendeur avec l'API axios 
        const response = await axios.get(`http://127.0.0.1:8000/api/user/${sellerId}`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        if (response.status === 200) {
          setSellerInfo(response.data);
        } else {
          setError(`Erreur ${response.status} : ${response.statusText}`);
        }

      } catch (error) {
        setError('Erreur lors de la récupération des informations du vendeur.');
        console.error('Erreur lors de la récupération des informations du vendeur', error);
      }
    };

    fetchSellerInfo();
  }, [sellerId]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!sellerInfo) {
    return <p>Chargement des informations du vendeur...</p>;
  }

  const { name, created_at: member_since, image } = sellerInfo;

  return (
    <div className="mt-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Informations sur le vendeur</h3>
      <div className="mt-3 flex items-center">
        <div className="flex-shrink-0">
          <img 
            className="h-10 w-10 rounded-full" 
            src={image ? `http://127.0.0.1:8000${image}` : `https://ui-avatars.com/api/?name=${name}&background=random`} 
            alt={name} 
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">
            Membre depuis : <span className="font-medium"> {new Date(member_since).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

SellerInfo.propTypes = {
  sellerId: PropTypes.number.isRequired,
};

export default SellerInfo;
