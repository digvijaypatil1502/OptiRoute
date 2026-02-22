import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');

    // If token exists, render child routes (Outlet)
    // Otherwise, redirect to login
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
