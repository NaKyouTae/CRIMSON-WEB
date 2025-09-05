import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenStorage, TokenPair } from '../utils/tokenManager';

// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// 토큰 갱신 플래그 (무한 루프 방지)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

// 토큰 갱신 함수
const refreshAccessToken = async (): Promise<string | null> => {
  if (isRefreshing) {
    // 이미 갱신 중이면 대기
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  const refreshToken = tokenStorage.getRefreshToken();

  if (!refreshToken) {
    isRefreshing = false;
    return null;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken
    });

    const newTokens: TokenPair = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken
    };

    tokenStorage.setTokens(newTokens);
    
    // 대기 중인 요청들 처리
    failedQueue.forEach(({ resolve }) => resolve(newTokens.accessToken));
    failedQueue = [];
    isRefreshing = false;

    return newTokens.accessToken;
  } catch (error) {
    // 갱신 실패 시 모든 토큰 삭제
    tokenStorage.clearTokens();
    
    // 대기 중인 요청들 거부
    failedQueue.forEach(({ reject }) => reject(error));
    failedQueue = [];
    isRefreshing = false;

    return null;
  }
};

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials는 프록시를 통해 처리
});

// 요청 인터셉터 (Access Token 자동 추가)
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = tokenStorage.getAccessToken();
    
    if (accessToken) {
      // 토큰 만료 확인
      if (tokenStorage.isTokenExpired(accessToken)) {
        // 토큰 갱신 시도
        const newToken = await refreshAccessToken();
        if (newToken) {
          config.headers.Authorization = `Bearer ${newToken}`;
        }
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 토큰 갱신 실패 콜백
let onTokenRefreshFailed: (() => void) | null = null;

export const setTokenRefreshFailedCallback = (callback: () => void) => {
  onTokenRefreshFailed = callback;
};

// 응답 인터셉터 (토큰 갱신 및 에러 처리)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // 토큰 갱신 시도
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // 갱신된 토큰으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } else {
        // 갱신 실패 시 로그아웃
        tokenStorage.clearTokens();
        if (onTokenRefreshFailed) {
          onTokenRefreshFailed();
        } else {
          window.location.href = '/login';
        }
      }
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

// 토큰 관리 유틸리티 export
export { tokenStorage, createTokenStorage } from '../utils/tokenManager';

export default apiClient;
