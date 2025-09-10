import apiClient from '../utils/apiClient';
import { PlaceGroupCreateRequest, PlaceGroupCreateRequest_Status, PlaceGroupCreateRequest_Category, PlaceGroupListResult } from '../../generated/place_group/place_group';

export const placeGroupsAPI = {
  createPlaceGroup: async (request: PlaceGroupCreateRequest): Promise<any> => {
    const response = await apiClient.post('/place-groups', request);
    return response.data;
  },
  
  getPlaceGroups: async (): Promise<PlaceGroupListResult> => {
    const response = await apiClient.get('/place-groups');
    return response.data;
  },
  
  getPlaceGroup: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/place-groups/${id}`);
    return response.data;
  },
  
  updatePlaceGroup: async (id: string, request: PlaceGroupCreateRequest): Promise<any> => {
    const response = await apiClient.put(`/place-groups/${id}`, request);
    return response.data;
  },
  
  deletePlaceGroup: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/place-groups/${id}`);
    return response.data;
  }
};

// 유틸리티 함수들
export const createPlaceGroupRequest = (
  name: string,
  isPublic: boolean,
  category: string,
  memo: string,
  link: string
): PlaceGroupCreateRequest => {
  // Status 매핑
  const status = isPublic 
    ? PlaceGroupCreateRequest_Status.PUBLIC 
    : PlaceGroupCreateRequest_Status.PRIVATE;

  // Category 매핑
  let categoryEnum: PlaceGroupCreateRequest_Category;
  switch (category) {
    case '데이트':
      categoryEnum = PlaceGroupCreateRequest_Category.DATE;
      break;
    case '가족':
      categoryEnum = PlaceGroupCreateRequest_Category.FAMILY;
      break;
    default:
      categoryEnum = PlaceGroupCreateRequest_Category.CATEGORY_UNKOWN;
      break;
  }

  return {
    icon: '📍',
    name,
    status,
    category: categoryEnum,
    memo,
    link
  };
};