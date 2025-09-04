import React from 'react';
import './PlaceItem.css';

const PlaceItem = ({ place, onItemClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case '영업중':
        return '#ff6b6b';
      case '오늘휴무':
        return '#999999';
      default:
        return '#666666';
    }
  };

  const getPinColor = (isSaved) => {
    return isSaved ? '#ff6b6b' : '#cccccc';
  };

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick(place);
    }
  };

  return (
    <div className="place-item" onClick={handleItemClick}>
      <div className="place-image">
        <img src={place.image} alt={place.name} />
      </div>
      <div className="place-content">
        <div className="place-header">
          <div className="place-name-section">
            <h4 className="place-name">{place.name}</h4>
            <span className="place-category">{place.category}</span>
          </div>
          <div 
            className="place-pin"
            style={{ color: getPinColor(place.isSaved) }}
          >
            📍
          </div>
        </div>
        <div className="place-status">
          <span 
            className="status-text"
            style={{ color: getStatusColor(place.status) }}
          >
            {place.status}
          </span>
          <span className="separator"> | </span>
          <span className="location">{place.location}</span>
        </div>
        <div className="place-meta">
          <span className="saved-count">저장 {place.savedCount}</span>
          {place.reviewCount > 0 && (
            <>
              <span className="separator"> · </span>
              <span className="review-count">리뷰 {place.reviewCount}</span>
            </>
          )}
        </div>
        <div className="place-maps">
          <span className="map-link">네이버지도</span>
          <span className="map-link">카카오맵</span>
        </div>
      </div>
    </div>
  );
};

export default PlaceItem;
