import React from 'react';
// import { translations } from '../../locales/ar';

import en from '../../locales/en';
import ar from '../../locales/ar';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // أي خطأ يصير رح يغير state
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // ممكن تبعت الخطأ للسيرفر أو تسجله
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Get current language from localStorage
            const currentLanguage = localStorage.getItem('language') || 'ar';
            const translationsMap = { ar, en };
            const errorMessage = translationsMap[currentLanguage]?.error || 'حدث خطأ ما. الرجاء إعادة المحاولة لاحقًا.';
            
            // UI fallback بديل
            return <h2>{errorMessage}</h2>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
