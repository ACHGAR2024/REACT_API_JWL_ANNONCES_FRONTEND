import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import PropTypes from 'prop-types';

const UserContext = createContext();


const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        console.error('Token non disponible');
        return;
      }

      try {
        console.log('Authorization', `Bearer ${token}`);
        
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        });

        console.log('Response Data:', response.data);
        setUser(response.data.data.user);

      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur', error);
      }
    };

    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
