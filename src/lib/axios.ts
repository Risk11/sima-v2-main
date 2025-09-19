import axios, { AxiosRequestConfig } from 'axios';

const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api`,
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        if (config.method && ['post', 'put', 'patch'].includes(config.method.toLowerCase())) {
            const hasFile = config.data && Object.values(config.data).some(
                (value) =>
                    value instanceof File ||
                    value instanceof Blob ||
                    (Array.isArray(value) && value.some(item => item instanceof File || item instanceof Blob))
            );
            config.headers['Content-Type'] = hasFile ? 'multipart/form-data' : 'application/json';
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;
        if (response && response.status === 401) {
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);


export interface ApiResponseType<T> {
    success: boolean;
    message: string;
    data: T;
}

export const apiService = {

    getCsrfCookie: () => apiClient.get('/sanctum/csrf-cookie', {
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    }),

    get: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponseType<T>> => {
        const response = await apiClient.get<ApiResponseType<T>>(endpoint, config);
        return response.data;
    },


    post: async <T, U>(endpoint: string, data?: U, config?: AxiosRequestConfig): Promise<ApiResponseType<T>> => {
        const response = await apiClient.post<ApiResponseType<T>>(endpoint, data, config);
        return response.data;
    },

    put: async <T, U>(endpoint: string, data: U, config?: AxiosRequestConfig): Promise<ApiResponseType<T>> => {
        const payload = data instanceof FormData ? { ...Object.fromEntries(data.entries()), _method: 'PUT' } : { ...data, _method: 'PUT' };
        const response = await apiClient.post<ApiResponseType<T>>(endpoint, payload, config);
        return response.data;
    },

    patch: async <T, U>(endpoint: string, data: U, config?: AxiosRequestConfig): Promise<ApiResponseType<T>> => {
        const payload = data instanceof FormData ? { ...Object.fromEntries(data.entries()), _method: 'PATCH' } : { ...data, _method: 'PATCH' };
        const response = await apiClient.post<ApiResponseType<T>>(endpoint, payload, config);
        return response.data;
    },

    delete: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponseType<T>> => {
        const response = await apiClient.delete<ApiResponseType<T>>(endpoint, config);
        return response.data;
    },
};

export default apiService;
