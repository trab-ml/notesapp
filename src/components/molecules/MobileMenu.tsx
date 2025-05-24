import React from "react";
import Logout from "../../auth/Logout";
import MenuNavlink from "../atoms/MenuNavlink";

function toggleMobileServicesDropdown() {
    const mobileMenu = document.getElementById("mobile-menu");
    const servicesDropdown = document.getElementById("services-dropdown");

    if (mobileMenu && servicesDropdown) {
        servicesDropdown.classList.toggle("hidden");

        if (!servicesDropdown.classList.contains("hidden")) {
            mobileMenu.style.height = 216 + "px";
        } else {
            mobileMenu.style.height = 96 + "px";
        }
    }
}

export function MobileMenu() {
    return (
        <nav
            id="mobile-menu"
            className="hidden md:hidden bg-gray-50 border-t border-gray-200 transition-height duration-200 ease-in-out"
        >
            <ul className="px-4 py-2">
                <li>
                    <button
                        id="services-dropdown-toggle"
                        className="block py-2 hover:text-primary"
                        onClick={toggleMobileServicesDropdown}
                    >
                        Menu
                    </button>

                    {/* Mobile Dropdown */}
                    <ul
                        id="services-dropdown"
                        className="-bg-gray-50 hidden pl-4"
                    >
                        <MenuNavlink style="block py-2 hover:text-primary" />
                    </ul>
                </li>

                <li>
                    <Logout />
                </li>
            </ul>
        </nav>
    );
}
