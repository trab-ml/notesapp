import React from "react";
import visibility_icon from "../assets/icons/visibility.svg";
import edit_icon from "../assets/icons/edit.svg";
import delete_icon from "../assets/icons/delete.svg";


const Note: React.FC = () => {
    return (<section className="w-full md:w--md h-16 flex gap-1 justify-between items-center mt-1 px-2 border-1 border-solid rounded-md">
        <h5>titre</h5>
        <p>description...</p>
        <div className="flex gap-1">
            <img className="hover:cursor-pointer" src={visibility_icon} alt="eye"/>
            <img className="hover:cursor-pointer" src={edit_icon} alt="pencil"/>
            <img className="hover:cursor-pointer" src={delete_icon} alt="delete"/>
        </div>
    </section>);
};

export default Note;
