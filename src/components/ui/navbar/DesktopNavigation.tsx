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
        <li><NavLink to="#" className="hover:text-primary transition-colors duration-300">Home</NavLink></li>
        <li><NavLink to="#" className="hover:text-primary transition-colors duration-300">Profil</NavLink></li>
      </ul>
    </nav>);
}
