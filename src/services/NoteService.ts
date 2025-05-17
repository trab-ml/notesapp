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

const NOTES_COLLECTION = "notes";

const convertDocToNote = (doc: QueryDocumentSnapshot<DocumentData>): INote => {
    const data = doc.data();
    return {
        id: doc.id,
        title: data.title || "",
        content: data.content || "",
        isPublic: !!data.isPublic,
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt || Timestamp.now(),
        tags: data.tags || [],
        ownerId: data.ownerId || "",
        isFavorite: !!data.isFavorite,
    };
};

export const saveUserProfile = async (user: { uid: string, email: string }) => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
        });
    }
};

export const findUidByEmail = async (email: string): Promise<string | null> => {
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    return snapshot.docs[0].data().uid;
};

export const addNote = async (note: Omit<INote, "id">): Promise<string> => {
    try {
        if (!note.title.trim() || note.title.trim().length < 5) {
            throw new Error("Le titre de la note doit contenir au moins 5 caractères");
        }
        
        if (!note.content.trim() || note.content.trim().length < 10) {
            throw new Error("Le contenu de la note doit contenir au moins 10 caractères");
        }
        
        if (!note.ownerId) {
            throw new Error("L'ID du propriétaire est requis");
        }

        const docRef = await addDoc(collection(db, NOTES_COLLECTION), {
            ...note,
            createdAt: note.createdAt || Timestamp.now(),
            updatedAt: note.updatedAt || Timestamp.now(),
            isFavorite: false,
        });
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

export const getUserNotesAndPublicOnes = async (userId: string): Promise<INote[]> => {
    try {
        const userNotesQuery = query(
            collection(db, NOTES_COLLECTION),
            where("ownerId", "==", userId),
            orderBy("updatedAt", "desc")
        );
        
        const userNotesSnapshot = await getDocs(userNotesQuery);
        const userNotes = userNotesSnapshot.docs.map(convertDocToNote);
        
        const publicNotesQuery = query(
            collection(db, NOTES_COLLECTION),
            where("isPublic", "==", true),
            where("ownerId", "!=", userId),
            orderBy("ownerId"),
            orderBy("updatedAt", "desc")
        );
        
        const publicNotesSnapshot = await getDocs(publicNotesQuery);
        const publicNotes = publicNotesSnapshot.docs.map(convertDocToNote);
        
        return [...userNotes, ...publicNotes];
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
    await updateDoc(noteRef, {
        isFavorite,
        updatedAt: Timestamp.now(),
    });
};

export const getSharedNotes = async (uid: string): Promise<INote[]> => {
    const notesRef = collection(db, NOTES_COLLECTION);
    const q = query(notesRef, where("sharedWith", "array-contains", uid));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as INote[];
};
