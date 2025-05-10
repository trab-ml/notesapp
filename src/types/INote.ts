import { Timestamp } from "firebase/firestore";

export interface INote {
    id?: string;
    title: string;
    content: string;
    isPublic: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    tags: string[];
    ownerId: string;
}
