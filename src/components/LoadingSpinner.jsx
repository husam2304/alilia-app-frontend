import { useLanguage } from '../contexts/LanguageContext';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const { t } = useLanguage();
    
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                <div
                    className={`
            ${sizes[size]} border-4 border-gray-200 border-t-primary-500 
            rounded-full animate-spin ${className}
          `}
                />
                <p className="mt-4 text-gray-700 font-medium">{t('loading')}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;