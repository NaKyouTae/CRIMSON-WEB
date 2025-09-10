import React, { useState, useEffect } from 'react';
import PlaceGroupItem from './PlaceGroupItem';
import './PlaceGroupSection.css';
import { placeGroupsAPI } from '../../../../api/placeGroups';

// 타입 정의
interface PlaceGroup {
  id: string;
  name: string;
  status: number; // 1: PUBLIC, 2: PRIVATE
  category: number; // 1: DATE, 2: FAMILY, etc.
  memo: string;
  link: string;
  createdAt: number;
  updatedAt: number;
  // UI용 추가 필드들
  icon: string;
  role: string;
  roleText: string;
  privacyText: string;
  members: number;
  saved: number;
}

interface PlaceGroupSectionProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  onItemClick: (item: PlaceGroup) => void;
}

const PlaceGroupSection: React.FC<PlaceGroupSectionProps> = ({ 
  activeFilter, 
  setActiveFilter, 
  sortOrder, 
  setSortOrder, 
  onItemClick 
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [placeGroups, setPlaceGroups] = useState<PlaceGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleDropdownToggle = (itemId: string) => {
    setOpenDropdownId(openDropdownId === itemId ? null : itemId);
  };

  const handleDropdownClose = () => {
    setOpenDropdownId(null);
  };

  // API에서 데이터를 가져와서 UI용 데이터로 변환
  const transformPlaceGroupData = (apiData: any[]): PlaceGroup[] => {
    return apiData.map((item, index) => ({
      id: item.id || `temp-${index}`,
      name: item.name || '제목 없음',
      status: item.status || 1,
      category: item.category || 1,
      memo: item.memo || '',
      link: item.link || '',
      createdAt: item.createdAt || Date.now(),
      updatedAt: item.updatedAt || Date.now(),
      // UI용 필드들 (임시 데이터)
      icon: ['🔴', '🟡', '🟢', '🔵', '🟣', '🟠'][index % 6],
      role: 'editor', // 실제로는 사용자 권한에 따라 결정
      roleText: '에디터',
      privacyText: item.status === 1 ? '공개' : '비공개',
      members: Math.floor(Math.random() * 1000) + 1, // 임시 데이터
      saved: Math.floor(Math.random() * 10000) + 1, // 임시 데이터
    }));
  };

  // API 호출
  const fetchPlaceGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await placeGroupsAPI.getPlaceGroups();
      console.log('Place groups response:', response);
      
      // 응답 데이터 변환
      const transformedData = transformPlaceGroupData(response.groups || response || []);
      setPlaceGroups(transformedData);
    } catch (err) {
      console.error('Failed to fetch place groups:', err);
      setError('리스트를 불러오는데 실패했습니다.');
      // 에러 시 빈 배열로 설정
      setPlaceGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchPlaceGroups();
  }, []);

  return (
    <div className="place-group-section">
      <div className="section-title">
        <h3>내 리스트 목록</h3>
      </div>
      
      <div className="section-header">
        <div className="filter-buttons">
          <button 
            className={`filter-button ${activeFilter === 'captain' ? 'active' : ''}`}
            onClick={() => setActiveFilter('captain')}
          >
            캡틴
          </button>
          <button 
            className={`filter-button ${activeFilter === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveFilter('editor')}
          >
            에디터
          </button>
          <button 
            className={`filter-button ${activeFilter === 'member' ? 'active' : ''}`}
            onClick={() => setActiveFilter('member')}
          >
            멤버
          </button>
        </div>
        
        <div className="sort-dropdown">
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="latest">최신 순</option>
            <option value="name">이름 순</option>
            <option value="members">멤버 수 순</option>
            <option value="saved">저장 수 순</option>
          </select>
        </div>
      </div>

      <div className="place-group-list">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>리스트를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button 
              className="retry-button"
              onClick={fetchPlaceGroups}
            >
              다시 시도
            </button>
          </div>
        ) : placeGroups.length === 0 ? (
          <div className="empty-container">
            <p>아직 생성된 리스트가 없습니다.</p>
          </div>
        ) : (
          placeGroups.map((item) => (
            <PlaceGroupItem
              key={item.id}
              item={item}
              isOpen={openDropdownId === item.id}
              onToggle={() => handleDropdownToggle(item.id)}
              onClose={handleDropdownClose}
              onItemClick={onItemClick}
            />
          ))
        )}
      </div>

      <div className="pagination">
        <button className="pagination-button" disabled>«</button>
        <button className="pagination-button" disabled>‹</button>
        <button className="pagination-number active">1</button>
        <button className="pagination-button" disabled>›</button>
        <button className="pagination-button" disabled>»</button>
      </div>
    </div>
  );
};

export default PlaceGroupSection;
