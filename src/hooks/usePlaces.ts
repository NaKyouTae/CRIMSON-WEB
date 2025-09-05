import { useState, useEffect } from 'react';
import { placeAPI, Place, PlaceSearchParams, PlaceCreateData, PlaceUpdateData, PlaceQueryParams } from '../api/places';

// Place 데이터를 관리하는 커스텀 훅
export const usePlaces = (initialParams: PlaceSearchParams = {}) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<PlaceSearchParams>(initialParams);

  // 장소 검색
  const searchPlaces = async (query: string, searchParams: PlaceSearchParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placeAPI.searchPlaces(query, { ...params, ...searchParams });
      
      if (result.success) {
        setPlaces(result.data || []);
      } else {
        setError(result.error || '검색 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 장소 상세 조회
  const getPlace = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placeAPI.getPlace(id);
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error || '장소 조회 중 오류가 발생했습니다.');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // 장소 생성
  const createPlace = async (placeData: PlaceCreateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placeAPI.createPlace(placeData);
      
      if (result.success) {
        // 생성 성공 시 목록에 추가
        setPlaces(prev => [result.data!, ...prev]);
        return { success: true, data: result.data };
      } else {
        setError(result.error || '장소 생성 중 오류가 발생했습니다.');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // 장소 수정
  const updatePlace = async (id: string, placeData: PlaceUpdateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placeAPI.updatePlace(id, placeData);
      
      if (result.success) {
        // 수정 성공 시 목록 업데이트
        setPlaces(prev => prev.map(place => 
          place.id === id ? { ...place, ...result.data } : place
        ));
        return { success: true, data: result.data };
      } else {
        setError(result.error || '장소 수정 중 오류가 발생했습니다.');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // 장소 삭제
  const deletePlace = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placeAPI.deletePlace(id);
      
      if (result.success) {
        // 삭제 성공 시 목록에서 제거
        setPlaces(prev => prev.filter(place => place.id !== id));
        return { success: true };
      } else {
        setError(result.error || '장소 삭제 중 오류가 발생했습니다.');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // 장소 즐겨찾기 추가
  const addToFavorites = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placeAPI.addToFavorites(id);
      
      if (result.success) {
        // 즐겨찾기 추가 성공 시 목록 업데이트
        setPlaces(prev => prev.map(place => 
          place.id === id ? { ...place, isFavorite: true } : place
        ));
        return { success: true };
      } else {
        setError(result.error || '즐겨찾기 추가 중 오류가 발생했습니다.');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // 장소 즐겨찾기 제거
  const removeFromFavorites = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placeAPI.removeFromFavorites(id);
      
      if (result.success) {
        // 즐겨찾기 제거 성공 시 목록 업데이트
        setPlaces(prev => prev.map(place => 
          place.id === id ? { ...place, isFavorite: false } : place
        ));
        return { success: true };
      } else {
        setError(result.error || '즐겨찾기 제거 중 오류가 발생했습니다.');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // 카테고리별 장소 조회
  const getPlacesByCategory = async (category: string, categoryParams: PlaceQueryParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placeAPI.getPlacesByCategory(category, { ...params, ...categoryParams });
      
      if (result.success) {
        setPlaces(result.data || []);
      } else {
        setError(result.error || '카테고리별 장소 조회 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 인기 장소 조회
  const getPopularPlaces = async (popularParams: PlaceQueryParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placeAPI.getPopularPlaces({ ...params, ...popularParams });
      
      if (result.success) {
        setPlaces(result.data || []);
      } else {
        setError(result.error || '인기 장소 조회 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    places,
    loading,
    error,
    searchPlaces,
    getPlace,
    createPlace,
    updatePlace,
    deletePlace,
    addToFavorites,
    removeFromFavorites,
    getPlacesByCategory,
    getPopularPlaces,
    setParams,
  };
};
