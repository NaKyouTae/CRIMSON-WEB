import React, { useEffect, useState } from 'react';
import './MapContainer.css';
import MapMarker from './map/MapMarker';
import { Place as GeneratedPlace } from '../../generated/dto';

// 네이버 지도 타입 정의
declare global {
  interface Window {
    naver: any;
  }
}

interface MapContainerProps {
  onSearch?: (keyword: string) => void;
  searchResults?: any[]; // 검색 결과 데이터
  groupPlaces?: GeneratedPlace[]; // 그룹 장소 데이터
  focusedPlaceIndex?: number; // 포커싱할 장소 인덱스
  resetMapTrigger?: number; // 지도 원복 트리거
  onPlaceFocus?: (index: number) => void; // 장소 포커스 콜백
}

const MapContainer: React.FC<MapContainerProps> = ({ searchResults = [], groupPlaces = [], focusedPlaceIndex, resetMapTrigger, onPlaceFocus }) => {
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
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
      // 컴포넌트 정리
    };
  }, []);

  // 검색 결과가 변경될 때마다 마커 업데이트 (MapMarker 컴포넌트에서 처리)
  // useEffect(() => {
  //   if (isLoaded && searchResults.length > 0) {
  //     displaySearchResultMarkers(searchResults);
  //   }
  // }, [searchResults, isLoaded]);

  // 포커싱할 장소 인덱스가 변경될 때 지도 중심 이동
  useEffect(() => {
    if (focusedPlaceIndex !== undefined && focusedPlaceIndex >= 0 && map) {
      let targetPlace = null;
      
      // searchResults에서 찾기
      if (focusedPlaceIndex < searchResults.length) {
        targetPlace = searchResults[focusedPlaceIndex];
      } 
      // groupPlaces에서 찾기
      else if (focusedPlaceIndex >= searchResults.length && groupPlaces.length > 0) {
        const groupIndex = focusedPlaceIndex - searchResults.length;
        if (groupIndex < groupPlaces.length) {
          targetPlace = groupPlaces[groupIndex];
        }
      }
      
      if (targetPlace) {
        // 좌표 생성
        const lat = targetPlace.y || targetPlace.lat;
        const lng = targetPlace.x || targetPlace.lng;
        
        if (lat && lng) {
          const position = new window.naver.maps.LatLng(parseFloat(lat), parseFloat(lng));
          
          // 지도 중심을 해당 위치로 부드럽게 이동
          map.panTo(position, {
            duration: 500,
            easing: 'easeOutCubic'
          });
          
          console.log(`🗺️ 지도가 인덱스 ${focusedPlaceIndex} 위치로 이동했습니다.`);
        }
      }
    }
  }, [focusedPlaceIndex, map, searchResults, groupPlaces]);

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

  // 검색 결과 마커 표시 함수 (네이버 지도 API 문서 기반)


  // 지도를 원래 상태로 복원하는 함수
  const resetMapToInitialState = () => {
    if (!map || !initialMapState) return;


    // 지도를 초기 상태로 부드럽게 복원
    map.panTo(initialMapState.center, {
      duration: 2000, // 2초 동안 부드럽게 이동
      easing: 'easeOutCubic'
    });
    map.setZoom(initialMapState.zoom, {
      duration: 2000, // 2초 동안 부드럽게 줌 변경
      easing: 'easeOutCubic'
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
        
        {/* 마커 렌더링 */}
        {isLoaded && map && (
          <>
            {/* 검색 결과 마커 */}
            {searchResults.map((place, index) => (
              <MapMarker
                key={`search-${index}`}
                map={map}
                place={{
                  id: place.id || `search-${index}`,
                  locationId: place.id || `search-${index}`,
                  name: place.place_name || place.name,
                  categoryName: place.category_name || place.categoryName || '',
                  addressName: place.road_address_name || place.addressName || '',
                  phone: place.phone || '',
                  lat: place.y || place.lat || '0',
                  lng: place.x || place.lng || '0',
                  url: place.place_url || place.url || '',
                  createdAt: 0,
                  updatedAt: 0
                }}
                index={index}
                isFocused={focusedPlaceIndex === index}
                onMarkerClick={(place, index) => {
                  console.log('검색 결과 마커 클릭:', place, index);
                  onPlaceFocus?.(index);
                }}
              />
            ))}
            
            {/* 그룹 장소 마커 */}
            {groupPlaces.map((place, index) => (
              <MapMarker
                key={`group-${place.id}`}
                map={map}
                place={place}
                index={index}
                isFocused={focusedPlaceIndex === index}
                onMarkerClick={(place, index) => {
                  console.log('그룹 장소 마커 클릭:', place, index);
                  onPlaceFocus?.(index);
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MapContainer;
