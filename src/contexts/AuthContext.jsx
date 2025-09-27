// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../service/auth.service';
import { TokenManager, FormUtils } from '../utils';
import toast from 'react-hot-toast';
import { useLanguage } from './LanguageContext';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { t } = useLanguage();
    // Check authentication status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);

            const token = TokenManager.getAccessToken();
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setIsLoading(true);
                return;
            }

            const response = await authService.getUserInfo();
            if (response?.user?.userRole == "Customer") {
                setIsLoading(false);
                throw new Error(t('unothrized'))
            }
            setUser(response.user);
            setIsAuthenticated(true);
            setUserId(response?.user?.userId);
        } catch (error) {
            // Token is invalid
            TokenManager.clearTokens();
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);

            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials, rememberMe = false) => {
        try {
            setIsLoading(true);

            const response = await authService.login({ Identifer: credentials.email, password: credentials.password, rememberMe });

            if (response.accessToken) {
                // Store tokens
                TokenManager.setTokens(
                    response.accessToken,
                    response.refreshToken
                );

                // Store user data
                await checkAuthStatus();
                // Handle remember me
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('userEmail', credentials.email);
                }

                toast.success('تم تسجيل الدخول بنجاح!');
                return response;
            } else {
                throw new Error(response.message || 'فشل في تسجيل الدخول');
            }

        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);

            const refreshToken = TokenManager.getRefreshToken();
            if (refreshToken) {
                try {
                    await authService.logout(refreshToken);
                } catch (error) {
                    console.warn('Logout API call failed:', error);
                }
            }

            // Clear local state
            TokenManager.clearTokens();
            setUser(null);
            setIsAuthenticated(false);

            // Clear remember me data
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('userEmail');

            toast.success('تم تسجيل الخروج بنجاح');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setIsLoading(true);
            const formattedData = FormUtils.createVendorFormData(userData);
            const response = await authService.register(formattedData);

            if (response.success) {
                toast.success(response.message || 'تم التسجيل بنجاح!');
                return response;
            } else {
                throw new Error(response.message || 'فشل في التسجيل');
            }
        } catch (error) {
            toast.error(error?.message || 'فشل في التسجيل');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
    };

    const refreshAuth = async () => {
        await checkAuthStatus();
    };

    const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        register,
        updateUser,
        refreshAuth,
        checkAuthStatus,
        userId
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};