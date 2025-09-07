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
        return '#FF6002';
      case '오늘휴무':
        return '#808991';
      default:
        return '#515C66';
    }
  };

  const getPinColor = (isSaved?: boolean): string => {
    return isSaved ? '#FF6002' : '#808991';
  };

  const handleItemClick = () => {
    onItemClick(place);
  };

  return (
    <li onClick={handleItemClick}>
      <div className='img'>
        <img 
          src={place.image || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=60&h=60&fit=crop"} 
          alt={place.name} 
        />
      </div>
      <div className='txt'>
        <div>
          <div>
            <p>{place.name}</p>
            <ul>
              <li>{place.category}</li>
              <li style={{ color: getStatusColor(place.status) }}>{place.status || (place.isOpen ? '영업중' : '오늘휴무')}</li>
            </ul>
          </div>
          {/* case01 : 저장 안 된 장소 */}
          <button className='trans'><i className='ic-spot' /></button>
          {/* case02 : 저장 된 장소 */}
          {/* <button className='trans'><i className='ic-spot' /></button> */}
        </div>
        <p>{place.address}</p>
        <ul className='meta'>
          <li><p>저장</p> <span>{place.savedCount || 0}</span></li>
          {place.reviewCount && place.reviewCount > 0 && (
            <li><p>리뷰</p> <span>{place.reviewCount}</span></li>
          )}
        </ul>
        <ul className='link'>
          <li><a href='#'>네이버지도</a></li>
          <li><a href='#'>카카오맵</a></li>
        </ul>
      </div>
    </li>
  );
};

export default PlaceItem;
