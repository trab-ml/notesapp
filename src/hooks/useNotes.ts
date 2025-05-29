import { useCallback, useState, useEffect } from "react";
import { INote } from "../types/INote";
import { notesService } from "../services/notesService";
import { Timestamp } from "firebase/firestore";

export const useNotes = (userId?: string) => {
    const [notes, setNotes] = useState<INote[]>([]);
    const [loading, setLoading] = useState(true);

    const loadNotes = useCallback(async () => {
        setLoading(true);
        try {
            const combinedNotes = userId
                ? await notesService.getUserNotesAndPublicOnes(userId)
                : await notesService.getVisibleNotes();
            setNotes(combinedNotes);
        } catch (error) {
            console.error("Error loading notes:", error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const addNewNote = useCallback(async (noteData: Omit<INote, "id" | "createdAt" | "updatedAt" | "sharedWith">) => {
        try {
            await notesService.addNote(noteData);
            await loadNotes();
        } catch (error) {
            console.error("Error adding note:", error);
            throw error;
        }
    }, [loadNotes]);

    const updateExistingNote = useCallback(async (noteId: string, updates: Partial<INote>) => {
        try {
            await notesService.updateNote(noteId, { ...updates, updatedAt: Timestamp.now() });
            setNotes(prev => prev.map(note => 
                note.id === noteId ? { ...note, ...updates, updatedAt: Timestamp.now() } : note
            ));
        } catch (error) {
            console.error("Error updating note:", error);
            await loadNotes();
            throw error;
        }
    }, [loadNotes]);

    const removeNote = useCallback(async (noteId: string) => {
        try {
            await notesService.deleteNote(noteId);
            setNotes(prev => prev.filter(note => note.id !== noteId));
        } catch (error) {
            console.error("Error deleting note:", error);
            await loadNotes();
            throw error;
        }
    }, [loadNotes]);

    const toggleNoteFavorite = useCallback(async (noteId: string, isFavorite: boolean) => {
        try {
            await notesService.toggleFavorite(noteId, isFavorite);
            setNotes(prev => prev.map(note =>
                note.id === noteId ? { ...note, isFavorite } : note
            ));
        } catch (error) {
            console.error("Error toggling favorite:", error);
            await loadNotes();
            throw error;
        }
    }, [loadNotes]);

    const shareNote = useCallback(async (noteId: string, email: string, ownerId: string) => {
        try {
            await notesService.shareNoteWithUser(noteId, email, ownerId);
            await loadNotes();
        } catch (error) {
            console.error("Error sharing note:", error);
            throw error;
        }
    }, [loadNotes]);

    useEffect(() => {
        loadNotes();
    }, [loadNotes]);

    return {
        notes,
        loading,
        addNewNote,
        updateExistingNote,
        removeNote,
        toggleNoteFavorite,
        shareNote,
        refreshNotes: loadNotes,
    };
};