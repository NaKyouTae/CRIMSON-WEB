import React from 'react';
import './KakaoPlaceItem.css';
import { KakaoPlace } from '../../../../../../generated/dto';

interface PlaceItemProps {
  place: KakaoPlace;
  onItemClick: (place: KakaoPlace) => void;
  onAddClick?: (place: KakaoPlace) => void;
  isFocused?: boolean;
}

const KakaoPlaceItem: React.FC<PlaceItemProps> = ({ place, onItemClick, onAddClick, isFocused }) => {
  const getPinColor = (isSaved?: boolean): string => {
    return isSaved ? '#FF6002' : '#808991';
  };

  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onItemClick(place);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddClick?.(place);
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
            <span className="place-category">{place.categoryName}</span>
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
        <div className="place-actions">
          {onAddClick && (
            <button className="add-btn" type="button"
              onClick={handleAddClick}
              title="장소 그룹에 추가"
            >
              ➕ 추가
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KakaoPlaceItem;
