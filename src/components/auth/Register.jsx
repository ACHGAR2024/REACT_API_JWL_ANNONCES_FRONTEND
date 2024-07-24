import { useForm } from 'react-hook-form';
import axios from '../../config/axiosConfig';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmationVisibility = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation);
  };

  const onSubmit = async (data) => {
    try {
      data.role = 'user'; // Ajout de la valeur par défaut pour le champ 'role'

      const response = await axios.post('/register', data);
      localStorage.setItem('token', response.data.access_token);
      setMessage('User registered successfully!');
      setErrorMessage('');
      
      navigate('/login'); // Redirection vers la page de login après l'inscription réussie
    } catch (error) {
      setMessage('');
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.role) {
          setErrorMessage('The role field is required.');
        } else {
          setErrorMessage('Registration failed. Please try again.');
        }
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
      console.error('There was an error!', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen  bg-slate-300">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white shadow-xl rounded-lg p-4 space-y-4">
        <h2 className="text-center text-lg font-semibold bg-blue-400 text-gray-800 p-2 rounded-md">
          <i className="fa fa-user-plus" aria-hidden="true"></i> Inscription
        </h2>

       
        <input
          name="name"
          type="text"
          {...register('name', { required: true })}
          placeholder="Name"
          className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
        />
        {errors.name && <span className="text-red-500">Ce champ est requis</span>}

        
        <div className="input-group mb-4 relative">
          <span className="input-group-addon absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fa fa-envelope-o fa-fw pr-1"></i>
          </span>
          <input
            name="email"
            type="email"
            {...register('email', { required: true })}
            placeholder="Email"
            className="form-control pl-10 p-2 rounded-md w-full"
          />
        </div>
        {errors.email && <span className="text-red-500">Ce champ est requis</span>}

        
        <div className="input-group mb-4 relative">
          <span className="input-group-addon absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fa fa-key fa-fw pr-1"></i>
          </span>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            {...register('password', { required: true })}
            placeholder="Password"
            className="form-control pl-10 p-2 rounded-md w-full"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={togglePasswordVisibility}>
            <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
          </span>
        </div>
        {errors.password && <span className="text-red-500">Ce champ est requis</span>}

        
        <div className="input-group mb-4 relative">
          <span className="input-group-addon absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fa fa-key fa-fw pr-1"></i>
          </span>
          <input
            name="password_confirmation"
            type={showPasswordConfirmation ? "text" : "password"}
            {...register('password_confirmation', { required: true })}
            placeholder="Confirm Password"
            className="form-control pl-10 p-2 rounded-md w-full"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={togglePasswordConfirmationVisibility}>
            <i className={`fa ${showPasswordConfirmation ? "fa-eye-slash" : "fa-eye"}`}></i>
          </span>
        </div>
        {errors.password_confirmation && <span className="text-red-500">Ce champ est requis</span>}

        {/* Champ 'role' invisible avec valeur par défaut */}
        <input
          type="hidden"
          name="role"
          value="user"
          {...register('role', { required: true })}
        />

        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full">
          Enregistrer
        </button>

        {message && <p className="text-green-500">{message}</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Register;
