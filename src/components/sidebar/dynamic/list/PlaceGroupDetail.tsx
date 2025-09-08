import React, { useState } from 'react';
import './PlaceGroupDetail.css';
import { placeAPI } from '../../../../api/places';
import { showSuccessMessage, showErrorMessage } from '../../../../utils/apiClient';
import { KakaoPlace, PlaceGroup } from '../../../../../generated/dto';


interface PlaceGroupDetailProps {
  placeGroup: PlaceGroup;
  onBack: () => void;
}

const PlaceGroupDetail: React.FC<PlaceGroupDetailProps> = ({ placeGroup, onBack }) => {
  const [activeButton, setActiveButton] = useState<string>('share');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<KakaoPlace[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(20);

  // 네이버지도 링크 생성 함수 (매장명 + 위경도 조합)
  const generateNaverMapUrl = (place: KakaoPlace): string => {
    const placeName = encodeURIComponent(place.name);
    const coordinates = `${place.y},${place.x}`;
    
    // 매장명과 좌표를 함께 사용하여 더 정확한 검색
    return `https://map.naver.com/v5/search/${placeName}@${coordinates}`;
  };

  const handleButtonClick = async (buttonType: string) => {
    setActiveButton(buttonType);
  };

  // 검색 기능
  const handleSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setSearchResults([]);
      setCurrentPage(1);
      setTotalPages(1);
      return;
    }

    setIsSearching(true);
    try {
      const result = await placeAPI.searchPlacesByKeyword({
        query: query.trim(),
        page: page,
        size: pageSize
      });
      
      if (result.success) {
        // KakaoPlaceListResult에서 places 배열 추출
        const places = result.data?.places || [];
        setSearchResults(places);
        setCurrentPage(page);
        // API 응답에서 총 페이지 수를 가져오거나 계산
        // 실제 API 응답 구조에 따라 조정 필요
        setTotalPages(Math.ceil(places.length / pageSize));
      } else {
        showErrorMessage(result.error || '검색 중 오류가 발생했습니다.');
        setSearchResults([]);
        setCurrentPage(1);
        setTotalPages(1);
      }
    } catch (error: any) {
      showErrorMessage(`검색 중 오류가 발생했습니다: ${error.message}`);
      setSearchResults([]);
      setCurrentPage(1);
      setTotalPages(1);
    } finally {
      setIsSearching(false);
    }
  };

  // 검색 입력 핸들러
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  // 엔터키 검색 핸들러
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(searchQuery, 1);
    }
  };

  // 돋보기 아이콘 클릭 핸들러
  const handleSearchClick = () => {
    handleSearch(searchQuery, 1);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      handleSearch(searchQuery, page);
    }
  };

  // 장소를 PlaceGroup에 추가
  const handleAddPlaceToGroup = async (placeId: string) => {
    try {
      // TODO: placeGroupsAPI.addPlaceToGroup 함수가 구현되면 사용
      // const result = await placeGroupsAPI.addPlaceToGroup(placeGroup.id, { placeId });
      
      // 임시로 성공 메시지만 표시
      showSuccessMessage('장소가 PlaceGroup에 추가되었습니다.');
      // 검색 결과에서 제거
      setSearchResults(prev => prev.filter(place => place.id !== placeId));
      
      // 실제 API 호출 시 아래 코드 사용
      // if (result.success) {
      //   showSuccessMessage('장소가 PlaceGroup에 추가되었습니다.');
      //   setSearchResults(prev => prev.filter(place => place.id !== placeId));
      // } else {
      //   showErrorMessage(result.error || '장소 추가 중 오류가 발생했습니다.');
      // }
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
        <div className="place-group-icon-large">{placeGroup.icon}</div>
        <div className="place-group-content-large">
          <h3 className="place-group-title">{placeGroup.name}</h3>
          <p className="place-group-description">{placeGroup.memo}</p>
          <div className="place-group-link">
            <span className="link-icon">🔗</span>
            <a href="#" className="link-url">{placeGroup.link}</a>
          </div>
          <div className="place-group-meta-large">
            <span className="role-badge captain">{placeGroup.status}</span>
            <span className="separator">|</span>
            <span className="category-badge">{placeGroup.category}</span>
            <span className="separator">|</span>
            <span className="privacy-badge">{placeGroup.status}</span>
            <span className="separator">|</span>
            <span className="members-badge">멤버 {placeGroup.status}</span>
            <span className="separator">|</span>
            <span className="saved-badge">저장 {placeGroup.status}</span>
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
            placeholder="원하는 장소를 검색해 보세요."
            className="search-input"
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyPress={handleSearchKeyPress}
          />
          <button 
            className="search-button"
            onClick={handleSearchClick}
            disabled={isSearching}
          >
            <img src="/img/ico/ic-search.svg" alt="검색" />
          </button>
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
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=60&h=60&fit=crop" 
                  alt={place.name} 
                />
              </div>
              <div className="place-content">
                <div className="place-header">
                  <div className="place-name-section">
                    <h4 className="place-name">{place.name}</h4>
                    <span className="place-category">{place.categoryName}</span>
                  </div>
                  <div className="place-pin" style={{ color: '#ff6b6b' }}>📍</div>
                </div>
                <div className="place-status">
                  <span className="status-text" style={{ color: '#ff6b6b' }}>
                    영업중
                  </span>
                  <span className="separator"> | </span>
                  <span className="location">{place.addressName}</span>
                </div>
                <div className="place-meta">
                  <span className="category-group">{place.categoryGroupName}</span>
                  {place.phone && (
                    <>
                      <span className="separator"> | </span>
                      <span className="phone">{place.phone}</span>
                    </>
                  )}
                </div>
                <div className="place-maps">
                  <a href={place.url} className="map-link" target="_blank" rel="noopener noreferrer">카카오맵</a>
                  <span className="separator"> | </span>
                  <a 
                    href={generateNaverMapUrl(place)} 
                    className="map-link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    네이버지도
                  </a>
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

      {/* 페이지네이션 */}
      {searchResults.length > 0 && totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <img src="/img/ico/ic-pagination-prev.svg" alt="이전" />
          </button>
          
          <div className="pagination-info">
            <span>{currentPage} / {totalPages}</span>
          </div>
          
          <button 
            className="pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <img src="/img/ico/ic-pagination-next.svg" alt="다음" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaceGroupDetail;
