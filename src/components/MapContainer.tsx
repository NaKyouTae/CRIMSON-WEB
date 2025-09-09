import React, { useEffect, useState } from 'react';
import './MapContainer.css';

// 네이버 지도 타입 정의
declare global {
  interface Window {
    naver: any;
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

interface MapContainerProps {
  onSearch?: (keyword: string) => void;
  searchResults?: any[]; // 검색 결과 데이터
  focusedPlaceIndex?: number; // 포커싱할 장소 인덱스
  resetMapTrigger?: number; // 지도 원복 트리거
}

const MapContainer: React.FC<MapContainerProps> = ({ onSearch, searchResults = [], focusedPlaceIndex, resetMapTrigger }) => {
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infowindow, setInfowindow] = useState<any>(null);
  const [initialMapState, setInitialMapState] = useState<{center: any, zoom: number} | null>(null);

  useEffect(() => {
    let checkCount = 0;
    const maxChecks = 50; // 최대 5초 대기

    // 네이버 지도 API 로드 확인
    const checkNaverMaps = () => {
      checkCount++;
      console.log(`네이버 지도 API 체크 중... (${checkCount}/${maxChecks})`);
      
      if (typeof window.naver !== 'undefined' && window.naver.maps) {
        console.log('✅ 네이버 지도 API 로드 완료');
        setIsLoaded(true);
        // 약간의 지연 후 지도 초기화
        setTimeout(() => {
          initializeMap();
        }, 100);
      } else if (checkCount < maxChecks) {
        console.log('⏳ 네이버 지도 API 로드 대기 중...');
        setTimeout(checkNaverMaps, 100);
      } else {
        console.error('❌ 네이버 지도 API 로드 실패 - 최대 대기 시간 초과');
        alert('네이버 지도 API 로드에 실패했습니다. 페이지를 새로고침해주세요.');
      }
    };

    // 즉시 체크 시작
    checkNaverMaps();

    return () => {
      // 마커 정리
      markers.forEach(marker => marker.setMap(null));
    };
  }, []);

  // 검색 결과가 변경될 때마다 마커 업데이트
  useEffect(() => {
    if (isLoaded && searchResults.length > 0) {
      displaySearchResultMarkers(searchResults);
    }
  }, [searchResults, isLoaded]);

  // 포커싱할 장소 인덱스가 변경될 때 해당 마커 포커싱
  useEffect(() => {
    if (focusedPlaceIndex !== undefined && focusedPlaceIndex >= 0 && markers[focusedPlaceIndex]) {
      focusMarker(focusedPlaceIndex);
    }
  }, [focusedPlaceIndex, markers]);

  // 외부에서 지도 복원 요청 시 실행
  useEffect(() => {
    if (resetMapTrigger !== undefined && resetMapTrigger > 0) {
      resetMapToInitialState();
    }
  }, [resetMapTrigger]);

  const initializeMap = () => {
    console.log('🗺️ 지도 초기화 시작...');
    
    if (!window.naver || !window.naver.maps) {
      console.error('❌ 네이버 지도 API가 로드되지 않았습니다.');
      return;
    }

    try {
      // 네이버 지도 초기화
      const container = document.getElementById('map');
      
      if (!container) {
        console.error('❌ 지도 컨테이너를 찾을 수 없습니다.');
        return;
      }

      const initialCenter = new window.naver.maps.LatLng(36.5, 127.5); // 대한민국 중심 좌표
      const initialZoom = 7;
      
      const options = {
        center: initialCenter,
        zoom: initialZoom
      };

      console.log('🗺️ 지도 인스턴스 생성 중...');
      const mapInstance = new window.naver.maps.Map(container, options);

      // 초기 지도 상태 저장
      setInitialMapState({
        center: initialCenter,
        zoom: initialZoom
      });
      
      if (!mapInstance) {
        console.error('❌ 지도 인스턴스 생성 실패');
        return;
      }

      setMap(mapInstance);
      console.log('✅ 지도 인스턴스 생성 완료');

      // 인포윈도우 생성
      const infoWindowInstance = new window.naver.maps.InfoWindow();
      setInfowindow(infoWindowInstance);

      // 지도 클릭 이벤트
      window.naver.maps.Event.addListener(mapInstance, 'click', () => {
        infoWindowInstance.close();
      });

      // 지도 로드 완료 이벤트
      window.naver.maps.Event.addListener(mapInstance, 'init', () => {
        console.log('🎉 네이버 지도 로드 완료!');
        setIsLoaded(true);
      });

      console.log('✅ 네이버 지도 초기화 완료');
    } catch (error: any) {
      console.error('❌ 네이버 지도 초기화 실패:', error);
      alert('지도 초기화에 실패했습니다: ' + (error?.message || '알 수 없는 오류'));
    }
  };

  // 장소 검색 함수 (네이버 지도 API)
  const searchPlaces = (keyword: string) => {
    if (!keyword.trim()) {
      alert('키워드를 입력해주세요!');
      return;
    }

    if (!map || !window.naver) return;

    // 네이버 지도 장소 검색
    window.naver.maps.Service.geocode({
      query: keyword
    }, (status: any, response: any) => {
      if (status === window.naver.maps.Service.Status.OK) {
        const items = response.result.items;
        if (items.length > 0) {
          // 기존 마커 제거
          markers.forEach(marker => marker.setMap(null));
          setMarkers([]);

          // 검색 결과를 Place 형태로 변환
          const places: Place[] = items.map((item: any) => ({
            place_name: item.title || keyword,
            road_address_name: item.address,
            address_name: item.address,
            phone: '',
            x: item.point.x.toString(),
            y: item.point.y.toString(),
            place_url: ''
          }));

          // 검색 결과 표시
          displayPlaces(places);
          
          // 부모 컴포넌트에 검색 결과 전달
          if (onSearch) {
            onSearch(keyword);
          }
        } else {
          alert('검색 결과가 존재하지 않습니다.');
        }
      } else {
        alert('검색 중 오류가 발생했습니다.');
      }
    });
  };

  // 검색 결과 표시 (네이버 지도 API)
  const displayPlaces = (places: Place[]) => {
    if (!map || !infowindow) return;

    const bounds = new window.naver.maps.LatLngBounds();
    const newMarkers: any[] = [];

    places.forEach((place, index) => {
      // 마커 생성
      const placePosition = new window.naver.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
      const marker = addMarker(placePosition, index);
      newMarkers.push(marker);

      // 지도 범위에 추가
      bounds.extend(placePosition);

      // 마커 클릭 이벤트
      window.naver.maps.Event.addListener(marker, 'click', () => {
        displayInfowindow(marker, place);
      });
    });

    setMarkers(newMarkers);

    // 지도 범위 재설정
    map.fitBounds(bounds);
  };

  // 마커 생성 (네이버 지도 API)
  const addMarker = (position: any, idx: number) => {
    const marker = new window.naver.maps.Marker({
      position: position,
      map: map,
      title: `마커 ${idx + 1}`
    });

    return marker;
  };

  // 인포윈도우 표시 (네이버 지도 API)
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

  // 검색 결과 마커 표시 함수 (네이버 지도 API 문서 기반)
  const displaySearchResultMarkers = (results: any[]) => {
    if (!map || !infowindow || !window.naver) return;

    // 기존 마커 제거
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    if (results.length === 0) return;

    const bounds = new window.naver.maps.LatLngBounds();
    const newMarkers: any[] = [];

    results.forEach((place, index) => {
      // 좌표 생성
      const position = new window.naver.maps.LatLng(
        parseFloat(place.y), 
        parseFloat(place.x)
      );

      // 마커 생성 (네이버 지도 API 문서의 마커 예제 기반)
      const marker = new window.naver.maps.Marker({
        map: map,
        position: position,
        title: place.name || place.place_name,
        icon: {
          content: `
            <div id="marker-${index}" style="
              background-color: #ff6b6b;
              color: white;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              font-weight: bold;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              cursor: pointer;
              transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            ">
              ${index}
            </div>
          `,
          anchor: new window.naver.maps.Point(14, 14)
        },
        zIndex: 100
      });

      // 마커 hover 이벤트
      window.naver.maps.Event.addListener(marker, 'mouseover', () => {
        // 마커 확대 효과
        const markerElement = document.getElementById(`marker-${index}`);
        if (markerElement) {
          markerElement.style.transform = 'scale(1.2)';
          markerElement.style.zIndex = '1000';
          markerElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        }
      });

      window.naver.maps.Event.addListener(marker, 'mouseout', () => {
        // 마커 원래 크기로 복원
        const markerElement = document.getElementById(`marker-${index}`);
        if (markerElement) {
          markerElement.style.transform = 'scale(1)';
          markerElement.style.zIndex = '100';
          markerElement.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        }
      });

      // 마커 클릭 이벤트
      window.naver.maps.Event.addListener(marker, 'click', () => {
        const content = `
          <div style="padding: 12px; min-width: 200px;">
            <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 600;">${place.name || place.place_name}</h4>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">
              ${place.roadAddressName || place.addressName || place.road_address_name || place.address_name}
            </p>
            ${place.phone ? `<p style="margin: 0; font-size: 12px; color: #666;">📞 ${place.phone}</p>` : ''}
            ${place.categoryName ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #999;">${place.categoryName}</p>` : ''}
          </div>
        `;
        
        infowindow.setContent(content);
        infowindow.open(map, marker);
      });

      newMarkers.push(marker);
      bounds.extend(position);
    });

    setMarkers(newMarkers);

    // 지도 범위를 모든 마커를 포함하도록 조정
    if (newMarkers.length > 0) {
      map.fitBounds(bounds);
    }
  };

  // 특정 마커 포커싱 함수
  const focusMarker = (index: number) => {
    if (!markers[index] || !map) return;

    // 모든 마커를 원래 상태로 복원
    markers.forEach((_, i) => {
      const markerElement = document.getElementById(`marker-${i}`);
      if (markerElement) {
        markerElement.style.transform = 'scale(1)';
        markerElement.style.zIndex = '100';
        markerElement.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        markerElement.style.backgroundColor = '#ff6b6b';
        markerElement.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }
    });

    // 포커싱할 마커 강조 (애니메이션과 함께)
    const targetMarker = markers[index];
    const markerElement = document.getElementById(`marker-${index}`);
    if (markerElement) {
      markerElement.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      markerElement.style.transform = 'scale(1.3)';
      markerElement.style.zIndex = '1000';
      markerElement.style.boxShadow = '0 6px 16px rgba(0,0,0,0.5)';
      markerElement.style.backgroundColor = '#e55a5a';
    }

    // 지도 중심을 해당 마커로 부드럽게 이동 (줌 레벨은 유지)
    const position = targetMarker.getPosition();
    
    // 네이버 지도 API의 panTo 메서드와 TransitionOptions 사용
    map.panTo(position, {
      duration: 500, // 2초 동안 부드럽게 이동
      easing: 'easeOutCubic' // 자연스러운 감속 효과
    });
  };

  // 지도를 원래 상태로 복원하는 함수
  const resetMapToInitialState = () => {
    if (!map || !initialMapState) return;

    // 모든 마커를 원래 상태로 복원
    markers.forEach((_, i) => {
      const markerElement = document.getElementById(`marker-${i}`);
      if (markerElement) {
        markerElement.style.transform = 'scale(1)';
        markerElement.style.zIndex = '100';
        markerElement.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        markerElement.style.backgroundColor = '#ff6b6b';
      }
    });

    // 지도를 초기 상태로 부드럽게 복원
    map.panTo(initialMapState.center, {
      duration: 2000, // 2초 동안 부드럽게 이동
      easing: 'ease-out'
    });
    map.setZoom(initialMapState.zoom, {
      duration: 2000, // 2초 동안 부드럽게 줌 변경
      easing: 'ease-out'
    });
    
    // 인포윈도우 닫기
    if (infowindow) {
      infowindow.close();
    }

    console.log('🗺️ 지도가 초기 상태로 복원되었습니다.');
  };


  return (
    <div className="map-container">
      <div className="map-area">
        <div 
          id="map"
          className="naver-map"
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
              <p>네이버 지도를 불러오고 있습니다.</p>
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
                {window.naver ? '✅ 로드됨' : '❌ 로드 안됨'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapContainer;
