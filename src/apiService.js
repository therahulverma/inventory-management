import axios from "axios";
import keycloak from "./keycloak";

const apiClient = axios.create({
  baseURL: "http://localhost:3001/api", // Your API base URL
});

// Add JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    if (keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await keycloak.updateToken(30);
        // Retry the request with new token
        error.config.headers.Authorization = `Bearer ${keycloak.token}`;
        return apiClient.request(error.config);
      } catch (refreshError) {
        keycloak.login();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
