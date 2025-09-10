import React from 'react';
import KakaoPlaceItem from './KakaoPlaceItem';
import Pagination from '../../../../common/Pagination';
import './SearchResults.css';
import { KakaoPlace } from '../../../../../../generated/dto';

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
      <div className='place-list'>
        {results.map((place, index) => (
          <KakaoPlaceItem 
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
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default SearchResults;
