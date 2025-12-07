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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {showInfo && (
                <div className="text-sm text-gray-700 text-center sm:text-right">
                    {t('showing')} <span className="font-medium">{startItem}</span> {t('to')}{' '}
                    <span className="font-medium">{endItem}</span> {t('of')}{' '}
                    <span className="font-medium">{totalItems}</span> {t('results')}
                </div>
            )}

            <div className="flex items-center justify-center space-x-1 space-x-reverse overflow-x-auto max-w-full pb-1 sm:pb-0">
                {/* Previous Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="ml-2 px-2 sm:px-4"
                >
                    <ChevronRight className="w-4 h-4" />
                    <span className="hidden sm:inline mr-1">{t('previous')}</span>
                </Button>

                {/* Page Numbers */}
                <div className="hidden sm:flex items-center space-x-1 space-x-reverse">
                    {visiblePages.map((page, index) => {
                        if (page === '...') {
                            return (
                                <span key={index} className="px-2 py-2 text-gray-500">
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
                                className="min-w-[2rem]"
                            >
                                {page}
                            </Button>
                        );
                    })}
                </div>

                {/* Mobile Page Indicator (Simple) */}
                <div className="flex sm:hidden items-center px-4 font-medium text-sm">
                    {currentPage} / {totalPages}
                </div>

                {/* Next Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="mr-2 px-2 sm:px-4"
                >
                    <span className="hidden sm:inline ml-1">{t('next')}</span>
                    <ChevronLeft className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default Pagination;