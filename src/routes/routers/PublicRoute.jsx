import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">جاري التحميل...</div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PublicRoute;