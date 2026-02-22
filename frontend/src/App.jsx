import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import RouteSearchPage from './pages/RouteSearchPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import BookingsPage from './pages/BookingsPage';
import SettingsPage from './pages/SettingsPage';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import logo from './assets/logo.png';
import './App.css';

import AdminDashboard from './pages/AdminDashboard';

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutConfirmModal from './components/LogoutConfirmModal';
import { SidebarProvider, useSidebar } from './context/SidebarContext';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar(); // Access sidebar toggle
  // Show menu button on dashboard pages
  const dashboardRoutes = ['/search', '/profile', '/bookings', '/admin/dashboard'];
  const showMenuButton = dashboardRoutes.includes(location.pathname);

  // Show logout button on dashboard pages + payment page
  const showLogout = showMenuButton || location.pathname === '/payment';

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Navigation Guard - Prevent Back Button
  useEffect(() => {
    if (showLogout) {
      // Push history state so the user has something to "back" from, which we can intercept
      window.history.pushState(null, document.title, window.location.href);

      const handlePopState = (event) => {
        // Prevent default back action by pushing state again
        window.history.pushState(null, document.title, window.location.href);
        setShowConfirmModal(true);
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [showLogout]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const confirmLogout = () => {
    setShowConfirmModal(false);
    handleLogout();
  };

  const cancelLogout = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <div className="top-header-bar" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '80px',
        padding: '0 3rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        boxSizing: 'border-box',
        backdropFilter: 'blur(10px)',
        background: 'rgba(15, 23, 42, 0.6)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {showMenuButton && (
          <button
            onClick={toggleSidebar}
            className="header-menu-btn"
            style={{
              position: 'absolute',
              left: '3rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: '#818cf8',
              fontSize: '1.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              zIndex: 10
            }}
          >
            ☰
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src={logo} alt="OptiRoute Logo" style={{ height: '40px', width: 'auto' }} />
          <h1 style={{
            margin: 0,
            fontSize: '2.2rem',
            fontWeight: '800',
            background: 'linear-gradient(to right, #818cf8, #c084fc, #f472b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent'
          }}>OptiRoute</h1>
        </div>
        {showLogout && (
          <button
            onClick={() => setShowConfirmModal(true)}
            style={{
              position: 'absolute',
              right: '3rem',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '0.6rem 1.5rem',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#fca5a5',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.25)';
              e.target.style.transform = 'translateY(-50%) scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.15)';
              e.target.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            Logout
          </button>
        )}
      </div>

      <div className="app-container" style={{
        marginTop: '80px',
        minHeight: 'calc(100vh - 80px)',
        padding: '2rem',
        boxSizing: 'border-box'
      }}>
        <main style={{ width: '100%', margin: '0 auto' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Dashboard Routes with Sidebar - Protected */}
            <Route element={<PrivateRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/search" element={<RouteSearchPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                {/* Add other dashboard routes here */}
              </Route>

              <Route path="/payment" element={<PaymentPage />} /> {/* Kept separate for distraction-free payment */}
            </Route>
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<Contact />} />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>

      <LogoutConfirmModal
        isOpen={showConfirmModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
}

import { PopupProvider } from './context/PopupContext';

function App() {
  return (
    <Router>
      <PopupProvider>
        <SidebarProvider>
          <AppContent />
        </SidebarProvider>
      </PopupProvider>
    </Router>
  );
}

export default App;
