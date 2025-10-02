import axios, { AxiosRequestConfig } from "axios";

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (
      ["post", "put", "patch", "delete"].includes(
        config.method?.toLowerCase() ?? ""
      )
    ) {
      await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/sanctum/csrf-cookie`,
        { withCredentials: true }
      );

      const xsrfToken = getCookie("XSRF-TOKEN");
      if (xsrfToken) {
        config.headers["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
      }
    }

    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export interface ApiResponseType<T> {
  success?: boolean;
  message?: string;
  data?: T;
  user?: T;
  token?: string;
  total?: string;
  last_page?: string;
}

export const apiService = {
  get: async <T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponseType<T>> => {
    const response = await apiClient.get<ApiResponseType<T>>(endpoint, config);
    return response.data;
  },

  post: async <TReq, TRes>(
    endpoint: string,
    data?: TReq,
    config?: AxiosRequestConfig
  ): Promise<ApiResponseType<TRes>> => {
    const response = await apiClient.post<ApiResponseType<TRes>>(
      endpoint,
      data,
      config
    );
    return response.data;
  },

  put: async <TReq, TRes>(
    endpoint: string,
    data?: TReq,
    config?: AxiosRequestConfig
  ): Promise<ApiResponseType<TRes>> => {
    const response = await apiClient.put<ApiResponseType<TRes>>(
      endpoint,
      data,
      config
    );
    return response.data;
  },

  delete: async <T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponseType<T>> => {
    const response = await apiClient.delete<ApiResponseType<T>>(
      endpoint,
      config
    );
    return response.data;
  },
};

export default apiService;
