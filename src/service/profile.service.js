// ===============================================
// خدمة الملف الشخصي (Profile Service)
// profile.service.js
// ===============================================

import api from "./api/apiCliant";
import endpoints from "./api/endpoints";

export const profileService = {
    /**
     * الحصول على ملف البائع الشخصي
     * @returns {Promise} - وعد يحتوي على بيانات ملف البائع الشخصي
     */
    getVendorProfile: async () => {
        try {
            const response = await api.get(endpoints.profile.getVendorProfile);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * تحديث ملف البائع الشخصي
     * @param {FormData} profileData - بيانات الملف الشخصي (قد تتضمن ملفات)
     * @returns {Promise} - وعد يحتوي على تأكيد التحديث
     */
    updateVendorProfile: async (profileData) => {
        try {
            const response = await api.put(endpoints.profile.updateVendorProfile, profileData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * الحصول على ملف المدير الشخصي
     * @returns {Promise} - وعد يحتوي على بيانات ملف المدير الشخصي
     */
    getAdminProfile: async () => {
        try {
            const response = await api.get(endpoints.profile.getAdminProfile);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },

    /**
     * تحديث ملف المدير الشخصي
     * @param {Object} profileData - بيانات الملف الشخصي
     * @returns {Promise} - وعد يحتوي على تأكيد التحديث
     */
    updateAdminProfile: async (profileData) => {
        try {
            const response = await api.put(endpoints.profile.updateAdminProfile, profileData);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    }
};

export default profileService;