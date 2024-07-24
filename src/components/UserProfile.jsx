import { useEffect, useState, useContext } from 'react';

import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import DashboardContent from './DashboardContent';
import DashboardAdminContent from './DashboardAdminContent';

const UserProfile = () => {
  const [imageURL, setImageURL] = useState(null);
  useContext(AuthContext);
  const user = useContext(UserContext);

  useEffect(() => {
    if (user && user.image) {
      setImageURL(`http://127.0.0.1:8000${user.image}`);
    }
  }, [user]);

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg p-6 mt-16 z-50">
        <ul className="flex items-center">
          <li className="px-4 py-2">{imageURL && <img src={imageURL} alt="Profil" className="w-10 h-10 rounded-full" />}</li>
          <li className="px-4">
            {user.role === 'admin' ? (
              <span className="font-bold">Bonjour Administrateur</span>
            ) : (
              <span>Bonjour {user.name}</span>
            )}
          </li>
        </ul>
      </div>
      <div>
        {user.role === 'admin' ? <DashboardAdminContent /> : <DashboardContent />}
      </div>
    </div>
  );
};

export default UserProfile;
