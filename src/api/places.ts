import { api, ApiResponse } from './index';
import { KakaoPlaceListResult } from '../../generated/place/kako_place';
import { PlaceCreateRequest } from '../../generated/place/place';

// Place 관련 타입 정의
export interface Place {
  id: string;
  name: string;
  address: string;
  category: string;
  image?: string;
  isOpen?: boolean;
  savedCount?: number;
  reviewCount?: number;
  rating?: number;
  description?: string;
  phone?: string;
  website?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface PlaceCreateData {
  name: string;
  address: string;
  category: string;
  description?: string;
  phone?: string;
  website?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PlaceUpdateData {
  name?: string;
  address?: string;
  category?: string;
  description?: string;
  phone?: string;
  website?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PlaceSearchParams {
  q?: string;
  category?: string;
  groupId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PlaceKeywordSearchParams {
  query: string;
  page?: number;
  size?: number;
}

export interface PlaceReview {
  id: string;
  placeId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceReviewCreateData {
  rating: number;
  comment: string;
}

export interface PlaceReviewUpdateData {
  rating?: number;
  comment?: string;
}

export interface PlaceQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Place 관련 API 함수들
export const placeAPI = {
  // 장소 검색
  searchPlaces: async (query: string, params: PlaceSearchParams = {}): Promise<ApiResponse<Place[]>> => {
    return await api.get('/places/search', { 
      params: { q: query, ...params } 
    });
  },

  // 장소 상세 조회
  getPlace: async (id: string): Promise<ApiResponse<Place>> => {
    return await api.get(`/places/${id}`);
  },

  // 장소 생성
  createPlace: async (data: PlaceCreateRequest): Promise<ApiResponse<Place>> => {
    return await api.post('/places', data);
  },

  // 장소 수정
  updatePlace: async (id: string, data: PlaceUpdateData): Promise<ApiResponse<Place>> => {
    return await api.put(`/places/${id}`, data);
  },

  // 장소 삭제
  deletePlace: async (id: string): Promise<ApiResponse> => {
    return await api.delete(`/places/${id}`);
  },

  // 장소 즐겨찾기 추가
  addToFavorites: async (id: string): Promise<ApiResponse> => {
    return await api.post(`/places/${id}/favorite`);
  },

  // 장소 즐겨찾기 제거
  removeFromFavorites: async (id: string): Promise<ApiResponse> => {
    return await api.delete(`/places/${id}/favorite`);
  },

  // 장소 리뷰 조회
  getPlaceReviews: async (id: string, params: PlaceQueryParams = {}): Promise<ApiResponse<PlaceReview[]>> => {
    return await api.get(`/places/${id}/reviews`, { params });
  },

  // 장소 리뷰 작성
  createPlaceReview: async (id: string, reviewData: PlaceReviewCreateData): Promise<ApiResponse<PlaceReview>> => {
    return await api.post(`/places/${id}/reviews`, reviewData);
  },

  // 장소 리뷰 수정
  updatePlaceReview: async (placeId: string, reviewId: string, reviewData: PlaceReviewUpdateData): Promise<ApiResponse<PlaceReview>> => {
    return await api.put(`/places/${placeId}/reviews/${reviewId}`, reviewData);
  },

  // 장소 리뷰 삭제
  deletePlaceReview: async (placeId: string, reviewId: string): Promise<ApiResponse> => {
    return await api.delete(`/places/${placeId}/reviews/${reviewId}`);
  },

  // 카테고리별 장소 조회
  getPlacesByCategory: async (category: string, params: PlaceQueryParams = {}): Promise<ApiResponse<Place[]>> => {
    return await api.get(`/places/category/${category}`, { params });
  },

  // 인기 장소 조회
  getPopularPlaces: async (params: PlaceQueryParams = {}): Promise<ApiResponse<Place[]>> => {
    return await api.get('/places/popular', { params });
  },

  // 키워드로 장소 검색
  searchPlacesByKeyword: async (params: PlaceKeywordSearchParams): Promise<ApiResponse<KakaoPlaceListResult>> => {
    return await api.get('/places/keyword', { params });
  },

  // 그룹 ID로 장소 목록 조회
  getPlacesByGroupId: async (placeGroupId: string): Promise<ApiResponse<Place[]>> => {
    return await api.get(`/places/${placeGroupId}`);
  },
};
