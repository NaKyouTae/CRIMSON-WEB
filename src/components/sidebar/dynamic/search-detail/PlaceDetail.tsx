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
  kakaoPlaceId?: string; // 카카오 플레이스 ID 추가
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
  const [viewMode, setViewMode] = useState<'detail' | 'kakao'>('kakao'); // 상세보기 또는 카카오 플레이스 모드

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


  // 카카오 플레이스 URL 생성
  const getKakaoPlaceUrl = (): string => {
    return `https://place.map.kakao.com/${place.id}`;
  };

  // 카카오 플레이스 iframe 컴포넌트
  const KakaoPlaceIframe = () => (
    <div className="kakao-place-container">
      <iframe
        src={getKakaoPlaceUrl()}
        width="100%"
        height="100%"
        title={`${place.name} - 카카오 플레이스`}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        style={{
          border: 'none',
          borderRadius: '8px',
          minHeight: '600px'
        }}
      />
    </div>
  );

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

  // 카카오 플레이스 모드일 때 iframe 표시
  if (viewMode === 'kakao') {
    return (
      <div className='place-detail kakao-place-mode'>
        <div className='place-detail-close'>
          <button onClick={onClose}><i className='ic-close-20' /></button>
        </div>
        <KakaoPlaceIframe />
      </div>
    );
  }

  // 기본 상세보기 모드
  return (
    <div className='place-detail'>
      <div className='place-detail-close'>
        <button onClick={onClose}><i className='ic-close-20' /></button>
      </div>
      <div className='place-summary'>
        <div className='img'><img src={place.image} alt={place.name} /></div>
        <div className='desc'>
          <div className='name'>
            <div>
              <p>{place.name}</p>
              <span>{place.category}</span>
            </div>
            {/* case01 : 저장 안 된 장소 */}
            <button className='trans'><i className='ic-spot' /></button>
            {/* case02 : 저장 된 장소 */}
            {/* <button className='trans'><i className='ic-spot' /></button> */}
          </div>
          <div className='info'>
            <p>{place.address}</p>
            <ul className='state'>
              <li style={{ color: getStatusColor(place.status) }}>{place.status || (place.isOpen ? '영업중' : '오늘휴무')}</li>
              <li className='time'><p>매일 11:00 ~ 22:00</p></li>
            </ul>
            <a href='#'><i className='ic-link' />www.instagram.com/cafeletter_hapjeong</a>
            <ul className='tag'>
              <li>포장</li>
              <li>예약</li>
              <li>주차</li>
              <li>애견동반</li>
              <li>단체</li>
            </ul>
          </div>
          <div className='btn'>
            <button className='md'>공유</button>
            <button className='md'><i className='ic-map-naver' />네이버지도</button>
            <button className='md'><i className='ic-map-kakao' />카카오맵</button>
            <button 
              className='md kakao-place-btn'
              onClick={() => setViewMode('kakao')}
            >
              <i className='ic-map-kakao' />카카오 플레이스 보기
            </button>
          </div>
        </div>
      </div>
      <div className='place-wrap'>
        <div className='tab-style2'>
          <button 
            className={`${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            메뉴
          </button>
          <button 
            className={`${activeTab === 'review' ? 'active' : ''}`}
            onClick={() => setActiveTab('review')}
          >
            리뷰
          </button>
        </div>
        {activeTab === 'menu' && (
          <div className='tab-sub-cont'>
            <ul className='menu-list'>
              {menuItems.map((item) => (
                <li key={item.id}>
                  <div className='img'><img src={item.image} alt={item.name} /></div>
                  <div className='desc'>
                    <div>
                      <p>{item.name}</p>
                      <span>{item.description}</span>
                    </div>
                    <p>{item.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {activeTab === 'review' && (
          <div className='tab-sub-cont'>
            <div className='empty'>
              <i className='ic-ghost' />
              <p>등록된 리뷰가 없어요.<br/>제일 먼저 리뷰를 남겨주세요!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceDetail;
