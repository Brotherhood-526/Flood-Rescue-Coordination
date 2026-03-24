import axios from "axios";

const rawBaseURL = import.meta.env.VITE_BACKEND_URL as string | undefined;
const normalizedBaseURL = rawBaseURL ? rawBaseURL.replace(/\/+$/, "") : rawBaseURL;

const apiClient = axios.create({
  baseURL: normalizedBaseURL, 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

apiClient.interceptors.response.use(
  (response) => {
    return response.data?.data ?? response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
