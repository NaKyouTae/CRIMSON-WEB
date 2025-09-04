import React, { useState } from 'react';
import PlaceGroupItem from './PlaceGroupItem';
import './PlaceGroupSection.css';

const PlaceGroupSection = ({ activeFilter, setActiveFilter, sortOrder, setSortOrder }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const handleDropdownToggle = (itemId) => {
    setOpenDropdownId(openDropdownId === itemId ? null : itemId);
  };

  const handleDropdownClose = () => {
    setOpenDropdownId(null);
  };

  // 샘플 데이터
  const placeGroupItems = [
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
      icon: '❤️',
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
      icon: '☁️',
      title: '다이렉트 결혼준비 카페 추천 상견례 맛집',
      role: 'ghost',
      roleText: '고스트',
      privacy: 'public',
      privacyText: '공개',
      members: '2,213',
      saved: '10,462'
    },
    {
      id: 4,
      icon: '☀️',
      title: '해싸리들이 추천하는 햇님이 맛집',
      role: 'viewer',
      roleText: '뷰어',
      privacy: 'public',
      privacyText: '공개',
      members: '43,213',
      saved: '123,123'
    }
  ];

  return (
    <div className="place-group-section">
      <div className="place-group-header">
        <h3>My Place Groups</h3>
      </div>

      {/* 필터 탭 */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${activeFilter === 'captain' ? 'active' : ''}`}
          onClick={() => setActiveFilter('captain')}
        >
          캡틴
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'editor' ? 'active' : ''}`}
          onClick={() => setActiveFilter('editor')}
        >
          에디터
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'viewer' ? 'active' : ''}`}
          onClick={() => setActiveFilter('viewer')}
        >
          뷰어
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'ghost' ? 'active' : ''}`}
          onClick={() => setActiveFilter('ghost')}
        >
          고스트
        </button>
      </div>

      {/* 정렬 옵션 */}
      <div className="sort-section">
        <select 
          className="sort-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="latest">최신 생성 순</option>
          <option value="oldest">오래된 순</option>
          <option value="name">이름 순</option>
        </select>
      </div>

      {/* 플레이스 그룹 아이템들 */}
      <div className="place-group-items">
        {placeGroupItems.map((item) => (
          <PlaceGroupItem 
            key={item.id} 
            item={item} 
            isOpen={openDropdownId === item.id}
            onToggle={() => handleDropdownToggle(item.id)}
            onClose={handleDropdownClose}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button className="page-button">«</button>
        <button className="page-button">‹</button>
        <button className="page-button active">1</button>
        <button className="page-button">›</button>
        <button className="page-button">»</button>
      </div>
    </div>
  );
};

export default PlaceGroupSection;
