import React from "react";
import { NavLink } from "react-router-dom";

const MenuNavlink: React.FC<{ style: string }> = ({ style }) => {
    return (
        <>
            <li>
                <NavLink
                    to="/home"
                    className={style}
                >
                    Notes
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/profile"
                    className={style}
                >
                    Profil
                </NavLink>
            </li>
        </>
    );
}

export default MenuNavlink;