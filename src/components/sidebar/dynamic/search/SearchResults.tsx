import React from 'react';
import PlaceItem from './PlaceItem';
import './SearchResults.css';
import { KakaoPlace } from '../../../../../generated/dto';

interface SearchResultsProps {
  searchQuery: string;
  results: KakaoPlace[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onItemClick: (place: KakaoPlace) => void;
  onPlaceFocus?: (index: number) => void;
  onResetMap?: () => void;
  onAddClick?: (place: KakaoPlace) => void;
  focusedPlaceIndex?: number;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  currentPage, 
  totalPages, 
  onPageChange, 
  onItemClick,
  onPlaceFocus,
  onResetMap,
  onAddClick,
  focusedPlaceIndex
}) => {
  return (
    <div className='cont-box'>
      <div className='title'>
        <h2>검색 결과</h2>
        {onResetMap && (<a onClick={onResetMap} title="지도를 원래 상태로 복원">원위치</a>)}
        <div className='title-actions'>
          <span>{results.length}건</span>
        </div>
      </div>
      <ul className='place-list'>
        {results.map((place, index) => (
          <PlaceItem 
            key={place.id || index} 
            place={place} 
            onItemClick={(place) => {
              onItemClick(place);
              onPlaceFocus?.(index);
            }}
            onAddClick={onAddClick}
            isFocused={focusedPlaceIndex === index}
          />
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
