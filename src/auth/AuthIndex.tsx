import React from 'react';
import AuthStatus from './AuthStatus';
import Login from './Login'
import Register from './Register'

// connexion, inscription, 'Accès anonyme'... 

const AuthIndex: React.FC = () => {
    return (
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <AuthStatus />
            <Login />
            <Register />
        </main>);
}

export default AuthIndex;