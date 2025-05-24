import React from "react";
import { TSearchOptions } from "../../../types/SearchOptions";

const SearchOptions: React.FC<TSearchOptions> = ({
    query,
    setQuery,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-3 lg:flex-row-reverse"
        >
            <div className="flex">
                <input
                    type="text"
                    placeholder="example: react"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full md:w-80 text-indigo-600 px-3 h-10 rounded-l border-2 border-indigo-600 focus:outline-none focus:border-indigo-600"
                />
                <button
                    type="submit"
                    className="bg-indigo-600 text-white rounded-r px-2 md:px-3 py-0 md:py-1 cursor-pointer"
                >
                    Rechercher
                </button>
            </div>

            {/* search options */}
            <div className="w-full flex justify-between md:justify-end md:gap-3">
                <select
                    id="sortBy"
                    name="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-2/6 h-10 border-2 border-indigo-600 focus:outline-none focus:border-indigo-600 text-indigo-600 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
                >
                    <option value="all">Trier</option>
                    <option value="new-to-old">Du plus récent</option>
                    <option value="old-to-new">Du plus ancien</option>
                    <option value="favorites-first">Favoris en haut</option>
                    <option value="a-z">tri alphabétique</option>
                </select>

                <select
                    id="filterBy"
                    name="filterBy"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="w-2/6 h-10 border-2 border-indigo-600 focus:outline-none focus:border-indigo-600 text-indigo-600 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
                >
                    <option value="all">Filtrer</option>
                    <option value="favorites">Favoris</option>
                    <option value="tag">Tag</option>
                    <option value="mine">À moi</option>
                    <option value="not-mine">Non à moi</option>
                    <option value="shared">Partagées avec moi</option>
                </select>
            </div>
        </form>
    );
};

export default SearchOptions;
