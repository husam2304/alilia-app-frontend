import api from "./api/apiCliant";
import endpoints from "./api/endpoints";

export const offerService = {

    offerDetials: async (offerId) => {
        try {
            const response = await api.get(endpoints.offer.offerDetails(offerId));
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    }
};

export default offerService;