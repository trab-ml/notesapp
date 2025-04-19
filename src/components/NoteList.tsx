import React from "react";
import Note from "./Note";

// List of notes
const NoteList: React.FC = () => {
    return (
        <div className="my-2 p-2 border-2 border-solid rounded-md">
            <Note />
        </div>
    );
};

export default NoteList;
