// ===============================================
// خدمة البائعين (Vendor Service)
// vendor.service.js
// ===============================================

import api from "./api/apiCliant";
import endpoints from "./api/endpoints";

export const vendorService = {
    /**
     * الحصول على قائمة طلبات البائع
     * @param {number} pageNumber - رقم الصفحة للتقسيم
     * @param {number} pageSize - عدد الطلبات في الصفحة الواحدة
     * @returns {Promise} - وعد يحتوي على قائمة الطلبات
     */
    getOrders: async (pageNumber, pageSize) => {
        try {
            const response = await api.get(endpoints.vendor.orders, {
                params: { pageNumber, pageSize }
            });
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * إنشاء عرض جديد لطلب معين
     * @param {string|number} orderId - معرف الطلب
     * @param {FormData} offerData - بيانات العرض (قد تتضمن ملفات)
     * @returns {Promise} - وعد يحتوي على تأكيد إنشاء العرض
     */
    createOffer: async (orderId, offerData) => {
        try {
            // إرسال طلب POST لإنشاء عرض جديد
            const response = await api.post(endpoints.vendor.createOffer(orderId), offerData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // لرفع الملفات المرفقة مع العرض
                }
            });
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * الحصول على تفاصيل طلب معين
     * @param {string|number} orderId - معرف الطلب
     * @returns {Promise} - وعد يحتوي على تفاصيل الطلب
     */
    getOrderDetails: async (orderId) => {
        try {
            const response = await api.get(endpoints.vendor.orderDetails(orderId));
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * الحصول على قائمة العروض التي تحتاج موافقة البائع
     * @param {number} pageNumber - رقم الصفحة للتقسيم
     * @param {number} pageSize - عدد العروض في الصفحة الواحدة
     * @returns {Promise} - وعد يحتوي على قائمة العروض مع تفاصيل العملاء
     */
    getOffersToManage: async (pageNumber, pageSize) => {
        try {
            const response = await api.get(endpoints.vendor.offersToManage, {
                params: { pageNumber, pageSize }
            });
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * قبول عرض معين
     * @param {string|number} offerId - معرف العرض
     * @returns {Promise} - وعد يحتوي على تأكيد قبول العرض
     */
    acceptOffer: async (offerId) => {
        try {
            const response = await api.post(endpoints.vendor.acceptOffer(offerId));
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * رفض عرض معين
     * @param {string|number} offerId - معرف العرض
     * @returns {Promise} - وعد يحتوي على تأكيد رفض العرض
     */
    rejectOffer: async (offerId) => {
        try {
            const response = await api.post(endpoints.vendor.rejectOffer(offerId));
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    }
};

export default vendorService;