import React from "react";
import { INote } from "../../types/INote";
import { NoteCard } from "../molecules/NoteCard";

interface NoteGridProps {
    notes: INote[];
    expandedNote: string | null;
    currentUserId?: string;
    onToggleExpand: (noteId: string) => void;
    onToggleVisibility: (e: React.MouseEvent, note: INote) => void;
    onEdit: (note: INote) => void;
    onDelete: (e: React.MouseEvent, noteId: string) => void;
    onToggleFavorite: (e: React.MouseEvent, note: INote) => void;
    onShare: (note: INote, email: string) => void;
}

export const NoteGrid: React.FC<NoteGridProps> = ({
    notes,
    expandedNote,
    currentUserId,
    onToggleExpand,
    onToggleVisibility,
    onEdit,
    onDelete,
    onToggleFavorite,
    onShare,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {notes.map((note) => {
                const isOwner = currentUserId === note.ownerId;
                
                return (
                    <NoteCard
                        key={note.id}
                        note={note}
                        isExpanded={expandedNote === note.id}
                        onToggleExpand={onToggleExpand}
                        onToggleVisibility={isOwner ? onToggleVisibility : undefined}
                        onEdit={isOwner ? onEdit : undefined}
                        onDelete={isOwner ? onDelete : undefined}
                        isOwner={isOwner}
                        onToggleFavorite={isOwner ? onToggleFavorite : undefined}
                        onShare={isOwner ? onShare : undefined}
                    />
                );
            })}
        </div>
    );
};