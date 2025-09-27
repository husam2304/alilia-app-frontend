import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    helperText,
    icon: Icon,
    endIcon: EndIcon,
    className = '',
    containerClassName = '',
    language,
    ...props
}, ref) => {

    return (
        <div className={`${containerClassName}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}

                <input
                    ref={ref}
                    dir={language === "ar" ? "rtl" : language === "en" ? "ltr" : undefined}
                    className={`
            block w-full px-3 py-3 border border-gray-300 rounded-xl
            placeholder-gray-500 text-gray-900 bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white
            transition-all duration-200
            ${Icon ? 'pr-10' : ''}
            ${EndIcon ? 'pl-10' : ''}
            ${error ? 'border-error-500 focus:ring-error-500' : ''}
            ${className}
          `}
                    {...props}
                />

                {EndIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <EndIcon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-2 text-sm text-error-500 animate-slide-in">
                    {error}
                </p>
            )}

            {helperText && !error && (
                <p className="mt-2 text-sm text-gray-500">
                    {helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;