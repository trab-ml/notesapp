import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-indigo-700 text-white py-1 md:py-2">
            <div className="container mx-auto text-center">
                <p>&copy; 2025 <span className="font-semibold">Notesapp</span>. Tous droits réservés.</p>
            </div>
        </footer>
    );
};

export default Footer;
