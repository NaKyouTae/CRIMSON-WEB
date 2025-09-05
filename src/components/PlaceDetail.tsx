import React, { useState } from 'react';
import './PlaceDetail.css';

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

interface PlaceDetailProps {
  place: Place;
  onClose: () => void;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

const PlaceDetail: React.FC<PlaceDetailProps> = ({ place, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('menu');

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

  // 샘플 메뉴 데이터
  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: '스카치밀크커피',
      description: '달콤한 스카치 캬라멜 향의 크림 커피',
      price: '6,000원',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=150&fit=crop'
    },
    {
      id: 2,
      name: '크로와상',
      description: '결이 하나하나 살아있는 크로와상',
      price: '3,800원',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&h=150&fit=crop'
    },
    {
      id: 3,
      name: '스카치밀크커피',
      description: '달콤한 스카치 캬라멜 향의 크림 커피',
      price: '6,000원',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=150&fit=crop'
    },
    {
      id: 4,
      name: '크로와상',
      description: '결이 하나하나 살아있는 크로와상',
      price: '3,800원',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&h=150&fit=crop'
    }
  ];

  return (
    <div className="place-detail">
      <div className="place-image-large">
        <img src={place.image} alt={place.name} />
        <button className="close-button" onClick={onClose}>✕</button>
      </div>

      <div className="detail-content">

        <div className="place-info">
          <div className="place-name-section">
            <h2 className="place-name-large">{place.name}</h2>
            <span 
              className="place-pin-large"
              style={{ color: getPinColor(place.isSaved) }}
            >
              📍
            </span>
          </div>
          <div className="place-category-large">{place.category}</div>
          
          <div className="place-address">
            서울 마포구 독막로3길 28-20 1층
          </div>

          <div className="place-hours">
            <span 
              className="status-text-large"
              style={{ color: getStatusColor(place.status) }}
            >
              {place.status}
            </span>
            <span className="hours-separator"> | </span>
            <span className="hours-text">매일 11:00 ~ 22:00</span>
            <span className="dropdown-arrow">▼</span>
          </div>

          <div className="place-social">
            <span className="social-icon">🔗</span>
            <a href="#" className="social-link">www.instagram.com/cafeletter_hapjeong</a>
          </div>

          <div className="place-features">
            <button className="feature-tag">포장</button>
            <button className="feature-tag">예약</button>
            <button className="feature-tag">주차</button>
            <button className="feature-tag">애견동반</button>
            <button className="feature-tag">단체</button>
          </div>

          <div className="place-actions">
            <button className="share-button">공유</button>
            <button className="map-button naver">네이버지도</button>
            <button className="map-button kakao">카카오맵</button>
          </div>

          <div className="detail-tabs-content">
            <button 
              className={`content-tab ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              메뉴
            </button>
            <button 
              className={`content-tab ${activeTab === 'review' ? 'active' : ''}`}
              onClick={() => setActiveTab('review')}
            >
              리뷰
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'menu' && (
              <div className="menu-content">
                {menuItems.map((item) => (
                  <div key={item.id} className="menu-item">
                    <div className="menu-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="menu-info">
                      <h4 className="menu-name">{item.name}</h4>
                      <p className="menu-description">{item.description}</p>
                      <span className="menu-price">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'review' && (
              <div className="review-content">
                <p>리뷰 내용이 여기에 표시됩니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;
