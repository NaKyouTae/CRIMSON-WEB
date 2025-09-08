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
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  activeFilter, 
  setActiveFilter, 
  sortOrder, 
  setSortOrder,
  onPlaceClick
}) => {
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [showPlaceGroupDetail, setShowPlaceGroupDetail] = useState<boolean>(false);
  const [selectedPlaceGroup, setSelectedPlaceGroup] = useState<PlaceGroup>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(15);
  const [searchResults, setSearchResults] = useState<KakaoPlace[]>([]);
  
  const handleSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setSearchResults([]);
      setCurrentPage(1);
      setTotalPages(1);
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
        // API 응답에서 총 페이지 수를 가져오거나 계산
        // 실제 API 응답 구조에 따라 조정 필요
        setTotalPages(Math.ceil(places.length / pageSize));
      } else {      
        setSearchResults([]);
        setCurrentPage(1);
        setTotalPages(1);
      }
    } catch (error: any) {
      setSearchResults([]);
      setCurrentPage(1);
      setTotalPages(1);
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
              searchQuery={searchQuery}
              results={searchResults}
              currentPage={currentPage}
              totalPages={10}
              onPageChange={handlePageChange}
              onItemClick={onPlaceClick}
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
