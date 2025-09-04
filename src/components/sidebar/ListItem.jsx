import React, { useRef, useEffect } from 'react';
import './ListItem.css';

const ListItem = ({ item, isOpen, onToggle, onClose }) => {
  const dropdownRef = useRef(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleMenuAction = (action) => {
    console.log(`${action} clicked for item:`, item.title);
    onClose();
  };

  return (
    <div className="list-item">
      <div className="list-icon">{item.icon}</div>
      <div className="list-content">
        <h4>{item.title}</h4>
        <div className="list-meta">
          <span className={`role ${item.role}`}>{item.roleText}</span>
          <span className={`privacy ${item.privacy}`}>{item.privacyText}</span>
          <span className="members">멤버 {item.members}</span>
          <span className="saved">저장 {item.saved}</span>
        </div>
      </div>
      <div className="more-button-container" ref={dropdownRef}>
        <button className="more-button" onClick={onToggle}>
          ⋮
        </button>
        {isOpen && (
          <div className="dropdown-menu">
            <button 
              className="dropdown-item"
              onClick={() => handleMenuAction('edit')}
            >
              수정
            </button>
            <button 
              className="dropdown-item"
              onClick={() => handleMenuAction('share')}
            >
              공유
            </button>
            <button 
              className="dropdown-item"
              onClick={() => handleMenuAction('duplicate')}
            >
              복제
            </button>
            <button 
              className="dropdown-item"
              onClick={() => handleMenuAction('delete')}
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListItem;
