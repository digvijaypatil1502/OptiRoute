import { createContext, useContext, useState, useCallback } from 'react';
import Popup from '../components/Popup';

const PopupContext = createContext();

export const usePopup = () => {
    return useContext(PopupContext);
}

export const PopupProvider = ({ children }) => {
    const [popup, setPopup] = useState({
        message: '',
        type: '', // 'success', 'error', 'warning'
        show: false
    });

    const showPopup = useCallback((message, type = 'info') => {
        setPopup({ message, type, show: true });
    }, []);

    const hidePopup = useCallback(() => {
        setPopup(prev => ({ ...prev, show: false }));
    }, []);

    return (
        <PopupContext.Provider value={{ showPopup }}>
            {children}
            {popup.show && (
                <Popup
                    message={popup.message}
                    type={popup.type}
                    onClose={hidePopup}
                />
            )}
        </PopupContext.Provider>
    );
};
