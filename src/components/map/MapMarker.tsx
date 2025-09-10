import React, { useEffect, useRef } from 'react';
import { Place as GeneratedPlace } from '../../../generated/dto';

interface MapMarkerProps {
  map: any; // naver.maps.Map
  place: GeneratedPlace;
  index: number;
  isFocused?: boolean;
  onMarkerClick?: (place: GeneratedPlace, index: number) => void;
  onMarkerHover?: (place: GeneratedPlace, index: number) => void;
  onMarkerLeave?: (place: GeneratedPlace, index: number) => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({
  map,
  place,
  index,
  isFocused = false,
  onMarkerClick,
  onMarkerHover,
  onMarkerLeave
}) => {
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !place.lat || !place.lng) return;

    // 마커 위치 설정
    const position = new window.naver.maps.LatLng(
      parseFloat(place.lat),
      parseFloat(place.lng)
    );

    // 마커 HTML 콘텐츠 (displaySearchResultMarkers 디자인과 통일)
    const markerContent = `
      <div id="marker-${index}" class="map-marker" style="
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
        ${index + 1}
      </div>
    `;

    // 마커 생성 (displaySearchResultMarkers와 동일한 방식)
    const marker = new window.naver.maps.Marker({
      map: map,
      position: position,
      title: place.name,
      icon: {
        content: markerContent,
        anchor: new window.naver.maps.Point(14, 14)
      },
      zIndex: 100
    });

    markerRef.current = marker;

    // 마커 클릭 이벤트
    window.naver.maps.Event.addListener(marker, 'click', () => {
      // 부모 컴포넌트에 클릭 이벤트 전달 (MapContainer에서 panTo 처리)
      onMarkerClick?.(place, index);
    });

    // 마커 hover 이벤트 (displaySearchResultMarkers와 동일)
    window.naver.maps.Event.addListener(marker, 'mouseover', () => {
      // 마커 확대 효과
      const markerElement = document.getElementById(`marker-${index}`);
      if (markerElement) {
        markerElement.style.transform = 'scale(1.2)';
        markerElement.style.zIndex = '1000';
        markerElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
      }
      onMarkerHover?.(place, index);
    });

    window.naver.maps.Event.addListener(marker, 'mouseout', () => {
      // 마커 원래 크기로 복원
      const markerElement = document.getElementById(`marker-${index}`);
      if (markerElement) {
        markerElement.style.transform = 'scale(1)';
        markerElement.style.zIndex = '100';
        markerElement.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      }
      onMarkerLeave?.(place, index);
    });

    // 컴포넌트 언마운트 시 마커 제거
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [map, place, index, onMarkerClick, onMarkerHover, onMarkerLeave]);

  // 포커스 상태 변경 시 마커 스타일 업데이트 (displaySearchResultMarkers와 동일)
  useEffect(() => {
    const markerElement = document.getElementById(`marker-${index}`);
    if (markerElement) {
      markerElement.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      if (isFocused) {
        markerElement.style.transform = 'scale(1.3)';
        markerElement.style.zIndex = '1000';
        markerElement.style.boxShadow = '0 6px 16px rgba(0,0,0,0.5)';
        markerElement.style.backgroundColor = '#e55a5a';
      } else {
        markerElement.style.transform = 'scale(1)';
        markerElement.style.zIndex = '100';
        markerElement.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        markerElement.style.backgroundColor = '#ff6b6b';
      }
    }
  }, [isFocused, index]);

  return null; // 마커는 DOM에 직접 렌더링되므로 null 반환
};

export default MapMarker;
