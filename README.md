# CRIMSON-WEB

> 거기어때 웹 애플리케이션

CRIMSON-WEB은 React와 Vite를 사용하여 구축된 현대적인 웹 애플리케이션입니다.

## 🚀 시작하기

### 필수 요구사항

- Node.js (v18 이상)
- npm 또는 yarn

### 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 브라우저에서 `http://localhost:5173` 접속

## 📦 사용 가능한 스크립트

- `npm run dev` - 개발 서버 시작
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드된 앱 미리보기
- `npm run lint` - ESLint로 코드 검사
- `npm run lint:fix` - ESLint 자동 수정

## 🛠️ 기술 스택

- **React 19** - UI 라이브러리
- **Vite** - 빌드 도구 및 개발 서버
- **ESLint** - 코드 품질 관리
- **CSS3** - 스타일링 (Glassmorphism 디자인)

## 📁 프로젝트 구조

```
src/
├── App.jsx                    # 메인 앱 컴포넌트
├── App.css                    # 앱 스타일
├── main.jsx                   # 앱 진입점
├── index.css                  # 글로벌 스타일
├── components/                # 컴포넌트 폴더
│   ├── index.js              # 컴포넌트 export
│   ├── MapContainer.jsx      # 지도 컨테이너
│   ├── MapContainer.css      # 지도 컨테이너 스타일
│   └── sidebar/              # 사이드바 컴포넌트들
│       ├── index.js          # 사이드바 컴포넌트 export
│       ├── Sidebar.jsx       # 메인 사이드바 컴포넌트
│       ├── Sidebar.css       # 사이드바 스타일
│       ├── static/           # 고정 영역 컴포넌트들
│       │   ├── index.js      # 고정 컴포넌트 export
│       │   ├── SidebarHeader.jsx # 사이드바 헤더
│       │   ├── SidebarHeader.css # 사이드바 헤더 스타일
│       │   ├── TabNavigation.jsx # 탭 네비게이션
│       │   ├── TabNavigation.css # 탭 네비게이션 스타일
│       │   ├── SearchSection.jsx # 검색 섹션
│       │   ├── SearchSection.css # 검색 섹션 스타일
│       │   ├── CreateSection.jsx # 새 리스트 생성 섹션
│       │   └── CreateSection.css # 새 리스트 생성 섹션 스타일
│       └── dynamic/          # 동적 영역 컴포넌트들
│           ├── index.js      # 동적 컴포넌트 export
│           ├── list/         # 리스트 관련 컴포넌트
│           │   ├── index.js  # 리스트 컴포넌트 export
│           │   ├── ListSection.jsx # 리스트 섹션
│           │   ├── ListSection.css # 리스트 섹션 스타일
│           │   ├── ListItem.jsx # 리스트 아이템
│           │   └── ListItem.css # 리스트 아이템 스타일
│           ├── search/       # 검색 결과 관련 컴포넌트
│           │   ├── index.js  # 검색 컴포넌트 export
│           │   ├── SearchResults.jsx # 검색 결과 섹션
│           │   ├── SearchResults.css # 검색 결과 스타일
│           │   ├── PlaceItem.jsx # 장소 아이템
│           │   └── PlaceItem.css # 장소 아이템 스타일
│           └── create/       # 리스트 생성 관련 컴포넌트
│               ├── index.js  # 생성 컴포넌트 export
│               ├── CreateListForm.jsx # 리스트 생성 폼
│               └── CreateListForm.css # 리스트 생성 폼 스타일
└── assets/                   # 정적 자산
```

## 🎨 디자인 특징

- **Glassmorphism** 디자인 적용
- **반응형** 레이아웃
- **그라데이션** 배경
- **부드러운 애니메이션** 효과

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

---

**CRIMSON-WEB** © 2024