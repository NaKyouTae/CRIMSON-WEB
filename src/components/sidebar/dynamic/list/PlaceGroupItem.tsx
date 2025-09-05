import React, { useRef, useEffect, useState } from 'react';
import './PlaceGroupItem.css';

// 타입 정의
interface PlaceGroup {
  id: number;
  icon: string;
  title: string;
  role: string;
  roleText: string;
  privacy: string;
  privacyText: string;
  members: number;
  saved: number;
}

interface PlaceGroupItemProps {
  item: PlaceGroup;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onItemClick: (item: PlaceGroup) => void;
}

const PlaceGroupItem: React.FC<PlaceGroupItemProps> = ({ 
  item, 
  isOpen, 
  onToggle, 
  onClose, 
  onItemClick 
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  // 드롭다운 위치 계산
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: buttonRect.bottom + 4,
        right: window.innerWidth - buttonRect.right
      });
    }
  }, [isOpen]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleItemClick = () => {
    onItemClick(item);
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Dropdown button clicked!', { isOpen, itemId: item.id });
    onToggle();
  };

  const handleActionClick = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`${action} clicked for item:`, item.title);
    onClose();
  };

  return (
    <>
      <div className="place-group-item" onClick={handleItemClick}>
        <div className="item-content">
          <div className="item-icon">{item.icon}</div>
          <div className="item-info">
            <h3 className="item-title">{item.title}</h3>
            <div className="item-meta">
              <span>{item.roleText}</span>
              <span className="separator">|</span>
              <span>{item.privacyText}</span>
              <span className="separator">|</span>
              <span>멤버 {item.members.toLocaleString()}</span>
              <span className="separator">|</span>
              <span>저장 {item.saved.toLocaleString()}</span>
            </div>
          </div>
          <div className="item-actions">
            <button 
              ref={buttonRef}
              className="dropdown-button"
              onClick={handleDropdownClick}
            >
              ⋯
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="dropdown-overlay" onClick={onClose}></div>
          <div 
            className="dropdown-menu" 
            ref={dropdownRef}
            style={{
              top: `${dropdownPosition.top}px`,
              right: `${dropdownPosition.right}px`
            }}
          >
            <button 
              className="dropdown-item"
              onClick={(e) => handleActionClick('edit', e)}
            >
              수정
            </button>
            <button 
              className="dropdown-item"
              onClick={(e) => handleActionClick('duplicate', e)}
            >
              복제
            </button>
            <button 
              className="dropdown-item"
              onClick={(e) => handleActionClick('share', e)}
            >
              공유
            </button>
            <button 
              className="dropdown-item danger"
              onClick={(e) => handleActionClick('delete', e)}
            >
              삭제
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default PlaceGroupItem;
