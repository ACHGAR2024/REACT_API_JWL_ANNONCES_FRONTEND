
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import PropTypes from 'prop-types';

const PrivateRoute = ({ element: Component }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Component /> : <Navigate to="/" />;
};

PrivateRoute.propTypes = {
  element: PropTypes.any
};
export default PrivateRoute;

