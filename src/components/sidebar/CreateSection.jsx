import React from 'react';
import './CreateSection.css';

const CreateSection = ({ onCreateClick }) => {
  return (
    <div className="create-section">
      <div className="create-card" onClick={onCreateClick}>
        <div className="create-icon">📍</div>
        <div className="create-content">
          <h3>새로운 리스트 생성하기</h3>
          <p>원하는 장소를 저장하고 공유해 보세요.</p>
        </div>
      </div>
    </div>
  );
};

export default CreateSection;
