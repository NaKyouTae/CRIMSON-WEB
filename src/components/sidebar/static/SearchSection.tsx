import React from 'react';
import './SearchSection.css';

interface SearchSectionProps {
  searchQuery?: string;
  onSearch: (query: string) => void;
  hasSearchResults?: boolean;
  onClearSearch?: () => void;
  onSearchQueryChange?: (query: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ searchQuery = '', onSearch, hasSearchResults = false, onClearSearch, onSearchQueryChange }) => {

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    onClearSearch?.();
  };

  const handleButtonClick = () => {
    if (hasSearchResults) {
      handleClearSearch();
    } else {
      handleSearch();
    }
  };

  return (
    <div className='search-wrap'>
      <input type='text' placeholder='장소를 검색해 보세요.'
        value={searchQuery}
        onChange={(e) => onSearchQueryChange?.(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button className='trans' onClick={handleButtonClick}>
        <i className={hasSearchResults ? 'ic-close-20' : 'ic-search'} />
      </button>
    </div>
  );
};

export default SearchSection;
