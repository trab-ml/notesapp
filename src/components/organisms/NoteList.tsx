import React, { useEffect, useState } from "react";
import { INote } from "../../types/INote";
import {
    getVisibleNotes,
    getUserNotesAndPublicOnes,
    addNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    shareNoteWithUser,
} from "../../services/NoteService";
import { useAuth } from "../../hooks/useAuth";
import { Timestamp } from "firebase/firestore";
import { Modal } from "../molecules/Modal";
import { NoteForm } from "../molecules/NoteForm";
import { NoteCard } from "../molecules/NoteCard";
import { LoadingSpinner } from "../atoms/LoadingSpinner";
import { EmptyState } from "../atoms/EmptyState";
import { TNoteListSearchOptions } from "../../types/SearchOptions";

const NoteList: React.FC<TNoteListSearchOptions> = ({
    query,
    sortBy,
    filterBy,
}) => {
    const [notes, setNotes] = useState<INote[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [expandedNote, setExpandedNote] = useState<string | null>(null);
    const [noteToEdit, setNoteToEdit] = useState<INote | null>(null);
    const [displayedNotes, setDisplayedNotes] = useState<INote[]>([]);

    const { user } = useAuth();

    useEffect(() => {
        loadNotes();
    }, [user]);

    useEffect(() => {
        let filteredNotes = [...notes];

        // searching
        if (query) {
            filteredNotes = filteredNotes.filter(
                (note) =>
                    note.title.toLowerCase().includes(query.toLowerCase()) ||
                    note.content.toLowerCase().includes(query.toLowerCase())
            );
        }

        // filtering
        if (filterBy === "mine") {
            filteredNotes = filteredNotes.filter(
                (note) => note.ownerId === user?.uid
            );
        } else if (filterBy === "not-mine") {
            filteredNotes = filteredNotes.filter(
                (note) => note.ownerId !== user?.uid
            );
        } else if (filterBy === "tag") {
            filteredNotes = filteredNotes.filter((note) =>
                note.tags?.some((tag) =>
                    tag.toLowerCase().includes(query.toLowerCase())
                )
            );
        } else if (filterBy === "favorites") {
            filteredNotes = filteredNotes.filter((note) => note.isFavorite);
        } else if (filterBy === "shared") {
            filteredNotes = filteredNotes.filter(
                (note) =>
                    note.sharedWith?.includes(user?.uid || "") &&
                    note.ownerId !== user?.uid
            );
        }

        // sorting
        if (sortBy === "new-to-old") {
            filteredNotes.sort(
                (a, b) =>
                    b.createdAt.toDate().getTime() -
                    a.createdAt.toDate().getTime()
            );
        } else if (sortBy === "old-to-new") {
            filteredNotes.sort(
                (a, b) =>
                    a.createdAt.toDate().getTime() -
                    b.createdAt.toDate().getTime()
            );
        } else if (sortBy === "favorites-first") {
            filteredNotes.sort(
                (a, b) => Number(b.isFavorite) - Number(a.isFavorite)
            );
        } else if (sortBy === "a-z") {
            filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
        }

        setDisplayedNotes(filteredNotes);
    }, [query, filterBy, sortBy, notes, user?.uid]);

    const loadNotes = async () => {
        setLoading(true);
        try {
            let combinedNotes: INote[] = [];

            combinedNotes = user 
                ? await getUserNotesAndPublicOnes(user.uid)
                : await getVisibleNotes();

            setNotes(combinedNotes);
        } catch (error) {
            console.error("Error loading notes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async (values: {
        title: string;
        content: string;
        tags: string[];
        isPublic: boolean;
    }) => {
        if (!user) return;

        const note: Omit<
            INote,
            "id" | "createdAt" | "updatedAt" | "sharedWith"
        > = {
            ...values,
            ownerId: user.uid,
        };

        await addNote(note);
        setShowAddForm(false);
        await loadNotes();
    };

    const handleEditNote = async (values: {
        title: string;
        content: string;
        tags: string[];
        isPublic: boolean;
    }) => {
        if (!noteToEdit || !noteToEdit.id) return;

        try {
            await updateNote(noteToEdit.id, {
                ...values,
                updatedAt: Timestamp.now(),
            });
            setNoteToEdit(null);
            await loadNotes();
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    };

    const handleToggleIsPublic = async (e: React.MouseEvent, note: INote) => {
        e.stopPropagation();
        if (!note.id) return;

        try {
            await updateNote(note.id, {
                isPublic: !note.isPublic,
                updatedAt: Timestamp.now(),
            });
            setNotes((prev) =>
                prev.map((n) =>
                    n.id === note.id
                        ? {
                              ...n,
                              isPublic: !n.isPublic,
                              updatedAt: Timestamp.now(),
                          }
                        : n
                )
            );
        } catch (error) {
            console.error("Error updating note visibility:", error);
        }
    };

    const handleDeleteNote = async (e: React.MouseEvent, noteId: string) => {
        e.stopPropagation();
        if (confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) {
            try {
                await deleteNote(noteId);
                setNotes((prev) => prev.filter((n) => n.id !== noteId));
            } catch (error) {
                console.error("Error deleting note:", error);
            }
        }
    };

    const toggleExpandNote = (noteId: string) => {
        setExpandedNote(expandedNote === noteId ? null : noteId);
    };

    const handleAnonymousUser = () => {
        alert("Veuillez vous connecter pour ajouter une note.");
    };

    const handleToggleFavorite = async (e: React.MouseEvent, note: INote) => {
        e.stopPropagation();
        if (!note.id) return;

        try {
            await toggleFavorite(note.id, !note.isFavorite);
            setNotes((prev) =>
                prev.map((n) =>
                    n.id === note.id ? { ...n, isFavorite: !n.isFavorite } : n
                )
            );
        } catch (error) {
            console.error("Erreur lors du changement de favori :", error);
        }
    };

    const handleShare = async (note: INote, email: string) => {
        try {
            if (!note.id) return;
            
            await shareNoteWithUser(note.id, email, user?.uid || "");
            alert("Note partagée avec succès !");
            await loadNotes();
            
        } catch (error) {
            console.error("Erreur de partage :", error);
            alert(error.message ?? "Erreur lors du partage de la note");
        }
    };


    return (
        <div className="mt-3">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Notes</h2>
                <button
                    onClick={() =>
                        user ? setShowAddForm(true) : handleAnonymousUser()
                    }
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

            <Modal
                isOpen={showAddForm}
                onClose={() => setShowAddForm(false)}
                title="Nouvelle Note"
            >
                <NoteForm
                    onSubmit={handleAddNote}
                    onCancel={() => setShowAddForm(false)}
                />
            </Modal>

            <Modal
                isOpen={!!noteToEdit}
                onClose={() => setNoteToEdit(null)}
                title="Modifier la note"
            >
                <NoteForm
                    initialValues={{
                        title: noteToEdit?.title ?? "",
                        content: noteToEdit?.content ?? "",
                        tags: noteToEdit?.tags?.join(", ") ?? "",
                        isPublic: noteToEdit?.isPublic ?? false,
                    }}
                    onSubmit={handleEditNote}
                    onCancel={() => setNoteToEdit(null)}
                />
            </Modal>

            {loading ? (
                <LoadingSpinner />
            ) : displayedNotes.length === 0 ? (
                <EmptyState
                    message="Aucune note disponible."
                    actionText="Créer votre première note"
                    onAction={() =>
                        user ? setShowAddForm(true) : handleAnonymousUser()
                    }
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {displayedNotes.map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            isExpanded={expandedNote === note.id}
                            onToggleExpand={toggleExpandNote}
                            onToggleVisibility={
                                user?.uid === note.ownerId
                                    ? handleToggleIsPublic
                                    : undefined
                            }
                            onEdit={
                                user?.uid === note.ownerId
                                    ? (e) => {
                                          e.stopPropagation();
                                          setNoteToEdit(note);
                                      }
                                    : undefined
                            }
                            onDelete={
                                user?.uid === note.ownerId
                                    ? handleDeleteNote
                                    : undefined
                            }
                            isOwner={user?.uid === note.ownerId}
                            onToggleFavorite={
                                user?.uid === note.ownerId
                                    ? handleToggleFavorite
                                    : undefined
                            }
                            onShare={
                                user?.uid === note.ownerId
                                    ? handleShare
                                    : undefined
                           
                                }
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default NoteList;
