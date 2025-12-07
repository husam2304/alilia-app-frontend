

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
}

export default adminService;