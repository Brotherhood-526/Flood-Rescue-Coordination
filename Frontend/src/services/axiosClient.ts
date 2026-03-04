import axios from "axios";

// Create instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Nhớ config .env
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s timeout
});

apiClient.interceptors.response.use(
    (response) => {
         return response.data?.data ?? response.data;
    },
    (error) => {
    return Promise.reject(error);
  }
)

export default apiClient;