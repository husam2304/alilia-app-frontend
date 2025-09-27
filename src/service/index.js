
// ===============================================
// ملف الفهرس الرئيسي (Main Index)
// index.js
// ===============================================

/*
 * هذا الملف يقوم بتجميع وتصدير جميع الخدمات
 * حتى يمكن استيرادها بسهولة في ملفات أخرى
 * 
 * مثال على الاستخدام:
 * import { authService, vendorService } from './services';
 */

export * from './admin.service';      // تصدير جميع وظائف خدمة المدراء
export * from './vendor.service';     // تصدير جميع وظائف خدمة البائعين  
export * from './auth.service';       // تصدير جميع وظائف خدمة المصادقة
export * from './dashboard.service';  // تصدير جميع وظائف خدمة لوحة التحكم
export * from './customer.service';   // تصدير جميع وظائف خدمة العملاء
export * from './offer.service';   // تصدير جميع وظائف خدمة العملاء
