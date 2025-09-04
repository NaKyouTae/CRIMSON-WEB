import React, { useState } from 'react';
import './CreateListForm.css';

const CreateListForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    icon: '🐷',
    name: '특별한 날 가기 좋은 가성비 데이트 장소',
    isPublic: true,
    category: '데이트',
    defaultPermission: 'editor',
    members: [{ id: 'qhdud4957', permission: 'editor' }],
    newMemberId: '',
    memo: '',
    relatedUrl: ''
  });

  const [selectedIcon, setSelectedIcon] = useState('🐷');

  const icons = ['🐷', '🎂', '🍺', '🍴', '❤️', '+'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIconSelect = (icon) => {
    if (icon !== '+') {
      setSelectedIcon(icon);
      setFormData(prev => ({
        ...prev,
        icon: icon
      }));
    }
  };

  const handleAddMember = () => {
    if (formData.newMemberId.trim()) {
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, { 
          id: prev.newMemberId, 
          permission: prev.defaultPermission 
        }],
        newMemberId: ''
      }));
    }
  };

  const handleRemoveMember = (memberId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(member => member.id !== memberId)
    }));
  };

  const handleMemberPermissionChange = (memberId, permission) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map(member => 
        member.id === memberId ? { ...member, permission } : member
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating list:', formData);
    onBack();
  };

  return (
    <div className="create-form-container">
      <div className="form-header">
        <button className="back-button" onClick={onBack}>‹</button>
        <h2>리스트 생성하기</h2>
      </div>

        <form className="create-form" onSubmit={handleSubmit}>
          {/* 대표 아이콘 */}
          <div className="form-section">
            <label className="form-label">대표 아이콘</label>
            <div className="icon-selector">
              {icons.map((icon, index) => (
                <button
                  key={index}
                  type="button"
                  className={`icon-button ${selectedIcon === icon ? 'selected' : ''}`}
                  onClick={() => handleIconSelect(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* 이름 */}
          <div className="form-section">
            <label className="form-label">이름</label>
            <div className="input-container">
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              <button 
                type="button" 
                className="clear-button"
                onClick={() => handleInputChange('name', '')}
              >
                ×
              </button>
            </div>
          </div>

          {/* 공개 여부 */}
          <div className="form-section">
            <label className="form-label">공개 여부</label>
            <div className="radio-group">
              <label className={`radio-option ${formData.isPublic ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={() => handleInputChange('isPublic', true)}
                />
                공개 리스트
              </label>
              <label className={`radio-option ${!formData.isPublic ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="isPublic"
                  checked={!formData.isPublic}
                  onChange={() => handleInputChange('isPublic', false)}
                />
                비공개 리스트
              </label>
            </div>
          </div>

          {/* 분류 */}
          <div className="form-section">
            <label className="form-label">분류</label>
            <select 
              className="form-select"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <option value="데이트">데이트</option>
              <option value="맛집">맛집</option>
              <option value="카페">카페</option>
              <option value="쇼핑">쇼핑</option>
              <option value="엔터테인먼트">엔터테인먼트</option>
            </select>
          </div>

          {/* 멤버 관리 */}
          <div className="form-section">
            <label className="form-label">멤버 관리</label>
            <div className="member-input-container">
              <input
                type="text"
                className="form-input"
                placeholder="멤버 아이디 입력"
                value={formData.newMemberId}
                onChange={(e) => handleInputChange('newMemberId', e.target.value)}
              />
              <button 
                type="button" 
                className="add-button"
                onClick={handleAddMember}
              >
                +
              </button>
            </div>
            
            {formData.members.map((member) => (
              <div key={member.id} className="member-item">
                <span className="member-id">{member.id}</span>
                <select
                  className="member-permission"
                  value={member.permission}
                  onChange={(e) => handleMemberPermissionChange(member.id, e.target.value)}
                >
                  <option value="editor">에디터</option>
                  <option value="viewer">뷰어</option>
                </select>
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  −
                </button>
              </div>
            ))}
          </div>

          {/* 멤버 기본 권한 */}
          <div className="form-section">
            <label className="form-label">멤버 기본 권한</label>
            <div className="radio-group">
              <label className={`radio-option ${formData.defaultPermission === 'editor' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="defaultPermission"
                  checked={formData.defaultPermission === 'editor'}
                  onChange={() => handleInputChange('defaultPermission', 'editor')}
                />
                에디터
              </label>
              <label className={`radio-option ${formData.defaultPermission === 'viewer' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="defaultPermission"
                  checked={formData.defaultPermission === 'viewer'}
                  onChange={() => handleInputChange('defaultPermission', 'viewer')}
                />
                뷰어
              </label>
            </div>
          </div>

          {/* 메모 */}
          <div className="form-section">
            <label className="form-label">
              메모 <span className="optional">(선택)</span>
            </label>
            <textarea
              className="form-textarea"
              placeholder="메모 입력"
              value={formData.memo}
              onChange={(e) => handleInputChange('memo', e.target.value)}
            />
          </div>

          {/* 관련 URL */}
          <div className="form-section">
            <label className="form-label">
              관련 URL <span className="optional">(선택)</span>
            </label>
            <input
              type="url"
              className="form-input"
              placeholder="관련 URL 입력"
              value={formData.relatedUrl}
              onChange={(e) => handleInputChange('relatedUrl', e.target.value)}
            />
          </div>

          {/* 생성하기 버튼 */}
          <button type="submit" className="create-button">
            생성하기
          </button>
        </form>
    </div>
  );
};

export default CreateListForm;
