import React from "react";
import NavBar from "../navbar/NavBar";
import SearchOptions from "../form/SearchOptions";
import NoteList from "../../NoteList";
import Footer from "../Footer";

const Home: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />

            <main className="flex flex-grow w-full">
                <div className="container w-5/6 mx-auto mt-4">
                    <SearchOptions />
                    <NoteList />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Home;
