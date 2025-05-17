import React from "react";
import { INote } from "../../types/INote";
import { formatDate } from "../../utils/dateUtils";
import { truncateText } from "../../utils/textUtils";

interface NoteCardProps {
    note: INote;
    isExpanded: boolean;
    onToggleExpand: (noteId: string) => void;
    onToggleVisibility?: (e: React.MouseEvent, note: INote) => void;
    onEdit?: () => void;
    onDelete?: (e: React.MouseEvent, noteId: string) => void;
    isOwner: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
    note,
    isExpanded,
    onToggleExpand,
    onToggleVisibility,
    onEdit,
    onDelete,
    isOwner,
}) => {
    return (
        <div
            onClick={() => onToggleExpand(note.id!)}
            className={`border rounded-md shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer ${
                isExpanded ? "bg-gray-50" : "bg-white"
            }`}
        >
            <div className="p-3">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-base truncate">
                        {truncateText(note.title, 20)}
                    </h4>
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                            note.isPublic
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                        {note.isPublic ? "Publique" : "Privée"}
                    </span>
                </div>
                <p
                    className={`text-sm text-gray-600 ${
                        isExpanded ? "" : "line-clamp-2"
                    }`}
                >
                    {isExpanded
                        ? note.content
                        : truncateText(note.content, 100)}
                </p>

                {(isExpanded || !note.content) && note.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {note.tags.map((tag) => (
                            <span
                                key={tag}
                                className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>{formatDate(note.updatedAt.toDate())}</span>
                    {isOwner && (
                        <div className="flex gap-2">
                            {onToggleVisibility && (
                                <button
                                    onClick={(e) => onToggleVisibility(e, note)}
                                    className="text-blue-600 hover:underline"
                                >
                                    {note.isPublic ? "Privée" : "Publique"}
                                </button>
                            )}
                            {onEdit && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit();
                                    }}
                                    className="text-orange-600 hover:underline"
                                >
                                    Éditer
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={(e) => onDelete(e, note.id!)}
                                    className="text-red-600 hover:underline"
                                >
                                    Supprimer
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
