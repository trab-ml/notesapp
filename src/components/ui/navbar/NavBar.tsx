import { MobileMenuTriggerButton } from "./MobileMenuTriggerButton";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { DesktopNavigation } from "./DesktopNavigation";
import React from "react";

const NavBar = () => {
    return (
        <header className="bg-white shadow-lg py-4 sticky top-0 z-50 flex w-full">
            <div className="container w-5/6 mx-auto">
                <div className="container flex items-center justify-between">
                    <Logo />
                    <MobileMenuTriggerButton />
                    <DesktopNavigation />
                </div>

                <MobileMenu />
            </div>
        </header>
    );
};

export default NavBar;
