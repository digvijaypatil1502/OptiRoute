import React from 'react';

const SettingsPage = () => {
    return (
        <div className="profile-container" style={{ color: 'white' }}>
            <h2>Settings</h2>
            <div className="search-card">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>Notifications</h4>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Receive email updates about your trips</span>
                        </div>
                        <input type="checkbox" defaultChecked style={{ transform: 'scale(1.5)' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>Dark Mode</h4>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Enable dark theme</span>
                        </div>
                        <input type="checkbox" defaultChecked disabled style={{ transform: 'scale(1.5)' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
                        <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#f87171' }}>Delete Account</h4>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Permanently remove your data</span>
                        </div>
                        <button style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#fca5a5',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
