export const endpoints = {
    auth: {
        login: '/Auth/login',
        register: '/Auth/register/vendor',
        refreshToken: '/Auth/refresh-token',
        userInfo: '/Auth/GetUserInfo',
        logout: (refreshtoken) => `/Auth/logout/${refreshtoken}`,
    },
    dashboard: {
        dashboardVendor: '/Dashboard/vendor',
        dashboardAdmin: '/Dashboard/admin',
        summary: '/Dashboard/summary',
        profitByYear: '/Dashboard/profit-by-year',
        topProduct: '/Dashboard/top-products',
        charts: '/Dashboard/charts',
        export: '/Dashboard/export'
    },
    vendor: {
        orders: "/Vendor/Orders",
        createOffer: (orderId) => `/Vendor/CreateOffer/${orderId}`,
        orderDetails: (orderId) => `/Vendor/Order/${orderId}`
    },
    admin: {
        orders: "/Admin/Orders",
    }
};
export default endpoints;