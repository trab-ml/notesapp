import React from 'react';
import AuthIndex from '../../auth/AuthIndex'
import { ILogin } from '../../types/Form';

const Root: React.FC<ILogin> = ({isLogin}) => {
    return (
        <main className='relative min-h-screen bg-gray-100 flex flex-col justify-center'>
            <h1 className='absolute inset-0 text-2xl text-center mt-4  mx--4 my--3 px--4 py--6'>
                Bienvenue sur <span className='font-semibold'>Notesapp</span>,
                <br/> une application de prise de notes réactive.
            </h1>

            <AuthIndex isLogin={isLogin} />
        </main>);
}

export default Root
