import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <div className="auth-container" style={{ maxWidth: '800px', width: '90%' }}>
            <div className="auth-header">
                <h2>About OptiRoute</h2>
                <p>Revolutionizing your travel experience</p>
            </div>

            <div style={{ padding: '0 1rem', color: '#e2e8f0', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                    OptiRoute is your intelligent companion for smarter, more efficient travel planning. 
                    We leverage cutting-edge technology to find the most optimal routes, saving you time and resources.
                </p>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{ 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        padding: '1.5rem', 
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <h3 style={{ color: '#818cf8', marginBottom: '0.5rem' }}>Smart Routing</h3>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Advanced algorithms to calculate the most efficient paths for your journey.</p>
                    </div>
                    <div style={{ 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        padding: '1.5rem', 
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <h3 style={{ color: '#c084fc', marginBottom: '0.5rem' }}>Real-time Updates</h3>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Stay informed with the latest traffic and route conditions as they happen.</p>
                    </div>
                    <div style={{ 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        padding: '1.5rem', 
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <h3 style={{ color: '#f472b6', marginBottom: '0.5rem' }}>User Centric</h3>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Designed with you in mind, offering a seamless and intuitive interface.</p>
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <button 
                        onClick={() => navigate('/login')}
                        className="btn-primary"
                        style={{ maxWidth: '200px' }}
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
