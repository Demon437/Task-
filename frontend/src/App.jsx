import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import UserEpaper from './pages/UserEpaper';
import AdminEpaper from './pages/AdminEpaper';
import SiteHeader from './components/SiteHeader';

function App() {
    const token = localStorage.getItem('token');

    return (
        <BrowserRouter>
            <SiteHeader />
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/epaper" element={<UserEpaper />} />
                <Route
                    path="/dashboard"
                    element={
                        token ? <Dashboard /> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/admin/epaper"
                    element={
                        token ? <AdminEpaper /> : <Navigate to="/login" />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
