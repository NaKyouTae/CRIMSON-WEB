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

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  onPlaceClick: (place: Place) => void;
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
  const [selectedPlaceGroup, setSelectedPlaceGroup] = useState<PlaceGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 샘플 검색 결과 데이터
  const sampleSearchResults: Place[] = [
    {
      id: '1',
      name: '카페레터',
      address: '서울 마포구 독막로3길 28-20 1층',
      category: '카페',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=150&fit=crop',
      isOpen: true,
      savedCount: 42,
      reviewCount: 15,
      rating: 4.5
    },
    {
      id: '2',
      name: '스타벅스 홍대점',
      address: '서울 마포구 어울마당로 123',
      category: '카페',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce729b77?w=200&h=150&fit=crop',
      isOpen: true,
      savedCount: 128,
      reviewCount: 89,
      rating: 4.2
    },
    {
      id: '3',
      name: '투썸플레이스',
      address: '서울 마포구 양화로 188',
      category: '카페',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=150&fit=crop',
      isOpen: false,
      savedCount: 67,
      reviewCount: 23,
      rating: 4.0
    }
  ];

  // 검색 핸들러
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
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
    setSelectedPlaceGroup(null);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="sidebar">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {showCreateForm ? (
        <CreatePlaceGroupForm onBack={handleBackToList} />
      ) : showPlaceGroupDetail ? (
        <PlaceGroupDetail 
          placeGroup={selectedPlaceGroup} 
          onBack={handleBackFromPlaceGroupDetail} 
        />
      ) : (
        <>
          <SearchSection onSearch={handleSearch} />
          <CreateSection onCreateClick={() => setShowCreateForm(true)} />
          {showSearchResults ? (
            <SearchResults 
              searchQuery={searchQuery}
              results={sampleSearchResults}
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
        </>
      )}
    </div>
  );
};

export default Sidebar;
