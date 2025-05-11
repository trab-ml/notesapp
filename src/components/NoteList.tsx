import React, { useEffect, useState } from "react";
import { INote } from "../types/INote";
import {
    getVisibleNotes,
    getUserNotesAndPublicOnes,
} from "../services/NoteService";
import { useAuth } from "../hooks/useAuth";

const NoteList: React.FC = () => {
    const [notes, setNotes] = useState<INote[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedNote, setExpandedNote] = useState<string | null>(null);

    const { user } = useAuth();

    useEffect(() => {
        loadNotes();
    }, [user]);

    const loadNotes = async () => {
        setLoading(true);
        try {
            setNotes(
                user
                    ? await getUserNotesAndPublicOnes(user.uid)
                    : await getVisibleNotes()
            );
        } catch (error) {
            console.error("Error loading notes:", error);
        } finally {
            setLoading(false);
        }
    };    

    const toggleExpandNote = (noteId: string) => {
        setExpandedNote(expandedNote === noteId ? null : noteId);
    };

    return (
        <div className="mt-3">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Notes</h2>
                <button
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

            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : (
                <div className="mt-2">
                    {notes.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                            <p className="text-gray-500">
                                Aucune note disponible.
                            </p>
                            <button
                                className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                                Créer votre première note
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    onClick={() => toggleExpandNote(note.id!)}
                                    className={`border rounded-md shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer ${
                                        expandedNote === note.id
                                            ? "bg-gray-50"
                                            : "bg-white"
                                    }`}
                                >
                                    <div className="p-3">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-medium text-base truncate">
                                                {note.title}
                                            </h4>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full ${
                                                    note.isPublic
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {note.isPublic
                                                    ? "Publique"
                                                    : "Privée"}
                                            </span>
                                        </div>
                                        <p
                                            className={`text-sm text-gray-600 ${
                                                expandedNote === note.id
                                                    ? ""
                                                    : "line-clamp-2"
                                            }`}
                                        >
                                            {note.content}
                                        </p>
                                        {(expandedNote === note.id ||
                                            !note.content) &&
                                            note.tags &&
                                            note.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {note.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                            <span>{note.updatedAt.toDate().toDateString()}</span>
                                            {user &&
                                                note.ownerId === user.uid && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="text-blue-500 hover:underline"
                                                        >
                                                            {note.isPublic
                                                                ? "Privée"
                                                                : "Publique"}
                                                        </button>
                                                        <button
                                                            className="text-red-500 hover:underline"
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NoteList;
