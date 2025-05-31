import { useCallback, useState, useEffect, useRef } from "react";
import { INote } from "../types/INote";
import { notesService } from "../services/notesService";
import { SyncStatus } from "../services/baseNotesService";

export const useNotes = (userId?: string) => {
    const [notes, setNotes] = useState<INote[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>("synced");

    const isMountedRef = useRef(true);
    const unsubscribersRef = useRef<{
        notes?: () => void;
        syncStatus?: () => void;
    }>({});

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            Object.values(unsubscribersRef.current).forEach((unsubscribe) =>
                unsubscribe?.()
            );
            unsubscribersRef.current = {};
        };
    }, []);

    useEffect(() => {
        const unsubscribe = notesService.onSyncStatusChange((status) => {
            if (isMountedRef.current) {
                setSyncStatus(status);
            }
        });

        unsubscribersRef.current.syncStatus = unsubscribe;

        return () => {
            unsubscribe();
            unsubscribersRef.current.syncStatus = undefined;
        };
    }, []);

    useEffect(() => {
        const loadNotes = async () => {
            if (!isMountedRef.current) return;

            setLoading(true);

            unsubscribersRef.current.notes?.();
            unsubscribersRef.current.notes = undefined;

            await new Promise((r) => setTimeout(r, 100));

            if (!userId) {
                try {
                    const publicNotes = await notesService.getVisibleNotes();
                    if (isMountedRef.current) setNotes(publicNotes);
                } catch {
                    if (isMountedRef.current) {
                        setNotes([]);
                    }
                } finally {
                    if (isMountedRef.current) setLoading(false);
                }
                return;
            }

            try {
                const unsubscribe = notesService.subscribeToUserNotes(
                    userId,
                    (newNotes) => {
                        if (isMountedRef.current) {
                            setNotes(newNotes);
                        }
                    }
                );
                if (isMountedRef.current) {
                    unsubscribersRef.current.notes = unsubscribe;
                }
            } catch {
                try {
                    const fallbackNotes =
                        await notesService.getUserNotesAndPublicOnes(userId);
                    if (isMountedRef.current) {
                        setNotes(fallbackNotes);
                    }
                } catch {
                    if (isMountedRef.current) {
                        setNotes([]);
                    }
                }
            } finally {
                if (isMountedRef.current) setLoading(false);
            }
        };

        loadNotes();

        return () => {
            unsubscribersRef.current.notes?.();
            unsubscribersRef.current.notes = undefined;
        };
    }, [userId]);

    const assertUserConnected = useCallback(
        (message: string) => {
            if (!userId) throw new Error(message);
        },
        [userId]
    );

    const assertOnline = useCallback(
        (message: string) => {
            if (syncStatus === "offline") throw new Error(message);
        },
        [syncStatus]
    );

    const addNewNote = useCallback(
        async (
            noteData: Omit<
                INote,
                "id" | "createdAt" | "updatedAt" | "sharedWith"
            >
        ) => {
            assertUserConnected(
                "Veuillez vous connecter pour ajouter une note"
            );
            await notesService.addNote(noteData);
        },
        [assertUserConnected]
    );

    const updateExistingNote = useCallback(
        async (noteId: string, updates: Partial<INote>) => {
            assertUserConnected(
                "Vous devez être connecté pour modifier une note"
            );
            await notesService.updateNote(noteId, updates);
        },
        [assertUserConnected]
    );

    const removeNote = useCallback(
        async (noteId: string) => {
            assertUserConnected("Connexion requise pour supprimer une note");
            await notesService.deleteNote(noteId);
        },
        [assertUserConnected]
    );

    const toggleNoteFavorite = useCallback(
        async (noteId: string, isFavorite: boolean) => {
            assertUserConnected("Connexion requise pour gérer les favoris");
            await notesService.toggleFavorite(noteId, isFavorite);
        },
        [assertUserConnected]
    );

    const shareNote = useCallback(
        async (noteId: string, email: string, ownerId: string) => {
            assertUserConnected("Connexion requise pour partager");
            assertOnline("Le partage nécessite une connexion internet");
            await notesService.shareNoteWithUser(noteId, email, ownerId);
        },
        [assertUserConnected, assertOnline]
    );

    return {
        notes,
        loading,
        addNewNote,
        updateExistingNote,
        removeNote,
        toggleNoteFavorite,
        shareNote,
    };
};
