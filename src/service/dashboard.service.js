// ===============================================
// خدمة لوحة التحكم (Dashboard Service)
// dashboard.service.js
// ===============================================

import api from "./api/apiCliant";
import endpoints from "./api/endpoints";

export const dashboardService = {
    /**
     * الحصول على بيانات لوحة تحكم البائع
     * @returns {Promise} - وعد يحتوي على إحصائيات البائع
     */
    dashboardVendor: async () => {
        try {
            const response = await api.get(endpoints.dashboard.dashboardVendor);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * الحصول على بيانات لوحة تحكم المدير
     * @returns {Promise} - وعد يحتوي على إحصائيات المدير
     */
    dashboardAdmin: async () => {
        try {
            const response = await api.get(endpoints.dashboard.dashboardAdmin);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * الحصول على ملخص الإحصائيات العامة
     * @returns {Promise} - وعد يحتوي على ملخص البيانات
     */
    summary: async () => {
        try {
            const response = await api.get(endpoints.dashboard.summary);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * الحصول على الأرباح مقسمة حسب السنوات
     * @returns {Promise} - وعد يحتوي على بيانات الأرباح السنوية
     */
    profitByYear: async () => {
        try {
            const response = await api.get(endpoints.dashboard.profitByYear);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * الحصول على قائمة أفضل المنتجات مبيعاً
     * @returns {Promise} - وعد يحتوي على بيانات المنتجات الأكثر مبيعاً
     */
    topProduct: async () => {
        try {
            const response = await api.get(endpoints.dashboard.topProduct);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * الحصول على بيانات الرسوم البيانية
     * @returns {Promise} - وعد يحتوي على بيانات للرسوم البيانية
     */
    charts: async () => {
        try {
            const response = await api.get(endpoints.dashboard.charts);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * تصدير بيانات لوحة التحكم
     * ملاحظة: هناك خطأ في الكود الأصلي - يجب استخدام export بدلاً من exportData
     * @returns {Promise} - وعد يحتوي على الملف المُصدَّر أو رابط التحميل
     */
    exportData: async () => {
        try {
            // خطأ في الكود الأصلي: endpoints.dashboard.exportData غير موجود
            // يجب أن يكون: endpoints.dashboard.export
            const response = await api.get(endpoints.dashboard.export);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    }
};

export default dashboardService;