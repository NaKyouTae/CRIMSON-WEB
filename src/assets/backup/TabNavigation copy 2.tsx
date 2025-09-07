import React from 'react';
import './TabNavigation.css';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className='tab-style1'>
      <button 
        className={`${activeTab === 'list' ? 'active' : ''}`}
        onClick={() => setActiveTab('list')}
      >
        리스트 목록
      </button>
      <button 
        className={`${activeTab === 'mypage' ? 'active' : ''}`}
        onClick={() => setActiveTab('mypage')}
      >
        마이페이지
      </button>
    </div>
  );
};

export default TabNavigation;
