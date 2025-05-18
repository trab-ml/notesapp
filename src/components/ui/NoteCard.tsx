import React, { useState } from "react";
import { INote } from "../../types/INote";
import { formatDate } from "../../utils/dateUtils";
import { truncateText } from "../../utils/textUtils";
import empty_start from "../../assets/icons/empty-star-24px.png";
import full_start from "../../assets/icons/full-star-24px.png";

interface NoteCardProps {
    note: INote;
    isExpanded: boolean;
    onToggleExpand: (noteId: string) => void;
    onToggleVisibility?: (e: React.MouseEvent, note: INote) => void;
    onEdit?: () => void;
    onDelete?: (e: React.MouseEvent, noteId: string) => void;
    isOwner: boolean;
    onToggleFavorite?: (e: React.MouseEvent, note: INote) => void;
    onShare?: (note: INote, email: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
    note,
    isExpanded,
    onToggleExpand,
    onToggleVisibility,
    onEdit,
    onDelete,
    isOwner,
    onToggleFavorite,
    onShare,
}) => {
    const [showShareInput, setShowShareInput] = useState(false);
    const [emailToShare, setEmailToShare] = useState("");

    const handleShareSubmit = (e: React.FormEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (emailToShare && onShare) {
            onShare(note, emailToShare.trim());
            setEmailToShare("");
            setShowShareInput(false);
        }
    };

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

                    <div className="flex gap-2">
                        {isOwner && (
                            <>
                                {onToggleVisibility && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleVisibility(e, note);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                        title={
                                            note.isPublic
                                                ? "Rendre la note privée"
                                                : "Rendre la note publique"
                                        }
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            {note.isPublic ? (
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            ) : (
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            )}
                                            {note.isPublic && (
                                                <circle cx="12" cy="12" r="3" />
                                            )}
                                            {!note.isPublic && (
                                                <line
                                                    x1="1"
                                                    y1="1"
                                                    x2="23"
                                                    y2="23"
                                                />
                                            )}
                                        </svg>
                                    </button>
                                )}
                                {onEdit && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit();
                                        }}
                                        className="text-orange-600 hover:text-orange-800"
                                        title="Modifier la note"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={(e) => onDelete(e, note.id!)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Supprimer la note"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            <line
                                                x1="10"
                                                y1="11"
                                                x2="10"
                                                y2="17"
                                            />
                                            <line
                                                x1="14"
                                                y1="11"
                                                x2="14"
                                                y2="17"
                                            />
                                        </svg>
                                    </button>
                                )}
                                {onShare && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowShareInput(true);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-800 relative"
                                        title="Partager la note"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="18" cy="5" r="3" />
                                            <circle cx="6" cy="12" r="3" />
                                            <circle cx="18" cy="19" r="3" />
                                            <line
                                                x1="8.59"
                                                y1="13.51"
                                                x2="15.42"
                                                y2="17.49"
                                            />
                                            <line
                                                x1="15.41"
                                                y1="6.51"
                                                x2="8.59"
                                                y2="10.49"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </>
                        )}
                        <button
                            onClick={(e) => onToggleFavorite?.(e, note)}
                            title={
                                note.isFavorite
                                    ? "Retirer des favoris"
                                    : "Ajouter aux favoris"
                            }
                            className="text-yellow-500 hover:text-yellow-600"
                        >
                            {note.isFavorite ? (
                                <img
                                    src={full_start}
                                    alt="favori"
                                    className="w-5 h-5"
                                />
                            ) : (
                                <img
                                    src={empty_start}
                                    alt="non favori"
                                    className="w-5 h-5"
                                />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* sharing note form */}
            {showShareInput && (
                <form
                    onSubmit={handleShareSubmit}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 flex gap-2"
                >
                    <input
                        type="email"
                        required
                        placeholder="Email du destinataire"
                        value={emailToShare}
                        onChange={(e) => setEmailToShare(e.target.value)}
                        className="border px-2 py-1 rounded text-sm w-full"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-500 text-white px-2 py-1 text-sm rounded"
                    >
                        Envoyer
                    </button>
                </form>
            )}
        </div>
    );
};
