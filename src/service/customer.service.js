import api from "./api/apiCliant";
import endpoints from "./api/endpoints";

export const customerService = {
    changeLanguage: async (language) => {
        try {
            const response = await api.post(endpoints.customer.changeLanguage, null, {
                params: { language }
            });
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    }
};

export default customerService;