import React from 'react';
import PlaceItem from './KakaoPlaceItem';
import './SearchResults.css';

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

interface SearchResultsProps {
  searchQuery: string;
  results: Place[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onItemClick: (place: Place) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  searchQuery, 
  results, 
  currentPage, 
  totalPages, 
  onPageChange, 
  onItemClick 
}) => {
  return (
    <div className="search-results">
      <div className="search-results-header">
        <h3>검색 결과</h3>
        <span className="results-count">{results.length}건</span>
      </div>
      
      <div className="place-list">
        {results.map((place, index) => (
          <PlaceItem key={place.id || index} place={place} onItemClick={onItemClick} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            이전
          </button>
          
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button 
            className="pagination-button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
