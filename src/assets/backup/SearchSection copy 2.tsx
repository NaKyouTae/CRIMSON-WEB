import React, { useState } from 'react';
import './SearchSection.css';

interface SearchSectionProps {
  onSearch: (query: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>('서교동');

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

  return (
    <div className='search-wrap'>
      <input type='text' placeholder='장소를 검색해 보세요.'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button className='trans' onClick={handleSearch}><i className='ic-search' /></button>
    </div>
  );
};

export default SearchSection;
