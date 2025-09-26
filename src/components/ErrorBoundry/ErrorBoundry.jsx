import React from 'react';

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
            // UI fallback بديل
            return <h2>حدث خطأ ما. الرجاء إعادة المحاولة لاحقًا.</h2>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
