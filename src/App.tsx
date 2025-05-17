import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Root from "./components/ui/pages/Root";
import ForgotPassword from './auth/ForgotPassword'
import Home from "./components/ui/pages/Home";
import NotesSharedWithMe from "./components/ui/pages/NotesSharedWithMe";
import NoMatch from "./components/ui/pages/NoMatch";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Root isLogin={true} />} />

                <Route path="/register" element={<Root isLogin={false} />} />

                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route path="/home" element={<Home />} />

                {/* Menu */}
                <Route path="/notes-shared-with-me" element={<NotesSharedWithMe />} />

                <Route path="*" element={<NoMatch />} />
            </Routes>
        </Router>
    );
}
