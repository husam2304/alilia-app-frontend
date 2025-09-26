
// ===============================================
// خدمة العملاء (Customer Service)
// customer.service.js
// ===============================================

import api from "./api/apiCliant";
import endpoints from "./api/endpoints";

export const customerService = {
    /**
     * تغيير لغة واجهة العميل
     * @param {string} language - رمز اللغة الجديدة (مثل 'ar', 'en')
     * @returns {Promise} - وعد يحتوي على تأكيد تغيير اللغة
     */
    changeLanguage: async (language) => {
        try {
            // إرسال طلب POST لتغيير اللغة
            // البيانات الأساسية null، واللغة ترسل كمعامل في URL
            const response = await api.post(endpoints.customer.changeLanguage, null, {
                params: { language } // سيصبح ?language=ar في URL
            });
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    }
};

export default customerService;