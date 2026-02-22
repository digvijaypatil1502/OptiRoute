import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { usePopup } from '../context/PopupContext';

const RouteSearchPage = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [priority, setPriority] = useState(50); // 0 = Time, 100 = Cost
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showPopup } = usePopup();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const searchRoutes = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResults(null);
        try {

            const costWeight = priority / 100;
            const timeWeight = 1.0 - costWeight;

            const response = await api.get('/routes/suggest', {
                params: {
                    from,
                    to,
                    date,
                    timeWeight: timeWeight.toFixed(2),
                    costWeight: costWeight.toFixed(2)
                }
            });

            setTimeout(() => {
                setResults(response.data);
                setLoading(false);
            }, 200);
        } catch (error) {
            console.error("Search error:", error);
            showPopup('Error fetching routes', 'error');
            setLoading(false);
        }
    };

    const handleSelect = async (routeId) => {
        try {
            const response = await api.post('/payment/initiate', { routeId });
            if (response.data.routeId && response.data.amount) {
                navigate('/payment', {
                    state: {
                        routeId: response.data.routeId,
                        amount: response.data.amount,
                        date: date,
                        from: from,
                        to: to
                    }
                });
            } else {
                navigate(response.data.paymentUrl || '/payment');
            }
        } catch (error) {
            showPopup('Error initiating payment', 'error');
        }
    };

    const getTransportBadge = (type) => {
        const lowerType = type.toLowerCase();
        let badgeClass = 'badge';
        if (lowerType.includes('flight') || lowerType.includes('air')) badgeClass += ' flight';
        else if (lowerType.includes('train') || lowerType.includes('rail')) badgeClass += ' train';
        else if (lowerType.includes('bus') || lowerType.includes('road')) badgeClass += ' bus';

        return <span className={badgeClass}>{type}</span>;
    };

    return (
        <div className="dashboard-container">
            <div className="search-card">
                <h2>Find Your Journey</h2>
                <form onSubmit={searchRoutes} className="search-form" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    <div className="form-group">
                        <label>From</label>
                        <input
                            className="form-input"
                            placeholder="e.g. New York"
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>To</label>
                        <input
                            className="form-input"
                            placeholder="e.g. London"
                            value={to}
                            onChange={e => setTo(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Date of Journey</label>
                        <input
                            type="date"
                            className="form-input"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <label>Priority: {priority < 50 ? 'Time' : 'Cost'}</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            style={{ width: '100%', accentColor: '#34d399', marginTop: '10px' }}
                            title="Left for Time, Right for Cost"
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.7rem', color: '#94a3b8' }}>
                            <span>Time</span>
                            <span>Cost</span>
                        </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '300px', margin: 0 }}>
                            {loading ? 'Searching...' : 'Search Routes'}
                        </button>
                    </div>
                </form>
            </div>

            {loading && (
                <div style={{ textAlign: 'center', marginTop: '3rem', color: '#94a3b8' }}>
                    <p style={{ animation: 'float 2s infinite ease-in-out', fontSize: '1.2rem' }}>Finding the best routes for you...</p>
                </div>
            )}

            {results && !loading && (
                <div className="results-section">
                    { (!results.bestRoute && (!results.otherRoutes || results.otherRoutes.length === 0)) ? (
                        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#94a3b8' }}>
                            <p style={{ fontSize: '1.2rem' }}>No routes found for this search. Try modifying your criteria.</p>
                        </div>
                    ) : (
                        <>
                            {results.bestRoute && (
                                <div style={{ marginBottom: '3rem', animation: 'fadeInUp 0.6s ease-out' }}>
                                    <h3> Recommended Option</h3>
                                    <div className="route-card best-route-card">
                                        <div className="route-header">
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                {getTransportBadge(results.bestRoute.transportType)}
                                                <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{results.bestRoute.operator}</span>
                                                <span style={{ fontSize: '0.9rem', color: '#34d399', fontWeight: 'bold', textTransform: 'uppercase' }}>Efficiency Score: {results.bestRoute.efficiencyScore?.toFixed(2)}</span>
                                            </div>
                                            <span className="price">₹{results.bestRoute.cost}</span>
                                        </div>
                                        <div className="route-details">
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                {results.bestRoute.durationMinutes} min
                                            </span>
                                        </div>
                                        <button
                                            className="btn-primary"
                                            style={{ marginTop: '0', background: 'linear-gradient(135deg, #059669, #10b981)', border: 'none' }}
                                            onClick={() => handleSelect(results.bestRoute.routeId)}
                                        >
                                            Select This Route
                                        </button>
                                    </div>
                                </div>
                            )}
        
                            {results.otherRoutes && results.otherRoutes.length > 0 && (
                                <div>
                                    <h3>Other Options</h3>
                                    <div className="results-grid">
                                        {results.otherRoutes.map((route, index) => (
                                            <div
                                                key={route.routeId}
                                                className="route-card"
                                                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards` }}
                                            >
                                                <div className="route-header">
                                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                        {getTransportBadge(route.transportType)}
                                                        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{route.operator}</span>
                                                    </div>
                                                    <span className="price">₹{route.cost}</span>
                                                </div>
                                                <div className="route-details">
                                                    <span>⏱️ {route.durationMinutes} min</span>
                                                </div>
                                                <button
                                                    className="btn-select"
                                                    onClick={() => handleSelect(route.routeId)}
                                                >
                                                    Select
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default RouteSearchPage;
