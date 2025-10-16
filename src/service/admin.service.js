

// ===============================================
// خدمة المدراء (Admin Service)
// admin.service.js
// ===============================================

import api from "./api/apiCliant";
import endpoints from "./api/endpoints";

export const adminService = {
    /**
     * الحصول على قائمة الطلبات للمدير
     * @param {number} pageNumber - رقم الصفحة (للتقسيم)
     * @param {number} pageSize - عدد العناصر في الصفحة
     * @returns {Promise} - وعد يحتوي على بيانات الطلبات
     */
    getOrders: async (pageNumber, pageSize) => {
        try {
            // إرسال طلب GET للحصول على الطلبات مع معاملات الصفحة
            const response = await api.get(endpoints.admin.orders, {
                params: { pageNumber, pageSize } // معاملات URL - مثل ?pageNumber=1&pageSize=10
            });
            return response.data; // إرجاع البيانات المستلمة فقط
        } catch (error) {
            // معالجة الأخطاء
            if (error.response) {
                // خطأ من الخادم (مثل 404, 500)
                throw error.response.data;
            } else {
                // خطأ في الشبكة أو إعداد الطلب
                throw error.message;
            }
        }
    },

    getOffersToManage: async (pageNumber, pageSize) => {
        try {
            const response = await api.get(endpoints.admin.offersToManage, {
                params: { pageNumber, pageSize }
            });
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },
    closeOrder: async (orderId) => {
        try {
            const response = await api.post(endpoints.admin.closeOrder(orderId))
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    markOfferAsDelivered: async (offerId) => {
        try {
            const response = await api.post(endpoints.admin.markOfferAsDelivered(offerId));
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    markOfferAsCompleted: async (offerId) => {
        try {
            const response = await api.post(endpoints.admin.markOfferAsCompleted(offerId));
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    }
}

export default adminService;