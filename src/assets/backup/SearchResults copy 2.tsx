import React from 'react';
import PlaceItem from '../../components/sidebar/dynamic/search/PlaceItem';
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
    <div className='cont-box'>
      <div className='title'>
        <h2>검색 결과</h2>
        <span>{results.length}건</span>
      </div>
      
      <ul className='place-list'>
        {results.map((place, index) => (
          <PlaceItem key={place.id || index} place={place} onItemClick={onItemClick} />
        ))}
      </ul>
      
      {totalPages > 1 && (

        <div className='pagination'>
          <button disabled><i className='ic-pagination first'></i></button>
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          ><i className='ic-pagination prev'></i></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
          <button 
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          ><i className='ic-pagination next'></i></button>
          <button disabled><i className='ic-pagination last'></i></button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
