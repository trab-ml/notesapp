import React from "react";
import NavBar from "../navbar/NavBar";

const Home: React.FC = () => {
    return (
        <>
            <NavBar />
            <main className="flex w-full">
                <div className="container w-5/6 mx-auto">
                    <h1>Home page</h1>
                    <h2>Notes page</h2>

                    <form className="flex flex-col md:flex-row gap-3 lg:flex-row-reverse">
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="example: react"
                                className="w-full md:w-80 px-3 h-10 rounded-l border-2 border-sky-500 focus:outline-none focus:border-sky-500"
                            />
                            <button
                                type="submit"
                                className="bg-sky-500 text-white rounded-r px-2 md:px-3 py-0 md:py-1 cursor-pointer"
                            >
                                Rechercher
                            </button>
                        </div>

                        {/* search options */}
                        <div className="w-full flex justify-between lg:justify-end lg:gap-3">
                            <select
                                id="sortBy"
                                name="sortBy"
                                className="w-2/6 h-10 border-2 border-sky-500 focus:outline-none focus:border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
                            >
                                <option value="all" selected={true}>
                                    Tout
                                </option>
                                <option value="new-to-old">
                                    Du plus récent
                                </option>
                                <option value="old-to-new">
                                    Du plus ancien
                                </option>
                            </select>

                            <select
                                id="filterBy"
                                name="filterBy"
                                className="w-2/6 h-10 border-2 border-sky-500 focus:outline-none focus:border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
                            >
                                <option value="all" selected={true}>
                                    Aucun
                                </option>
                                <option value="tag">
                                    Tag
                                </option>
                            </select>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default Home;
