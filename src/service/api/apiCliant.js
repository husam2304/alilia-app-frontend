
// ===============================================
// عميل API الأساسي (API Client)
// service/api/apiClient.js
// ===============================================

/*
 * ما هو Axios؟
 * مكتبة JavaScript تستخدم لإرسال طلبات HTTP
 * 
 * 
 * أنواع طلبات HTTP الأساسية:
 * GET: للحصول على البيانات (مثل قراءة ملف)
 * POST: لإرسال بيانات جديدة (مثل إنشاء حساب)
 * PUT: لتحديث بيانات موجودة (مثل تعديل ملف)
 * DELETE: لحذف بيانات (مثل حذف ملف)
 */

import axios from 'axios';

// إعدادات الـ API الأساسية
const API_CONFIG = {
    BASE_URL: "/api",  // العنوان الأساسي لجميع الطلبات - مثل اسم المدينة في العنوان البريدي
};

// إنشاء instance من axios مع الإعدادات المخصصة
const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,          // العنوان الأساسي
    credentials: "include",                // إرسال ملفات تعريف الارتباط مع كل طلب
    headers: {                             // رؤوس HTTP - معلومات إضافية ترسل مع كل طلب
        "Content-Type": "application/json", // نوع البيانات المرسلة (JSON)
        "Accept": "application/json"        // نوع البيانات المقبولة في الرد
    }
});

/*
 * ما هي الـ Interceptors؟
 * دوال تعمل تلقائياً قبل إرسال الطلب أو بعد استلام الرد
 * مثل موظف الأمن - يفتش كل شخص داخل وخارج
 */

// مُعترِض الطلبات (Request Interceptor) - يعمل قبل إرسال أي طلب
api.interceptors.request.use(
    (config) => {
        // الحصول على رمز المصادقة من التخزين المحلي
        const token = localStorage.getItem('authToken');
        if (token) {
            // إضافة رمز المصادقة لرأس التفويض
            // مثل إظهار الهوية للحارس قبل الدخول
            config.headers.Authorization = `Bearer ${token}`;
        }

        // الحصول على اللغة المفضلة وإضافتها للطلب
        const language = localStorage.getItem('language') || 'ar'; // افتراضي: العربية
        config.headers['Accept-Language'] = language;

        return config; // إرجاع الإعدادات المحدثة
    },
    (error) => {
        // في حالة حدوث خطأ أثناء تحضير الطلب
        return Promise.reject(error);
    }
);

/*
 * مُعترِض الردود (Response Interceptor) - يعمل بعد استلام الرد
 * يتعامل مع الأخطاء الشائعة تلقائياً
 */
api.interceptors.response.use(
    response => response, // في حالة نجاح الطلب، إرجاع الرد كما هو
    async error => {
        const originalRequest = error.config; // الطلب الأصلي الذي فشل
        const authpath = (window.location.href.includes("auth/login") || window.location.href.includes("auth/register"))

        // إذا كان الخطأ 401 (غير مصرح) ولم نحاول إصلاحه من قبل

        if (error.response.status === 401 && !originalRequest._retry && !authpath) {
            originalRequest._retry = true; // تمييز الطلب كمُعاد المحاولة لمنع الحلقة اللانهائية

            try {
                // محاولة تجديد رمز المصادقة
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_CONFIG.BASE_URL}/Auth/refresh-token/${refreshToken}`);

                // استخراج الرموز الجديدة من الرد
                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // حفظ الرموز الجديدة في التخزين المحلي
                localStorage.setItem('authToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                // تحديث رأس التفويض الافتراضي
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                // إعادة محاولة الطلب الأصلي بالرمز الجديد
                return api(originalRequest);
            } catch (refreshError) {
                // فشل تجديد الرمز - تنظيف البيانات وإعادة توجيه لتسجيل الدخول
                localStorage.removeItem('authToken');      // حذف رمز المصادقة
                localStorage.removeItem('refreshToken');   // حذف رمز التجديد
                window.location.href = '/auth/login';      // إعادة توجيه لصفحة تسجيل الدخول
                return Promise.reject(refreshError);
            }
        }

        // لجميع الأخطاء الأخرى، إرجاع الخطأ كما هو
        return Promise.reject(error);
    }
);
export default api;
