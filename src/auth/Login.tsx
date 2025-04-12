import React from 'react';
import { NavLink } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div className="relative py-1 sm:max-w-xl sm:mx-auto">
      <div
        className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
      </div>

      <div className="relative px-2 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div className="max-w-md mx-auto">
          <div>
            <h2 className="text-2xl font-semibold text-center">Se Connecter</h2>
            <p className="mt-2 text-center text-sm text-gray-600 max-w md:text-lg">
              Où <NavLink to="/register" className="font-medium text-blue-600 hover:text-blue-500">Créer un compte</NavLink>
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <div className="relative">
                <input autoComplete="off" id="email" name="email" type="text" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" />
                <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Addresse email</label>
              </div>
              <div className="relative">
                <input autoComplete="off" id="password" name="password" type="password" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" />
                <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Mot de passe</label>
              </div>

              <div className="relative flex justify-center">
                <button className="bg-cyan-500 text-white rounded-md px-2 py-1 cursor-pointer">Se Connecter</button>
              </div>

              <div className="flex items-center justify-between">
                <NavLink to='/forgot-password' className="md:text-xs font-medium text-blue-600 hover:text-blue-500">Mot de passe oublié?</NavLink>
                <NavLink to='/home' className="md:text-xs font-medium text-blue-600 hover:text-blue-500">Accéder sans compte</NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};

export default Login;