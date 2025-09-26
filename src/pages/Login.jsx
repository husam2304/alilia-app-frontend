import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './../assets/images/logo.png';
import LoginImage from '../assets/images/login.png';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm();

    // Load remembered user code
    useEffect(() => {
        if (localStorage.getItem('rememberMe') === 'true') {
            const rememberedUserCode = localStorage.getItem('userCode');
            if (rememberedUserCode) {
                setValue('userCode', rememberedUserCode);
                setValue('rememberMe', true);
            }
        }
    }, [setValue]);

    const onSubmit = async (data) => {
        try {
            // Convert user code to email format for backend compatibility
            const loginData = {
                email: data.userCode, // Convert user code to email format
                password: data.password
            };

            await login(loginData, data.rememberMe);
            navigate('/dashboard', { replace: true });
        } catch (error) {

            // Error is handled by AuthContext
        }
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden" dir="rtl">
            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 flex flex-col">
                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center px-6 py-8">
                    <div className="w-full max-w-md">
                        {/* Logo Section */}
                        <div className="text-center mb-4">
                            <div className="flex justify-center mb-3">
                                <img
                                    src={Logo}
                                    alt="ALIA Logo"
                                    className="w-20 h-20"
                                />
                            </div>
                        </div>

                        {/* Welcome Section */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                تسجيل الدخول في التطبيق
                            </h1>
                            <p className="text-gray-600 text-sm">
                                مرحباً بك في التطبيق
                            </p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* User Code Field */}
                            <div>
                                <label htmlFor="userCode" className="block text-sm font-medium text-gray-700 mb-2">
                                    الحساب او الأسم او رقم الهاتف
                                </label>
                                <div className="relative">
                                    <input
                                        id="userCode"
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                                        {...register('userCode', {
                                            required: 'رمز المستخدم مطلوب',
                                            minLength: {
                                                value: 3,
                                                message: 'رمز المستخدم قصير جداً'
                                            }
                                        })}
                                    />
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                </div>
                                {errors.userCode && (
                                    <p className="mt-1 text-sm text-red-600">{errors.userCode.message}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    كلمة السر
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right pr-12"
                                        {...register('password', {
                                            required: 'كلمة المرور مطلوبة',
                                            minLength: {
                                                value: 6,
                                                message: 'كلمة المرور قصيرة جداً'
                                            }
                                        })}
                                    />
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <button
                                        type="button"
                                        onClick={togglePassword}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Forgot Password Link */}
                            {/* <div className="text-right mb-6">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm transition-colors"
                                    style={{ color: '#931158' }}
                                    onMouseEnter={(e) => e.target.style.color = '#7a0e47'}
                                    onMouseLeave={(e) => e.target.style.color = '#931158'}
                                >
                                    نسيت كلمة المرور؟
                                </Link>
                            </div> */}

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#931158' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#7a0e47'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#931158'}
                            >
                                {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                            </button>
                        </form>

                        {/* Registration Link */}
                        <div className="text-center mt-6">
                            <p className="text-gray-600 text-sm mb-2">
                                ليس لديك حساب بالفعل؟
                            </p>
                            <Link
                                to="/auth/register"
                                className="font-medium text-sm transition-colors"
                                style={{ color: '#931158' }}
                                onMouseEnter={(e) => e.target.style.color = '#7a0e47'}
                                onMouseLeave={(e) => e.target.style.color = '#931158'}
                            >
                                التسجيل
                            </Link>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-center justify-center mt-6">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-2"
                                style={{
                                    accentColor: '#931158',
                                    '--tw-ring-color': '#931158'
                                }}
                            />
                            <label htmlFor="terms" className="mr-2 text-xs text-gray-600">
                                أوافق على الشروط والأحكام
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Left Side - Image */}
            <div className="hidden md:flex md:w-1/2 relative">
                <img
                    src={LoginImage}
                    alt="CANDID Store"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
        </div>
    );
};

export default Login;