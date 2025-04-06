import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/ui/Menu";
import Profile from "./components/ui/Profile";
import NavBar from "./components/ui/NavBar";
import NoMatch from "./components/NoMatch";

export default function App() {
    return (
        <Router>
            <NavBar />

            <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NoMatch />} />
            </Routes>
        </Router>
    );
}
