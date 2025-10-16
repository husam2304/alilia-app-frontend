// import { translations } from '../locales/ar';

import en from '../locales/en';
import ar from '../locales/ar';

const translationsMap = { ar, en };

export const DataUtils = {
    formatDate(dateString) {
        if (!dateString) return '';

        const date = new Date(dateString);
        return date.toLocaleDateString('ar-Jo', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    },

    formatCurrency(amount, currency = 'JOD') {
        if (typeof amount !== 'number') return amount;

        return new Intl.NumberFormat('ar-JO', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    },

    formatOrderStatus(status, language = null) {
        // Get current language from localStorage if not provided
        const currentLang = language || localStorage.getItem('language') || 'ar';
        
        const statusMap = {
            '1': {
                ar: translationsMap.ar.inProgress,
                en: translationsMap.en.inProgress
            },
            '2': {
                ar: translationsMap.ar.closed,
                en: translationsMap.en.closed
            },
            '3': {
                ar: translationsMap.ar.canceled,
                en: translationsMap.en.canceled
            }
        };
        return statusMap[status]?.[currentLang] || status;
    },

    formatDeliveryStatus(status, language = null) {
        // Get current language from localStorage if not provided
        const currentLang = language || localStorage.getItem('language') || 'ar';
        
        const statusMap = {
            '1': {
                ar: translationsMap.ar.noOffer,
                en: translationsMap.en.noOffer
            },
            '2': {
                ar: translationsMap.ar.preparing,
                en: translationsMap.en.preparing
            },
            '3': {
                ar: translationsMap.ar.offerAccepted,
                en: translationsMap.en.offerAccepted
            },
            '4': {
                ar: translationsMap.ar.offerExpired,
                en: translationsMap.en.offerExpired
            },
            '5': {
                ar: translationsMap.ar.offerRejected,
                en: translationsMap.en.offerRejected
            },
            '6': {
                ar: translationsMap.ar.offerDelivered,
                en: translationsMap.en.offerDelivered
            },
            '7': {
                ar: translationsMap.ar.offerCompleted,
                en: translationsMap.en.offerCompleted
            }
        };
        return statusMap[status]?.[currentLang] || status;
    },

    formatPaymentStatus(status) {
        const statusMap = {
            'pending': 'بانتظار',
            'paid': 'مدفوع',
            'failed': 'فشل',
            'refunded': 'مسترد',
            'cancelled': 'ملغي'
        };
        return statusMap[status] || status;
    },

    getStatusVariant(status, type = 'order') {
        const variantMap = {
            order: {
                '2': 'success',
                '1': 'info',
                '3': 'error'
            },
            offer: {
                '3': 'warning',
                '1': 'info',
                '2': 'primary',
                '5': 'success',
                '4': 'error',
                '6': 'info',
                '7': 'success'
            }

        };
        return variantMap[type]?.[status] || 'default';
    }
};
export default DataUtils;