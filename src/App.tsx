import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Root from "./components/pages/Root";
import ForgotPassword from "./auth/ForgotPassword";
import Home from "./components/pages/Home";
import NoMatch from "./components/pages/NoMatch";
import Profile from "./components/molecules/Profile";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Root isLogin={true} />} />
                <Route path="/register" element={<Root isLogin={false} />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<NoMatch />} />
            </Routes>
        </Router>
    );
}
