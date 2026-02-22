import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { usePopup } from '../context/PopupContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { showPopup } = usePopup();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            const role = response.data.role;
            localStorage.setItem('role', role); // Optional: store role if needed

            showPopup("Login successful", 'success');

            setTimeout(() => {
                if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
                    navigate('/admin/dashboard', { replace: true });
                } else {
                    navigate('/search', { replace: true });
                }
            }, 1000);
        } catch (err) {
            let errorMsg = typeof err.response?.data === 'string'
                ? err.response.data
                : err.response?.data?.message || "Invalid credentials";

            // Remove "Error: " prefix if present for a cleaner UI
            if (errorMsg.startsWith("Error: ")) {
                errorMsg = errorMsg.replace("Error: ", "");
            }

            showPopup(errorMsg, 'error');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <h2>Welcome Back</h2>
                <p>Sign in to continue to OptiRoute</p>
            </div>

            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        className="form-input"
                        type="email"
                        placeholder="Enter your email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        className="form-input"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn-primary">Sign In</button>
            </form>

            <div className="auth-footer">
                <p>Don't have an account? <a href="/register">Register here</a></p>
                <p><a href="/forgot-password" style={{ fontSize: '0.9rem', color: '#a78bfa' }}>Forgot Password?</a></p>
                <div style={{ marginTop: '15px', display: 'flex', gap: '15px', justifyContent: 'center', fontSize: '0.85rem' }}>
                    <a href="/about-us" style={{ color: '#94a3b8', textDecoration: 'none' }}>About Us</a>
                    <span style={{ color: '#475569' }}>|</span>
                    <a href="/contact-us" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact</a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
