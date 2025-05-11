import { db } from "../firebase/firebase";
import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
} from "firebase/firestore";
import { INote } from "../types/INote";

export const addNote = async (note: Omit<INote, "id">): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, "notes"), note);
        return docRef.id;
    } catch (error) {
        console.error("Error adding note:", error);
        throw error;
    }
};

export const getNote = async (noteId: string): Promise<INote | null> => {
    try {
        const noteDoc = await getDoc(doc(db, "notes", noteId));
        return noteDoc.exists()
            ? ({ id: noteDoc.id, ...noteDoc.data() } as INote)
            : null;
    } catch (error) {
        console.error("Error getting note:", error);
        throw error;
    }
};

export const getVisibleNotes = async (userId: string): Promise<INote[]> => {
    try {
        const notesRef = collection(db, "notes");

        const publicQuery = query(notesRef, where("isPublic", "==", true));
        const ownQuery = query(notesRef, where("ownerId", "==", userId));

        const [publicSnap, ownSnap] = await Promise.all([
            getDocs(publicQuery),
            getDocs(ownQuery),
        ]);

        const notesMap = new Map<string, INote>();

        publicSnap.forEach((doc) =>
            notesMap.set(doc.id, { id: doc.id, ...doc.data() } as INote)
        );
        ownSnap.forEach((doc) =>
            notesMap.set(doc.id, { id: doc.id, ...doc.data() } as INote)
        );

        return Array.from(notesMap.values());
    } catch (error) {
        console.error("Error fetching visible notes:", error);
        throw error;
    }
};

export const updateNote = async (
    noteId: string,
    updates: Partial<INote>
): Promise<void> => {
    try {
        await updateDoc(doc(db, "notes", noteId), updates);
    } catch (error) {
        console.error("Error updating note:", error);
        throw error;
    }
};

export const deleteNote = async (noteId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, "notes", noteId));
    } catch (error) {
        console.error("Error deleting note:", error);
        throw error;
    }
};
