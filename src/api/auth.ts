import apiClient from './index';
import { MemberLoginRequest, MemberLoginResult } from '../../generated/common/auth';

// 로그인 API
export const loginAPI = {
  // 회원 로그인
  memberLogin: async (request: MemberLoginRequest): Promise<MemberLoginResult> => {
    const response = await apiClient.post<MemberLoginResult>('/auth/members/login', request);
    return response.data;
  },

  // 회원 가입
  memberSignUp: async (request: any): Promise<any> => {
    const response = await apiClient.post('/auth/members/signup', request);
    return response.data;
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // 토큰 갱신
  refreshToken: async (): Promise<any> => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  }
};