import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        // Show a loading spinner or message while checking auth status
        return <div>Loading...</div>;
    }

    // If the user is authenticated (and is an admin), render the child route.
    // Otherwise, redirect to the login page.
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;