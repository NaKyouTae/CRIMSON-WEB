import React, { useState } from 'react';
import './CreatePlaceGroupForm.css';

// 타입 정의
interface Member {
  id: string;
  permission: string;
}

interface FormData {
  icon: string;
  name: string;
  isPublic: boolean;
  category: string;
  defaultPermission: string;
  members: Member[];
  newMemberId: string;
  memo: string;
  relatedUrl: string;
}

interface CreatePlaceGroupFormProps {
  onBack: () => void;
}

const CreatePlaceGroupForm: React.FC<CreatePlaceGroupFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState<FormData>({
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

  const [selectedIcon, setSelectedIcon] = useState<string>('🐷');

  const icons: string[] = ['🐷', '🎂', '🍺', '🍴', '❤️', '+'];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIconSelect = (icon: string) => {
    if (icon !== '+') {
      setSelectedIcon(icon);
      handleInputChange('icon', icon);
    }
  };

  const handleAddMember = () => {
    if (formData.newMemberId.trim()) {
      const newMember: Member = {
        id: formData.newMemberId.trim(),
        permission: formData.defaultPermission
      };
      handleInputChange('members', [...formData.members, newMember]);
      handleInputChange('newMemberId', '');
    }
  };

  const handleRemoveMember = (memberId: string) => {
    handleInputChange('members', formData.members.filter(member => member.id !== memberId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // 여기에 API 호출 로직 추가
    onBack();
  };

  return (
    <div className="create-place-group-form">
      <div className="form-header">
        <button className="back-button" onClick={onBack}>‹</button>
        <h2>새로운 플레이스 그룹 생성</h2>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-section">
          <label className="form-label">아이콘 선택</label>
          <div className="icon-selection">
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

        <div className="form-section">
          <label className="form-label">그룹 이름</label>
          <input
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="그룹 이름을 입력하세요"
          />
        </div>

        <div className="form-section">
          <label className="form-label">공개 설정</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="privacy"
                checked={formData.isPublic}
                onChange={() => handleInputChange('isPublic', true)}
              />
              공개
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="privacy"
                checked={!formData.isPublic}
                onChange={() => handleInputChange('isPublic', false)}
              />
              비공개
            </label>
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">카테고리</label>
          <select
            className="form-select"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
          >
            <option value="데이트">데이트</option>
            <option value="가족">가족</option>
            <option value="친구">친구</option>
            <option value="비즈니스">비즈니스</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div className="form-section">
          <label className="form-label">기본 권한</label>
          <select
            className="form-select"
            value={formData.defaultPermission}
            onChange={(e) => handleInputChange('defaultPermission', e.target.value)}
          >
            <option value="captain">캡틴</option>
            <option value="editor">에디터</option>
            <option value="member">멤버</option>
          </select>
        </div>

        <div className="form-section">
          <label className="form-label">멤버 추가</label>
          <div className="member-input-group">
            <input
              type="text"
              className="form-input"
              value={formData.newMemberId}
              onChange={(e) => handleInputChange('newMemberId', e.target.value)}
              placeholder="멤버 ID를 입력하세요"
            />
            <button
              type="button"
              className="add-member-button"
              onClick={handleAddMember}
            >
              추가
            </button>
          </div>
          
          <div className="member-list">
            {formData.members.map((member, index) => (
              <div key={index} className="member-item">
                <span className="member-id">{member.id}</span>
                <span className="member-permission">{member.permission}</span>
                <button
                  type="button"
                  className="remove-member-button"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">메모</label>
          <textarea
            className="form-textarea"
            value={formData.memo}
            onChange={(e) => handleInputChange('memo', e.target.value)}
            placeholder="그룹에 대한 메모를 입력하세요"
            rows={3}
          />
        </div>

        <div className="form-section">
          <label className="form-label">관련 URL</label>
          <input
            type="url"
            className="form-input"
            value={formData.relatedUrl}
            onChange={(e) => handleInputChange('relatedUrl', e.target.value)}
            placeholder="관련 URL을 입력하세요"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onBack}>
            취소
          </button>
          <button type="submit" className="submit-button">
            생성
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlaceGroupForm;
