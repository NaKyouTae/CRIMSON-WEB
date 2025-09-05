import React, { useState } from 'react';
import PlaceGroupItem from './PlaceGroupItem';
import './PlaceGroupSection.css';

// 타입 정의
interface PlaceGroup {
  id: number;
  icon: string;
  title: string;
  role: string;
  roleText: string;
  privacy: string;
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
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const handleDropdownToggle = (itemId: number) => {
    setOpenDropdownId(openDropdownId === itemId ? null : itemId);
  };

  const handleDropdownClose = () => {
    setOpenDropdownId(null);
  };

  // 샘플 데이터 - 이미지에 맞게 수정
  const placeGroupItems: PlaceGroup[] = [
    {
      id: 1,
      icon: '🔴',
      title: '디디팩토리 합정 점심 맛집 추천',
      role: 'editor',
      roleText: '에디터',
      privacy: 'private',
      privacyText: '비공개',
      members: 10,
      saved: 30
    },
    {
      id: 2,
      icon: '🟡',
      title: '규태 보영 데이트 장소 리스트',
      role: 'captain',
      roleText: '캡틴',
      privacy: 'private',
      privacyText: '비공개',
      members: 2,
      saved: 146
    },
    {
      id: 3,
      icon: '🟢',
      title: '다이렉트 결혼준비 카페 추천 상견례 맛집',
      role: 'ghost',
      roleText: '고스트',
      privacy: 'public',
      privacyText: '공개',
      members: 2213,
      saved: 10462
    },
    {
      id: 4,
      icon: '🔵',
      title: '해싸리들이 추천하는 햇님이 맛집',
      role: 'member',
      roleText: '뷰어',
      privacy: 'public',
      privacyText: '공개',
      members: 43213,
      saved: 123123
    }
  ];

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
        {placeGroupItems.map((item) => (
          <PlaceGroupItem
            key={item.id}
            item={item}
            isOpen={openDropdownId === item.id}
            onToggle={() => handleDropdownToggle(item.id)}
            onClose={handleDropdownClose}
            onItemClick={onItemClick}
          />
        ))}
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
