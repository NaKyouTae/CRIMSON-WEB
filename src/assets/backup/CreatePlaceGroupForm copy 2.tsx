import React, { useState } from 'react';
import './CreatePlaceGroupForm.css';
import { placeGroupsAPI, createPlaceGroupRequest } from '../../api/placeGroups';

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
    category: '',
    defaultPermission: 'editor',
    members: [{ id: 'qhdud4957', permission: 'editor' }],
    newMemberId: '',
    memo: '',
    relatedUrl: ''
  });

  const [selectedIcon, setSelectedIcon] = useState<string>('🐷');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // PlaceGroupCreateRequest 생성
      const request = createPlaceGroupRequest(
        formData.name,
        formData.isPublic,
        formData.category,
        formData.memo,
        formData.relatedUrl
      );
      
      console.log('Creating place group with request:', request);
      
      // API 호출
      const response = await placeGroupsAPI.createPlaceGroup(request);
      
      console.log('Place group created successfully:', response);
      alert('리스트가 성공적으로 생성되었습니다!');
      
      // 성공 시 뒤로 가기
      onBack();
    } catch (error) {
      console.error('Failed to create place group:', error);
      alert('리스트 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='list-create-wrap'>
      <div className='inside-nav'>
        <button className='trans' onClick={onBack}><i className='ic-arrow-left-16' /></button>
        <h2>리스트 생성하기</h2>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        {/* 대표 아이콘 */}
        <div className="form-section">
          <label className="form-label">대표 아이콘</label>
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

        {/* 이름 */}
        <div className="form-section">
          <label className="form-label">이름</label>
          <div className="input-container">
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="특별한 날 가기 좋은 가성비 데이트 장소"
            />
            {formData.name && (
              <button
                type="button"
                className="clear-button"
                onClick={() => handleInputChange('name', '')}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* 공개 여부 */}
        <div className="form-section">
          <label className="form-label">공개 여부</label>
          <div className="radio-group">
            <label className={`radio-option ${formData.isPublic ? 'selected' : ''}`}>
              <input
                type="radio"
                name="privacy"
                checked={formData.isPublic}
                onChange={() => handleInputChange('isPublic', true)}
                style={{ display: 'none' }}
              />
              공개 리스트
            </label>
            <label className={`radio-option ${!formData.isPublic ? 'selected' : ''}`}>
              <input
                type="radio"
                name="privacy"
                checked={!formData.isPublic}
                onChange={() => handleInputChange('isPublic', false)}
                style={{ display: 'none' }}
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
            <option value="">선택</option>
            <option value="데이트">데이트</option>
            <option value="가족">가족</option>
            <option value="친구">친구</option>
            <option value="비즈니스">비즈니스</option>
            <option value="기타">기타</option>
          </select>
        </div>

        {/* 멤버 기본 권한 */}
        <div className="form-section">
          <label className="form-label">멤버 기본 권한</label>
          <div className="radio-group">
            <label className={`radio-option ${formData.defaultPermission === 'editor' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="permission"
                checked={formData.defaultPermission === 'editor'}
                onChange={() => handleInputChange('defaultPermission', 'editor')}
                style={{ display: 'none' }}
              />
              에디터
            </label>
            <label className={`radio-option ${formData.defaultPermission === 'viewer' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="permission"
                checked={formData.defaultPermission === 'viewer'}
                onChange={() => handleInputChange('defaultPermission', 'viewer')}
                style={{ display: 'none' }}
              />
              뷰어
            </label>
          </div>
        </div>

        {/* 멤버 관리 */}
        <div className="form-section">
          <label className="form-label">멤버 관리</label>
          <div className="member-input-container">
            <input
              type="text"
              className="form-input"
              value={formData.newMemberId}
              onChange={(e) => handleInputChange('newMemberId', e.target.value)}
              placeholder="멤버 아이디 입력"
            />
            <button
              type="button"
              className="add-button"
              onClick={handleAddMember}
            >
              +
            </button>
          </div>
          
          <div className="member-list">
            {formData.members.map((member, index) => (
              <div key={index} className="member-item">
                <span className="member-id">{member.id}</span>
                <select
                  className="member-permission"
                  value={member.permission}
                  onChange={(e) => {
                    const updatedMembers = [...formData.members];
                    updatedMembers[index].permission = e.target.value;
                    handleInputChange('members', updatedMembers);
                  }}
                >
                  <option value="editor">에디터</option>
                  <option value="viewer">뷰어</option>
                </select>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  -
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 메모 */}
        <div className="form-section">
          <label className="form-label">메모</label>
          <textarea
            className="form-textarea"
            value={formData.memo}
            onChange={(e) => handleInputChange('memo', e.target.value)}
            placeholder="메모 입력"
            rows={3}
          />
        </div>

        {/* 관련 URL */}
        <div className="form-section">
          <label className="form-label">관련 URL</label>
          <input
            type="url"
            className="form-input"
            value={formData.relatedUrl}
            onChange={(e) => handleInputChange('relatedUrl', e.target.value)}
            placeholder="관련 URL 입력"
          />
        </div>

        {/* 생성하기 버튼 */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="create-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? '생성 중...' : '생성하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlaceGroupForm;
