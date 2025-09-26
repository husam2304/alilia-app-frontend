import api from "./api/apiCliant";
import endpoints from "./api/endpoints";

export const adminService = {
    getOrders: async (pageNumber, pageSize) => {
        try {
            const response = await api.get(endpoints.admin.orders, {
                params: { pageNumber, pageSize }
            });
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },
}
export default adminService;