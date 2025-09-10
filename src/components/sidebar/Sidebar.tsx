import React, { useState } from 'react';
import TabNavigation from './static/TabNavigation';
import SearchSection from './static/SearchSection';
import CreateSection from './static/CreateSection';
import SearchResults from './dynamic/search/SearchResults';
import CreatePlaceGroupForm from './dynamic/create/CreatePlaceGroupForm';
import PlaceGroupDetail from './dynamic/list/place-group/PlaceGroupDetail';
import PlaceGroupSection from './dynamic/list/place-group/PlaceGroupSection';
import './Sidebar.css';
import { placeAPI } from '../../api/places';
import { KakaoPlace, PlaceGroup, Place, KakaoPlaceMeta } from '../../../generated/dto';


interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  onPlaceClick: (place: KakaoPlace) => void;
  onSearchResults?: (results: KakaoPlace[]) => void;
  onPlaceFocus?: (index: number) => void;
  onResetMap?: () => void;
  onAddClick?: (place: KakaoPlace) => void;
  focusedPlaceIndex?: number;
  onGroupPlacesChange?: (places: Place[]) => void;
  onFocusAllMarkers?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  activeFilter, 
  setActiveFilter, 
  sortOrder, 
  setSortOrder,
  onPlaceClick,
  onSearchResults,
  onPlaceFocus,
  onResetMap,
  onAddClick,
  focusedPlaceIndex,
  onGroupPlacesChange,
  onFocusAllMarkers
}) => {
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [showPlaceGroupDetail, setShowPlaceGroupDetail] = useState<boolean>(false);
  const [selectedPlaceGroup, setSelectedPlaceGroup] = useState<PlaceGroup>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(15);
  const [searchResults, setSearchResults] = useState<KakaoPlace[]>([]);
  const [searchResultsMeta, setSearchResultsMeta] = useState<KakaoPlaceMeta | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const handleSearch = async (query: string, page: number = 1) => {
    // searchQuery 상태 업데이트
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setCurrentPage(1);
      return;
    }

    setShowSearchResults(true);
    try {
      const result = await placeAPI.searchPlacesByKeyword({
        query: query.trim(),
        page: page,
        size: pageSize
      });

      console.log('Search results:', result);
      
      if (result.data) {
        // KakaoPlaceListResult에서 places 배열 추출
        const places = result.data?.places || [];
        console.log('Places:', places);
        setSearchResults(places);
        setSearchResultsMeta(result.data?.meta);
        setCurrentPage(page);
        
        // 검색 결과를 부모 컴포넌트로 전달
        if (onSearchResults) {
          onSearchResults(places);
        }
      } else {      
        setSearchResults([]);
        setCurrentPage(1);
        
        // 빈 결과를 부모 컴포넌트로 전달
        if (onSearchResults) {
          onSearchResults([]);
        }
      }
    } catch (error: any) {
      setSearchResults([]);
      setCurrentPage(1);
      
      // 에러 시 빈 결과를 부모 컴포넌트로 전달
      if (onSearchResults) {
        onSearchResults([]);
      }
    }
  };

  // PlaceGroup 클릭 핸들러
  const handlePlaceGroupClick = (placeGroup: PlaceGroup) => {
    setSelectedPlaceGroup(placeGroup);
    setShowPlaceGroupDetail(true);
  };

  // 뒤로가기 핸들러들
  const handleBackToList = () => {
    setShowCreateForm(false);
  };

  const handleBackFromPlaceGroupDetail = () => {
    setShowPlaceGroupDetail(false);
    setSelectedPlaceGroup(undefined);
  };

  const handleClearSearch = () => {
    console.log('검색 초기화');
    setSearchQuery(''); // searchQuery 초기화
    setSearchResults([]);
    setShowSearchResults(false);
    setCurrentPage(1);
    
    // 부모 컴포넌트에 빈 결과 전달
    if (onSearchResults) {
      onSearchResults([]);
    }
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleSearch(searchQuery, page);
  };

  return (
    <aside>
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {showCreateForm ? (
        <CreatePlaceGroupForm onBack={handleBackToList} />
      ) : showPlaceGroupDetail ? (
        <PlaceGroupDetail 
          placeGroup={selectedPlaceGroup!} 
          onBack={handleBackFromPlaceGroupDetail}
          onGroupPlacesChange={onGroupPlacesChange}
          onPlaceFocus={onPlaceFocus}
          onResetMap={onResetMap}
          onFocusAllMarkers={onFocusAllMarkers}
        />
      ) : (
        <div className='side-wrap'>
          <SearchSection 
            searchQuery={searchQuery}
            onSearch={handleSearch} 
            hasSearchResults={showSearchResults && searchResults.length > 0}
            onClearSearch={handleClearSearch}
            onSearchQueryChange={handleSearchQueryChange}
          />
          <CreateSection onCreateClick={() => setShowCreateForm(true)} />
          {showSearchResults ? (
            <SearchResults 
              searchQuery=""
              results={searchResults}
              currentPage={currentPage}
              totalPages={searchResultsMeta?.totalCount ? Math.ceil(searchResultsMeta.totalCount / pageSize) : 1}
              onPageChange={handlePageChange}
              onItemClick={onPlaceClick}
              onPlaceFocus={onPlaceFocus}
              onResetMap={onResetMap}
              onAddClick={onAddClick}
              focusedPlaceIndex={focusedPlaceIndex}
            />
          ) : (
            <PlaceGroupSection 
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              onItemClick={handlePlaceGroupClick}
              pageSize={pageSize}
            />
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
