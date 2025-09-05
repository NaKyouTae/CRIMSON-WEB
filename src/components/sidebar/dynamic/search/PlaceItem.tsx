import React from 'react';
import './PlaceItem.css';

// 타입 정의
interface Place {
  id: string;
  name: string;
  address: string;
  category: string;
  image?: string;
  isOpen?: boolean;
  isSaved?: boolean;
  status?: string;
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

interface PlaceItemProps {
  place: Place;
  onItemClick: (place: Place) => void;
}

const PlaceItem: React.FC<PlaceItemProps> = ({ place, onItemClick }) => {
  const getStatusColor = (status?: string): string => {
    switch (status) {
      case '영업중':
        return '#ff6b6b';
      case '오늘휴무':
        return '#999999';
      default:
        return '#666666';
    }
  };

  const getPinColor = (isSaved?: boolean): string => {
    return isSaved ? '#ff6b6b' : '#cccccc';
  };

  const handleItemClick = () => {
    onItemClick(place);
  };

  return (
    <div className="place-item" onClick={handleItemClick}>
      <div className="place-image">
        <img 
          src={place.image || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=60&h=60&fit=crop"} 
          alt={place.name} 
        />
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
            {place.status || (place.isOpen ? '영업중' : '휴무')}
          </span>
          <span className="separator"> | </span>
          <span className="location">{place.address}</span>
        </div>
        <div className="place-meta">
          <span className="saved">저장 {place.savedCount || 0}</span>
          {place.reviewCount && place.reviewCount > 0 && (
            <>
              <span className="separator"> | </span>
              <span className="reviews">리뷰 {place.reviewCount}</span>
            </>
          )}
        </div>
        <div className="place-maps">
          <a href="#" className="map-link">네이버지도</a>
          <span className="separator"> | </span>
          <a href="#" className="map-link">카카오맵</a>
        </div>
      </div>
    </div>
  );
};

export default PlaceItem;
