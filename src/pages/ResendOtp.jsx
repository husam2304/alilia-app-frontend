import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Logo from './../assets/images/logo.png';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../service';

const ResendOTP = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const { t } = useLanguage();
    const navigate = useNavigate();

    const resendOtp = useMutation({
        mutationFn: () => authService.resendOtp(id),
        onSuccess: () => {
            toast.success(t('otpSent'));
            navigate(`/auth/verfyOtp?userId=${id}`, { replace: true });
        },
        onError: (error) => {
            toast.error(error?.message || t('failedToSendOTP'));
        }
    });

    return (
        <div className="w-full max-w-md">
            {/* Logo Section */}
            <div className="text-center mb-4">
                <div className="flex justify-center mb-3">
                    <img src={Logo} alt="ALIA Logo" className="w-20 h-20" />
                </div>
            </div>

            {/* Resend OTP Section */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('resendOTPTitle')}
                </h1>
                <p className="text-gray-600 text-sm">
                    {t('resendOTPMessage')}
                </p>
            </div>

            {/* Resend OTP Button */}
            <button
                type="button"
                disabled={resendOtp.isPending}
                onClick={() => resendOtp.mutate()}
                className="w-full text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#931158' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#7a0e47'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#931158'}
            >
                {resendOtp.isPending ? t('resending') : t('resendOTP')}
            </button>

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

export default ResendOTP;
