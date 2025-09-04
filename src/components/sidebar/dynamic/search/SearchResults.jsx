import React from 'react';
import PlaceItem from './PlaceItem';
import './SearchResults.css';

const SearchResults = ({ searchQuery, results, currentPage, totalPages, onPageChange, onItemClick }) => {
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
            className="pagination-btn"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            &lt;&lt;
          </button>
          <button 
            className="pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          
          {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button 
            className="pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
          <button 
            className="pagination-btn"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
