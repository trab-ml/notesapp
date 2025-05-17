import React, { useState } from "react";
import NavBar from "../navbar/NavBar";
import SearchOptions from "../form/SearchOptions";
import NoteList from "../../NoteList";
import Footer from "../Footer";

const Home: React.FC = () => {
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState("all");
    const [filterBy, setFilterBy] = useState("all");

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />

            <main className="flex flex-grow w-full">
                <div className="container w-5/6 mx-auto mt-4">
                    <SearchOptions
                        query={query}
                        setQuery={setQuery}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        filterBy={filterBy}
                        setFilterBy={setFilterBy}
                    />
                    <NoteList
                        query={query}
                        sortBy={sortBy}
                        filterBy={filterBy}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Home;
