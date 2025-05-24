import React from "react";
import Logout from "../../auth/Logout";
import MenuNavlink from "../atoms/MenuNavlink";

/**
 * Desktop Navigation (Hidden on smaller screens)
 * @returns
 */
export function DesktopNavigation() {
    return (
        <nav className="hidden md:block">
            <ul className="flex space-x-8">
                <MenuNavlink style="hover:text-primary transition-colors duration-300" />
                <li>
                    <Logout />
                </li>
            </ul>
        </nav>
    );
}
