// ===============================================
// ملف نقاط النهاية للـ API (API Endpoints)
// service/api.endpoints.js
// ===============================================

/*
 * ما هو API؟
 * API اختصار لـ Application Programming Interface
 * هو وسيلة للتواصل بين التطبيقات المختلفة
 * مثل جسر يربط بين تطبيق الموبايل/الويب وقاعدة البيانات
 * 
 * نقاط النهاية (Endpoints):
 * هي عناوين محددة في الخادم يمكن إرسال طلبات إليها
 * مثل عناوين البريد - كل عنوان له غرض معين
 */

export const endpoints = {
    // مجموعة خدمات المصادقة والتسجيل
    auth: {
        login: '/Auth/login',                           // تسجيل دخول المستخدم
        register: '/Auth/register/vendor',              // تسجيل بائع جديد
        refreshToken: '/Auth/refresh-token',            // تجديد رمز المصادقة
        userInfo: '/Auth/GetUserInfo',                  // الحصول على معلومات المستخدم
        logout: (refreshtoken) => `/Auth/logout/${refreshtoken}`, // تسجيل خروج (يحتاج رمز التجديد)
        forgetPassword: (Identifier) => `/Auth/password/send-otp?Identifier=${Identifier}`,
        verfiyPasswordOtp: (otp, identifer) => `/Auth/password/verify-otp?identifer=${identifer}&otp=${otp}`,
        resetPassword: (resetToken, identifer) => `/Auth/password/reset?resetToken=${resetToken}&identifer=${identifer}`,
        validatEmail: (email) => `/Auth/validate-email/${email}`,
        validatUsername: (username) => `/Auth/validate-username/${username}`,
        validatPhone: (phone) => `/Auth/validate-phone/${phone}`,
        verfiyOtp: (UserId, otp) => `/Auth/verfiyOtp?userId=${UserId}&otp=${otp}`,
        resendOtp: (Identifier) => `/Auth/reSendAuth-otp?Identifier=${Identifier}`

    },
    // مجموعة خدمات لوحة التحكم والإحصائيات
    dashboard: {
        dashboardVendor: '/Dashboard/vendor',           // لوحة تحكم البائع
        dashboardAdmin: '/Dashboard/admin',             // لوحة تحكم المدير
        summary: '/Dashboard/summary',                  // ملخص الإحصائيات
        profitByYear: '/Dashboard/profit-by-year',      // الأرباح حسب السنة
        topProduct: '/Dashboard/top-products',          // أفضل المنتجات مبيعاً
        charts: '/Dashboard/charts',                    // بيانات الرسوم البيانية
        export: (format) => `/Dashboard/export?format=${format}`                     // تصدير البيانات
    },
    // مجموعة خدمات البائعين
    vendor: {
        orders: "/Vendor/Orders",                       // قائمة طلبات البائع
        createOffer: (orderId) => `/Vendor/CreateOffer/${orderId}`, // إنشاء عرض لطلب معين
        orderDetails: (orderId) => `/Vendor/Order/${orderId}`       // تفاصيل طلب معين
    },
    // مجموعة خدمات المدراء
    admin: {
        orders: "/Admin/Orders",                        // قائمة جميع الطلبات للمدير
    },
    // مجموعة خدمات العملاء
    customer: {
        changeLanguage: "/Customer/ChangeLanguage"      // تغيير لغة واجهة العميل
    },
    offer: {
        offerDetails: (offerId) => `/Offer/OfferDetails/${offerId}`
    },
    // مجموعة خدمات الملف الشخصي
    profile: {
        getVendorProfile: '/Vendor/Profile',        // الحصول على ملف البائع الشخصي
        updateVendorProfile: '/Vendor/Profile',     // تحديث ملف البائع الشخصي
        getAdminProfile: '/Admin/Profile',          // الحصول على ملف المدير الشخصي
        updateAdminProfile: '/Admin/Profile'        // تحديث ملف المدير الشخصي
    }
};

export default endpoints;
