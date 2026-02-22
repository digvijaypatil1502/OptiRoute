import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';

const DashboardLayout = () => {
    const { isSidebarOpen, closeSidebar } = useSidebar();

    return (
        <div className="dashboard-layout">
            {/* Menu button moved to header in App.jsx */}

            {/* Overlay background for mobile/when drawer is open */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={closeSidebar}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            <main className="dashboard-content">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
