import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Popup from '../components/Popup';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: Security Question
    const [email, setEmail] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [popup, setPopup] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    const fetchSecurityQuestion = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get(`/auth/security-question/${email}`);
            setSecurityQuestion(response.data);
            setStep(2);
            setPopup({ message: '', type: '' });
        } catch (err) {
            setPopup({ message: 'Email not found', type: 'error' });
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/reset-password', {
                email,
                securityAnswer,
                newPassword
            });
            setPopup({ message: response.data, type: 'success' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            let errorMsg = typeof err.response?.data === 'string'
                ? err.response.data
                : err.response?.data?.message || 'Error resetting password';

            if (errorMsg.startsWith("Error: ")) {
                errorMsg = errorMsg.replace("Error: ", "");
            }

            setPopup({ message: errorMsg, type: 'error' });
        }
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
                    <h2>Reset Password</h2>
                    <p>Recover your account</p>
                </div>

                {step === 1 ? (
                    <form onSubmit={fetchSecurityQuestion}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                className="form-input"
                                type="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary">Next</button>
                        <div className="auth-footer">
                            <p><a href="/login">Back to Login</a></p>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label>Security Question</label>
                            <input
                                className="form-input"
                                type="text"
                                value={securityQuestion}
                                readOnly
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>Answer</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Enter your answer"
                                value={securityAnswer}
                                onChange={(e) => setSecurityAnswer(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                className="form-input"
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary">Reset Password</button>
                        <div className="auth-footer">
                            <p><button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline' }}>Back</button></p>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default ForgotPassword;
