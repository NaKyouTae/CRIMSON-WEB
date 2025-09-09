import React from 'react';
import './PlaceItem.css';
import { KakaoPlace } from '../../../../../generated/dto';

interface PlaceItemProps {
  place: KakaoPlace;
  onItemClick: (place: KakaoPlace) => void;
  isFocused?: boolean;
}

const PlaceItem: React.FC<PlaceItemProps> = ({ place, onItemClick, isFocused }) => {
  const getPinColor = (isSaved?: boolean): string => {
    return isSaved ? '#FF6002' : '#808991';
  };

  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onItemClick(place);
  };

  return (
    <div 
      className={`place-item ${isFocused ? 'focused' : ''}`}
      onClick={handleItemClick}
    >
      <div className="place-image">
        <img 
          src={"https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=60&h=60&fit=crop"} 
          alt={place.name} 
        />
      </div>
      <div className="place-content">
        <div className="place-header">
          <div className="place-name-section">
            <h4 className="place-name">{place.name}</h4>
            <span className="place-category">{place.categoryGroupName}</span>
          </div>
          <div 
            className="place-pin" 
            style={{ color: getPinColor(place.phone.length > 0) }}
          >
            📍
          </div>
        </div>
        <div>
          <span className="place-category">{place.categoryName}</span>
        </div>
        <div className="place-status">
          <span className="location">{place.phone}</span>
          <span className="separator"> | </span>
          <span className="location">{place.addressName}</span>
        </div>
        <div className="place-maps">
          <a href={place.url} target="_blank" rel="noopener noreferrer" className="map-link">카카오맵</a>
        </div>
      </div>
    </div>
  );
};

export default PlaceItem;
