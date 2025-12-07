import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layout/AuthLayout';
import DashboardLayout from '../layout/DashboardLayout';
import { PrivateRoute, PublicRoute } from './';
import LoadingSpinner from '../components/LoadingSpinner';
import ForgetPassword from '../pages/ForgetPassword';
import OTPConfirmation from '../pages/OTPConfirmation';
import ResetPassword from '../pages/ResetPassword';
import VerfyOtp from '../pages/verfyOtp';
// Lazy load page components for code splitting
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Orders = lazy(() => import('../pages/Orders'));
const PriceQuote = lazy(() => import('../pages/PriceQuote'));
const OfferDetails = lazy(() => import('../pages/OfferDetails'));



const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path='orders' element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path='createOffer/:OrderId' element={<PrivateRoute><PriceQuote /></PrivateRoute>} />
          <Route path='offer-details/:offerId' element={<PrivateRoute><OfferDetails /></PrivateRoute>} />

        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="forget-Password" element={<PublicRoute><ForgetPassword /></PublicRoute>} />
          <Route path="verfyPasswordOtp" element={<PublicRoute><OTPConfirmation /></PublicRoute>} />
          <Route path="reset-Password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
          <Route path="verfyOtp" element={<PublicRoute><VerfyOtp /></PublicRoute>} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" />} />

      </Routes>
    </Suspense>
  )
};

export default AppRouter;