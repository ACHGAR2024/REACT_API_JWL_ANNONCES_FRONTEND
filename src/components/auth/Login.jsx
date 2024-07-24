import { useForm } from 'react-hook-form';
import axios from '../../config/axiosConfig';
import { useState } from 'react';
import PropTypes from 'prop-types';

const Login = ({ onLogin }) => {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/login', data);
      localStorage.setItem('token', response.data.access_token);
      onLogin(response.data.access_token);
      setMessage('Utilisateur connecté avec succès !');
      
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage('Identifiants invalides. Veuillez vérifier votre adresse e-mail et votre mot de passe.');
        
      } else {
        setMessage('Échec de la connexion. Veuillez réessayer plus tard.');
       
      }
      console.error('Échec de la connexion', error);
      
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen -m-5">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white shadow-xl rounded-lg p-4 space-y-4">
        <h2 className="text-center text-lg font-semibold bg-blue-400 text-gray-800 p-2 rounded-md">
          <i className="fa fa-sign-in" aria-hidden="true"></i> Connexion
        </h2>
        
        <label className="block text-gray-700">Email</label>
        <div className="input-group mb-4 relative">
          <span className="input-group-addon absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fa fa-envelope-o fa-fw pr-1"></i>
          </span>
          <input
            className="form-control pl-10 p-2 rounded-md w-full"
            type="text"
            placeholder="Email address"
            {...register('email', { required: true })}
          />
        </div>
        
        <label className="block text-gray-700">Mot de passe</label>
        <div className="input-group mb-4 relative">
          <span className="input-group-addon absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fa fa-key fa-fw pr-1"></i>
          </span>
          <input
            className="form-control pl-10 p-2 rounded-md w-full"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register('password', { required: true })}
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={togglePasswordVisibility}>
            <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
          </span>
        </div>
        
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full">
          Se connecter
        </button>
        {message && <p className="text-red-500">{message}</p>}
      </form>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
