import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { usePopup } from '../context/PopupContext';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        mobileNumber: '',
        securityQuestion: '',
        securityAnswer: ''
    });
    const { showPopup } = usePopup();
    const navigate = useNavigate();

    const securityQuestions = [
        "What was your first pet?",
        "What is your mother's maiden name?",
        "What city were you born in?",
        "What is your favorite book?",
        "What is the name of your first school?"
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const { email, mobileNumber, password } = formData;

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Invalid email format";

        // Mobile Number Validation
        if (!/^\d{10}$/.test(mobileNumber)) return "Mobile number must be 10 digits";

        // Password Validation (Alphanumeric)
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
        if (!passwordRegex.test(password)) return "Password must be alphanumeric";

        return null;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            showPopup(validationError, 'error');
            return;
        }

        try {
            await api.post('/auth/register', formData);
            showPopup("Registration successful", 'success');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            let errorMsg = typeof err.response?.data === 'string'
                ? err.response.data
                : err.response?.data?.message || "Registration failed";

            if (errorMsg.startsWith("Error: ")) {
                errorMsg = errorMsg.replace("Error: ", "");
            }

            showPopup(errorMsg, 'error');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <h2>Create Account</h2>
                <p>Join OptiRoute today</p>
            </div>

            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label>Username</label>
                    <input className="form-input" type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input className="form-input" type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Mobile Number</label>
                    <input className="form-input" type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Security Question</label>
                    <select className="form-select" name="securityQuestion" value={formData.securityQuestion} onChange={handleChange} required>
                        <option value="">Select a question</option>
                        {securityQuestions.map((q, index) => (
                            <option key={index} value={q}>{q}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Answer</label>
                    <input className="form-input" type="text" name="securityAnswer" value={formData.securityAnswer} onChange={handleChange} required />
                </div>

                <button type="submit" className="btn-primary">Create Account</button>
            </form>

            <div className="auth-footer">
                <p>Already have an account? <a href="/login">Sign in</a></p>
                <div style={{ marginTop: '15px', display: 'flex', gap: '15px', justifyContent: 'center', fontSize: '0.85rem' }}>
                    <a href="/about-us" style={{ color: '#94a3b8', textDecoration: 'none' }}>About Us</a>
                    <span style={{ color: '#475569' }}>|</span>
                    <a href="/contact-us" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact</a>
                </div>
            </div>
        </div>
    );
};

export default Register;
