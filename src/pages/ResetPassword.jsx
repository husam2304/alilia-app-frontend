import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Logo from './../assets/images/logo.png';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../service';

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [params] = useSearchParams();
    const id = params.get('identifer');
    const resetToken = params.get('resetToken');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { t } = useLanguage();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const reset = useMutation({
        mutationFn: (data) => authService.resetPassword(encodeURIComponent(resetToken), id, data),
        onSuccess: () => {
            navigate('/auth/login', { replace: true });
        },
        onError: (error) => {
            toast.error(error?.message || 'فشل في إعادة تعيين كلمة المرور');
        }
    })
    const onSubmit = async (data) => {
        await reset.mutateAsync({ NewPassword: data.newPassword, ConfirmPassword: data.newPasswordConfirm });
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="w-full max-w-md">
            {/* Logo Section */}
            <div className="text-center mb-4">
                <div className="flex justify-center mb-3">
                    <img src={Logo} alt="ALIA Logo" className="w-20 h-20" />
                </div>
            </div>

            {/* Welcome Section */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('resetPasswordTitle')}
                </h1>
                <p className="text-gray-600 text-sm">
                    {t('resetPasswordWelcome')}
                </p>
            </div>

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* New Password Field */}
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('newPasswordLabel')}
                    </label>
                    <div className="relative">
                        <input
                            id="newPassword"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right pr-12"
                            {...register('newPassword', {
                                required: t('required'),
                                minLength: {
                                    value: 6,
                                    message: t('passwordShort')
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
                    {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('ConfirmNewPasswordLabel')}
                    </label>
                    <div className="relative">
                        <input
                            id="newPasswordConfirm"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right pr-12"
                            {...register('newPasswordConfirm', {
                                required: t('required'),
                                minLength: {
                                    value: 6,
                                    message: t('passwordShort')
                                }
                            })}
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.newPasswordConfirm && (
                        <p className="mt-1 text-sm text-red-600">{errors.newPasswordConfirm.message}</p>
                    )}
                </div>

                {/* Reset Password Button */}
                <button
                    type="submit"
                    disabled={reset.isPending}
                    className="w-full text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#931158' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#7a0e47'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#931158'}
                >
                    {reset.isPending ? t('resettingPassword') : t('resetPasswordButton')}
                </button>
            </form>

            {/* Back to Login Link */}
            <div className="text-center mt-6">
                <Link
                    to="/auth/login"
                    className="font-medium text-sm transition-colors"
                    style={{ color: '#931158' }}
                    onMouseEnter={(e) => e.target.style.color = '#7a0e47'}
                    onMouseLeave={(e) => e.target.style.color = '#931158'}
                >
                    {t('backToLogin')}
                </Link>
            </div>
        </div>
    );
};

export default ResetPassword;