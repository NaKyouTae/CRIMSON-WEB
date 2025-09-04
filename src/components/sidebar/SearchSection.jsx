import React from 'react';
import './SearchSection.css';

const SearchSection = () => {
  return (
    <div className="search-section">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="장소를 검색해 보세요."
          className="search-input"
        />
        <button className="search-button">
          🔍
        </button>
      </div>
    </div>
  );
};

export default SearchSection;
