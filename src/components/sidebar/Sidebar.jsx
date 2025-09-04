import React, { useState } from 'react';
import SidebarHeader from './SidebarHeader';
import TabNavigation from './TabNavigation';
import SearchSection from './SearchSection';
import CreateSection from './CreateSection';
import ListSection from './ListSection';
import CreateListForm from '../CreateListForm';
import './Sidebar.css';

const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  activeFilter, 
  setActiveFilter, 
  sortOrder, 
  setSortOrder
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateClick = () => {
    setShowCreateForm(true);
  };

  const handleBackToList = () => {
    setShowCreateForm(false);
  };

  return (
    <div className="sidebar">
      <SidebarHeader />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {showCreateForm ? (
        <CreateListForm onBack={handleBackToList} />
      ) : (
        <>
          <SearchSection />
          <CreateSection onCreateClick={handleCreateClick} />
          <ListSection 
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </>
      )}
    </div>
  );
};

export default Sidebar;
