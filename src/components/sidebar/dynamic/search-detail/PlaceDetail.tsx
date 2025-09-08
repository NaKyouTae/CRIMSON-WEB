import React from 'react';
import './PlaceDetail.css';
import { KakaoPlace } from '../../../../../generated/dto';

interface PlaceDetailProps {
  place: KakaoPlace;
  onClose: () => void;
}

const PlaceDetail: React.FC<PlaceDetailProps> = ({ place, onClose }) => {
  // 카카오 플레이스 iframe 컴포넌트
  const KakaoPlaceIframe = () => (
    <div className="kakao-place-container">
      <iframe
        src={`https://place.map.kakao.com/${place.id}`}
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

  // 기본 상세보기 모드
  return (
    <div className='place-detail kakao-place-mode'>
      <div className='place-detail-close'>
        <button onClick={onClose}><i className='ic-close-20' /></button>
      </div>
      <KakaoPlaceIframe />
    </div>
  );
};

export default PlaceDetail;
