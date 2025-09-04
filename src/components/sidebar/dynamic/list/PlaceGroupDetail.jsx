import React, { useState } from 'react';
import './PlaceGroupDetail.css';

const PlaceGroupDetail = ({ placeGroup, onBack }) => {
  const [activeButton, setActiveButton] = useState('share');

  // 샘플 데이터에 description과 url 추가
  const placeGroupData = {
    ...placeGroup,
    description: placeGroup.title === '규태 보영 데이트 장소 리스트' 
      ? '규태 보영 데이트 장소 저장용(2023)' 
      : '장소 저장 및 공유용 리스트',
    url: placeGroup.title === '규태 보영 데이트 장소 리스트' 
      ? 'blog.naver.com/by1uv' 
      : 'example.com',
    category: placeGroup.title === '규태 보영 데이트 장소 리스트' 
      ? '데이트' 
      : '일반'
  };

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
    console.log(`${buttonType} clicked for place group:`, placeGroup.title);
  };

  return (
    <div className="place-group-detail">
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>‹</button>
        <h2>리스트 상세보기</h2>
      </div>

      <div className="place-group-info">
        <div className="place-group-icon-large">{placeGroupData.icon}</div>
        <div className="place-group-content-large">
          <h3 className="place-group-title">{placeGroupData.title}</h3>
          <p className="place-group-description">{placeGroupData.description}</p>
          <div className="place-group-link">
            <span className="link-icon">🔗</span>
            <a href="#" className="link-url">{placeGroupData.url}</a>
          </div>
          <div className="place-group-meta-large">
            <span className="role-badge captain">{placeGroupData.roleText}</span>
            <span className="separator">|</span>
            <span className="category-badge">{placeGroupData.category}</span>
            <span className="separator">|</span>
            <span className="privacy-badge">{placeGroupData.privacyText}</span>
            <span className="separator">|</span>
            <span className="members-badge">멤버 {placeGroupData.members}</span>
            <span className="separator">|</span>
            <span className="saved-badge">저장 {placeGroupData.saved}</span>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className={`action-button ${activeButton === 'share' ? 'active' : ''}`}
          onClick={() => handleButtonClick('share')}
        >
          공유
        </button>
        <button 
          className={`action-button ${activeButton === 'edit' ? 'active' : ''}`}
          onClick={() => handleButtonClick('edit')}
        >
          수정
        </button>
        <button 
          className={`action-button ${activeButton === 'duplicate' ? 'active' : ''}`}
          onClick={() => handleButtonClick('duplicate')}
        >
          복제
        </button>
        <button 
          className={`action-button ${activeButton === 'delete' ? 'active' : ''}`}
          onClick={() => handleButtonClick('delete')}
        >
          삭제
        </button>
        <button 
          className={`action-button ${activeButton === 'leave' ? 'active' : ''}`}
          onClick={() => handleButtonClick('leave')}
        >
          탈퇴
        </button>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="서교동"
            className="search-input"
          />
        </div>
        <div className="category-filters">
          <button className="filter-tag active">카페</button>
          <button className="filter-tag">요리주점</button>
          <button className="filter-tag">문화</button>
          <button className="filter-tag">음식점</button>
        </div>
        <div className="sort-section">
          <select className="sort-select">
            <option>최신 저장 순</option>
            <option>이름 순</option>
            <option>평점 순</option>
          </select>
        </div>
      </div>

      <div className="search-results">
        <div className="place-item">
          <div className="place-image">
            <img src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=60&h=60&fit=crop" alt="카페레터" />
          </div>
          <div className="place-content">
            <div className="place-header">
              <div className="place-name-section">
                <h4 className="place-name">카페레터</h4>
                <span className="place-category">카페</span>
              </div>
              <div className="place-pin" style={{ color: '#ff6b6b' }}>📍</div>
            </div>
            <div className="place-status">
              <span className="status-text" style={{ color: '#ff6b6b' }}>영업중</span>
              <span className="separator"> | </span>
              <span className="location">서울시 마포구 서교동</span>
            </div>
            <div className="place-meta">
              <span className="saved">저장 3</span>
              <span className="separator"> | </span>
              <span className="reviews">리뷰 1</span>
            </div>
            <div className="place-maps">
              <a href="#" className="map-link">네이버지도</a>
              <span className="separator"> | </span>
              <a href="#" className="map-link">카카오맵</a>
            </div>
          </div>
        </div>

        <div className="place-item">
          <div className="place-image">
            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=60&h=60&fit=crop" alt="선비다이닝" />
          </div>
          <div className="place-content">
            <div className="place-header">
              <div className="place-name-section">
                <h4 className="place-name">선비다이닝</h4>
                <span className="place-category">요리주점</span>
              </div>
              <div className="place-pin" style={{ color: '#cccccc' }}>📍</div>
            </div>
            <div className="place-status">
              <span className="status-text" style={{ color: '#999999' }}>오늘휴무</span>
              <span className="separator"> | </span>
              <span className="location">서울시 마포구 서교동</span>
            </div>
            <div className="place-meta">
              <span className="saved">저장 1</span>
            </div>
            <div className="place-maps">
              <a href="#" className="map-link">네이버지도</a>
              <span className="separator"> | </span>
              <a href="#" className="map-link">카카오맵</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceGroupDetail;
