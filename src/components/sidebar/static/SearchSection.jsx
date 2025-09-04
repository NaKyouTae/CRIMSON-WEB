import React, { useState } from 'react';
import './SearchSection.css';

const SearchSection = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('서교동');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-section">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="장소를 검색해 보세요."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="search-button" onClick={handleSearch}>
          🔍
        </button>
        <span className="search-count">102건</span>
      </div>
    </div>
  );
};

export default SearchSection;
