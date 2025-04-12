import React from "react";

function toggleMenu() {
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenu) {
    mobileMenu.classList.toggle('hidden');

    if (!mobileMenu.classList.contains('hidden')) {
      mobileMenu.style.height = mobileMenu.scrollHeight + "px"; // Set height for transition
    } else {
      mobileMenu.style.height = "0";
    }
  }
}

/**
 * Component for the Mobile Menu Button (Hidden on larger screens)
 * @returns 
 */
export function MobileMenuTriggerButton() {
  return <div className="md:hidden">
    <button id="menu-toggle" className="text-gray-800 hover:text-primary focus:outline-none transition-colors duration-300" onClick={toggleMenu}>
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </button>
  </div>;
}
