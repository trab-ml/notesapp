import React, { useCallback, useMemo, useState } from "react";
import { INote } from "../../types/INote";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "../atoms/LoadingSpinner";
import { EmptyState } from "../atoms/EmptyState";
import { TNoteListSearchOptions } from "../../types/SearchOptions";
import { useNotes } from "../../hooks/useNotes";
import { useNoteFiltering } from "../../hooks/useNoteFiltering";
import { NoteListHeader } from "../atoms/NoteListHeader";
import { NoteGrid } from "../molecules/NoteGrid";
import { NoteModals } from "../molecules/NoteModals";

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
    const [showAddForm, setShowAddForm] = useState(false);
    const [expandedNote, setExpandedNote] = useState<string | null>(null);
    const [noteToEdit, setNoteToEdit] = useState<INote | null>(null);

    const { user } = useAuth();

    const {
        notes,
        loading,
        addNewNote,
        updateExistingNote,
        removeNote,
        toggleNoteFavorite,
        shareNote,
    } = useNotes(user?.uid);

    const displayedNotes = useNoteFiltering(
        notes,
        query,
        filterBy,
        sortBy,
        user?.uid
    );

    const handleAddNote = useCallback(async (values: NoteFormValues) => {
        if (!user) return;

        try {
            await addNewNote({
                ...values,
                ownerId: user.uid,
                ownerEmail: user.email,
            });
            setShowAddForm(false);
        } catch (error) {
            console.error("Error adding note:", error);
        }
    }, [user, addNewNote]);

    const handleEditNote = useCallback(async (values: NoteFormValues) => {
        if (!noteToEdit?.id) return;

        try {
            await updateExistingNote(noteToEdit.id, values);
            setNoteToEdit(null);
        } catch (error) {
            console.error("Error updating note:", error);
        }
    }, [noteToEdit, updateExistingNote]);

    const handleToggleVisibility = useCallback(async (e: React.MouseEvent, note: INote) => {
        e.stopPropagation();
        if (!note.id) return;

        try {
            await updateExistingNote(note.id, { isPublic: !note.isPublic });
        } catch (error) {
            console.error("Error updating note visibility:", error);
        }
    }, [updateExistingNote]);

    const handleDeleteNote = useCallback(async (e: React.MouseEvent, noteId: string) => {
        e.stopPropagation();
        
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) {
            return;
        }

        try {
            await removeNote(noteId);
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    }, [removeNote]);

    const handleToggleFavorite = useCallback(async (e: React.MouseEvent, note: INote) => {
        e.stopPropagation();
        if (!note.id) return;

        try {
            await toggleNoteFavorite(note.id, !note.isFavorite);
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    }, [toggleNoteFavorite]);

    const handleShare = useCallback(async (note: INote, email: string) => {
        if (!note.id || !user?.uid) return;

        try {
            await shareNote(note.id, email, user.uid);
            alert("Note partagée avec succès !");
        } catch (error) {
            console.error("Error sharing note:", error);
            const errorMessage = error instanceof Error 
                ? error.message 
                : "Erreur lors du partage de la note";
            alert(errorMessage);
        }
    }, [user?.uid, shareNote]);

    const handleEditClick = useCallback((note: INote) => {
        setNoteToEdit(note);
    }, []);

    const toggleExpandNote = useCallback((noteId: string) => {
        setExpandedNote(prev => prev === noteId ? null : noteId);
    }, []);

    const handleEmptyStateAction = useCallback(() => {
        if (user) {
            setShowAddForm(true);
        } else {
            alert("Veuillez vous connecter pour ajouter une note.");
        }
    }, [user]);

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
            <NoteListHeader
                onAddNote={() => setShowAddForm(true)}
                isAuthenticated={!!user}
            />

            <NoteModals
                showAddForm={showAddForm}
                noteToEdit={noteToEdit}
                onCloseAddForm={() => setShowAddForm(false)}
                onCloseEditForm={() => setNoteToEdit(null)}
                onSubmitAdd={handleAddNote}
                onSubmitEdit={handleEditNote}
                editFormInitialValues={editFormInitialValues}
            />

            {displayedNotes.length === 0 ? (
                <EmptyState
                    message="Aucune note disponible."
                    actionText="Créer votre première note"
                    onAction={handleEmptyStateAction}
                />
            ) : (
                <NoteGrid
                    notes={displayedNotes}
                    expandedNote={expandedNote}
                    currentUserId={user?.uid}
                    onToggleExpand={toggleExpandNote}
                    onToggleVisibility={handleToggleVisibility}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteNote}
                    onToggleFavorite={handleToggleFavorite}
                    onShare={handleShare}
                />
            )}
        </div>
    );
};

export default NoteList;
