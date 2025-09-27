import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../contexts/LanguageContext';
import Logo from './../assets/images/logo.png';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../service';
import { useAuth } from '../contexts/AuthContext';
import { TokenManager } from '../utils';

const VerfyOtp = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("userId");
    const { t } = useLanguage();
    const { checkAuthStatus } = useAuth()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const confirmOtp = useMutation({
        mutationFn: (otp) => authService.verfiyOtp(id, otp),
        onSuccess: async (data) => {
            if (data?.accessToken) {
                TokenManager.setTokens(data?.accessToken, data?.refreshToken)
                await checkAuthStatus();
            }
        },
        onError: (error) => {
            toast.error(error?.message || 'Invalid OTP');

        }
    })
    const onSubmit = (data) => {

        confirmOtp.mutate(data.otp, id);

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
                    {t('verifyOTPTitle')}
                </h1>
                <p className="text-gray-600 text-sm">
                    {t('enterOTPMessage')}
                </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* OTP Input Field */}
                <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('otpLabel')}
                    </label>
                    <input
                        id="otp"
                        type="text"
                        maxLength="4"
                        placeholder="Enter 4-digit OTP"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl tracking-widest"
                        {...register('otp', {
                            required: t('required'),
                            pattern: {
                                value: /^[0-9]{4}$/,
                                message: t('invalidOTP')
                            }
                        })}
                    />
                    {errors.otp && (
                        <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
                    )}
                </div>

                {/* Verify OTP Button */}
                <button
                    type="submit"
                    disabled={confirmOtp.isPending}
                    className="w-full text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#931158' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#7a0e47'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#931158'}
                >
                    {confirmOtp.isPending ? t('verifying') : t('verifyOTP')}
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

export default VerfyOtp;
