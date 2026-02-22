import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { usePopup } from '../context/PopupContext';
import ConfirmModal from '../components/ConfirmModal';

const ProfilePage = () => {
    const { showPopup } = usePopup();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        username: '',
        email: '',
        mobileNumber: '',
        joinDate: 'Jan 2026' // Placeholder as we don't store this yet
    });

    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [editForm, setEditForm] = useState({
        username: '',
        mobileNumber: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const checkIsAdmin = storedRole === 'ADMIN' || storedRole === 'ROLE_ADMIN';
        setIsAdmin(checkIsAdmin);
        fetchProfile(checkIsAdmin);
    }, []);

    const fetchProfile = async (adminMode) => {
        try {
            const endpoint = adminMode ? '/admin/profile' : '/user/profile';
            const response = await api.get(endpoint);
            setUser(prev => ({ ...prev, ...response.data }));
            setLoading(false);
        } catch (error) {
            console.error(error);
            showPopup('Failed to fetch profile', 'error');
            setLoading(false);
        }
    };

    const handleEditClick = () => {
        setEditForm({
            username: user.username,
            mobileNumber: user.mobileNumber || '',
            password: '',
            confirmPassword: ''
        });
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (editForm.password && editForm.password !== editForm.confirmPassword) {
            showPopup("Passwords don't match", 'warning');
            return;
        }

        try {
            const endpoint = isAdmin ? '/admin/profile' : '/user/profile';
            await api.put(endpoint, {
                username: editForm.username,
                mobileNumber: editForm.mobileNumber,
                password: editForm.password || null
            });
            showPopup('Profile updated successfully', 'success');
            setIsEditing(false);
            fetchProfile(isAdmin); // Refresh data
        } catch (error) {
            showPopup(error.response?.data || 'Update failed', 'error');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await api.delete('/user/profile');
            localStorage.removeItem('token');
            window.location.href = '/login';
        } catch (error) {
            showPopup('Failed to delete account', 'error');
            setShowDeleteConfirm(false);
        }
    };

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', marginTop: '3rem' }}>Loading profile...</div>;
    }

    return (
        <div className="profile-container" style={{ color: 'white' }}>
            <h2>{isAdmin ? 'Admin Profile' : 'My Profile'}</h2>
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar-placeholder">
                        {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                        <h3>{user.username}</h3>
                        <p style={{ color: '#94a3b8' }}>{user.email}</p>
                    </div>
                </div>

                <div className="profile-details">
                    <div className="detail-item">
                        <label>Email</label>
                        <span>{user.email}</span>
                    </div>
                    <div className="detail-item">
                        <label>Mobile Number</label>
                        <span>{user.mobileNumber || 'Not set'}</span>
                    </div>
                    <div className="detail-item">
                        <label>Member Since</label>
                        <span>{user.joinDate}</span>
                    </div>
                    <div className="detail-item">
                        <label>Account Status</label>
                        <span className="badge success">Active</span>
                    </div>
                </div>

                <div className="profile-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        className="btn-primary"
                        style={{ flex: 1, minWidth: '150px' }}
                        onClick={handleEditClick}
                    >
                        Edit Profile
                    </button>
                    {!isAdmin && (
                        <button
                            className="btn-primary"
                            onClick={() => setShowDeleteConfirm(true)}
                            style={{
                                flex: 1,
                                minWidth: '150px',
                                background: '#ef4444',
                                border: 'none'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = '#dc2626';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = '#ef4444';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            Delete Account
                        </button>
                    )}
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="sidebar-overlay" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                    <div className="auth-container" style={{ margin: 0, maxWidth: '500px', animation: 'fadeInUp 0.3s ease' }}>
                        <div className="auth-header">
                            <h2>Edit Profile</h2>
                        </div>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-input"
                                    value={editForm.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Mobile Number</label>
                                <input
                                    type="text"
                                    name="mobileNumber"
                                    className="form-input"
                                    value={editForm.mobileNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password (leave blank to keep current)</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input"
                                    value={editForm.password}
                                    onChange={handleInputChange}
                                    placeholder="********"
                                />
                            </div>
                            {editForm.password && (
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="form-input"
                                        value={editForm.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" onClick={() => setIsEditing(false)} className="btn-primary" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', marginTop: 0 }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" style={{ marginTop: 0 }}>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Delete Account"
                message="Are you sure you want to permanently delete your account? This action cannot be undone."
                onConfirm={handleDeleteAccount}
                onCancel={() => setShowDeleteConfirm(false)}
                confirmText="Delete Account"
                cancelText="Cancel"
                isDanger={true}
            />
        </div>
    );
};
export default ProfilePage;
