import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../contexts/LanguageContext';
import Logo from './../assets/images/logo.png';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../service';

const ForgetPassword = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const SendOtp = useMutation({
        mutationFn: (identifer) => authService.forgetPassword(identifer),
        onSuccess: (data, variables) => {
            toast.success(t('otpSent'));
            navigate(`/auth/verfyPasswordOtp?identifer=${variables}`, { replace: true });
        },
        onError: (error) => {
            toast.error(error?.message || t('failedToSendOTP'));
        }
    })
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {

        await SendOtp.mutateAsync(data.identifier);
        // Store identifier for next step
        sessionStorage.setItem('resetIdentifier', data.identifier);


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
                    {t('forgotPasswordTitle')}
                </h1>
                <p className="text-gray-600 text-sm">
                    {t('enterIdentifierMessage')}
                </p>
            </div>

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Identifier Input Field */}
                <div>
                    <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('userCodeLabel')}
                    </label>
                    <input
                        id="identifier"
                        type="text"
                        placeholder={t('userCodeLabel')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        {...register('identifier', {
                            required: t('required'),
                            pattern: {
                                value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(\+?[0-9]{10,})$/,
                                message: t('invalidIdentifier')
                            }
                        })}
                    />
                    {errors.identifier && (
                        <p className="mt-1 text-sm text-red-600">{errors.identifier.message}</p>
                    )}
                </div>

                {/* Send OTP Button */}
                <button
                    type="submit"
                    disabled={SendOtp.isPending}
                    className="w-full text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#931158' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#7a0e47'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#931158'}
                >
                    {SendOtp.isPending ? t('sending') : t('sendOTP')}
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

export default ForgetPassword;
