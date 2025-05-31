import { db } from "../firebase/firebase";
import {
    collection,
    addDoc,
    getDoc,
    setDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    Timestamp,
    DocumentData,
    QueryDocumentSnapshot,
    onSnapshot,
} from "firebase/firestore";
import { INote } from "../types/INote";
import { uid } from "uid/secure";
import { BaseNotesService, PendingOperation } from "./baseNotesService";

const NOTES_COLLECTION = "notes";
const USERS_COLLECTION = "users";

const now = () => Timestamp.now();

const convertDocToNote = (doc: QueryDocumentSnapshot<DocumentData>): INote => {
    const data = doc.data();
    return {
        id: doc.id,
        title: data.title || "",
        content: data.content || "",
        isPublic: !!data.isPublic,
        createdAt: data.createdAt || now(),
        updatedAt: data.updatedAt || now(),
        tags: data.tags || [],
        ownerId: data.ownerId || "",
        ownerEmail: data.ownerEmail ?? "",
        isFavorite: !!data.isFavorite,
        sharedWith: data.sharedWith || [],
    };
};

class NotesService extends BaseNotesService {
    private activeSubscriptions = new Map<string, () => void>();

    constructor() {
        super();
    }

    protected async executeOperation(operation: PendingOperation) {
        const { type, noteId, data } = operation;
        const noteRef = noteId ? doc(db, NOTES_COLLECTION, noteId) : null;

        switch (type) {
            case 'create':
                await addDoc(collection(db, NOTES_COLLECTION), data);
                break;
            case 'update':
            case 'favorite':
            case 'share':
            case 'unshare':
                if (noteRef) await updateDoc(noteRef, data);
                break;
            case 'delete':
                if (noteRef) await deleteDoc(noteRef);
                break;
        }
    }

    async saveUserProfile(user: { uid: string; email: string }) {
        if (!this.isOnline) {
            this.addPendingOperation({
                type: 'create',
                data: { type: 'user_profile', user }
            });
            return;
        }

        const userRef = doc(db, USERS_COLLECTION, user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            await setDoc(userRef, user);
        }
    }

    async findUidByEmail(email: string): Promise<string | null> {
        return this.executeWithOfflineSupport(
            async () => {
                const q = query(
                    collection(db, USERS_COLLECTION),
                    where("email", "==", email)
                );
                const snapshot = await getDocs(q);
                return snapshot.empty ? null : snapshot.docs[0].data().uid;
            },
            () => null
        );
    }

    private validateNoteInput(note: { title?: string; content?: string; ownerId?: string }) {
        if (!note.title?.trim() || note.title.length < 5) {
            throw new Error("Le titre de la note doit contenir au moins 5 caractères");
        }
        if (!note.content?.trim() || note.content.length < 10) {
            throw new Error("Le contenu de la note doit contenir au moins 10 caractères");
        }
        if (!note.ownerId) {
            throw new Error("L'ID du propriétaire est requis");
        }
    }

    async addNote(note: Omit<INote, "id" | "createdAt" | "updatedAt" | "sharedWith">): Promise<string> {
        try {
            this.validateNoteInput(note);

            const noteId = uid();
            const newNote = {
                ...note,
                id: noteId,
                createdAt: now(),
                updatedAt: now(),
                isFavorite: false,
                sharedWith: [],
            };

            if (!this.isOnline) {
                this.addPendingOperation({
                    type: 'create',
                    data: newNote
                });
                return noteId;
            }

            const docRef = await addDoc(collection(db, NOTES_COLLECTION), newNote);
            return docRef.id;
        } catch (error) {
            console.error("Error adding note:", error);
            throw error;
        }
    }

    async getNote(noteId: string): Promise<INote | null> {
        return this.executeWithOfflineSupport(
            async () => {
                const noteDoc = await getDoc(doc(db, NOTES_COLLECTION, noteId));
                return noteDoc.exists()
                    ? ({ id: noteDoc.id, ...noteDoc.data() } as INote)
                    : null;
            },
            () => null
        );
    }

    async getVisibleNotes(): Promise<INote[]> {
        return this.executeWithOfflineSupport(
            async () => {
                const q = query(
                    collection(db, NOTES_COLLECTION),
                    where("isPublic", "==", true),
                    orderBy("updatedAt", "desc")
                );

                const querySnapshot = await getDocs(q);
                return querySnapshot.docs.map(convertDocToNote);
            },
            () => []
        );
    }

    async getUserNotesAndPublicOnes(userId: string): Promise<INote[]> {
        return this.executeWithOfflineSupport(
            async () => {
                const [ownNotes, publicNotes, sharedNotes] = await Promise.all([
                    getDocs(
                        query(
                            collection(db, NOTES_COLLECTION),
                            where("ownerId", "==", userId),
                            orderBy("updatedAt", "desc")
                        )
                    ),
                    getDocs(
                        query(
                            collection(db, NOTES_COLLECTION),
                            where("isPublic", "==", true),
                            where("ownerId", "!=", userId),
                            orderBy("ownerId"),
                            orderBy("updatedAt", "desc")
                        )
                    ),
                    getDocs(
                        query(
                            collection(db, NOTES_COLLECTION),
                            where("sharedWith", "array-contains", userId)
                        )
                    ),
                ]);

                const allNotes = [
                    ...ownNotes.docs,
                    ...publicNotes.docs,
                    ...sharedNotes.docs,
                ].map(convertDocToNote);

                const uniqueNotes = allNotes.filter(
                    (note, index, self) =>
                        index === self.findIndex((n) => n.id === note.id)
                );

                return uniqueNotes.sort(
                    (a, b) =>
                        b.updatedAt.toDate().getTime() -
                        a.updatedAt.toDate().getTime()
                );
            },
            () => []
        );
    }

    private async updateNoteWithPending(noteId: string, updates: Partial<INote>, operationType: 'update' | 'favorite' = 'update') {
        const updateData = { ...updates, updatedAt: now() };

        if (!this.isOnline) {
            this.addPendingOperation({
                type: operationType,
                noteId,
                data: updateData
            });
            return;
        }

        try {
            await updateDoc(doc(db, NOTES_COLLECTION, noteId), updateData);
        } catch (error) {
            console.error(`Error ${operationType === 'update' ? 'updating' : 'toggling favorite'} note:`, error);
            this.addPendingOperation({
                type: operationType,
                noteId,
                data: updateData
            });
            throw error;
        }
    }

    async updateNote(noteId: string, updates: Partial<INote>): Promise<void> {
        await this.updateNoteWithPending(noteId, updates);
    }

    async deleteNote(noteId: string): Promise<void> {
        if (!this.isOnline) {
            this.addPendingOperation({
                type: 'delete',
                noteId
            });
            return;
        }

        try {
            await deleteDoc(doc(db, NOTES_COLLECTION, noteId));
        } catch (error) {
            console.error("Error deleting note:", error);
            this.addPendingOperation({
                type: 'delete',
                noteId
            });
            throw error;
        }
    }

    async toggleFavorite(noteId: string, isFavorite: boolean) {
        await this.updateNoteWithPending(noteId, { isFavorite }, 'favorite');
    }

    private async validateNoteSharing(noteId: string, currentUserId: string) {
        const note = await this.getNote(noteId);
        if (!note) throw new Error("Note non trouvée");
        if (note.ownerId !== currentUserId) {
            throw new Error("Seul le propriétaire peut partager cette note");
        }
        return note;
    }

    async shareNoteWithUser(noteId: string, userEmail: string, currentUserId: string): Promise<void> {
        if (!this.isOnline) {
            throw new Error("Le partage de notes n'est pas disponible hors ligne");
        }

        try {
            const sharedUserUid = await this.findUidByEmail(userEmail);
            if (!sharedUserUid) throw new Error("Utilisateur non trouvé");
            if (sharedUserUid === currentUserId) {
                throw new Error("Vous ne pouvez pas partager une note avec vous-même");
            }

            const note = await this.validateNoteSharing(noteId, currentUserId);

            if (note.sharedWith?.includes(sharedUserUid)) {
                throw new Error("La note est déjà partagée avec cet utilisateur");
            }

            const updatedSharedWith = [
                ...(note.sharedWith || []),
                sharedUserUid,
            ];

            await this.updateNoteWithPending(noteId, {
                sharedWith: updatedSharedWith
            });
        } catch (error) {
            console.error("Error sharing note:", error);
            throw error;
        }
    }

    async unshareNoteFromUser(noteId: string, userUid: string, currentUserId: string): Promise<void> {
        if (!this.isOnline) {
            throw new Error("La modification du partage n'est pas disponible hors ligne");
        }

        try {
            const note = await this.validateNoteSharing(noteId, currentUserId);

            const updatedSharedWith = (note.sharedWith || []).filter(
                (uid) => uid !== userUid
            );

            await this.updateNoteWithPending(noteId, {
                sharedWith: updatedSharedWith
            });
        } catch (error) {
            console.error("Error unsharing note:", error);
            throw error;
        }
    }

    subscribeToUserNotes(userId: string, callback: (notes: INote[]) => void): () => void {
        if (!this.isOnline || !this.isNetworkEnabled) {
            return () => {};
        }
        this.cleanup();
        
        return new Promise<() => void>((resolve) => {
            setTimeout(() => {
                const unsubscribes: (() => void)[] = [];
                let isActive = true;
                const subscriptionId = `${userId}-${Date.now()}`;
        
                const notesCollections: INote[][] = [[], [], []];
        
                const handleSnapshot = (index: number) => (snapshot: any) => {
                    if (!isActive) return;
                    
                    try {
                        notesCollections[index] = snapshot.docs.map(convertDocToNote);
                        const allNotes = notesCollections.flat();
        
                        const uniqueNotes = allNotes.filter(
                            (note, i, self) => i === self.findIndex((n) => n.id === note.id)
                        );
        
                        const sortedNotes = [...uniqueNotes].sort((a, b) =>
                            b.updatedAt.toMillis() - a.updatedAt.toMillis()
                        );

                        callback(sortedNotes);
                    } catch (error) {
                        console.error("Erreur dans handleSnapshot:", error);
                    }
                };

                const queries = [
                    query(collection(db, NOTES_COLLECTION), where("ownerId", "==", userId), orderBy("updatedAt", "desc")),
                    query(collection(db, NOTES_COLLECTION), where("isPublic", "==", true), where("ownerId", "!=", userId), orderBy("updatedAt", "desc")),
                    query(collection(db, NOTES_COLLECTION), where("sharedWith", "array-contains", userId)),
                ];
        
                queries.forEach((q, i) => {
                    try {
                        const unsub = onSnapshot(q, 
                            handleSnapshot(i),
                            (error) => {
                                console.error(`Erreur snapshot query ${i}:`, error);
                                if (isActive) {
                                    setTimeout(() => {
                                        try {
                                            unsub();
                                        } catch (e) {
                                            console.error("Erreur cleanup après erreur snapshot:", e);
                                        }
                                    }, 100);
                                }
                            }
                        );
                        unsubscribes.push(unsub);
                    } catch (error) {
                        console.error(`Erreur création subscription ${i}:`, error);
                    }
                });
        
                const cleanup = () => {
                    isActive = false;
                    unsubscribes.forEach((unsub, index) => {
                        try {
                            unsub();
                        } catch (error) {
                            console.error(`Erreur lors du cleanup de la souscription ${index}:`, error);
                        }
                    });
                    this.activeSubscriptions.delete(subscriptionId);
                };
        
                this.activeSubscriptions.set(subscriptionId, cleanup);
                resolve(cleanup);
            }, 100);
        });
    }

    cleanup() {
        const subscriptionsToClean = Array.from(this.activeSubscriptions.entries());
        this.activeSubscriptions.clear();
        
        subscriptionsToClean.forEach(([subscriptionId, unsubscribe]) => {
            try {
                unsubscribe();
            } catch (error) {
                console.error(`Erreur lors du cleanup pour la souscription ${subscriptionId}:`, error);
            }
        });

        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
            this.retryTimeout = null;
        }
    }

    destroy() {
        this.cleanup();
        this.syncStatusCallbacks.clear();
        
        if (typeof window !== 'undefined') {
            window.removeEventListener('online', this.handleOnline.bind(this));
            window.removeEventListener('offline', this.handleOffline.bind(this));
        }
    }
}

export const notesService = new NotesService();