
import React from "react";
import ListeAnnonces from "../pages/ListeAnnonces ";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import PropTypes from 'prop-types';



const DashboardCard = ({ title, icon, value, color }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${color} animate-slideIn hover:shadow-lg transition-shadow duration-300`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <p className="mt-1 text-3xl font-semibold">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('600', '100')}`}>
        <i className={`${icon} fa-2x ${color}`}></i>
      </div>
    </div>
  </div>
);



const QuickActions = () => (



  
  <div className="mt-8 bg-white rounded-lg shadow-md p-6 animate-slideIn">
    <h2 className="text-2xl font-bold mb-4">Actions rapides</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <a href="/deposer_annonce" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center">
        <i className="fa fa-plus-circle fa-fw pr-1"></i> Nouvelle annonce
      </a>
      <a href="/messages-management" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center">
        <i className="fa fa-envelope fa-fw pr-1"></i> Voir les messages
      </a>
      <a href="/profil-user-update" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center">
        <i className="fa fa-cog fa-fw pr-1"></i> Paramètres
      </a>
      <a href="/aide" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 text-center">
        <i className="fa fa-question-circle fa-fw pr-1"></i> Aide
      </a>
    </div>
  </div>
);

const UserDashboard = () => {
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

        const userAnnonces = response.data.announcements.filter(
          announcement => announcement.user_id === user.id
        );

        setCountAnnonces(userAnnonces.length);
      } catch (error) {
        console.error('Erreur lors de la récupération des annonces', error);
      }
    };

    fetchAnnonceCount();
  }, [token, user]);

  useEffect(() => {
    const fetchMessagesCount = async () => {
      if (!user || !user.id) return;

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/messages', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        ////console.log('Response Data:', response.data);
        ////console.log('User id:', user.id);

        // Récupérer toutes les annonces pour cet utilisateur
        const announcementsResponse = await axios.get('http://127.0.0.1:8000/api/announcements', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        const userAnnonces = announcementsResponse.data.announcements.filter(
          announcement => announcement.user_id === user.id
        );

        //console.log('User Annonces:', userAnnonces);

        const userMessages = response.data.filter(message => 
          userAnnonces.some(announcement => message.announcement_id === announcement.id)
        );

        //console.log('Filtered Messages:', userMessages);

        setCountMessages(userMessages.length);

        // Filtrer les messages favoris
        const userFavoriteMessages = userMessages.filter(
          message => message.is_favorite === 1
        );

        // Compter le nombre de messages favoris
        setFavoriteCount(userFavoriteMessages.length);

        // Filtrer les messages signaleés
        const userReportedMessages = userMessages.filter(
          message => message.is_report === 1
        );

        // Compter le nombre de messages signaleés
        setReportCount(userReportedMessages.length);

      } catch (error) {
        console.error('Erreur lors de la récupération des messages', error);
        if (error.response) {
          console.error('Erreur:', error.response.data);
        }
      }
    };

    fetchMessagesCount();
  }, [token, user]);



return (
  <React.Fragment>
    
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-8">Dashboard Utilisateur </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <a href="#mesannonces" >
          <DashboardCard title="Mes Annonces" icon="fa fa-bolt" value={countAnnonces} color="text-blue-600" />
         </a>
          <DashboardCard title="Messages" icon="fa fa-envelope" value={countMessages} color="text-green-600" />
          <DashboardCard title="Favoris" icon="fa fa-star" value={favoriteCount} color="text-yellow-400" />
          <DashboardCard title="Signalements" icon="fa fa-flag" value={reportCount} color="text-red-600" />
        </div>
      <QuickActions />
      <ListeAnnonces userId={user.id} />
    </div>
  </React.Fragment>
);
};



const DashboardContent = () => {
  return (
    <React.Fragment>
      
      <main className="min-h-screen mb-16">
        
        <UserDashboard />
      </main>
     
    </React.Fragment>
  );
};

DashboardContent.propTypes = {
  token: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    prenom: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    photo: PropTypes.string,
  }).isRequired,
  
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


export default DashboardContent;
