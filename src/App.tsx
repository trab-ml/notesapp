import React from "react";
import { Link, Route } from "react-router-dom";
import Menu from "./components/ui/Menu";
import Profile from "./components/ui/Profile";

export default function App() {
    return (
        <div>
            <nav>
                <ul>
                    <li><Link to="/">Notesapp</Link></li>
                    <li><Link to="/">Menu</Link></li>
                    <li><Link to="/profile">Profil</Link></li>
                </ul>
            </nav>

            <Route path="/" Component={Menu} />
            <Route path="/about" Component={Profile} />
        </div>
    );
}
