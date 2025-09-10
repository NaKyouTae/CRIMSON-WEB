import React from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const showPageSize = 10;
  // 페이지 그룹 계산
  const getPageGroups = () => {
    const groups = [];
    const totalGroups = Math.ceil(totalPages / showPageSize);
    
    for (let i = 0; i < totalGroups; i++) {
      const startPage = i * showPageSize + 1;
      const endPage = Math.min((i + 1) * showPageSize, totalPages);
      groups.push({ startPage, endPage });
    }
    
    return groups;
  };

  // 현재 페이지가 속한 그룹 찾기
  const getCurrentGroup = () => {
    const groups = getPageGroups();
    return groups.find(group => 
      currentPage >= group.startPage && currentPage <= group.endPage
    ) || groups[0];
  };

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const currentGroup = getCurrentGroup();
    if (!currentGroup) return [];

    const { startPage, endPage } = currentGroup;
    const pages = [];
    
    // 현재 페이지가 중간보다 한칸 더 높다면 보여지는 페이지도 한칸 더 보여주기
    const isNearEnd = currentPage > endPage - Math.floor(showPageSize / 2);
    const adjustedStartPage = isNearEnd ? Math.max(1, endPage - showPageSize + 1) : startPage;
    const adjustedEndPage = isNearEnd ? endPage : Math.min(totalPages, adjustedStartPage + showPageSize - 1);

    // 첫 페이지
    if (adjustedStartPage > 1) {
      pages.push(1);
      if (adjustedStartPage > 2) {
        pages.push('...');
      }
    }

    // 중간 페이지들
    for (let i = adjustedStartPage; i <= adjustedEndPage; i++) {
      pages.push(i);
    }

    // 마지막 페이지
    if (adjustedEndPage < totalPages) {
      if (adjustedEndPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={() => onPageChange(1)}><i className='ic-pagination first'></i></button>
      <button disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}><i className='ic-pagination prev'></i></button>
      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="page-ellipsis">...</span>
          ) : (
            <button
              className={`${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page as number)}
              title={`${page}페이지로 이동`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage + 1)}><i className='ic-pagination next'></i></button>
      <button disabled={currentPage === 1} onClick={() => onPageChange(totalPages)}><i className='ic-pagination last'></i></button>
    </div>
  );
};

export default Pagination;
