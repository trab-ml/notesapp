import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li><NavLink to="/">Notesapp</NavLink></li>
        <li><NavLink to="/">Menu</NavLink></li>
        <li><NavLink to="/profile">Profil</NavLink></li>
      </ul>
    </nav>
  );
};

export default NavBar;