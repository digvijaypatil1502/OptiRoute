import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Popup from '../components/Popup';
import ConfirmModal from '../components/ConfirmModal';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState({ message: '', type: '' });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    // Reset pagination when tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    // Confirm Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDanger: false
    });

    // New Route Form State
    const [newRoute, setNewRoute] = useState({
        fromLocation: { name: '' },
        toLocation: { name: '' },
        transportType: 'BUS',
        durationMinutes: '',
        cost: '',
        operator: '',
        date: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'users') {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } else {
                // Fetch routes. For "Routes Today", we could filter here or filtering on backend.
                // Assuming backend returns all, we can filter or just show all for now.
                const res = await api.get('/admin/routes');
                // Sort by ID descending so newest routes appear first
                const sortedRoutes = res.data.sort((a, b) => (b.id || 0) - (a.id || 0));
                setRoutes(sortedRoutes);
            }
        } catch (err) {
            setPopup({ message: "Failed to fetch data", type: 'error' });
            if (err.response?.status === 403) {
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete User',
            message: 'Are you sure you want to delete this user? This action cannot be undone.',
            isDanger: true,
            onConfirm: async () => {
                try {
                    await api.delete(`/admin/users/${id}`);
                    setUsers(users.filter(u => u.id !== id));
                    setPopup({ message: "User deleted", type: 'success' });
                } catch (err) {
                    setPopup({ message: "Failed to delete user", type: 'error' });
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleDeleteRoute = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Route',
            message: 'Are you sure you want to delete this route? This action cannot be undone.',
            isDanger: true,
            onConfirm: async () => {
                try {
                    await api.delete(`/admin/routes/${id}`);
                    setRoutes(routes.filter(r => r.id !== id));
                    setPopup({ message: "Route deleted", type: 'success' });
                } catch (err) {
                    setPopup({ message: "Failed to delete route", type: 'error' });
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };


    const handleAddRoute = async () => {
        try {
            const routePayload = {
                ...newRoute,
                durationMinutes: parseInt(newRoute.durationMinutes),
                cost: parseFloat(newRoute.cost),
                date: newRoute.date || null
            };

            if (!routePayload.fromLocation.name || !routePayload.toLocation.name) {
                setPopup({ message: "Location Names are required", type: 'error' });
                return;
            }

            if (isNaN(routePayload.durationMinutes) || isNaN(routePayload.cost)) {
                setPopup({ message: "Duration and Cost must be valid numbers", type: 'error' });
                return;
            }

            await api.post('/admin/routes', routePayload);

            await fetchData();
            setCurrentPage(1); // Reset to first page to see the new route (since it's sorted by ID DESC)

            setPopup({ message: "Route added successfully", type: 'success' });

            setNewRoute({
                fromLocation: { name: '' },
                toLocation: { name: '' },
                transportType: 'BUS',
                durationMinutes: '',
                cost: '',
                operator: '',
                date: ''
            });
        } catch (err) {
            setPopup({ message: "Failed to add route", type: 'error' });
        }
    };


    const handleAssignOperator = async (id) => {
        const operator = prompt("Enter new operator name:");
        if (!operator) return;
        try {
            await api.put(`/admin/routes/${id}/operator`, { operator });
            fetchData(); // Refresh
            setPopup({ message: "Operator assigned", type: 'success' });
        } catch (err) {
            setPopup({ message: "Failed to assign operator", type: 'error' });
        }
    };



    const [stopModal, setStopModal] = useState({
        isOpen: false,
        routeId: null
    });

    const [newStop, setNewStop] = useState({
        locationName: '',
        lat: '',
        lon: '',
        order: '',
        distKm: '',
        timeMins: ''
    });

    const handleOpenStopModal = (routeId) => {
        setStopModal({ isOpen: true, routeId });
    };

    const handleAddStop = async () => {
        try {
            const payload = {
                ...newStop,
                lat: parseFloat(newStop.lat),
                lon: parseFloat(newStop.lon),
                order: parseInt(newStop.order),
                distKm: parseFloat(newStop.distKm),
                timeMins: parseInt(newStop.timeMins)
            };

            await api.post(`/admin/routes/${stopModal.routeId}/stops`, payload);
            setPopup({ message: "Stop added successfully", type: 'success' });
            setStopModal({ isOpen: false, routeId: null });
            setNewStop({ locationName: '', lat: '', lon: '', order: '', distKm: '', timeMins: '' });
        } catch (err) {
            setPopup({ message: "Failed to add stop: " + (err.response?.data || err.message), type: 'error' });
        }
    };

    return (
        <div className="dashboard-container">
            <Popup
                message={popup.message}
                type={popup.type}
                onClose={() => setPopup({ message: '', type: '' })}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                isDanger={confirmModal.isDanger}
                confirmText={confirmModal.isDanger ? 'Delete' : 'Confirm'}
            />

            {/* Add Stop Modal */}
            {stopModal.isOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: '#1e293b', padding: '2rem', borderRadius: '16px', width: '400px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <h3 style={{ marginTop: 0, color: '#f8fafc' }}>Add Stop to Route #{stopModal.routeId}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input placeholder="Location Name" value={newStop.locationName} onChange={e => setNewStop({ ...newStop, locationName: e.target.value })} className="form-input" />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input placeholder="Lat" value={newStop.lat} onChange={e => setNewStop({ ...newStop, lat: e.target.value })} className="form-input" />
                                <input placeholder="Lon" value={newStop.lon} onChange={e => setNewStop({ ...newStop, lon: e.target.value })} className="form-input" />
                            </div>
                            <input placeholder="Order (e.g., 1)" type="number" value={newStop.order} onChange={e => setNewStop({ ...newStop, order: e.target.value })} className="form-input" />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input placeholder="Dist from Start (km)" type="number" value={newStop.distKm} onChange={e => setNewStop({ ...newStop, distKm: e.target.value })} className="form-input" />
                                <input placeholder="Time from Start (min)" type="number" value={newStop.timeMins} onChange={e => setNewStop({ ...newStop, timeMins: e.target.value })} className="form-input" />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button className="btn-primary" onClick={handleAddStop}>Add Stop</button>
                                <button onClick={() => setStopModal({ isOpen: false, routeId: null })} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #475569', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', flex: 1 }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="search-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ margin: 0, background: 'linear-gradient(to right, #818cf8, #c084fc, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Admin Dashboard
                    </h2>
                </div>

                <div className="admin-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                    <button
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                        style={{
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'users' ? '2px solid var(--primary-color)' : '2px solid transparent',
                            color: activeTab === 'users' ? 'var(--primary-color)' : 'var(--text-muted)',
                            padding: '1rem',
                            cursor: 'pointer',
                            fontSize: '1.1rem',
                            fontWeight: '500'
                        }}
                    >
                        All Users
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'routes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('routes')}
                        style={{
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'routes' ? '2px solid var(--primary-color)' : '2px solid transparent',
                            color: activeTab === 'routes' ? 'var(--primary-color)' : 'var(--text-muted)',
                            padding: '1rem',
                            cursor: 'pointer',
                            fontSize: '1.1rem',
                            fontWeight: '500'
                        }}
                    >
                        Routes Management
                    </button>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Total {activeTab === 'users' ? 'Users' : 'Routes'}: {activeTab === 'users' ? users.length : routes.length}
                    </div>
                </div>

                <div className="admin-content">
                    {loading && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</p>}

                    {!loading && activeTab === 'users' && (
                        <div className="users-list" style={{ overflowX: 'auto' }}>
                            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>ID</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>Username</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>Email</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>Mobile</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(user => (
                                        <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1rem' }}>{user.id}</td>
                                            <td style={{ padding: '1rem' }}>{user.username}</td>
                                            <td style={{ padding: '1rem' }}>{user.email}</td>
                                            <td style={{ padding: '1rem' }}>{user.mobileNumber}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    style={{
                                                        background: 'rgba(239, 68, 68, 0.2)',
                                                        color: '#fca5a5',
                                                        border: 'none',
                                                        padding: '0.4rem 0.8rem',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Pagination Controls */}
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '0.5rem' }}>
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    style={{ padding: '0.5rem 1rem', background: 'var(--input-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                                >
                                    Previous
                                </button>
                                <span style={{ padding: '0.5rem 1rem', color: 'var(--text-muted)' }}>Page {currentPage} of {Math.ceil(users.length / itemsPerPage)}</span>
                                <button
                                    disabled={currentPage >= Math.ceil(users.length / itemsPerPage)}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    style={{ padding: '0.5rem 1rem', background: 'var(--input-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: currentPage >= Math.ceil(users.length / itemsPerPage) ? 'not-allowed' : 'pointer', opacity: currentPage >= Math.ceil(users.length / itemsPerPage) ? 0.5 : 1 }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {!loading && activeTab === 'routes' && (
                        <div className="routes-list">
                            <div className="add-route-section" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--input-bg)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                <h3 style={{ color: 'var(--primary-color)', marginTop: 0, marginBottom: '1.5rem' }}>Add New Route</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                                    <input placeholder="From Location Name" value={newRoute.fromLocation.name} onChange={e => setNewRoute({ ...newRoute, fromLocation: { name: e.target.value } })} className="form-input" />
                                    <input placeholder="To Location Name" value={newRoute.toLocation.name} onChange={e => setNewRoute({ ...newRoute, toLocation: { name: e.target.value } })} className="form-input" />
                                    <select value={newRoute.transportType} onChange={e => setNewRoute({ ...newRoute, transportType: e.target.value })} className="form-select">
                                        <option value="BUS">Bus</option>
                                        <option value="TRAIN">Train</option>
                                        <option value="FLIGHT">Flight</option>
                                        <option value="CAB">Cab</option>
                                    </select>
                                    <input placeholder="Duration (min)" type="number" value={newRoute.durationMinutes} onChange={e => setNewRoute({ ...newRoute, durationMinutes: e.target.value })} className="form-input" />
                                    <input placeholder="Cost" type="number" value={newRoute.cost} onChange={e => setNewRoute({ ...newRoute, cost: e.target.value })} className="form-input" />
                                    <input placeholder="Operator" value={newRoute.operator} onChange={e => setNewRoute({ ...newRoute, operator: e.target.value })} className="form-input" />
                                    <input type="date" value={newRoute.date} onChange={e => setNewRoute({ ...newRoute, date: e.target.value })} className="form-input" style={{ colorScheme: 'dark' }} />
                                    <button className="btn-primary" onClick={handleAddRoute} style={{ marginTop: 0 }}>Add Route</button>
                                </div>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>From</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>To</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>Type</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>Operator</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>Date</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {routes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(route => (
                                            <tr key={route.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '1rem' }}>{route.fromLocation?.name || 'N/A'}</td>
                                                <td style={{ padding: '1rem' }}>{route.toLocation?.name || 'N/A'}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{
                                                        padding: '0.3rem 0.8rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.85rem',
                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                        color: 'var(--text-main)'
                                                    }}>
                                                        {route.transportType}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {route.operator || <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Unassigned</span>}
                                                    <button onClick={() => handleAssignOperator(route.id)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginLeft: '0.5rem', textDecoration: 'underline' }}>Edit</button>
                                                </td>
                                                <td style={{ padding: '1rem' }}>{route.date || 'N/A'}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <button
                                                        onClick={() => handleOpenStopModal(route.id)}
                                                        style={{
                                                            background: 'rgba(52, 211, 153, 0.2)',
                                                            color: '#34d399',
                                                            border: 'none',
                                                            padding: '0.4rem 0.8rem',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            marginRight: '0.5rem'
                                                        }}
                                                    >
                                                        + Stop
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteRoute(route.id)}
                                                        style={{
                                                            background: 'rgba(239, 68, 68, 0.2)',
                                                            color: '#fca5a5',
                                                            border: 'none',
                                                            padding: '0.4rem 0.8rem',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* Pagination Controls */}
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '0.5rem' }}>
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        style={{ padding: '0.5rem 1rem', background: 'var(--input-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                                    >
                                        Previous
                                    </button>
                                    <span style={{ padding: '0.5rem 1rem', color: 'var(--text-muted)' }}>Page {currentPage} of {Math.ceil(routes.length / itemsPerPage)}</span>
                                    <button
                                        disabled={currentPage >= Math.ceil(routes.length / itemsPerPage)}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        style={{ padding: '0.5rem 1rem', background: 'var(--input-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: currentPage >= Math.ceil(routes.length / itemsPerPage) ? 'not-allowed' : 'pointer', opacity: currentPage >= Math.ceil(routes.length / itemsPerPage) ? 0.5 : 1 }}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
