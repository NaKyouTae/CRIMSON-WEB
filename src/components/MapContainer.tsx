import React, { useEffect, useState } from 'react';
import './MapContainer.css';

// 카카오맵 타입 정의
declare global {
  interface Window {
    kakao: any;
  }
}

interface Place {
  place_name: string;
  road_address_name: string;
  address_name: string;
  phone: string;
  x: string;
  y: string;
  place_url: string;
}

const MapContainer: React.FC = () => {
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infowindow, setInfowindow] = useState<any>(null);

  useEffect(() => {
    let checkCount = 0;
    const maxChecks = 50; // 최대 5초 대기

    // 카카오맵 API 로드 확인
    const checkKakaoMaps = () => {
      checkCount++;
      console.log(`카카오맵 API 체크 중... (${checkCount}/${maxChecks})`);
      
      if (typeof window.kakao !== 'undefined' && window.kakao.maps) {
        console.log('✅ 카카오맵 API 로드 완료');
        setIsLoaded(true);
        // 약간의 지연 후 지도 초기화
        setTimeout(() => {
          initializeMap();
        }, 100);
      } else if (checkCount < maxChecks) {
        console.log('⏳ 카카오맵 API 로드 대기 중...');
        setTimeout(checkKakaoMaps, 100);
      } else {
        console.error('❌ 카카오맵 API 로드 실패 - 최대 대기 시간 초과');
        alert('카카오맵 API 로드에 실패했습니다. 페이지를 새로고침해주세요.');
      }
    };

    // 즉시 체크 시작
    checkKakaoMaps();

    return () => {
      // 마커 정리
      markers.forEach(marker => marker.setMap(null));
    };
  }, []);

  const initializeMap = () => {
    console.log('🗺️ 지도 초기화 시작...');
    
    if (!window.kakao || !window.kakao.maps) {
      console.error('❌ 카카오맵 API가 로드되지 않았습니다.');
      return;
    }

    try {
      // 제공해주신 스크립트 방식으로 지도 초기화
      const container = document.getElementById('map');
      
      if (!container) {
        console.error('❌ 지도 컨테이너를 찾을 수 없습니다.');
        return;
      }

      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 제주도 좌표
        level: 3
      };

      console.log('🗺️ 지도 인스턴스 생성 중...');
      const mapInstance = new window.kakao.maps.Map(container, options);
      
      if (!mapInstance) {
        console.error('❌ 지도 인스턴스 생성 실패');
        return;
      }

      setMap(mapInstance);
      console.log('✅ 지도 인스턴스 생성 완료');

      // 인포윈도우 생성
      const infoWindowInstance = new window.kakao.maps.InfoWindow({ zIndex: 1 });
      setInfowindow(infoWindowInstance);

      // 지도 클릭 이벤트
      window.kakao.maps.event.addListener(mapInstance, 'click', () => {
        infoWindowInstance.close();
      });

      // 지도 로드 완료 이벤트
      window.kakao.maps.event.addListener(mapInstance, 'tilesloaded', () => {
        console.log('🎉 카카오 지도 로드 완료!');
        
        // 테스트용 마커 추가
        const testMarker = new window.kakao.maps.Marker({
          position: options.center,
          map: mapInstance
        });
        
        // 테스트용 인포윈도우
        const testInfoWindow = new window.kakao.maps.InfoWindow({
          content: '<div style="padding: 10px; text-align: center;"><strong>🎉 카카오 지도 로드 성공!</strong><br>제주도 위치입니다.</div>'
        });
        
        testInfoWindow.open(mapInstance, testMarker);
        
        // 3초 후 테스트 인포윈도우 닫기
        setTimeout(() => {
          testInfoWindow.close();
        }, 3000);
      });

      console.log('✅ 카카오 지도 초기화 완료');
    } catch (error: any) {
      console.error('❌ 카카오 지도 초기화 실패:', error);
      alert('지도 초기화에 실패했습니다: ' + (error?.message || '알 수 없는 오류'));
    }
  };

  // 장소 검색 함수
  const searchPlaces = (keyword: string) => {
    if (!keyword.trim()) {
      alert('키워드를 입력해주세요!');
      return;
    }

    if (!map || !window.kakao) return;

    // 장소 검색 객체 생성
    const ps = new window.kakao.maps.services.Places();

    // 키워드로 장소 검색
    ps.keywordSearch(keyword, placesSearchCB);
  };

  // 장소 검색 완료 콜백
  const placesSearchCB = (data: Place[], status: any) => {
    if (status === window.kakao.maps.services.Status.OK) {
      // 기존 마커 제거
      markers.forEach(marker => marker.setMap(null));
      setMarkers([]);

      // 검색 결과 표시
      displayPlaces(data);
    } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
      alert('검색 결과가 존재하지 않습니다.');
    } else if (status === window.kakao.maps.services.Status.ERROR) {
      alert('검색 결과 중 오류가 발생했습니다.');
    }
  };

  // 검색 결과 표시
  const displayPlaces = (places: Place[]) => {
    if (!map || !infowindow) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    const newMarkers: any[] = [];

    places.forEach((place, index) => {
      // 마커 생성
      const placePosition = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = addMarker(placePosition, index);
      newMarkers.push(marker);

      // 지도 범위에 추가
      bounds.extend(placePosition);

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        displayInfowindow(marker, place);
      });
    });

    setMarkers(newMarkers);
    setSearchResults(places);

    // 지도 범위 재설정
    map.setBounds(bounds);
  };

  // 마커 생성
  const addMarker = (position: any, idx: number) => {
    const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
    const imageSize = new window.kakao.maps.Size(36, 37);
    const imgOptions = {
      spriteSize: new window.kakao.maps.Size(36, 691),
      spriteOrigin: new window.kakao.maps.Point(0, (idx * 46) + 10),
      offset: new window.kakao.maps.Point(13, 37)
    };
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
    
    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage
    });

    marker.setMap(map);
    return marker;
  };

  // 인포윈도우 표시
  const displayInfowindow = (marker: any, place: Place) => {
    const content = `
      <div style="padding: 10px; min-width: 200px;">
        <h4 style="margin: 0 0 5px 0; font-size: 14px;">${place.place_name}</h4>
        <p style="margin: 0 0 3px 0; font-size: 12px; color: #666;">
          ${place.road_address_name || place.address_name}
        </p>
        ${place.phone ? `<p style="margin: 0; font-size: 12px; color: #666;">${place.phone}</p>` : ''}
      </div>
    `;

    infowindow.setContent(content);
    infowindow.open(map, marker);
  };


  return (
    <div className="map-container">
      <div className="map-area">
        <div 
          id="map"
          className="kakao-map"
          style={{ 
            width: '100%', 
            height: '100%',
            minHeight: '500px',
            backgroundColor: '#f0f0f0'
          }}
        />
        {!isLoaded && (
          <div className="map-loading">
            <div className="loading-content">
              <h2>지도 로딩 중...</h2>
              <p>카카오 지도를 불러오고 있습니다.</p>
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
                {window.kakao ? '✅ 로드됨' : '❌ 로드 안됨'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapContainer;
