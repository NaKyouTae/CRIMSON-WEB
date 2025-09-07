import React, { useEffect, useRef, useState } from 'react';
import './MapContainer.css';

const MapContainer: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 네이버 지도 API 로드 확인
    const checkNaverMaps = () => {
      if (typeof naver !== 'undefined' && naver.maps) {
        setIsLoaded(true);
        initializeMap();
      } else {
        setTimeout(checkNaverMaps, 100);
      }
    };

    checkNaverMaps();

    // 인증 실패 처리
    (window as any).navermap_authFailure = () => {
      console.error('네이버 지도 API 인증에 실패했습니다.');
    };

    return () => {
      if (map) {
        // 지도 인스턴스 정리
        map.setMap(null);
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !naver.maps) return;

    // 서울 중심 좌표 (강남역 근처)
    const center = new naver.maps.LatLng(37.5665, 126.9780);

    const mapOptions: naver.maps.MapOptions = {
      center: center,
      zoom: 11,
      zoomControl: true,
      zoomControlOptions: {
        position: 'TOP_RIGHT' as any,
      },
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: 'TOP_LEFT' as any,
      },
      scaleControl: true,
      scaleControlOptions: {
        position: 'BOTTOM_LEFT' as any,
      },
      logoControl: true,
      logoControlOptions: {
        position: 'BOTTOM_RIGHT' as any,
      },
      mapDataControl: true,
      mapDataControlOptions: {
        position: 'TOP_RIGHT' as any,
      },
    };

    const mapInstance = new naver.maps.Map(mapRef.current, mapOptions);
    setMap(mapInstance);

    // 지도 클릭 이벤트
    naver.maps.Event.addListener(mapInstance, 'click', (e: any) => {
      console.log('지도 클릭:', e.coord);
    });

    // 마커 추가 예제 (강남역)
    const gangnamStation = new naver.maps.LatLng(37.4979, 127.0276);
    const marker = new naver.maps.Marker({
      position: gangnamStation,
      map: mapInstance,
      title: '강남역',
    });

    // 정보창 추가
    const infoWindow = new naver.maps.InfoWindow({
      content: '<div style="padding: 10px;"><strong>강남역</strong><br>서울특별시 강남구 강남대로 396</div>',
    });

    // 마커 클릭 시 정보창 표시
    naver.maps.Event.addListener(marker, 'click', () => {
      if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindow.open(mapInstance, marker);
      }
    });
  };

  return (
    <div className="map-container">
      <div 
        ref={mapRef} 
        className="naver-map"
        style={{ width: '100%', height: '100%' }}
      />
      {!isLoaded && (
        <div className="map-loading">
          <div className="loading-content">
            <h2>지도 로딩 중...</h2>
            <p>네이버 지도를 불러오고 있습니다.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapContainer;
