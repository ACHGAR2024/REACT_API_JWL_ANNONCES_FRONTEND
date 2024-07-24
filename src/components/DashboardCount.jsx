import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { AuthContext } from '../context/AuthContext';
import UserContext from '../context/UserContext';

const DashboardCount = () => {
  const [countMessage, setCountMessage] = useState(0);

  const { token } = useContext(AuthContext);

  const U_id = useContext(UserContext);

  useEffect(() => {
    const fetchMessages = async () => {
      

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/messages', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setCountMessage(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des messages', error);
            if (error.response) {
              console.error('Erreur:', error.response.data);
            }
          }
    };

    fetchMessages();
  }, [token, U_id]);

  return (
    <div>{countMessage}</div>
  );
};

DashboardCount.propTypes = {
  countmessage: PropTypes.number,
};

export default DashboardCount;
