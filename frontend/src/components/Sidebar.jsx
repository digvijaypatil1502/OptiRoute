import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const role = localStorage.getItem('role');
    const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN' || location.pathname.startsWith('/admin');

    const navItems = [
        { name: 'Search Routes', path: '/search', icon: '🔍' },
        { name: 'My Profile', path: '/profile', icon: '👤' },
        { name: 'My Bookings', path: '/bookings', icon: '📅' },
    ];

    const adminNavItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { name: 'My Profile', path: '/profile', icon: '👤' },
    ];

    const itemsToShow = isAdmin ? adminNavItems : navItems;

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            {/* Close button for mobile/drawer */}
            <button className="sidebar-close-btn" onClick={onClose}>×</button>

            <div className="sidebar-header">
                <h3>Menu</h3>
            </div>
            <nav className="sidebar-nav">
                {itemsToShow.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? "sidebar-link active" : "sidebar-link"
                        }
                    >
                        <span className="icon">{item.icon}</span>
                        {item.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
