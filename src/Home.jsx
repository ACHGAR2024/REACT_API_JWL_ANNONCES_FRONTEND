// ** React and React Router DOM Imports **
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

// ** CSS Imports **
import './index.css';

// ** Component Imports **
// Layout Components
import Nav from './components/Nav';
import Footer from './components/Footer';

// Authentication Components
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';
import UserProfileUpdate from './components/auth/UserProfileUpdate';

// Announcement Management Components
import EditAnnonce from './components/EditAnnonce';
import DeleteAnnonce from './components/DeleteAnnonce';
import EditCategorie from './components/EditCategorie';
import DeleteCategorie from './components/DeleteCategorie';

// Page Components
import HomeContent from './pages/HomeContent';
import Dashboard from './pages/Dashboard';
import RechercherAnnonce from './pages/RechercherAnnonce';
import DeposerAnnonce from './pages/DeposerAnnonce';
import DeposerCategorie from './pages/DeposerCategorie';
import MessagesManagement from './pages/MessagesManagement';
import FicheAnnonce from './pages/FicheAnnonce';
import Aide from './pages/Aide';
import CarteAnnonces from './pages/CarteAnnonces';
import LieuAnnoncesRecherche from './pages/LieuAnnoncesRecherche';

// ** Context Imports **
import { AuthProvider, AuthContext } from './context/AuthContext';
import { UserProvider } from './context/UserContext';

// ** Main Application Component **

function PageWrapper({ children }) {
  return (
    <main className="w-full h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    </main>
  );
}

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

// ** Main Application Component **
const Home = () => {
  const { isAuthenticated, login, logout } = useContext(AuthContext);

  return (
    <Router>
      <Nav isAuthenticated={isAuthenticated} handleLogout={logout} />
      <PageWrapper>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<HomeContent />} />
          <Route path="/aide" element={<Aide />} />
          <Route path="/carte-annonces" element={<CarteAnnonces />} />
          <Route path="/lieux-annonces" element={<LieuAnnoncesRecherche />} />

          {/* Protected Routes */}
          <Route path="/rechercher-annonce" element={<RechercherAnnonce />} />
          <Route path="/fiche-annonce/:id" element={<FicheAnnonce />} />

          {/* Authentication Routes */}
          {!isAuthenticated && <Route path="/register" element={<Register />} />}
          <Route path="/login" element={!isAuthenticated ? <Login onLogin={login} /> : <Navigate to="/dashboard" />} />
          <Route path="/Logout" element={<Navigate to="/" />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={!isAuthenticated ?  <Navigate to="/dashboard" /> : <PrivateRoute element={Dashboard} />} />
          <Route path="/deposer_annonce" element={!isAuthenticated ?  <Navigate to="/deposer_annonce" /> : <PrivateRoute element={DeposerAnnonce} />} />
          <Route path="/deposer_categorie" element={!isAuthenticated ?  <Navigate to="/deposer_categorie" /> : <PrivateRoute element={DeposerCategorie} />} />
          <Route path="/messages-management" element={!isAuthenticated ?  <Navigate to="/messages-management" /> : <PrivateRoute element={MessagesManagement} />} />
          <Route path="/profil-user-update" element={!isAuthenticated ?  <Navigate to="/profil-user-update" /> : <PrivateRoute element={UserProfileUpdate} />} />
          
          {/* Announcement Management Routes */}
          {isAuthenticated && <Route path="/edit-annonce/:id" element={<EditAnnonce />} />}
          {isAuthenticated && <Route path="/delete-annonce/:id" element={<DeleteAnnonce />} />}
          {isAuthenticated && <Route path="/edit-categorie/:id" element={<EditCategorie />} />}
          {isAuthenticated && <Route path="/delete-categorie/:id" element={<DeleteCategorie />} />}

        </Routes>
      </PageWrapper>
      <Footer />
    </Router>
  );
};
// ** Main App Component **
const App = () => (
  <AuthProvider>
    <UserProvider>
       <Home />
    </UserProvider>
  </AuthProvider>
);

export default App;
