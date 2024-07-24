import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Nav = ({ isAuthenticated, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return ( 
    <nav className="bg-gray-800 p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img
            className="h-10 w-10"
            src="https://img.icons8.com/?size=100&id=n4M1PQzxzpSY&format=png&color=000000"
            alt="Logo"
          />
          <span className="text-white text-lg font-semibold">MarketAnnonce</span>
        </Link>

        {/* Hamburger menu button */}
        <div className="block lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none focus:bg-gray-700 px-3 py-2 rounded"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:space-x-4">
          {isAuthenticated ? (
            <>
            
          
              <Link to="/dashboard" className="text-white">Tableau de bord</Link>
              <button onClick={() => {handleLogout(); window.location.href = "/"}} className="text-white">Déconnexion</button>

              
              
            </>
          ) : (
            <>
              <Link to="/login" className="text-white">Connexion</Link>
              <Link to="/register" className="text-white">S&apos;inscrire</Link>
              
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="flex flex-col mt-2">
            {isAuthenticated ? (
              <>
             
                <Link to="/dashboard" className="text-white block py-2 px-4">Tableau de bord</Link>
                <button
                  onClick={handleLogout}
                  className="text-white block py-2 px-4"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white block py-2 px-4">Connexion</Link>
                <Link to="/register" className="text-white block py-2 px-4">S&apos;inscrire</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

Nav.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};
export default Nav;

