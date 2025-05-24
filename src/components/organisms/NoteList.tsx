import React, { useCallback, useEffect, useMemo, useState } from "react";
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

interface NoteFormValues {
    title: string;
    content: string;
    tags: string[];
    isPublic: boolean;
}

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

    const { user } = useAuth();

    const displayedNotes = useMemo(() => {
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

        return filteredNotes;
    }, [query, filterBy, sortBy, notes, user?.uid]);

    const loadNotes = useCallback(async () => {
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
    }, [user]);

    useEffect(() => {
        loadNotes();
    }, [loadNotes]);

    const handleAddNote = useCallback(
        async (values: NoteFormValues) => {
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
        },
        [user, loadNotes]
    );

    const handleEditNote = useCallback(
        async (values: NoteFormValues) => {
            if (!noteToEdit?.id) return;

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
        },
        [noteToEdit, loadNotes]
    );

    const handleToggleIsPublic = useCallback(
        async (e: React.MouseEvent, note: INote) => {
            e.stopPropagation();
            if (!note.id) return;

            try {
                const updatedVisibility = !note.isPublic;
                await updateNote(note.id, {
                    isPublic: updatedVisibility,
                    updatedAt: Timestamp.now(),
                });

                setNotes((prev) =>
                    prev.map((n) =>
                        n.id === note.id
                            ? {
                                  ...n,
                                  isPublic: updatedVisibility,
                                  updatedAt: Timestamp.now(),
                              }
                            : n
                    )
                );
            } catch (error) {
                console.error("Error updating note visibility:", error);
                await loadNotes();
            }
        },
        [loadNotes]
    );

    const handleDeleteNote = useCallback(
        async (e: React.MouseEvent, noteId: string) => {
            e.stopPropagation();

            if (
                !window.confirm(
                    "Êtes-vous sûr de vouloir supprimer cette note ?"
                )
            ) {
                return;
            }

            try {
                await deleteNote(noteId);
                setNotes((prev) => prev.filter((n) => n.id !== noteId));
            } catch (error) {
                console.error("Error deleting note:", error);
                await loadNotes();
            }
        },
        [loadNotes]
    );

    const toggleExpandNote = useCallback((noteId: string) => {
        setExpandedNote(expandedNote === noteId ? null : noteId);
    }, []);

    const handleAnonymousUser = useCallback(() => {
        alert("Veuillez vous connecter pour ajouter une note.");
    }, []);

    const handleToggleFavorite = useCallback(
        async (e: React.MouseEvent, note: INote) => {
            e.stopPropagation();
            if (!note.id) return;

            try {
                const newFavoriteStatus = !note.isFavorite;
                await toggleFavorite(note.id, newFavoriteStatus);

                setNotes((prev) =>
                    prev.map((n) =>
                        n.id === note.id
                            ? { ...n, isFavorite: !n.isFavorite }
                            : n
                    )
                );
            } catch (error) {
                console.error("Erreur lors du changement de favori :", error);
                await loadNotes();
            }
        },
        [loadNotes]
    );

    const handleShare = useCallback(
        async (note: INote, email: string) => {
            if (!note.id || !user?.uid) return;

            try {
                await shareNoteWithUser(note.id, email, user.uid);
                alert("Note partagée avec succès !");
                await loadNotes();
            } catch (error) {
                console.error("Error sharing note:", error);
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Erreur lors du partage de la note";
                alert(errorMessage);
            }
        },
        [user?.uid, loadNotes]
    );

    const handleEditClick = useCallback((e: React.MouseEvent, note: INote) => {
        e.stopPropagation();
        setNoteToEdit(note);
    }, []);

    const handleAddButtonClick = useCallback(() => {
        if (user) {
            setShowAddForm(true);
        } else {
            handleAnonymousUser();
        }
    }, [user, handleAnonymousUser]);

    const handleEmptyStateAction = useCallback(() => {
        if (user) {
            setShowAddForm(true);
        } else {
            handleAnonymousUser();
        }
    }, [user, handleAnonymousUser]);

    const editFormInitialValues = useMemo(
        () => ({
            title: noteToEdit?.title ?? "",
            content: noteToEdit?.content ?? "",
            tags: noteToEdit?.tags?.join(", ") ?? "",
            isPublic: noteToEdit?.isPublic ?? false,
        }),
        [noteToEdit]
    );

    if (loading) {
        return (
            <div className="mt-3">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="mt-3">
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
                    initialValues={editFormInitialValues}
                    onSubmit={handleEditNote}
                    onCancel={() => setNoteToEdit(null)}
                />
            </Modal>

            {displayedNotes.length === 0 ? (
                <EmptyState
                    message="Aucune note disponible."
                    actionText="Créer votre première note"
                    onAction={handleEmptyStateAction}
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
                                    ? (e) => handleEditClick(e, note)
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
