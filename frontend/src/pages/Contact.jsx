import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup';

const Contact = () => {
    const navigate = useNavigate();
    const [popup, setPopup] = useState({ message: '', type: '' });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to a backend
        console.log('Contact form submitted:', formData);
        setPopup({ message: 'Message sent successfully! We will get back to you soon.', type: 'success' });

        // Clear form
        setFormData({ name: '', email: '', message: '' });

        // Optional: Redirect back after delay
        // setTimeout(() => navigate('/login'), 3000);
    };

    return (
        <>
            <Popup
                message={popup.message}
                type={popup.type}
                onClose={() => setPopup({ message: '', type: '' })}
            />
            <div className="auth-container">
                <div className="auth-header">
                    <h2>Contact Us</h2>
                    <p>We'd love to hear from you</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Your Name</label>
                        <input
                            className="form-input"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            className="form-input"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea
                            className="form-input"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="How can we help you?"
                            style={{ minHeight: '120px', resize: 'vertical' }}
                        />
                    </div>

                    <button type="submit" className="btn-primary">Send Message</button>

                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        style={{
                            width: '100%',
                            marginTop: '1rem',
                            padding: '0.8rem',
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#94a3b8',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#94a3b8';
                        }}
                    >
                        Cancel
                    </button>
                </form>

                <div className="auth-footer" style={{ marginTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }}>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                        Email: support@optiroute.com<br />
                        Phone: +91 (555) 123-4567
                    </p>
                </div>
            </div>
        </>
    );
};

export default Contact;
