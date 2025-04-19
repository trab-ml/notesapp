import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Desktop Navigation (Hidden on smaller screens)
 * @returns 
 */
export function DesktopNavigation() {
  return (
    <nav className="hidden md:block">
      <ul className="flex space-x-8">
        <li><NavLink to="/my-notes" className="hover:text-primary transition-colors duration-300">Mes notes</NavLink></li>
        <li><NavLink to="/favorites" className="hover:text-primary transition-colors duration-300">Mes favoris</NavLink></li>
        <li><NavLink to="/notes-shared-with-me" className="hover:text-primary transition-colors duration-300">Partagées avec moi</NavLink></li>
      </ul>
    </nav>);
}
