// src/components/Card.jsx
import { forwardRef } from 'react';

const Card = forwardRef(({
    children,
    className = '',
    padding = true,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={`
        rounded-lg shadow-sm border border-gray-200
        ${padding ? 'p-6' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = 'Card';

export default Card;