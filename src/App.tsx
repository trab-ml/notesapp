import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Root from "./components/ui/Root";
import ForgotPassword from './auth/ForgotPassword'
import Home from "./components/ui/Home";
import Menu from "./components/ui/navbar/Menu";
import Profile from "./components/ui/navbar/Profile";
import NoMatch from "./components/NoMatch";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Root isLogin={true} />} />

                <Route path="/register" element={<Root isLogin={false} />} />

                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route path="/home" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/profile" element={<Profile />} />

                <Route path="*" element={<NoMatch />} />
            </Routes>
        </Router>
    );
}
