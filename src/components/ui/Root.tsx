import React from 'react';
import Login from '../../auth/Login'
import Register from '../../auth/Register'
import { NavLink } from 'react-router-dom';

const Root: React.FC = () => {
    return (
        <main>
            <h1 className='px-4'>
                Se connecter, s'inscrire, accéder sans compte
            </h1>

            <Login />
            <Register />
            <NavLink to='/home'>Accéder sans compte</NavLink>
        </main>);
}

export default Root
