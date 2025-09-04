import React from 'react';
import './TabNavigation.css';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tab-navigation">
      <button 
        className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
        onClick={() => setActiveTab('list')}
      >
        리스트 목록
      </button>
      <button 
        className={`tab-button ${activeTab === 'mypage' ? 'active' : ''}`}
        onClick={() => setActiveTab('mypage')}
      >
        마이페이지
      </button>
    </div>
  );
};

export default TabNavigation;
