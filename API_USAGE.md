# CRIMSON-WEB API 사용 가이드

## 📁 프로젝트 구조

```
src/
├── api/
│   ├── index.js          # Axios 인스턴스 및 공통 API 함수
│   ├── placeGroups.js    # PlaceGroup 관련 API
│   ├── places.js         # Place 관련 API
│   ├── auth.js           # 인증 관련 API
│   └── api.js            # 모든 API 모듈 export
├── hooks/
│   ├── usePlaceGroups.js # PlaceGroup 데이터 관리 훅
│   ├── usePlaces.js      # Place 데이터 관리 훅
│   └── hooks.js          # 모든 훅 export
└── utils/
    └── apiClient.js      # API 유틸리티 함수들
```

## 🚀 기본 사용법

### 1. API 직접 사용

```javascript
import { placeGroupAPI, placeAPI, authAPI } from './api/api';

// PlaceGroup 생성
const createGroup = async () => {
  const result = await placeGroupAPI.createPlaceGroup({
    title: '새로운 PlaceGroup',
    description: '설명',
    icon: '📍',
    isPublic: true
  });
  
  if (result.success) {
    console.log('생성 성공:', result.data);
  } else {
    console.error('생성 실패:', result.error);
  }
};

// 장소 검색
const searchPlaces = async () => {
  const result = await placeAPI.searchPlaces('서교동', {
    category: '카페',
    limit: 10
  });
  
  if (result.success) {
    console.log('검색 결과:', result.data);
  }
};
```

### 2. 커스텀 훅 사용

```javascript
import { usePlaceGroups, usePlaces } from './hooks/hooks';

const MyComponent = () => {
  // PlaceGroup 데이터 관리
  const {
    placeGroups,
    loading,
    error,
    createPlaceGroup,
    updatePlaceGroup,
    deletePlaceGroup
  } = usePlaceGroups();

  // Place 데이터 관리
  const {
    places,
    searchPlaces,
    addToFavorites
  } = usePlaces();

  const handleCreateGroup = async () => {
    const result = await createPlaceGroup({
      title: '새 그룹',
      description: '설명'
    });
    
    if (result.success) {
      alert('그룹이 생성되었습니다!');
    }
  };

  return (
    <div>
      {loading && <div>로딩 중...</div>}
      {error && <div>에러: {error}</div>}
      <button onClick={handleCreateGroup}>그룹 생성</button>
    </div>
  );
};
```

## 🔧 API 설정

### 환경 변수 설정

`.env` 파일을 생성하고 API URL을 설정하세요:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

### 토큰 관리

API 클라이언트는 자동으로 localStorage에서 토큰을 읽어서 요청에 포함합니다:

```javascript
// 로그인 후 토큰 저장
localStorage.setItem('token', 'your-jwt-token');

// 로그아웃 시 토큰 제거
localStorage.removeItem('token');
```

## 📋 API 엔드포인트

### PlaceGroup API

- `GET /place-groups` - PlaceGroup 목록 조회
- `GET /place-groups/:id` - PlaceGroup 상세 조회
- `POST /place-groups` - PlaceGroup 생성
- `PUT /place-groups/:id` - PlaceGroup 수정
- `DELETE /place-groups/:id` - PlaceGroup 삭제
- `POST /place-groups/:id/duplicate` - PlaceGroup 복제
- `POST /place-groups/:id/share` - PlaceGroup 공유
- `POST /place-groups/:id/leave` - PlaceGroup 탈퇴

### Place API

- `GET /places/search` - 장소 검색
- `GET /places/:id` - 장소 상세 조회
- `POST /places` - 장소 생성
- `PUT /places/:id` - 장소 수정
- `DELETE /places/:id` - 장소 삭제
- `POST /places/:id/favorite` - 즐겨찾기 추가
- `DELETE /places/:id/favorite` - 즐겨찾기 제거

### Auth API

- `POST /auth/login` - 로그인
- `POST /auth/logout` - 로그아웃
- `POST /auth/register` - 회원가입
- `GET /auth/profile` - 프로필 조회
- `PUT /auth/profile` - 프로필 수정

## 🎯 실제 사용 예시

### PlaceGroupDetail 컴포넌트에서의 사용

```javascript
// 버튼 클릭 핸들러
const handleButtonClick = async (buttonType) => {
  try {
    let result;
    
    switch (buttonType) {
      case 'share':
        result = await placeGroupAPI.sharePlaceGroup(placeGroup.id, {
          isPublic: true,
          shareType: 'link'
        });
        break;
        
      case 'duplicate':
        result = await placeGroupAPI.duplicatePlaceGroup(placeGroup.id);
        break;
        
      case 'delete':
        if (window.confirm('정말 삭제하시겠습니까?')) {
          result = await placeGroupAPI.deletePlaceGroup(placeGroup.id);
        }
        break;
    }
    
    if (result && result.success) {
      showSuccessMessage(`${buttonType} 작업이 완료되었습니다.`);
    }
  } catch (error) {
    showErrorMessage(`오류: ${error.message}`);
  }
};

// 검색 기능
const handleSearch = async (query) => {
  const result = await placeAPI.searchPlaces(query, {
    groupId: placeGroup.id,
    limit: 20
  });
  
  if (result.success) {
    setSearchResults(result.data);
  }
};
```

## 🛠️ 유틸리티 함수

```javascript
import { 
  formatApiResponse, 
  formatApiError, 
  withLoading, 
  withRetry,
  withCache 
} from './utils/apiClient';

// 재시도 로직이 포함된 API 호출
const retryApiCall = withRetry(placeGroupAPI.getPlaceGroups, 3, 1000);

// 캐시가 포함된 API 호출
const cachedApiCall = withCache(placeGroupAPI.getPlaceGroups, 'placeGroups', 300000);
```

## 🔍 에러 처리

모든 API 함수는 표준화된 응답 형식을 반환합니다:

```javascript
// 성공 응답
{
  success: true,
  data: { /* 실제 데이터 */ },
  status: 200,
  message: "Success"
}

// 에러 응답
{
  success: false,
  error: "에러 메시지",
  status: 400,
  details: { /* 추가 에러 정보 */ }
}
```

## 📝 주의사항

1. **환경 변수**: `REACT_APP_API_URL`을 설정해야 합니다.
2. **토큰 관리**: 로그인 후 토큰을 localStorage에 저장하세요.
3. **에러 처리**: 항상 `result.success`를 확인하세요.
4. **로딩 상태**: UI에서 로딩 상태를 표시하세요.
5. **타입 안전성**: TypeScript 사용을 권장합니다.

## 🚀 다음 단계

1. **React Query 도입**: 서버 상태 관리 개선
2. **TypeScript 적용**: 타입 안전성 향상
3. **에러 바운더리**: 전역 에러 처리
4. **토스트 알림**: 사용자 피드백 개선
5. **무한 스크롤**: 대용량 데이터 처리
