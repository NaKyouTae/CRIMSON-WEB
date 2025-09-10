import React from 'react';
import './PlaceDetail.css';

interface PlaceDetailProps {
  placeId: string;
  onClose: () => void;
}

const PlaceDetail: React.FC<PlaceDetailProps> = ({ placeId, onClose }) => {
  // 카카오 플레이스 iframe 컴포넌트
  const KakaoPlaceIframe = () => (
    <div className="kakao-place-container">
      <iframe
        src={`https://place.map.kakao.com/${placeId}`}
        width="100%"
        height="100%"
        title={`${placeId} - 카카오 플레이스`}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        style={{
          border: 'none',
          borderRadius: '8px',
          minHeight: '600px'
        }}
      />
    </div>
  );

  return (
    <div className='place-detail'>
      <div className='place-detail-close'>
        <button onClick={onClose}><i className='ic-close-20' /></button>
      </div>
      <KakaoPlaceIframe />
    </div>
  );
};

export default PlaceDetail;
