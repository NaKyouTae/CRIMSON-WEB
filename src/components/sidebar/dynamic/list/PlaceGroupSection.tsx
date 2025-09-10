import React, { useState, useEffect } from 'react';
import PlaceGroupItem from './PlaceGroupItem';
import { Pagination } from '../../../common';
import './PlaceGroupSection.css';
import { placeGroupsAPI } from '../../../../api/placeGroups';
import { PlaceGroup } from '../../../../../generated/dto';

interface PlaceGroupSectionProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  onItemClick: (item: PlaceGroup) => void;
}

const PlaceGroupSection: React.FC<PlaceGroupSectionProps> = ({ 
  activeFilter, 
  setActiveFilter, 
  sortOrder, 
  setSortOrder, 
  onItemClick 
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [placeGroups, setPlaceGroups] = useState<PlaceGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const handleDropdownToggle = (itemId: string) => {
    setOpenDropdownId(openDropdownId === itemId ? null : itemId);
  };

  const handleDropdownClose = () => {
    setOpenDropdownId(null);
  };

  // API에서 데이터를 가져와서 UI용 데이터로 변환
  const transformPlaceGroupData = (apiData: any[]): PlaceGroup[] => {
    return apiData.map((item, index) => ({
      id: item.id || `temp-${index}`,
      name: item.name || '제목 없음',
      status: item.status || 1,
      category: item.category || 1,
      memo: item.memo || '',
      link: item.link || '',
      createdAt: item.createdAt || Date.now(),
      updatedAt: item.updatedAt || Date.now(),
      // UI용 필드들 (임시 데이터)
      icon: ['🔴', '🟡', '🟢', '🔵', '🟣', '🟠'][index % 6],
      role: 'editor', // 실제로는 사용자 권한에 따라 결정
      roleText: '에디터',
      privacyText: item.status === 1 ? '공개' : '비공개',
      members: Math.floor(Math.random() * 1000) + 1, // 임시 데이터
      saved: Math.floor(Math.random() * 10000) + 1, // 임시 데이터
    }));
  };

  // API 호출
  const fetchPlaceGroups = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await placeGroupsAPI.getPlaceGroups();
      console.log('Place groups response:', response);
      
      // 응답 데이터 변환
      const allData = transformPlaceGroupData(response.groups || response || []);
      
      // 페이지네이션 계산
      const totalItems = allData.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      setTotalPages(totalPages);
      
      // 현재 페이지에 해당하는 데이터만 추출
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = allData.slice(startIndex, endIndex);
      
      setPlaceGroups(paginatedData);
    } catch (err) {
      console.error('Failed to fetch place groups:', err);
      setError('리스트를 불러오는데 실패했습니다.');
      // 에러 시 빈 배열로 설정
      setPlaceGroups([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPlaceGroups(page);
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchPlaceGroups(currentPage);
  }, []);

  return (
    <div className='cont-box'>
      <div className='title'>
        <h2>내 리스트 목록</h2>
      </div>
      <div className='list-option'>
        <ul className='tab-style-label'>
          <li><input type='checkbox' id='chk1' checked /><label htmlFor='chk1'><span>캡틴</span></label></li>
          <li><input type='checkbox' id='chk2' /><label htmlFor='chk2'><span>에디터</span></label></li>
          {/* <li>
            <button 
              className={`${activeFilter === 'captain' ? 'active' : ''}`}
              onClick={() => setActiveFilter('captain')}
            >
              캡틴
            </button>
          </li>
          <li>
            <button 
              className={`${activeFilter === 'editor' ? 'active' : ''}`}
              onClick={() => setActiveFilter('editor')}
            >
              에디터
            </button>
          </li> */}
          <li>
            <button 
              className={`${activeFilter === 'member' ? 'active' : ''}`}
              onClick={() => setActiveFilter('member')}
            >
              멤버
            </button>
          </li>
        </ul>
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          className='sm'
        >
          <option value="latest">최신 생성 순</option>
          <option value="name">이름 순</option>
          <option value="members">멤버 많은 순</option>
          <option value="saved">저장 많은 순</option>
        </select>
      </div>
      <div className='list-wrap'>
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>리스트를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className='error'>
            <p>{error}</p>
            <button className='sm' onClick={() => fetchPlaceGroups(currentPage)}>다시시도</button>
          </div>
        ) : placeGroups.length === 0 ? (
          <div className="empty-container">
            <p>아직 생성된 리스트가 없습니다.</p>
          </div>
        ) : (
          placeGroups.map((item) => (
            <PlaceGroupItem
              key={item.id}
              item={item}
              isOpen={openDropdownId === item.id}
              onToggle={() => handleDropdownToggle(item.id)}
              onClose={handleDropdownClose}
              onItemClick={onItemClick}
            />
          ))
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PlaceGroupSection;
