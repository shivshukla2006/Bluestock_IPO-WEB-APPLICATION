import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// 🔐 Interceptor to attach token except for public routes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    const publicEndpoints = ['/register', '/token', '/token/refresh'];
    const isPublic = publicEndpoints.some(endpoint =>
      config.url?.includes(endpoint)
    );

    if (!isPublic && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;