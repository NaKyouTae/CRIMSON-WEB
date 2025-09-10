import React from 'react';
import './PlaceGroupPlaceItem.css';
import { Place } from '../../../../../generated/dto';

interface PlaceItemProps {
  place: Place;
  index: number;
  onItemClick: (place: Place, index: number) => void;
  isFocused?: boolean;
}

const PlaceGroupPlaceItem: React.FC<PlaceItemProps> = ({ place, index, onItemClick, isFocused }) => {
  const getPinColor = (isSaved?: boolean): string => {
    return isSaved ? '#FF6002' : '#808991';
  };

  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onItemClick(place, index);
  };

  return (
    <div 
      className={`place-group-place-item ${isFocused ? 'focused' : ''}`}
      onClick={handleItemClick}
    >
      <div className="place-group-image">
        <img 
          src={"https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=60&h=60&fit=crop"} 
          alt={place.name} 
        />
      </div>
      <div className="place-group-content">
        <div className="place-group-header">
          <div className="place-group-name-section">
            <h4 className="place-group-name">{place.name}</h4>
            <span className="place-group-category">{place.categoryName}</span>
          </div>
          <div 
            className="place-group-pin" 
            style={{ color: getPinColor(place.phone.length > 0) }}
          >
            📍
          </div>
        </div>
        <div className="place-group-status">
          <span className="place-group-location">{place.phone}</span>
          <span className="place-group-separator"> | </span>
          <span className="place-group-location">{place.addressName}</span>
        </div>
        <div className="place-group-status">
          <span className="place-group-location">생성자 : {place.member?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default PlaceGroupPlaceItem;
