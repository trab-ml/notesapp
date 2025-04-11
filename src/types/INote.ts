export interface INote {
    id?: string;
    title: string;
    description: string;
    isPublic: boolean;
    createdAt: Date;
    tags: string[];
    authorId: string;
}
