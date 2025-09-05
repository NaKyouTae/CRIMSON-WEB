import { useState, useEffect } from 'react';
import { placeGroupAPI, PlaceGroup, PlaceGroupCreateData, PlaceGroupUpdateData, PlaceGroupShareData, PlaceGroupQueryParams } from '../api/placeGroups';

// PlaceGroup 데이터를 관리하는 커스텀 훅
export const usePlaceGroups = (initialParams: PlaceGroupQueryParams = {}) => {
  const [placeGroups, setPlaceGroups] = useState<PlaceGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<PlaceGroupQueryParams>(initialParams);

  // PlaceGroup 목록 조회
  const fetchPlaceGroups = async (newParams: PlaceGroupQueryParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placeGroupAPI.getPlaceGroups({ ...params, ...newParams });
      
      if (result.success) {
        setPlaceGroups(result.data || []);
      } else {
        setError(result.error || 'PlaceGroup 목록 조회 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // PlaceGroup 생성
  const createPlaceGroup = async (placeGroupData: PlaceGroupCreateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placeGroupAPI.createPlaceGroup(placeGroupData);
      
      if (result.success) {
        // 생성 성공 시 목록 새로고침
        await fetchPlaceGroups();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'PlaceGroup 생성 중 오류가 발생했습니다.');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // PlaceGroup 수정
  const updatePlaceGroup = async (id: string, placeGroupData: PlaceGroupUpdateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placeGroupAPI.updatePlaceGroup(id, placeGroupData);
      
      if (result.success) {
        // 수정 성공 시 목록 새로고침
        await fetchPlaceGroups();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'PlaceGroup 수정 중 오류가 발생했습니다.');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // PlaceGroup 삭제
  const deletePlaceGroup = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placeGroupAPI.deletePlaceGroup(id);
      
      if (result.success) {
        // 삭제 성공 시 목록에서 제거
        setPlaceGroups(prev => prev.filter(group => group.id !== id));
        return { success: true };
      } else {
        setError(result.error || 'PlaceGroup 삭제 중 오류가 발생했습니다.');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // PlaceGroup 복제
  const duplicatePlaceGroup = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placeGroupAPI.duplicatePlaceGroup(id);
      
      if (result.success) {
        // 복제 성공 시 목록 새로고침
        await fetchPlaceGroups();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'PlaceGroup 복제 중 오류가 발생했습니다.');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // PlaceGroup 공유
  const sharePlaceGroup = async (id: string, shareData: PlaceGroupShareData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placeGroupAPI.sharePlaceGroup(id, shareData);
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'PlaceGroup 공유 중 오류가 발생했습니다.');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // PlaceGroup 탈퇴
  const leavePlaceGroup = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await placeGroupAPI.leavePlaceGroup(id);
      
      if (result.success) {
        // 탈퇴 성공 시 목록에서 제거
        setPlaceGroups(prev => prev.filter(group => group.id !== id));
        return { success: true };
      } else {
        setError(result.error || 'PlaceGroup 탈퇴 중 오류가 발생했습니다.');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchPlaceGroups();
  }, []);

  return {
    placeGroups,
    loading,
    error,
    fetchPlaceGroups,
    createPlaceGroup,
    updatePlaceGroup,
    deletePlaceGroup,
    duplicatePlaceGroup,
    sharePlaceGroup,
    leavePlaceGroup,
    setParams,
  };
};
