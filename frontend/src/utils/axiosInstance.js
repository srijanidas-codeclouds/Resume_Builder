import axios from "axios";
import { BASE_API_URL } from "./apiPaths";

export const axiosInstance = axios.create({
    baseURL: BASE_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Axios Error:", error.response.data);
      if (error.response.status === 401) {
        window.location.href = '/';
      } else if (error.response.status === 500) {
        console.error('Server error, please try again later.');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout, please try again.');
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;