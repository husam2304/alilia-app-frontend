import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
    title,
    value,
    color = 'blue'
}) => {
    const colors = {
        blue: 'text-blue-600 bg-blue-100',
        green: 'text-green-600 bg-green-100',
        purple: 'text-purple-600 bg-purple-100',
        orange: 'text-orange-600 bg-orange-100',
        pink: 'text-pink-600 bg-pink-100',
        primary: ' bg-card-50',
        secondary: ' bg-card-100',
    };

    const changeColors = {
        positive: 'text-green-600',
        negative: 'text-red-600',
    };

    return (
        <div className={`${colors[color]} rounded-3xl shadow-sm border  border-gray-200 p-6`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1 text-right">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-2 text-left">
                        {typeof value === 'number' ? value.toLocaleString('ar') : value}
                    </p>

                </div>
            </div>
        </div>
    );
};

export default StatCard;