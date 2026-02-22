import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div style={{
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2rem',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                maxWidth: '400px',
                width: '90%',
                animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                <h3 style={{
                    marginTop: 0,
                    color: '#f1f5f9',
                    fontSize: '1.5rem',
                    marginBottom: '1rem'
                }}>
                    {title}
                </h3>
                <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                    {message}
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '0.8rem 1.5rem',
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#e2e8f0',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.borderColor = '#94a3b8'}
                        onMouseOut={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: '0.8rem 1.5rem',
                            background: isDanger ? '#ef4444' : '#3b82f6',
                            border: 'none',
                            color: 'white',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            boxShadow: isDanger ? '0 4px 6px -1px rgba(239, 68, 68, 0.3)' : '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = isDanger ? '#dc2626' : '#2563eb'}
                        onMouseOut={(e) => e.target.style.background = isDanger ? '#ef4444' : '#3b82f6'}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ConfirmModal;
