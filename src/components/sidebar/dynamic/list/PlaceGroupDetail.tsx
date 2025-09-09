import React, { useState, useEffect } from 'react';
import './PlaceGroupDetail.css';
import { Place, placeAPI } from '../../../../api/places';
import { showErrorMessage } from '../../../../utils/apiClient';
import PlaceItem from '../search/PlaceItem';
import { PlaceGroup } from '../../../../../generated/dto';


interface PlaceGroupDetailProps {
  placeGroup: PlaceGroup;
  onBack: () => void;
}

const PlaceGroupDetail: React.FC<PlaceGroupDetailProps> = ({ placeGroup, onBack }) => {
  const [activeButton, setActiveButton] = useState<string>('share');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [groupPlaces, setGroupPlaces] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(20);

  // 그룹의 장소들을 로드하는 useEffect
  useEffect(() => {
    loadGroupPlaces();
  }, [placeGroup.id]);

  // 그룹의 장소들을 로드하는 함수
  const loadGroupPlaces = async () => {
    try {
      setIsLoadingPlaces(true);
      // GET /api/places/{placeGroupId} API 호출
      const result = await placeAPI.getPlacesByGroupId(placeGroup.id);
      
      console.log('그룹 장소 로드 결과:', result);
      
      if (result.success && result.data) {
        // API에서 받은 데이터를 Place 타입에 맞게 변환
        const resultPlaces: Place[] = result.data.places.map(place => ({
          id: place.id,
          name: place.name,
          addressName: place.address, // Place 타입의 addressName
          address: place.address, // Place 타입의 address
          categoryName: place.category, // Place 타입의 categoryName
          category: place.category, // Place 타입의 category
          phone: place.phone || '',
          x: place.coordinates?.lng?.toString() || '0',
          y: place.coordinates?.lat?.toString() || '0',
          url: place.website || '',
        }));
        
        setGroupPlaces(resultPlaces);
      } else {
        setGroupPlaces([]);
        showErrorMessage(result.error || '그룹의 장소를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('그룹 장소 로드 실패:', error);
      showErrorMessage('그룹의 장소를 불러오는데 실패했습니다.');
      setGroupPlaces([]);
    } finally {
      setIsLoadingPlaces(false);
    }
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
        // PlaceListResult에서 places 배열 추출
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
        {isLoadingPlaces ? (
          <div className="loading-results">
            <p>장소를 불러오는 중...</p>
          </div>
        ) : groupPlaces.length > 0 ? (
          <ul className="place-list">
            {groupPlaces.map((place, index) => (
              <PlaceItem
                key={place.id || index}
                place={place}
                onItemClick={(place) => {
                  // 장소 클릭 시 상세보기 (필요시 구현)
                  console.log('장소 클릭:', place);
                }}
                onAddClick={(place) => {
                  // 장소를 그룹에서 제거 (필요시 구현)
                  console.log('장소 제거:', place);
                }}
                isFocused={false}
              />
            ))}
          </ul>
        ) : (
          <div className="default-results">
            <p>이 그룹에 저장된 장소가 없습니다.</p>
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
