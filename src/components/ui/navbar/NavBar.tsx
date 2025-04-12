import { MobileMenuTriggerButton } from './MobileMenuTriggerButton';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { DesktopNavigation } from './DesktopNavigation';
import React from "react";

const NavBar = () => {
  return (
    // <nav>
    //   <ul>
    //     <li><NavLink to="/">Notesapp</NavLink></li>
    //     <li><NavLink to="/">Menu</NavLink></li>
    //     <li><NavLink to="/profile">Profil</NavLink></li>
    //   </ul>
    // </nav>

    <header className="bg-white shadow-lg py-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Logo />
        <MobileMenuTriggerButton />
        <DesktopNavigation />
      </div>

      <MobileMenu />
    </header>
  );
}

export default NavBar;