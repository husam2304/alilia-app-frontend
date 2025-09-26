import api from "./api/apiCliant";
import endpoints from "./api/endpoints";

export const dashboardService = {
    dashboardVendor: async () => {
        try {
            const response = await api.get(endpoints.dashboard.dashboardVendor);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },
    dashboardAdmin: async () => {
        try {
            const response = await api.get(endpoints.dashboard.dashboardAdmin);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },
    summary: async () => {
        try {
            const response = await api.get(endpoints.dashboard.summary);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },
    profitByYear: async () => {
        try {
            const response = await api.get(endpoints.dashboard.profitByYear);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },
    topProduct: async () => {
        try {
            const response = await api.get(endpoints.dashboard.topProduct);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },
    charts: async () => {
        try {
            const response = await api.get(endpoints.dashboard.charts);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },
    exportData: async () => {
        try {
            const response = await api.get(endpoints.dashboard.exportData);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    }
};
export default dashboardService;