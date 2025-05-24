import { useMemo } from "react";
import { INote } from "../types/INote";

const FILTER_TYPES = {
    MINE: "mine",
    NOT_MINE: "not-mine",
    TAG: "tag",
    FAVORITES: "favorites",
    SHARED: "shared",
} as const;

const SORT_TYPES = {
    NEW_TO_OLD: "new-to-old",
    OLD_TO_NEW: "old-to-new",
    FAVORITES_FIRST: "favorites-first",
    A_TO_Z: "a-z",
} as const;

export const useNoteFiltering = (
    notes: INote[],
    query?: string,
    filterBy?: string,
    sortBy?: string,
    userId?: string
) => {
    return useMemo(() => {
            let filteredNotes = [...notes];
    
            // searching
            if (query?.trim()) {
                const searchQuery = query.toLowerCase().trim();
                filteredNotes = filteredNotes.filter(
                    (note) =>
                        note.title.toLowerCase().includes(searchQuery) ||
                        note.content.toLowerCase().includes(searchQuery)
                );
            }
    
            // filtering
            switch (filterBy) {
                case FILTER_TYPES.MINE:
                    filteredNotes = filteredNotes.filter(
                        (note) => note.ownerId === userId
                    );
                    break;
                case FILTER_TYPES.NOT_MINE:
                    filteredNotes = filteredNotes.filter(
                        (note) => note.ownerId !== userId
                    );
                    break;
                case FILTER_TYPES.TAG:
                    if (query?.trim()) {
                        const searchQuery = query.toLowerCase().trim();
                        filteredNotes = filteredNotes.filter((note) =>
                            note.tags?.some((tag) =>
                                tag.toLowerCase().includes(searchQuery)
                            )
                        );
                    }
                    break;
                case FILTER_TYPES.FAVORITES:
                    filteredNotes = filteredNotes.filter((note) => note.isFavorite);
                    break;
                case FILTER_TYPES.SHARED:
                    filteredNotes = filteredNotes.filter(
                        (note) =>
                            note.sharedWith?.includes(userId || "") &&
                            note.ownerId !== userId
                    );
                    break;
            }
    
            // sorting
            switch (sortBy) {
                case SORT_TYPES.NEW_TO_OLD:
                    filteredNotes.sort(
                        (a, b) =>
                            b.createdAt.toDate().getTime() -
                            a.createdAt.toDate().getTime()
                    );
                    break;
                case SORT_TYPES.OLD_TO_NEW:
                    filteredNotes.sort(
                        (a, b) =>
                            a.createdAt.toDate().getTime() -
                            b.createdAt.toDate().getTime()
                    );
                    break;
                case SORT_TYPES.FAVORITES_FIRST:
                    filteredNotes.sort(
                        (a, b) => Number(b.isFavorite) - Number(a.isFavorite)
                    );
                    break;
                case SORT_TYPES.A_TO_Z:
                    filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
                    break;
            }
    
            return filteredNotes;
        }, [query, filterBy, sortBy, notes, userId]);
};