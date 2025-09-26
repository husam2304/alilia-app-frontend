
// ===============================================
// خدمة المصادقة (Authentication Service)
// auth.service.js
// ===============================================

import api from "./api/apiCliant";
import endpoints from "./api/endpoints";

export const authService = {
    /**
     * تسجيل دخول المستخدم
     * @param {Object} credentials - بيانات الاعتماد (اسم المستخدم وكلمة المرور)
     * @returns {Promise} - وعد يحتوي على بيانات المستخدم ورموز المصادقة
     */
    login: async (credentials) => {
        try {
            // إرسال طلب POST مع بيانات تسجيل الدخول
            const response = await api.post(endpoints.auth.login, credentials);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * تسجيل بائع جديد
     * @param {FormData} userData - بيانات المستخدم (قد تتضمن ملفات)
     * @returns {Promise} - وعد يحتوي على نتيجة التسجيل
     */
    register: async (userData) => {
        try {
            // إرسال طلب POST مع تحديد نوع المحتوى كـ multipart لرفع الملفات
            const response = await api.post(endpoints.auth.register, userData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // لرفع الملفات والصور
                }
            });
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * تسجيل خروج المستخدم
     * @param {string} refreshtoken - رمز التجديد للمستخدم
     * @returns {Promise} - وعد يحتوي على تأكيد تسجيل الخروج
     */
    logout: async (refreshtoken) => {
        try {
            // إرسال طلب POST لتسجيل الخروج مع رمز التجديد في URL
            const response = await api.post(endpoints.auth.logout(refreshtoken));
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * الحصول على معلومات المستخدم الحالي
     * @returns {Promise} - وعد يحتوي على معلومات المستخدم
     */
    getUserInfo: async () => {
        try {
            // إرسال طلب GET للحصول على معلومات المستخدم
            // رمز المصادقة سيُضاف تلقائياً بواسطة مُعترِض الطلبات
            const response = await api.get(endpoints.auth.userInfo);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * تجديد رمز المصادقة
     * @returns {Promise} - وعد يحتوي على الرموز الجديدة
     */
    refreshToken: async () => {
        try {
            // إرسال طلب POST لتجديد رمز المصادقة
            const response = await api.post(endpoints.auth.refreshToken);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    }
};

export default authService;