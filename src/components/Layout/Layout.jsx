import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Target, Calendar, Layout as LayoutIcon, Feather, Moon, Sun, CheckSquare } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="layout-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Journal</h2>
                </div>

                <nav className="nav-menu">
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Feather size={20} />
                        <span>Ownership</span>
                    </NavLink>
                    <NavLink to="/vision" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutIcon size={20} />
                        <span>Vision</span>
                    </NavLink>
                    <NavLink to="/goals" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Target size={20} />
                        <span>Goals</span>
                    </NavLink>
                    <NavLink to="/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Calendar size={20} />
                        <span>Year</span>
                    </NavLink>
                    <NavLink to="/monthly" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Moon size={20} />
                        <span>Month</span>
                    </NavLink>
                    <NavLink to="/weekly" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Sun size={20} />
                        <span>Week</span>
                    </NavLink>
                    <NavLink to="/daily" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <CheckSquare size={20} />
                        <span>Today</span>
                    </NavLink>
                    <NavLink to="/reflection" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <BookOpen size={20} />
                        <span>Reflection</span>
                    </NavLink>
                </nav>
            </aside>

            <main className="main-content fade-in">
                {children}
            </main>
        </div>
    );
};

export default Layout;
