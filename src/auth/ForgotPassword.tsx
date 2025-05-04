import React from 'react';
import { EmailField, SubmitButton } from '../components/ui/form/Field';

const ForgotPassword: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className='absolute inset-0 text-3xl text-center mt-4  mx--4 my--3 px--4 py--6'>
        Bienvenue sur <span className='font-semibold'>Notesapp</span>,
        <br /> une application de prise de notes réactive.
      </h1>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md w-full">
        <h2 className="text-center text-2xl font-bold mb-6">Mot de passe oublié</h2>
        <form className="py-4 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
          <EmailField />
          <SubmitButton buttonText={'Changer le mot de passe'} />
          {/* <p>Un email vous a été envoyé pour rénitialiser votre mot de passe.</p> */}
        </form>
      </div>
    </div>);
};

export default ForgotPassword;