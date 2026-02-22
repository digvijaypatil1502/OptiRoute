import { useState, useEffect } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { usePopup } from '../context/PopupContext';
import api from '../services/api';
import './PaymentPage.css';

const PaymentPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const routeId = location.state?.routeId || searchParams.get('routeId');
    const amount = location.state?.amount || searchParams.get('amount');
    const date = location.state?.date;
    const fromCity = location.state?.from;
    const toCity = location.state?.to;

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [paymentId, setPaymentId] = useState(null);
    const [errors, setErrors] = useState({});

    // Formatting helpers
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };

    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });

    const [upiDetails, setUpiDetails] = useState({ id: '' });
    const { showPopup } = usePopup();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');
    }, [navigate]);

    const validateForm = () => {
        let newErrors = {};
        if (paymentMethod === 'card') {
            if (!cardDetails.name.trim()) newErrors.name = 'Name on card is required';
            const cleanNumber = cardDetails.number.replace(/\s/g, '');
            if (!/^\d{16}$/.test(cleanNumber)) newErrors.number = 'Valid 16-digit card number required';
            if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
                newErrors.expiry = 'Use MM/YY format';
            } else {
                const [month, year] = cardDetails.expiry.split('/').map(Number);
                const now = new Date();
                const currentYear = now.getFullYear() % 100;
                const currentMonth = now.getMonth() + 1;
                if (month < 1 || month > 12 || year < currentYear || (year === currentYear && month < currentMonth)) {
                    newErrors.expiry = 'Card is expired or invalid';
                }
            }
            if (!/^\d{3,4}$/.test(cardDetails.cvc)) newErrors.cvc = 'Valid 3/4 digit CVC required';
        } else if (paymentMethod === 'upi') {
            if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiDetails.id)) {
                newErrors.upi = 'Invalid UPI ID format (e.g. name@bank)';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePay = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        try {
            const initiateRes = await api.post('/payment/initiate', { routeId: parseInt(routeId) });
            const pid = initiateRes.data.paymentId;
            setPaymentId(pid);

            // Mock transaction processing delay
            await new Promise(resolve => setTimeout(resolve, 2500));

            await api.post(`/payment/confirm/${pid}`);
            await api.post('/bookings/create', {
                routeId: parseInt(routeId),
                journeyDate: date,
                fromCity,
                toCity
            });
            showPopup('Payment Successful! Ticket Booked.', 'success');
            navigate('/bookings');
        } catch (error) {
            console.error(error);
            if (paymentId) await api.post(`/payment/fail/${paymentId}`);
            showPopup('Payment failed. Please try again.', 'error');
            setLoading(false);
        }
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === 'number') formattedValue = formatCardNumber(value);
        if (name === 'expiry') formattedValue = formatExpiry(value);
        setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleUpiChange = (e) => {
        setUpiDetails({ id: e.target.value });
        if (errors.upi) setErrors(prev => ({ ...prev, upi: null }));
    };

    const baseFare = parseFloat(amount || 0);
    const taxes = baseFare * 0.05; // Simulate 5% tax
    const totalAmount = baseFare + taxes;

    return (
        <div className="checkout-wrapper">
            <h2 className="checkout-title">Secure Checkout</h2>

            <div className="checkout-container">
                {/* Order Summary Column */}
                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-details">
                        <div className="journey-info">
                            <div className="city-row">
                                <span className="city-label">From</span>
                                <span className="city-value">{fromCity || 'Unknown'}</span>
                            </div>
                            <div className="city-divider">↓</div>
                            <div className="city-row">
                                <span className="city-label">To</span>
                                <span className="city-value">{toCity || 'Unknown'}</span>
                            </div>
                            <div className="date-row">
                                <span>Journey Date:</span>
                                <strong>{date || 'N/A'}</strong>
                            </div>
                            <div className="date-row" style={{ marginTop: '5px' }}>
                                <span>Route ID:</span>
                                <strong>#{routeId}</strong>
                            </div>
                        </div>

                        <div className="fare-breakdown">
                            <div className="fare-row">
                                <span>Base Fare</span>
                                <span>₹{baseFare.toFixed(2)}</span>
                            </div>
                            <div className="fare-row">
                                <span>Taxes & Fees (5%)</span>
                                <span>₹{taxes.toFixed(2)}</span>
                            </div>
                            <div className="fare-row total">
                                <span>Total Amount</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Methods Column */}
                <div className="payment-section">
                    <h3>Payment Method</h3>

                    <div className="payment-tabs">
                        <button
                            type="button"
                            className={`tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('card')}
                        >Credit/Debit Card</button>
                        <button
                            type="button"
                            className={`tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('upi')}
                        >UPI</button>
                        <button
                            type="button"
                            className={`tab-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('netbanking')}
                        >Net Banking</button>
                    </div>

                    <form onSubmit={handlePay} className="payment-form">
                        {paymentMethod === 'card' && (
                            <div className="method-pane fade-in">
                                <div className="input-group">
                                    <label>Cardholder Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className={errors.name ? 'input-error' : ''}
                                        placeholder="Name as it appears on card"
                                        value={cardDetails.name}
                                        onChange={handleCardChange}
                                        maxLength="50"
                                    />
                                    {errors.name && <span className="error-text">{errors.name}</span>}
                                </div>
                                <div className="input-group">
                                    <label>Card Number</label>
                                    <div className="card-input-wrapper">
                                        <input
                                            type="text"
                                            name="number"
                                            className={`card-input ${errors.number ? 'input-error' : ''}`}
                                            placeholder="XXXX XXXX XXXX XXXX"
                                            value={cardDetails.number}
                                            onChange={handleCardChange}
                                            maxLength="19"
                                        />
                                        <span className="card-icon">💳</span>
                                    </div>
                                    {errors.number && <span className="error-text">{errors.number}</span>}
                                </div>
                                <div className="row-group">
                                    <div className="input-group half">
                                        <label>Expiry Date</label>
                                        <input
                                            type="text"
                                            name="expiry"
                                            className={errors.expiry ? 'input-error' : ''}
                                            placeholder="MM/YY"
                                            value={cardDetails.expiry}
                                            onChange={handleCardChange}
                                            maxLength="5"
                                        />
                                        {errors.expiry && <span className="error-text">{errors.expiry}</span>}
                                    </div>
                                    <div className="input-group half">
                                        <label>Security Code (CVC)</label>
                                        <input
                                            type="password"
                                            name="cvc"
                                            className={errors.cvc ? 'input-error' : ''}
                                            placeholder="CVC"
                                            value={cardDetails.cvc}
                                            onChange={handleCardChange}
                                            maxLength="4"
                                        />
                                        {errors.cvc && <span className="error-text">{errors.cvc}</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'upi' && (
                            <div className="method-pane fade-in">
                                <div className="upi-apps">
                                    <div className="upi-app">GCash</div>
                                    <div className="upi-app">PayTM</div>
                                    <div className="upi-app">PhonePe</div>
                                </div>
                                <div className="input-group">
                                    <label>Enter UPI ID (VPA)</label>
                                    <input
                                        type="text"
                                        placeholder="username@bank"
                                        value={upiDetails.id}
                                        className={errors.upi ? 'input-error' : ''}
                                        onChange={handleUpiChange}
                                    />
                                    {errors.upi && <span className="error-text">{errors.upi}</span>}
                                </div>
                                <p className="upi-hint">A payment request will be sent to your UPI app.</p>
                            </div>
                        )}

                        {paymentMethod === 'netbanking' && (
                            <div className="method-pane fade-in">
                                <div className="input-group">
                                    <label>Select Your Bank</label>
                                    <select className="form-select bank-select">
                                        <option value="">Select a Bank...</option>
                                        <option value="sbi">State Bank of India</option>
                                        <option value="hdfc">HDFC Bank</option>
                                        <option value="icici">ICICI Bank</option>
                                        <option value="axis">Axis Bank</option>
                                        <option value="pnb">Punjab National Bank</option>
                                    </select>
                                </div>
                                <p className="upi-hint">You will be redirected to your bank's secure portal.</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`pay-btn ${loading ? 'loading' : ''}`}
                            disabled={loading || (paymentMethod === 'netbanking') /*Mock NB disable*/}
                        >
                            {loading ? (
                                <span className="spinner-text">
                                    <span className="spinner"></span> Processing Payment...
                                </span>
                            ) : (
                                `Pay ₹${totalAmount.toFixed(2)} Securely`
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {loading && (
                <div className="payment-overlay fade-in">
                    <div className="processing-box">
                        <div className="large-spinner"></div>
                        <h3>Processing Payment...</h3>
                        <p>Please do not refresh or close this page.</p>
                        <p className="securing-text">Securing transaction via 256-bit encryption</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
