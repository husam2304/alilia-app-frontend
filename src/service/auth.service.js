import api from "./api/apiCliant";
import endpoints from "./api/endpoints";
export const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post(endpoints.auth.login, credentials);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },
    register: async (userData) => {
        try {
            const response = await api.post(endpoints.auth.register, userData, {
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
    logout: async (refreshtoken) => {
        try {
            const response = await api.post(endpoints.auth.logout(refreshtoken));
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },
    getUserInfo: async () => {
        try {
            const response = await api.get(endpoints.auth.userInfo);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    },
    refreshToken: async () => {
        try {
            const response = await api.post(endpoints.auth.refreshToken);
            return response.data;
        } catch (error) {
            if (error.response) throw error.response.data;
            else throw error.message;
        }
    }
};
export default authService;