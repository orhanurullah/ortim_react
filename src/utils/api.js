import axios from 'axios';
import {logout} from "../features/auth/authSlice";

let storeDispatch = null;

export const initializeApi = (dispatch) => {
    storeDispatch = dispatch;
};

const api = axios.create({
    baseURL: 'http://localhost:8088/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const noAuthRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/email-activation',
    '/auth/re-email-activation',
    '/auth/refresh-token'
];

api.interceptors.request.use(
    (config) => {
        const requiresAuth = !noAuthRoutes.some((route) => config.url.includes(route));

        if (requiresAuth) {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                if (storeDispatch) {
                    storeDispatch(logout());
                }
            }else{
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 500 && storeDispatch) {
            storeDispatch(logout());
        }
        if (error.response?.status === 403) {
            localStorage.removeItem('accessToken');
            if (storeDispatch) {
                storeDispatch(logout());
            }
            return Promise.reject(error);
        }

        // 401 hatası ve token yenileme denenmemişse
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Refresh token isteği (cookie otomatik gönderilir)
                const refreshResponse = await api.post('/auth/refresh-token');
                console.log(refreshResponse.data.success);
                if(!refreshResponse.data.success){
                    localStorage.removeItem('accessToken');
                    if (storeDispatch) {
                        storeDispatch(logout());
                    }
                    return Promise.reject(error);
                }
                const newAccessToken = refreshResponse.data.data.accessToken;
                if (newAccessToken) {
                    localStorage.setItem('accessToken', newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest); // Orijinal isteği tekrarla
                }
            } catch (refreshError) {
                // Refresh token geçersizse oturumu sonlandır
                localStorage.removeItem('accessToken');
                if (storeDispatch) {
                    storeDispatch(logout());
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;