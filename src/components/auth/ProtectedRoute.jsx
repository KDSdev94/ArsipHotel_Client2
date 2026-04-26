import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../contexts/UserProfileContext';

const ProtectedRoute = ({ requireAdmin = false }) => {
    const { currentUser } = useAuth();
    const { userProfile, isAdmin } = useUserProfile();

    if (!currentUser || !userProfile) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin()) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
