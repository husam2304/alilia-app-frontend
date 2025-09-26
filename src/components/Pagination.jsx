import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    showInfo = true
}) => {
    const { t } = useLanguage();
    
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between">
            {showInfo && (
                <div className="text-sm text-gray-700">
                    {t('showing')} <span className="font-medium">{startItem}</span> {t('to')}{' '}
                    <span className="font-medium">{endItem}</span> {t('of')}{' '}
                    <span className="font-medium">{totalItems}</span> {t('results')}
                </div>
            )}

            <div className="flex items-center space-x-1 space-x-reverse">
                {/* Previous Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="ml-2"
                >
                    <ChevronRight className="w-4 h-4" />
                    {t('previous')}
                </Button>

                {/* Page Numbers */}
                {visiblePages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={index} className="px-3 py-2 text-gray-500">
                                ...
                            </span>
                        );
                    }

                    return (
                        <Button
                            key={page}
                            variant={currentPage === page ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </Button>
                    );
                })}

                {/* Next Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="mr-2"
                >
                    {t('next')}
                    <ChevronLeft className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default Pagination;