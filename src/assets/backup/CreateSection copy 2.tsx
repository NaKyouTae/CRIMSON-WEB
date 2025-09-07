import React from 'react';
import './CreateSection.css';

interface CreateSectionProps {
  onCreateClick: () => void;
}

const CreateSection: React.FC<CreateSectionProps> = ({ onCreateClick }) => {
  return (
    <div className='btn-list-create' onClick={onCreateClick}>
      <div className='ico'><i className='ic-spot red'/></div>
      <div className='txt'>
        <p>새로운 리스트 생성하기</p>
        <span>원하는 장소를 저장하고 공유해 보세요.</span>
      </div>
    </div>
  );
};

export default CreateSection;
