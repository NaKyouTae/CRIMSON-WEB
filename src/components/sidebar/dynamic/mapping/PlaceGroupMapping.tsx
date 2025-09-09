import React, { useState, useEffect } from 'react';
import './PlaceGroupMapping.css';
import { KakaoPlace, PlaceGroup } from '../../../../../generated/dto';
import { PlaceCreateRequest } from '../../../../../generated/place/place';
import { placeGroupsAPI } from '../../../../api/placeGroups';
import { placeAPI } from '../../../../api/places';

interface PlaceGroupMappingProps {
  place: KakaoPlace;
  onClose: () => void;
  onSuccess?: () => void;
}

const PlaceGroupMapping: React.FC<PlaceGroupMappingProps> = ({ 
  place, 
  onClose, 
  onSuccess 
}) => {
  const [placeGroups, setPlaceGroups] = useState<PlaceGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadPlaceGroups();
  }, []);

  const loadPlaceGroups = async () => {
    try {
      setIsLoading(true);
      const groups = await placeGroupsAPI.getPlaceGroups();
      setPlaceGroups(groups.groups);
    } catch (err) {
      console.error('장소 그룹 로드 실패:', err);
      setError('장소 그룹을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGroupId) {
      setError('장소 그룹을 선택해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // PlaceCreateRequest 객체 생성
      const placeCreateRequest: PlaceCreateRequest = {
        placeGroupId: selectedGroupId,
        place: place
      };
      
      console.log('장소 생성 요청:', placeCreateRequest);
      
      // POST /api/places API 호출
      const createdPlace = await placeAPI.createPlace(placeCreateRequest);
      
      console.log('장소가 성공적으로 생성되었습니다:', createdPlace);
      
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('장소 생성 실패:', err);
      setError('장소를 생성하는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="place-group-mapping-overlay">
      <div className="place-group-mapping-modal">
        <div className="modal-header">
          <h3>장소 그룹에 추가</h3>
          <button className="close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>
        
        <div className="modal-content">
          <div className="place-info">
            <h4>{place.name}</h4>
            <p className="place-address">{place.addressName}</p>
            <p className="place-category">{place.categoryName}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="mapping-form">
            <div className="form-group">
              <label htmlFor="placeGroup">장소 그룹 선택</label>
              <select
                id="placeGroup"
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                disabled={isLoading}
                className="group-select"
              >
                <option value="">그룹을 선택하세요</option>
                {placeGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-actions">
              <button
                type="button"
                onClick={handleClose}
                className="cancel-btn"
                disabled={isLoading}
              >
                취소
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={isLoading || !selectedGroupId}
              >
                {isLoading ? '추가 중...' : '추가'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlaceGroupMapping;