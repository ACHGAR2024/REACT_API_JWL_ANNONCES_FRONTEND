import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import Notiflix from 'notiflix';
import Notification from '../components/Notification';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const MessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState('my_messages');
  const [replyToId, setReplyToId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [notification, setNotification] = useState(null);
  const U_id = useContext(UserContext);
  const navigate = useNavigate();

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/messages', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages', error);
      if (error.response) {
        console.error('Erreur:', error.response.data);
      }
    }
  }, []);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/announcements', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAnnouncements(response.data.announcements || response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces', error);
      if (error.response) {
        console.error('Erreur:', error.response.data);
      }
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchAnnouncements();
  }, [fetchMessages, fetchAnnouncements]);

  const filteredMessages = messages.filter(message => {
    const announcement = announcements.find(a => a.id === message.announcement_id);
    const isSent = U_id && U_id.id === message.user_id;
    const adminAll = U_id && U_id.role === "admin";
    const isReceived = U_id && announcement && U_id.id === announcement.user_id;

    if (filter === 'favorite') return message.is_favorite;
    if (filter === 'reported') return message.is_report;
    if (filter === 'my_messages') return isReceived;
    if (filter === 'sent_messages') return isSent;
    if (filter === 'Messages de l\'admin') return adminAll;
    return true;
  });

  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessages(messages.filter(message => message.id !== id));
      setNotification({ type: 'success', message: 'Message supprimé avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la suppression du message', error);
      setNotification({ type: 'error', message: 'Erreur lors de la suppression du message.' });
    }
  };

  const confirmDelete = (id) => {
    Notiflix.Confirm.show(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce message ?',
      'Oui',
      'Non',
      () => {
        handleDelete(id);
      },
      () => {
        // Action à prendre si l'utilisateur annule la suppression
      },
      {
        width: '320px',
        borderRadius: '8px',
        titleColor: '#000',
        messageColor: '#000',
        buttonsFontSize: '16px',
        okButtonBackground: '#007bff',
        cancelButtonBackground: '#6c757d',
        okButtonColor: '#fff',
        cancelButtonColor: '#fff',
      }
    );
  };

  const handleReply = (id) => {
    setReplyToId(id);
    setReplyContent('');
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (replyContent.trim()) {
      try {
        //console.log('Submitting reply...');
        const response = await axios.post('http://127.0.0.1:8000/api/messages', {
          announcement_id: messages.find(m => m.id === replyToId)?.announcement_id,
          content: replyContent,
          status: 'Répondu',
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        //console.log('Reply submitted:', response.data);
        setMessages([...messages, response.data]);
        setReplyToId(null);
        setReplyContent('');
        Notiflix.Notify.success('Réponse envoyée avec succès.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (error) {
        console.error('Erreur lors de la soumission de la réponse', error);
        Notiflix.Notify.failure('Erreur lors de la soumission de la réponse.');
      }
    }
  };


  const getAnnouncementDetails = (announcementId) => {
    const found = announcements.find(a => a.id === announcementId);
    return found || { title: "Annonce inconnue", photo: "https://example.com/default.jpg" };
  };

  return (
    <div className="container mx-auto px-4 py-8 mb-20">
      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}
      <h1 className="text-3xl font-bold mb-6">Gestion des Messages</h1>
      
      <div className="mb-4">
        <label className="mr-2">Filtrer par:</label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {U_id && U_id.role === "admin" && (
            <option value="adminAll">Tous</option>
          )}
          <option value="my_messages">Mes Messages Reçus</option>
          <option value="sent_messages">Mes Messages Envoyés</option>
          {/*<option value="favorite">Favoris</option>
          <option value="reported">Signalés</option>*/}
          
         
          
        </select>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annonce</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contenu</th>
            
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMessages.map(message => {
              const announcement = getAnnouncementDetails(message.announcement_id);
              return (
                <React.Fragment key={message.id}>
                  <tr className="animate-fadeIn">
                    <td className="px-6 py-4 whitespace-nowrap">{message.id}</td>
                    <td className="px-6 py-4">
                      <a href={`/fiche-annonce/${announcement.id}`} className="flex items-center">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-12 w-12 rounded" src={`http://127.0.0.1:8000${announcement.photo}`} alt={announcement.title} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{announcement.title}</div>
                          <div className="text-sm text-gray-500">ID: {message.announcement_id}</div>
                        </div>
                      </div>
                      </a>
                    </td>
                    <td className="px-6 py-4">{message.content}</td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(message.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
  className={`mr-2 ${message.is_favorite ? 'text-yellow-500' : ''} hover:text-yellow-700`}
  onMouseEnter={() => Notiflix.Notify.warning(
    'Favoris',
    { position: 'center-top', timeout: 1000, clickToClose: true, showOnlyTheLastOne: true, pauseOnHover: true, distance: '100px', top: '100px', width: '300px',  }
    
    )}
>
  <i className="fas fa-star"></i>
</button>

                      <button 
                        className={`mr-2 ${message.is_report ? 'text-red-500' : ''}`}
                        onMouseEnter={() => Notiflix.Notify.info(
                          'Signalement',
                          { position: 'center-top', timeout: 1000, clickToClose: true, showOnlyTheLastOne: true, pauseOnHover: true, distance: '100px', top: '100px', width: '300px',  }
                          
                          )}

                      >
                        <i className="fas fa-flag"></i>
                      </button>
                      <button 
                        onClick={() => handleReply(message.id)}
                        className="text-green-600 hover:text-green-900 mr-2"
                      >
                        <i className="fas fa-reply"></i>
                      </button>
                      <button 
                        onClick={() => confirmDelete(message.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                  {replyToId === message.id && (
                    <tr className="animate-slideDown">
                      <td colSpan="6" className="px-6 py-4">
                        <form onSubmit={handleSubmitReply} className="flex items-center">
                          <input
                            type="text"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Votre réponse..."
                            className="flex-grow mr-2 px-3 py-2 border rounded"
                          />
                          <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Envoyer
                          </button>
                        </form>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MessagesManagement;
