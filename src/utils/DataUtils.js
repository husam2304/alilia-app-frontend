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

    formatOrderStatus(status, language = 'ar') {
        const statusMap = {
            '1': {
                ar: 'قائم',
                en: 'InProgress'
            },
            '2': {
                ar: 'مغلق',
                en: 'Closed'
            },
            '3': {
                ar: 'ملغي',
                en: 'Canceled'
            }
        };
        return statusMap[status]?.[language] || status;
    },

    formatDeliveryStatus(status, language = 'ar') {
        const statusMap = {
            '1': {
                ar: 'لا يوجد عرض',
                en: 'NoOffer'
            },
            '2': {
                ar: 'قائم',
                en: 'Preparing'
            },
            '3': {
                ar: 'تم قبول العرض',
                en: 'OfferAccepted'
            },
            '4': {
                ar: 'انتهت صلاحية العرض',
                en: 'OfferExpired'
            },
            '5': {
                ar: 'تم رفض العرض',
                en: 'OfferRejected'
            }
        };
        return statusMap[status]?.[language] || status;
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
                '4': 'error'
            }

        };
        return variantMap[type]?.[status] || 'default';
    }
};
export default DataUtils;