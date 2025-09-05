import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API 기본 설정
const API_BASE_URL = process.env.VITE_CRIMSON_API_URL;

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (토큰 자동 추가)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API 응답 타입 정의
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: any;
}

// 공통 API 함수들
export const api = {
  // GET 요청
  get: async <T = any>(url: string, config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await apiClient.get(url, config);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  },

  // POST 요청
  post: async <T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await apiClient.post(url, data, config);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  },

  // PUT 요청
  put: async <T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await apiClient.put(url, data, config);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  },

  // PATCH 요청
  patch: async <T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await apiClient.patch(url, data, config);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  },

  // DELETE 요청
  delete: async <T = any>(url: string, config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<T> = await apiClient.delete(url, config);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data || error.message };
    }
  },
};

export default apiClient;
