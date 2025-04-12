import React from 'react';
import Login from '../../auth/Login'

const Root: React.FC = () => {
    return (
        <main className='relative min-h-screen bg-gray-100 flex flex-col justify-center'>
            <h1 className='absolute inset-0 text-2xl text-center mt-4  mx--4 my--3 px--4 py--6'>
                Bienvenue sur <span className='font-semibold'>Notesapp</span>,
                <br/> une application de prise de notes réactive.
            </h1>

            <Login />
        </main>);
}

export default Root
