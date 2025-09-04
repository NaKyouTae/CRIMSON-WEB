import React, { useState } from 'react';
import { 
  SidebarHeader, 
  TabNavigation, 
  SearchSection, 
  CreateSection,
  PlaceGroupSection,
  SearchResults,
  CreatePlaceGroupForm
} from './';
import './Sidebar.css';

const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  activeFilter, 
  setActiveFilter, 
  sortOrder, 
  setSortOrder
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 샘플 검색 결과 데이터
  const sampleSearchResults = [
    {
      id: 1,
      name: '카페레터',
      category: '카페',
      status: '영업중',
      location: '서울시 마포구 서교동',
      savedCount: 3,
      reviewCount: 1,
      isSaved: true,
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=120&h=120&fit=crop'
    },
    {
      id: 2,
      name: '선비다이닝',
      category: '요리주점',
      status: '오늘휴무',
      location: '서울시 마포구 서교동',
      savedCount: 1,
      reviewCount: 0,
      isSaved: false,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&h=120&fit=crop'
    },
    {
      id: 3,
      name: '카페레터',
      category: '카페',
      status: '영업중',
      location: '서울시 마포구 서교동',
      savedCount: 3,
      reviewCount: 1,
      isSaved: true,
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=120&h=120&fit=crop'
    },
    {
      id: 4,
      name: '선비다이닝',
      category: '요리주점',
      status: '오늘휴무',
      location: '서울시 마포구 서교동',
      savedCount: 1,
      reviewCount: 0,
      isSaved: false,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&h=120&fit=crop'
    },
    {
      id: 5,
      name: '카페레터',
      category: '카페',
      status: '영업중',
      location: '서울시 마포구 서교동',
      savedCount: 3,
      reviewCount: 1,
      isSaved: true,
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=120&h=120&fit=crop'
    },
    {
      id: 6,
      name: '선비다이닝',
      category: '요리주점',
      status: '오늘휴무',
      location: '서울시 마포구 서교동',
      savedCount: 1,
      reviewCount: 0,
      isSaved: false,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&h=120&fit=crop'
    }
  ];

  const handleCreateClick = () => {
    setShowCreateForm(true);
    setShowSearchResults(false);
  };

  const handleBackToList = () => {
    setShowCreateForm(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowSearchResults(true);
    setShowCreateForm(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="sidebar">
      <SidebarHeader />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {showCreateForm ? (
        <CreatePlaceGroupForm onBack={handleBackToList} />
      ) : (
        <>
          <SearchSection onSearch={handleSearch} />
          <CreateSection onCreateClick={handleCreateClick} />
          {showSearchResults ? (
            <SearchResults 
              searchQuery={searchQuery}
              results={sampleSearchResults}
              currentPage={currentPage}
              totalPages={10}
              onPageChange={handlePageChange}
            />
          ) : (
            <PlaceGroupSection 
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Sidebar;
