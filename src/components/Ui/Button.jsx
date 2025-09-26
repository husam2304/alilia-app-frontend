import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    icon: Icon,
    iconPosition = 'left',
    ...props
}, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-md focus:ring-primary-500',
        secondary: 'bg-gray-500 hover:bg-gray-600 text-white shadow-sm hover:shadow-md focus:ring-gray-500',
        success: 'bg-success-500 hover:bg-success-600 text-white shadow-sm hover:shadow-md focus:ring-success-500',
        warning: 'bg-warning-500 hover:bg-warning-600 text-white shadow-sm hover:shadow-md focus:ring-warning-500',
        error: 'bg-error-500 hover:bg-error-600 text-white shadow-sm hover:shadow-md focus:ring-error-500',
        outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
        ghost: 'text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
        link: 'text-primary-500 hover:text-primary-600 underline-offset-4 hover:underline focus:ring-primary-500',
    };

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl',
    };

    const isDisabled = disabled || loading;

    return (
        <button
            ref={ref}
            disabled={isDisabled}
            className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${isDisabled ? 'transform-none' : 'hover:-translate-y-0.5 active:translate-y-0'}
        ${className}
      `}
            {...props}
        >
            {loading && (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
            )}

            {Icon && iconPosition === 'left' && !loading && (
                <span className="ml-2">
                    <Icon size={16} />
                </span>
            )}

            {children}

            {Icon && iconPosition === 'right' && !loading && (
                <span className="mr-2">
                    <Icon size={16} />
                </span>
            )}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;