import { api, ApiResponse } from './index';

// 인증 관련 타입 정의
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileData {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface EmailVerificationData {
  token: string;
}

export interface PasswordResetRequestData {
  email: string;
}

export interface PasswordResetData {
  token: string;
  password: string;
}

// 인증 관련 API 함수들
export const authAPI = {
  // 로그인
  login: async (credentials: LoginCredentials): Promise<ApiResponse> => {
    return await api.post('/auth/login', credentials);
  },

  // 로그아웃
  logout: async (): Promise<ApiResponse> => {
    return await api.post('/auth/logout');
  },

  // 회원가입
  register: async (userData: RegisterData): Promise<ApiResponse> => {
    return await api.post('/auth/register', userData);
  },

  // 토큰 갱신
  refreshToken: async (): Promise<ApiResponse> => {
    return await api.post('/auth/refresh');
  },

  // 비밀번호 변경
  changePassword: async (passwordData: PasswordChangeData): Promise<ApiResponse> => {
    return await api.put('/auth/password', passwordData);
  },

  // 프로필 조회
  getProfile: async (): Promise<ApiResponse> => {
    return await api.get('/auth/profile');
  },

  // 프로필 수정
  updateProfile: async (profileData: ProfileData): Promise<ApiResponse> => {
    return await api.put('/auth/profile', profileData);
  },

  // 이메일 인증
  verifyEmail: async (token: string): Promise<ApiResponse> => {
    return await api.post('/auth/verify-email', { token });
  },

  // 비밀번호 재설정 요청
  requestPasswordReset: async (email: string): Promise<ApiResponse> => {
    return await api.post('/auth/forgot-password', { email });
  },

  // 비밀번호 재설정
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse> => {
    return await api.post('/auth/reset-password', { token, password: newPassword });
  },
};
