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

export const saveUserProfile = async (user: { uid: string; email: string }) => {
    const userRef = doc(db, USERS_COLLECTION, user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        await setDoc(userRef, user);
    }
};

export const findUidByEmail = async (email: string): Promise<string | null> => {
    const q = query(
        collection(db, USERS_COLLECTION),
        where("email", "==", email)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].data().uid;
};

export const addNote = async (
    note: Omit<INote, "id" | "createdAt" | "updatedAt" | "sharedWith">
): Promise<string> => {
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

        const docRef = await addDoc(collection(db, NOTES_COLLECTION), newNote);
        return docRef.id;
    } catch (error) {
        console.error("Error adding note:", error);
        throw error;
    }
};

export const getNote = async (noteId: string): Promise<INote | null> => {
    try {
        const noteDoc = await getDoc(doc(db, NOTES_COLLECTION, noteId));
        return noteDoc.exists()
            ? ({ id: noteDoc.id, ...noteDoc.data() } as INote)
            : null;
    } catch (error) {
        console.error("Error getting note:", error);
        throw error;
    }
};

export const getVisibleNotes = async (): Promise<INote[]> => {
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
};

/**
 * Fetches notes for a specific user, including their own notes, public notes, and shared notes.
 * @param userId - The ID of the user whose notes are to be fetched.
 * @returns A promise that resolves to an array of notes.
 */
export const getUserNotesAndPublicOnes = async (
    userId: string
): Promise<INote[]> => {
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
                b.updatedAt.toDate().getTime() - a.updatedAt.toDate().getTime()
        );
    } catch (error) {
        console.error("Error fetching user and public notes:", error);
        throw new Error("Failed to load notes");
    }
};

export const updateNote = async (
    noteId: string,
    updates: Partial<INote>
): Promise<void> => {
    try {
        await updateDoc(doc(db, NOTES_COLLECTION, noteId), updates);
    } catch (error) {
        console.error("Error updating note:", error);
        throw error;
    }
};

export const deleteNote = async (noteId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, NOTES_COLLECTION, noteId));
    } catch (error) {
        console.error("Error deleting note:", error);
        throw error;
    }
};

export const toggleFavorite = async (noteId: string, isFavorite: boolean) => {
    const noteRef = doc(db, NOTES_COLLECTION, noteId);
    await updateDoc(noteRef, { isFavorite, updatedAt: now() });
};

export const shareNoteWithUser = async (
    noteId: string,
    userEmail: string,
    currentUserId: string
): Promise<void> => {
    try {
        const sharedUserUid = await findUidByEmail(userEmail);
        if (!sharedUserUid) throw new Error("Utilisateur non trouvé");
        if (sharedUserUid === currentUserId)
            throw new Error(
                "Vous ne pouvez pas partager une note avec vous-même"
            );

        const note = await getNote(noteId);
        if (!note) throw new Error("Note non trouvée");
        if (note.ownerId !== currentUserId)
            throw new Error("Seul le propriétaire peut partager cette note");

        if (note.sharedWith?.includes(sharedUserUid))
            throw new Error("La note est déjà partagée avec cet utilisateur");

        const updatedSharedWith = [...(note.sharedWith || []), sharedUserUid];

        await updateNote(noteId, {
            sharedWith: updatedSharedWith,
            updatedAt: now(),
        });
    } catch (error) {
        console.error("Error sharing note:", error);
        throw error;
    }
};

export const unshareNoteFromUser = async (
    noteId: string,
    userUid: string,
    currentUserId: string
): Promise<void> => {
    try {
        const note = await getNote(noteId);
        if (!note) {
            throw new Error("Note non trouvée");
        }

        if (note.ownerId !== currentUserId) {
            throw new Error("Seul le propriétaire peut modifier le partage");
        }

        const updatedSharedWith = (note.sharedWith || []).filter(
            (uid) => uid !== userUid
        );

        await updateNote(noteId, {
            sharedWith: updatedSharedWith,
            updatedAt: now(),
        });
    } catch (error) {
        console.error("Error unsharing note:", error);
        throw error;
    }
};
