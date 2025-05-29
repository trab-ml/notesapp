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
    enableNetwork,
    disableNetwork,
    onSnapshot,
} from "firebase/firestore";
import { INote } from "../types/INote";
import { uid } from "uid/secure";

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
        ownerEmail: data.ownerEmail || "",
        isFavorite: !!data.isFavorite,
        sharedWith: data.sharedWith || [],
    };
};

class NotesService {
    private listeners: (() => void)[] = [];

    static async initializeOfflineSupport() {
        try {
            await enableNetwork(db);
            console.log("Cache offline Firebase initialisé");
        } catch (error) {
            console.error("Erreur initialisation cache offline:", error);
        }
    }

    async setNetworkEnabled(enabled: boolean) {
        try {
            if (enabled) {
                await enableNetwork(db);
            } else {
                await disableNetwork(db);
            }
        } catch (error) {
            console.error("Erreur changement état réseau:", error);
        }
    }

    async saveUserProfile(user: { uid: string; email: string }) {
        const userRef = doc(db, USERS_COLLECTION, user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            await setDoc(userRef, user);
        }
    }

    async findUidByEmail(email: string): Promise<string | null> {
        const q = query(
            collection(db, USERS_COLLECTION),
            where("email", "==", email)
        );
        const snapshot = await getDocs(q);
        return snapshot.empty ? null : snapshot.docs[0].data().uid;
    }

    async addNote(
        note: Omit<INote, "id" | "createdAt" | "updatedAt" | "sharedWith">
    ): Promise<string> {
        try {
            const { title, content, ownerId } = note;

            if (!title?.trim() || title.length < 5)
                throw new Error(
                    "Le titre de la note doit contenir au moins 5 caractères"
                );
            if (!content?.trim() || content.length < 10)
                throw new Error(
                    "Le contenu de la note doit contenir au moins 10 caractères"
                );
            if (!ownerId) throw new Error("L'ID du propriétaire est requis");

            const newNote = {
                ...note,
                id: uid(),
                createdAt: now(),
                updatedAt: now(),
                isFavorite: false,
                sharedWith: [],
            };

            const docRef = await addDoc(
                collection(db, NOTES_COLLECTION),
                newNote
            );
            return docRef.id;
        } catch (error) {
            console.error("Error adding note:", error);
            throw error;
        }
    }

    async getNote(noteId: string): Promise<INote | null> {
        try {
            const noteDoc = await getDoc(doc(db, NOTES_COLLECTION, noteId));
            return noteDoc.exists()
                ? ({ id: noteDoc.id, ...noteDoc.data() } as INote)
                : null;
        } catch (error) {
            console.error("Error getting note:", error);
            throw error;
        }
    }

    async getVisibleNotes(): Promise<INote[]> {
        try {
            const q = query(
                collection(db, NOTES_COLLECTION),
                where("isPublic", "==", true),
                orderBy("updatedAt", "desc")
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(convertDocToNote);
        } catch (error) {
            console.error("Error fetching visible notes:", error);
            throw error;
        }
    }

    /**
     * Fetches notes for a specific user, including their own notes, public notes, and shared notes.
     * @param userId - The ID of the user whose notes are to be fetched.
     * @returns A promise that resolves to an array of notes.
     */
    async getUserNotesAndPublicOnes(userId: string): Promise<INote[]> {
        try {
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
        } catch (error) {
            console.error("Error fetching user and public notes:", error);
            throw new Error("Failed to load notes");
        }
    }

    async updateNote(noteId: string, updates: Partial<INote>): Promise<void> {
        try {
            await updateDoc(doc(db, NOTES_COLLECTION, noteId), updates);
        } catch (error) {
            console.error("Error updating note:", error);
            throw error;
        }
    }

    async deleteNote(noteId: string): Promise<void> {
        try {
            await deleteDoc(doc(db, NOTES_COLLECTION, noteId));
        } catch (error) {
            console.error("Error deleting note:", error);
            throw error;
        }
    }

    async toggleFavorite(noteId: string, isFavorite: boolean) {
        const noteRef = doc(db, NOTES_COLLECTION, noteId);
        await updateDoc(noteRef, { isFavorite, updatedAt: now() });
    }

    async shareNoteWithUser(
        noteId: string,
        userEmail: string,
        currentUserId: string
    ): Promise<void> {
        try {
            const sharedUserUid = await this.findUidByEmail(userEmail);
            if (!sharedUserUid) throw new Error("Utilisateur non trouvé");
            if (sharedUserUid === currentUserId)
                throw new Error(
                    "Vous ne pouvez pas partager une note avec vous-même"
                );

            const note = await this.getNote(noteId);
            if (!note) throw new Error("Note non trouvée");
            if (note.ownerId !== currentUserId)
                throw new Error(
                    "Seul le propriétaire peut partager cette note"
                );

            if (note.sharedWith?.includes(sharedUserUid))
                throw new Error(
                    "La note est déjà partagée avec cet utilisateur"
                );

            const updatedSharedWith = [
                ...(note.sharedWith || []),
                sharedUserUid,
            ];

            await this.updateNote(noteId, {
                sharedWith: updatedSharedWith,
                updatedAt: now(),
            });
        } catch (error) {
            console.error("Error sharing note:", error);
            throw error;
        }
    }

    async unshareNoteFromUser(
        noteId: string,
        userUid: string,
        currentUserId: string
    ): Promise<void> {
        try {
            const note = await this.getNote(noteId);

            if (!note) throw new Error("Note non trouvée");
            if (note.ownerId !== currentUserId)
                throw new Error(
                    "Seul le propriétaire peut modifier le partage"
                );

            const updatedSharedWith = (note.sharedWith || []).filter(
                (uid) => uid !== userUid
            );

            await this.updateNote(noteId, {
                sharedWith: updatedSharedWith,
                updatedAt: now(),
            });
        } catch (error) {
            console.error("Error unsharing note:", error);
            throw error;
        }
    }

    subscribeToUserNotes(userId: string, callback: (notes: INote[]) => void): () => void {
        const queries = [
            query(
                collection(db, NOTES_COLLECTION),
                where("ownerId", "==", userId),
                orderBy("updatedAt", "desc")
            ),
            query(
                collection(db, NOTES_COLLECTION),
                where("isPublic", "==", true),
                where("ownerId", "!=", userId),
                orderBy("ownerId"),
                orderBy("updatedAt", "desc")
            ),
            query(
                collection(db, NOTES_COLLECTION),
                where("sharedWith", "array-contains", userId)
            )
        ];

        const unsubscribes: (() => void)[] = [];
        let allNotes: INote[] = [];

        queries.forEach((q, index) => {
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const notes = snapshot.docs.map(convertDocToNote);
                
                if (index === 0) allNotes = allNotes.filter(n => n.ownerId !== userId);
                if (index === 1) allNotes = allNotes.filter(n => !n.isPublic || n.ownerId === userId);
                if (index === 2) allNotes = allNotes.filter(n => !n.sharedWith?.includes(userId));
                
                allNotes.push(...notes);
                
                const uniqueNotes = allNotes.filter(
                    (note, i, self) => i === self.findIndex(n => n.id === note.id)
                );
                
                uniqueNotes.sort((a, b) => 
                    b.updatedAt.toDate().getTime() - a.updatedAt.toDate().getTime()
                );
                
                callback(uniqueNotes);
            }, (error) => {
                console.error(`Erreur écoute query ${index}:`, error);
            });
            
            unsubscribes.push(unsubscribe);
        });

        const cleanup = () => {
            unsubscribes.forEach(unsub => unsub());
        };
        
        this.listeners.push(cleanup);
        return cleanup;
    }

    cleanup() {
        this.listeners.forEach(cleanup => cleanup());
        this.listeners = [];
    }
}

export const notesService = new NotesService();
