
import 'chart.js/auto'; 
import ListeAnnoncesAdmin from "../pages/ListeAnnoncesAdmin";
import ListeCategories from '../pages/ListeCategories';
import PropTypes from 'prop-types';
import Signalement from '../components/Signalement';
import UtilisateursAdmin from './auth/UtilisateursAdmin';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';


const DashboardCard = ({ title, value, icon, color}) => (

   <div className={`bg-white rounded-lg shadow-md p-4 ${color} animate-slideIn`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <p className="mt-2 text-lg font-semibold">{value}</p>
      </div>
      <div className={`p-2 rounded-full ${color.replace('text-', 'bg-').replace('600', '100')}`}>
        <i className={`${icon} fa-lg ${color}`}></i>
      </div>
    </div>
  </div>
);


const QuickActions = () => (
  <div className="mt-8 bg-white rounded-lg shadow-md p-6 animate-slideIn">
    <h2 className="text-2xl font-bold mb-4">Actions rapides</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <a href="/deposer_categorie" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center">
        <i className="fa fa-plus-circle fa-fw pr-1"></i> Nouvelle catégorie
      </a>
      <a href="/messages-management" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center">
        <i className="fa fa-envelope fa-fw pr-1"></i> Voir mes messages
      </a>
      <a href="/profil-user-update" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center">
        <i className="fa fa-cog fa-fw pr-1"></i> Paramètres
      </a>
      <a href="#utilisateurs" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center">
        <i className="fa fa-users fa-fw pr-1"></i> Utilisateurs
      </a>
      <a href="#categories" className="bg-red-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center">
        <i className="fa fa-list fa-fw pr-"></i> Gestion Catégories
      </a>
      <a href="#annonces" className="bg-cyan-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center">
        <i className="fa fa-address-book  "></i> Liste annonces
      </a>
      <a href="#signalements" className="bg-yellow-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center">
        <i className="fa fa-flag text-red-500  "></i> Gestion des signalements
      </a>
      <a href="/" className="bg-sky-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center">
      
        <i className="fa fa-sign-out  "></i> Page d&#39;accueil 
      </a>
      
    </div>
  </div>
  
);

const DashboardAdminContent = () => {

  const [countAnnonces, setCountAnnonces] = useState(0);
  const [countMessages, setCountMessages] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);

  const { token } = useContext(AuthContext);
  const user = useContext(UserContext);

  useEffect(() => {
    const fetchAnnonceCount = async () => {
      if (!user || !user.id) return;

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/announcements', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        setCountAnnonces(response.data.announcements.length);
      } catch (error) {
        console.error('Erreur lors de la récupération des annonces', error);
      }
    };

    fetchAnnonceCount();
  }, [token, user]);

  // Fetch total count of messages and calculate favorites and reports
  useEffect(() => {
    const fetchMessagesCount = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/messages', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        setCountMessages(response.data.length);

        // Filter the favorite messages
        const userFavoriteMessages = response.data.filter(
          message => message.is_favorite === 1
        );

        setFavoriteCount(userFavoriteMessages.length);

        // Filter the reported messages
        const userReportedMessages = response.data.filter(
          message => message.is_report === 1
        );

        setReportCount(userReportedMessages.length);

      } catch (error) {
        console.error('Erreur lors de la récupération des messages', error);
        if (error.response) {
          console.error('Erreur:', error.response.data);
        }
      }
    };

    fetchMessagesCount();
  }, [token]);
  return (
    <div className="container mx-auto px-4 py-8 ">
      <h2 className="text-3xl font-bold mb-8">Tableau de bord Administrateur</h2> 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DashboardCard title="Les annonces" icon="fa fa-bolt" value={countAnnonces} color="text-blue-600" />
            <DashboardCard title="Messages" icon="fa fa-envelope" value={countMessages} color="text-green-600" />
            <DashboardCard title="Favoris" icon="fa fa-star" value={favoriteCount} color="text-yellow-400" />
            <DashboardCard title="Signalements" icon="fa fa-flag" value={reportCount} color="text-red-600" />
      </div> 
      <QuickActions />
      <Signalement /> 
      <UtilisateursAdmin />
      <ListeCategories />
      <ListeAnnoncesAdmin />

    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  color: PropTypes.string.isRequired,

};

export default DashboardAdminContent;
