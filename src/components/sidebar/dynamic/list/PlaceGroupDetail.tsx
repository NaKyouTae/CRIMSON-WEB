import React, { useState } from 'react';
import './PlaceGroupDetail.css';
import { placeGroupAPI } from '../../../../api/placeGroups';
import { placeAPI } from '../../../../api/places';
import { showSuccessMessage, showErrorMessage } from '../../../../utils/apiClient';

// 타입 정의
interface Place {
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
}

interface PlaceGroup {
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

interface PlaceGroupDetailProps {
  placeGroup: PlaceGroup;
  onBack: () => void;
}

const PlaceGroupDetail: React.FC<PlaceGroupDetailProps> = ({ placeGroup, onBack }) => {
  const [activeButton, setActiveButton] = useState<string>('share');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // 샘플 데이터에 description과 url 추가
  const placeGroupData: PlaceGroup = {
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

  const handleButtonClick = async (buttonType: string) => {
    setActiveButton(buttonType);
    
    try {
      let result;
      
      switch (buttonType) {
        case 'share':
          result = await placeGroupAPI.sharePlaceGroup(placeGroup.id, {
            // 공유 설정 데이터
            isPublic: true,
            shareType: 'link'
          });
          break;
          
        case 'edit':
          // 수정 모드로 전환하는 로직
          console.log('Edit mode activated for:', placeGroup.title);
          showSuccessMessage('수정 모드로 전환되었습니다.');
          return;
          
        case 'duplicate':
          result = await placeGroupAPI.duplicatePlaceGroup(placeGroup.id);
          break;
          
        case 'delete':
          if (window.confirm('정말로 이 PlaceGroup을 삭제하시겠습니까?')) {
            result = await placeGroupAPI.deletePlaceGroup(placeGroup.id);
          } else {
            return;
          }
          break;
          
        case 'leave':
          if (window.confirm('정말로 이 PlaceGroup에서 탈퇴하시겠습니까?')) {
            result = await placeGroupAPI.leavePlaceGroup(placeGroup.id);
          } else {
            return;
          }
          break;
          
        default:
          console.log(`${buttonType} clicked for place group:`, placeGroup.title);
          return;
      }
      
      if (result && result.success) {
        showSuccessMessage(`${buttonType} 작업이 성공적으로 완료되었습니다.`);
        
        // 삭제나 탈퇴의 경우 뒤로가기
        if (buttonType === 'delete' || buttonType === 'leave') {
          onBack();
        }
      } else if (result && result.error) {
        showErrorMessage(result.error);
      }
      
    } catch (error: any) {
      showErrorMessage(`API 호출 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  // 검색 기능
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const result = await placeAPI.searchPlaces(query, {
        groupId: placeGroup.id,
        limit: 20
      });
      
      if (result.success) {
        setSearchResults(result.data || []);
      } else {
        showErrorMessage(result.error || '검색 중 오류가 발생했습니다.');
        setSearchResults([]);
      }
    } catch (error: any) {
      showErrorMessage(`검색 중 오류가 발생했습니다: ${error.message}`);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 검색 입력 핸들러
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // 디바운싱을 위한 타이머
    clearTimeout((window as any).searchTimeout);
    (window as any).searchTimeout = setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  // 장소를 PlaceGroup에 추가
  const handleAddPlaceToGroup = async (placeId: string) => {
    try {
      const result = await placeGroupAPI.addPlaceToGroup(placeGroup.id, { placeId });
      
      if (result.success) {
        showSuccessMessage('장소가 PlaceGroup에 추가되었습니다.');
        // 검색 결과에서 제거
        setSearchResults(prev => prev.filter(place => place.id !== placeId));
      } else {
        showErrorMessage(result.error || '장소 추가 중 오류가 발생했습니다.');
      }
    } catch (error: any) {
      showErrorMessage(`장소 추가 중 오류가 발생했습니다: ${error.message}`);
    }
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
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          {isSearching && <div className="search-loading">검색 중...</div>}
        </div>
        <div className="filter-sort-container">
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
      </div>

      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map((place) => (
            <div key={place.id} className="place-item">
              <div className="place-image">
                <img 
                  src={place.image || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=60&h=60&fit=crop"} 
                  alt={place.name} 
                />
              </div>
              <div className="place-content">
                <div className="place-header">
                  <div className="place-name-section">
                    <h4 className="place-name">{place.name}</h4>
                    <span className="place-category">{place.category}</span>
                  </div>
                  <div className="place-pin" style={{ color: place.isOpen ? '#ff6b6b' : '#cccccc' }}>📍</div>
                </div>
                <div className="place-status">
                  <span className="status-text" style={{ color: place.isOpen ? '#ff6b6b' : '#999999' }}>
                    {place.isOpen ? '영업중' : '휴무'}
                  </span>
                  <span className="separator"> | </span>
                  <span className="location">{place.address}</span>
                </div>
                <div className="place-meta">
                  <span className="saved">저장 {place.savedCount || 0}</span>
                  {place.reviewCount && place.reviewCount > 0 && (
                    <>
                      <span className="separator"> | </span>
                      <span className="reviews">리뷰 {place.reviewCount}</span>
                    </>
                  )}
                </div>
                <div className="place-maps">
                  <a href="#" className="map-link">네이버지도</a>
                  <span className="separator"> | </span>
                  <a href="#" className="map-link">카카오맵</a>
                </div>
                <div className="place-actions">
                  <button 
                    className="add-to-group-btn"
                    onClick={() => handleAddPlaceToGroup(place.id)}
                  >
                    그룹에 추가
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : searchQuery ? (
          <div className="no-results">
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="default-results">
            <p>장소를 검색해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceGroupDetail;
