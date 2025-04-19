import React from "react";
import NavBar from "../navbar/NavBar";
import SearchOptions from "../form/SearchOptions";
import NoteList from "../../NoteList";

const Home: React.FC = () => {
    return (
        <>
            <NavBar />
            <main className="flex w-full">
                <div className="container w-5/6 mx-auto mt-4">
                    {/* <h1>Home page</h1> <h2>Notes page</h2> */}
                    <SearchOptions />
                    <NoteList />
                </div>
            </main>
        </>
    );
};

export default Home;
