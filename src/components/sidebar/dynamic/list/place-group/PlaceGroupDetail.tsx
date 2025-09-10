import React, { useState, useEffect } from 'react';
import './PlaceGroupDetail.css';
import { placeAPI } from '../../../../../api/places';
import { PlaceGroup, Place } from '../../../../../../generated/dto';
import PlaceGroupPlaceItem from './PlaceGroupPlaceItem';
import PlaceDetail from '../place-detail/PlaceDetail';

interface PlaceGroupDetailProps {
  placeGroup: PlaceGroup;
  onBack: () => void;
  onGroupPlacesChange?: (places: Place[]) => void;
  onPlaceFocus?: (index: number) => void;
  onResetMap?: () => void;
  onFocusAllMarkers?: () => void;
}

const PlaceGroupDetail: React.FC<PlaceGroupDetailProps> = ({ placeGroup, onBack, onGroupPlacesChange, onPlaceFocus, onResetMap, onFocusAllMarkers }) => {
  const [activeButton, setActiveButton] = useState<string>('share');
  const [groupPlaces, setGroupPlaces] = useState<Place[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [focusedPlaceIndex, setFocusedPlaceIndex] = useState<number>(-1);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showPlaceDetail, setShowPlaceDetail] = useState<boolean>(false);

  // 카테고리 목록 생성
  const getCategories = (): string[] => {
    const categories = groupPlaces
      .map(place => place.categoryName)
      .filter((category, index, self) => self.indexOf(category) === index && category)
      .sort();
    return ['전체', ...categories];
  };

  // 필터링된 장소 목록
  const getFilteredPlaces = (): Place[] => {
    console.log('getFilteredPlaces', groupPlaces, selectedCategory);
    if (selectedCategory === '전체') {
      return groupPlaces;
    }
    return groupPlaces.filter(place => place.categoryName === selectedCategory);
  };

  // 카테고리 필터 핸들러
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  // PlaceGroupPlaceItem 클릭 핸들러
  const handlePlaceItemClick = (place: Place, index: number) => {
    console.log('PlaceGroupPlaceItem 클릭:', place, index);
    setFocusedPlaceIndex(index);
    setSelectedPlace(place);
    setShowPlaceDetail(true);
    // 부모 컴포넌트에 포커스 이벤트 전달 (searchResults.length + index로 전달)
    onPlaceFocus?.(index);
  };

  // PlaceDetail 닫기 핸들러
  const handleClosePlaceDetail = () => {
    console.log('PlaceDetail 닫기');
    setShowPlaceDetail(false);
    setSelectedPlace(null);
  };

  // 뒤로가기 핸들러 (마커 초기화 및 지도 위치 초기화 포함)
  const handleBack = () => {
    console.log('PlaceGroupDetail 뒤로가기 - 마커 초기화 및 지도 위치 초기화');
    // 포커스 상태 초기화
    setFocusedPlaceIndex(-1);
    // 그룹 장소 데이터 초기화 (마커 제거)
    onGroupPlacesChange?.([]);
    // 지도 위치를 대한민국 중심으로 초기화
    onResetMap?.();
    // PlaceDetail 닫기
    setShowPlaceDetail(false);
    setSelectedPlace(null);
    // 부모 컴포넌트의 뒤로가기 실행
    onBack();
  };


  // PlaceGroupDetail 진입 시 포커스 상태 초기화
  useEffect(() => {
    console.log('PlaceGroupDetail 진입: 포커스 상태 초기화');
    setFocusedPlaceIndex(-1);
    // 이전 포커스 상태 초기화
    onPlaceFocus?.(-1);
  }, [placeGroup.id, onPlaceFocus]);

  // 그룹의 장소들을 로드하는 useEffect
  useEffect(() => {
    loadGroupPlaces();
  }, [placeGroup.id]);

  // groupPlaces가 변경될 때마다 부모에게 전달
  useEffect(() => {
    onGroupPlacesChange?.(groupPlaces);
    
    // groupPlaces가 로드되면 모든 마커의 중심에 지도 이동
    if (groupPlaces.length > 0) {
      console.log('PlaceGroupDetail: groupPlaces 로드됨, 모든 마커 중심으로 지도 이동');
      onFocusAllMarkers?.();
    }
  }, [groupPlaces, onGroupPlacesChange, onFocusAllMarkers]);

  // 그룹의 장소들을 로드하는 함수
  const loadGroupPlaces = async () => {
    try {
      setIsLoadingPlaces(true);
      // GET /api/places/{placeGroupId} API 호출
      const result = await placeAPI.getPlacesByGroupId(placeGroup.id);
      
      console.log('그룹 장소 로드 결과:', result);
      
      if (result.data) {
        // API에서 받은 데이터를 Place 타입에 맞게 변환
        const resultPlaces: Place[] = result.data.places;
        
        setGroupPlaces(resultPlaces);
      } else {
        setGroupPlaces([]);
      }
    } catch (error) {
      console.error('그룹 장소 로드 실패:', error);
      setGroupPlaces([]);
    } finally {
      setIsLoadingPlaces(false);
    }
  };


  const handleButtonClick = async (buttonType: string) => {
    setActiveButton(buttonType);
  };

  return (
    <div className='list-create-wrap'>
      <div className='inside-nav'>
         <button className='trans' onClick={handleBack}><i className='ic-arrow-left-16' /></button>
        <h2>리스트 상세보기</h2>
      </div>
      <div>
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
              disabled
            />
            <button 
              className="search-button"
              disabled
            >
              <img src="/img/ico/ic-search.svg" alt="검색" />
            </button>
          </div>
          <div className="filter-sort-container">
            <div className="category-filters">
              {getCategories().map((category) => (
                <button
                  key={category}
                  className={`filter-tag ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                </button>
              ))}
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

        <div className="place-group-results">
          {isLoadingPlaces ? (
            <div className="loading-results">
              <p>장소를 불러오는 중...</p>
            </div>
          ) : getFilteredPlaces().length > 0 ? (
            <ul className="place-list">
              {getFilteredPlaces().map((place, index) => (
                <PlaceGroupPlaceItem
                  key={place.id || index}
                  place={place}
                  index={index}
                  onItemClick={handlePlaceItemClick}
                  isFocused={focusedPlaceIndex === index}
                />
              ))}
            </ul>
          ) : (  
            <div className="default-results">
              <p>이 그룹에 저장된 장소가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* PlaceDetail 모달 */}
      {showPlaceDetail && selectedPlace && (
        <PlaceDetail
          placeId={selectedPlace.locationId}
          onClose={handleClosePlaceDetail}
        />
      )}
    </div>
  );
};

export default PlaceGroupDetail;
