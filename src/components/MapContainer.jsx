import React from 'react';
import './MapContainer.css';

const MapContainer = () => {
  return (
    <div className="map-container">
      <div className="map-placeholder">
        <div className="map-content">
          <h2>서울 지도</h2>
          <p>지도 API 연동 예정</p>
          <div className="map-areas">
            <div className="area 종로구">종로구</div>
            <div className="area 서대문구">서대문구</div>
            <div className="area 강남구">강남구</div>
            <div className="area 송파구">송파구</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;
