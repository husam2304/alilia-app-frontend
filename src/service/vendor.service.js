import api from "./api/apiCliant";
import endpoints from "./api/endpoints";

export const vendorService = {
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
    createOffer: async (orderId, offerData) => {
        try {
            const response = await api.post(endpoints.vendor.createOffer(orderId), offerData, {
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
    getOrderDetails: async (orderId) => {
        try {
            const response = await api.get(endpoints.vendor.orderDetails(orderId));
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    }
};
export default vendorService;