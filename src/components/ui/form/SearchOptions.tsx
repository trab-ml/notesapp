import React from "react";

const SearchOptions: React.FC = () => {
    return (
        <form className="flex flex-col md:flex-row gap-3 lg:flex-row-reverse">
            <div className="flex">
                <input
                    type="text"
                    placeholder="example: react"
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
                    className="w-2/6 h-10 border-2 border-indigo-600 focus:outline-none focus:border-indigo-600 text-indigo-600 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
                >
                    <option value="all" defaultValue="">
                        Tout
                    </option>
                    <option value="new-to-old">Du plus récent</option>
                    <option value="old-to-new">Du plus ancien</option>
                </select>

                <select
                    id="filterBy"
                    name="filterBy"
                    className="w-2/6 h-10 border-2 border-indigo-600 focus:outline-none focus:border-indigo-600 text-indigo-600 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
                >
                    <option value="all" defaultValue="">
                        Aucun
                    </option>
                    <option value="tag">Tag</option>
                    <option value="mine">À moi</option>
                    <option value="not-mine">Non à moi</option>
                </select>
            </div>
        </form>
    );
};

export default SearchOptions;