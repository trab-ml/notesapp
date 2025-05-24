import React from "react";
import { NavLink } from "react-router-dom";
import Logout from "../../auth/Logout";

/**
 * Desktop Navigation (Hidden on smaller screens)
 * @returns 
 */
export function DesktopNavigation() {
  return (
    <nav className="hidden md:block">
      <ul className="flex space-x-8">
        <li><NavLink to="/home" className="hover:text-primary transition-colors duration-300">Les notes</NavLink></li>
        <li><NavLink to="/notes-shared-with-me" className="hover:text-primary transition-colors duration-300">Partagées avec moi</NavLink></li>
        <li><Logout /></li>
      </ul>
    </nav>);
}
