import React from "react";
import { NavLink } from "react-router-dom";

function toggleMobileServicesDropdown() {
  const servicesDropdown = document.getElementById('services-dropdown');
  servicesDropdown?.classList.toggle('hidden');
}

export function MobileMenu() {
  return (
    <nav id="mobile-menu" className="hidden md:hidden bg-gray-50 border-t border-gray-200 transition-height duration-300 ease-in-out">
      <ul className="px-4 py-2">
        <li>
          <NavLink
            to="/"
            id="services-dropdown-toggle"
            className="block py-2 hover:text-primary"
            onClick={toggleMobileServicesDropdown}>
            Menu
          </NavLink>

          {/* Mobile Dropdown */}
          <ul id="services-dropdown" className="hidden pl-4">
            <li><NavLink to="/menu/service1" className="block py-2 hover:text-primary">Service 1</NavLink></li>
            <li><NavLink to="/menu/service2" className="block py-2 hover:text-primary">Service 2</NavLink></li>
          </ul>
        </li>

        <li><NavLink to="/profile" className="block py-2 hover:text-primary">Profil</NavLink></li>
      </ul>
    </nav>);
}
