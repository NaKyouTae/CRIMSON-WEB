import React, { useRef, useEffect } from 'react';
import './PlaceGroupItem.css';

const PlaceGroupItem = ({ item, isOpen, onToggle, onClose, onItemClick }) => {
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

  const handleItemClick = (e) => {
    // 더보기 버튼 클릭 시에는 상세보기로 이동하지 않음
    if (e.target.closest('.more-button-container')) {
      return;
    }
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <div className="place-group-item" onClick={handleItemClick}>
      <div className="place-group-icon">{item.icon}</div>
      <div className="place-group-content">
        <h4>{item.title}</h4>
        <div className="place-group-meta">
          <span>{item.roleText}</span>
          <span className="separator">|</span>
          <span>{item.privacyText}</span>
          <span className="separator">|</span>
          <span>멤버 {item.members}</span>
          <span className="separator">|</span>
          <span>저장 {item.saved}</span>
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

export default PlaceGroupItem;
