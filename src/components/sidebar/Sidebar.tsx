import React, { useState } from 'react';
import {
  TabNavigation,
  SearchSection,
  CreateSection,
  PlaceGroupSection,
  SearchResults,
  CreatePlaceGroupForm
} from './';
import PlaceGroupDetail from './dynamic/list/PlaceGroupDetail';
import './Sidebar.css';
import { placeAPI } from '../../api/places';
import { KakaoPlace, PlaceGroup } from '../../../generated/dto';


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
  onResetMap
}) => {
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [showPlaceGroupDetail, setShowPlaceGroupDetail] = useState<boolean>(false);
  const [selectedPlaceGroup, setSelectedPlaceGroup] = useState<PlaceGroup>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(15);
  const [searchResults, setSearchResults] = useState<KakaoPlace[]>([]);
  
  const handleSearch = async (query: string, page: number = 1) => {
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
      
      if (result.success) {
        // KakaoPlaceListResult에서 places 배열 추출
        const places = result.data?.places || [];
        setSearchResults(places);
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

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        />
      ) : (
        <div className='side-wrap'>
          <SearchSection onSearch={handleSearch} />
          <CreateSection onCreateClick={() => setShowCreateForm(true)} />
          {showSearchResults ? (
            <SearchResults 
              searchQuery=""
              results={searchResults}
              currentPage={currentPage}
              totalPages={1}
              onPageChange={handlePageChange}
              onItemClick={onPlaceClick}
              onPlaceFocus={onPlaceFocus}
              onResetMap={onResetMap}
            />
          ) : (
            <PlaceGroupSection 
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              onItemClick={handlePlaceGroupClick}
            />
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
