import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings/my-bookings');
            setBookings(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTransportEmoji = (type) => {
        const lower = type.toLowerCase();
        if (lower.includes('flight') || lower.includes('air')) return '✈️';
        if (lower.includes('train') || lower.includes('rail')) return '🚆';
        if (lower.includes('bus')) return '🚌';
        return '🚗';
    };

    const getBookingStatus = (booking) => {
        if (booking.status === 'CANCELLED') return 'CANCELLED';

        // Date comparison: Check if journey date is in the past
        const journeyDate = new Date(booking.journeyDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        // If journey date is before today, it's completed
        if (journeyDate < today) return 'COMPLETED';

        return 'UPCOMING';
    };

    const filteredBookings = bookings.filter(booking => {
        const status = getBookingStatus(booking);
        if (activeTab === 'upcoming') {
            return status === 'UPCOMING' || status === 'CONFIRMED';
        } else {
            return status === 'COMPLETED' || status === 'CANCELLED';
        }
    });

    return (
        <div className="dashboard-container">
            <h2 style={{
                color: 'white',
                marginBottom: '2rem',
                fontSize: '2rem',
                background: 'linear-gradient(to right, #818cf8, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>My Bookings</h2>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={activeTab === 'upcoming' ? 'btn-primary' : 'btn-secondary'}
                    style={{
                        flex: 1,
                        background: activeTab === 'upcoming' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    Upcoming Trips
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}
                    style={{
                        flex: 1,
                        background: activeTab === 'history' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    History
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '3rem' }}>
                    <p>Loading your journeys...</p>
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="search-card">
                    <p style={{ textAlign: 'center', color: '#94a3b8' }}>
                        {activeTab === 'upcoming' ? 'You have no upcoming bookings.' : 'No past bookings found.'}
                    </p>
                    {activeTab === 'upcoming' && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                            <button
                                onClick={() => navigate('/search')}
                                className="btn-primary"
                                style={{ maxWidth: '200px' }}
                            >
                                Book a Trip
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="results-grid">
                    {filteredBookings.map((booking) => {
                        const displayStatus = getBookingStatus(booking);
                        return (
                            <div key={booking.id} className="route-card" style={{ cursor: 'default', opacity: displayStatus === 'COMPLETED' ? 0.8 : 1 }}>
                                <div className="route-header">
                                    <span className="badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {getTransportEmoji(booking.transportType)} {booking.transportType}
                                    </span>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        padding: '0.3rem 0.8rem',
                                        borderRadius: '20px',
                                        background: displayStatus === 'UPCOMING' ? 'rgba(52, 211, 153, 0.2)' :
                                            displayStatus === 'COMPLETED' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                                        color: displayStatus === 'UPCOMING' ? '#34d399' :
                                            displayStatus === 'COMPLETED' ? '#94a3b8' : '#f87171',
                                        fontWeight: '600',
                                        border: '1px solid currentColor'
                                    }}>
                                        {displayStatus}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.5rem' }}>Operator: {booking.operator || 'N/A'}</div>

                                <div style={{ marginTop: '1rem', color: '#e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{booking.fromCity}</span>
                                        <span style={{ color: '#94a3b8' }}>➜</span>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{booking.toCity}</span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                                        <div>
                                            <div style={{ marginBottom: '0.3rem' }}>Date</div>
                                            <div style={{ color: 'white' }}>{formatDate(booking.journeyDate)}</div>
                                        </div>
                                        <div>
                                            <div style={{ marginBottom: '0.3rem' }}>Cost</div>
                                            <div style={{ color: '#34d399', fontSize: '1.1rem', fontWeight: 'bold' }}>₹{booking.cost}</div>
                                        </div>
                                        <div>
                                            <div style={{ marginBottom: '0.3rem' }}>Duration</div>
                                            <div style={{ color: 'white' }}>{booking.durationMinutes} min</div>
                                        </div>
                                        <div>
                                            <div style={{ marginBottom: '0.3rem' }}>Booked On</div>
                                            <div style={{ color: 'white' }}>{new Date(booking.bookingTime).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BookingsPage;
