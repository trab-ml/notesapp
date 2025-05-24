import React from "react";

interface NoteListHeaderProps {
    onAddNote: () => void;
    isAuthenticated: boolean;
}

export const NoteListHeader: React.FC<NoteListHeaderProps> = ({
    onAddNote,
    isAuthenticated,
}) => {
    const handleAddButtonClick = () => {
        if (isAuthenticated) {
            onAddNote();
        } else {
            alert("Veuillez vous connecter pour ajouter une note.");
        }
    };

    return (
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Notes</h2>
            <button
                onClick={handleAddButtonClick}
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-3 py-1 rounded-md flex items-center"
            >
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1"
                >
                    <path
                        d="M1.22229 5.00019H8.77785M5.00007 8.77797V1.22241"
                        stroke="white"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                Nouvelle note
            </button>
        </div>
    );
};
