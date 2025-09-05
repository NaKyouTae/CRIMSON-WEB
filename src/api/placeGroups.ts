import { api, ApiResponse } from './index';

// PlaceGroup 관련 타입 정의
export interface PlaceGroup {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  roleText?: string;
  privacyText?: string;
  members?: number;
  saved?: number;
  category?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlaceGroupCreateData {
  title: string;
  description?: string;
  icon?: string;
  isPublic?: boolean;
}

export interface PlaceGroupUpdateData {
  title?: string;
  description?: string;
  icon?: string;
  isPublic?: boolean;
}

export interface PlaceGroupShareData {
  isPublic: boolean;
  shareType: 'link' | 'email' | 'social';
  recipients?: string[];
}

export interface PlaceGroupQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PlaceInGroup {
  id: string;
  name: string;
  address: string;
  category: string;
  image?: string;
  isOpen?: boolean;
  savedCount?: number;
  reviewCount?: number;
}

export interface PlaceGroupAddPlaceData {
  placeId: string;
}

// PlaceGroup 관련 API 함수들
export const placeGroupAPI = {
  // PlaceGroup 목록 조회
  getPlaceGroups: async (params: PlaceGroupQueryParams = {}): Promise<ApiResponse<PlaceGroup[]>> => {
    return await api.get('/place-groups', { params });
  },

  // PlaceGroup 상세 조회
  getPlaceGroup: async (id: string): Promise<ApiResponse<PlaceGroup>> => {
    return await api.get(`/place-groups/${id}`);
  },

  // PlaceGroup 생성
  createPlaceGroup: async (data: PlaceGroupCreateData): Promise<ApiResponse<PlaceGroup>> => {
    return await api.post('/place-groups', data);
  },

  // PlaceGroup 수정
  updatePlaceGroup: async (id: string, data: PlaceGroupUpdateData): Promise<ApiResponse<PlaceGroup>> => {
    return await api.put(`/place-groups/${id}`, data);
  },

  // PlaceGroup 삭제
  deletePlaceGroup: async (id: string): Promise<ApiResponse> => {
    return await api.delete(`/place-groups/${id}`);
  },

  // PlaceGroup 복제
  duplicatePlaceGroup: async (id: string): Promise<ApiResponse<PlaceGroup>> => {
    return await api.post(`/place-groups/${id}/duplicate`);
  },

  // PlaceGroup 공유
  sharePlaceGroup: async (id: string, shareData: PlaceGroupShareData): Promise<ApiResponse> => {
    return await api.post(`/place-groups/${id}/share`, shareData);
  },

  // PlaceGroup 탈퇴
  leavePlaceGroup: async (id: string): Promise<ApiResponse> => {
    return await api.post(`/place-groups/${id}/leave`);
  },

  // PlaceGroup 내 장소 목록 조회
  getPlacesInGroup: async (groupId: string, params: PlaceGroupQueryParams = {}): Promise<ApiResponse<PlaceInGroup[]>> => {
    return await api.get(`/place-groups/${groupId}/places`, { params });
  },

  // PlaceGroup에 장소 추가
  addPlaceToGroup: async (groupId: string, placeData: PlaceGroupAddPlaceData): Promise<ApiResponse> => {
    return await api.post(`/place-groups/${groupId}/places`, placeData);
  },

  // PlaceGroup에서 장소 제거
  removePlaceFromGroup: async (groupId: string, placeId: string): Promise<ApiResponse> => {
    return await api.delete(`/place-groups/${groupId}/places/${placeId}`);
  },
};
