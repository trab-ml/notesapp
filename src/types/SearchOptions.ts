export type TSearchOptions = {
    query: string;
    setQuery: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    filterBy: string;
    setFilterBy: (value: string) => void;
};

export type TNoteListSearchOptions = {
    query: string;
    sortBy: string;
    filterBy: string;
};