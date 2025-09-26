import { createContext, useContext, useEffect, useState } from 'react';
import { customerService } from '../service/customer.service';
import toast from 'react-hot-toast';
import ar from '../locales/ar';
import en from '../locales/en';

const LanguageContext = createContext(null);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

const translations = {
    ar,
    en
};

export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState('ar');
    const [isChangingLanguage, setIsChangingLanguage] = useState(false);

    // Initialize language from localStorage on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && ['ar', 'en'].includes(savedLanguage)) {
            setCurrentLanguage(savedLanguage);
            // Update document direction
            document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = savedLanguage;
        }
    }, []);

    const changeLanguage = async (newLanguage) => {
        if (newLanguage === currentLanguage) return;

        try {
            setIsChangingLanguage(true);

            // Call backend API to update language preference
            try {
                await customerService.changeLanguage(newLanguage);
            } catch (error) {
                console.warn('Failed to update language on server:', error);
                // Continue with local change even if server update fails
            }

            // Update local state and storage
            setCurrentLanguage(newLanguage);
            localStorage.setItem('language', newLanguage);

            // Update document direction and language
            document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = newLanguage;

            // Show success message
            const message = newLanguage === 'ar' 
                ? 'تم تغيير اللغة بنجاح' 
                : 'Language changed successfully';
            toast.success(message);

        } catch (error) {
            const errorMessage = currentLanguage === 'ar' 
                ? 'فشل في تغيير اللغة' 
                : 'Failed to change language';
            toast.error(errorMessage);
        } finally {
            setIsChangingLanguage(false);
        }
    };

    // Translation function
    const t = (key, params = {}) => {
        const translation = translations[currentLanguage];
        let text = translation[key] || key;

        // Replace parameters in the text
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });

        return text;
    };

    // Get translation for a specific language (useful for status formatting)
    const getTranslation = (key, language = currentLanguage) => {
        return translations[language]?.[key] || key;
    };

    const value = {
        currentLanguage,
        changeLanguage,
        isChangingLanguage,
        t,
        getTranslation,
        isRTL: currentLanguage === 'ar'
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageProvider;