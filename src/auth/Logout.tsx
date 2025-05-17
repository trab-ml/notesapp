import React from "react";

import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuth } from "../hooks/useAuth";

const Logout: React.FC = () => {
    const { user } = useAuth();
    
    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = "/";
            console.log("User logged out successfully");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className={`text-sm rounded-xl bg-red-600 px-2 py-1 md:px-4 md:py-2 font-bold leading-none text-white ${user ? "hover:bg-red-700" : "opacity-50 cursor-not-allowed"}`}
            disabled={!user}
        >
            Se Déconnecter
        </button>
    );
};

export default Logout;
