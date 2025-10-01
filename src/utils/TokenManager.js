export const TokenManager = {
    setTokens(accessToken, refreshToken) {
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    },

    getAccessToken() {
        return localStorage.getItem('authToken');
    },

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    },

    clearTokens() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
    },

    isAuthenticated() {
        return !!this.getAccessToken();
    },
    getLanguage() {
        return localStorage.getItem("language")
    }

};
export default TokenManager;


// Data formatting utilities
