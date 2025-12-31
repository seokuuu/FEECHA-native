# FEE-CHA 커피차 예약 플랫폼

React Native + NativeWind v4 + TypeScript로 구현된 커피차 예약 모바일 앱

## 🎯 주요 기능

- **온보딩**: 3개의 슬라이드로 구성된 앱 소개
- **홈 화면**: 검색, 프로모션 배너, 카테고리 필터, 인기 트럭 리스트
- **필터 검색**: 날짜, 지역, 가격, 스타일별 트럭 검색
- **트럭 상세**: 메뉴, 정보, 리뷰 확인
- **예약 시스템**: 3단계 예약 프로세스 (일정 → 장소 → 요청사항)

## 🏗️ 기술 스택

- **React Native** (Expo SDK 54)
- **NativeWind v4** - Tailwind CSS for React Native
- **TypeScript** - 타입 안전성
- **React Navigation v6** - Stack + Bottom Tabs
- **FSD Architecture** - Feature-Sliced Design

### 주요 라이브러리

- `react-native-calendars` - 날짜 선택
- `@react-native-community/slider` - 가격 슬라이더
- `expo-image-picker` - 이미지 업로드
- `react-native-maps` - 지도 표시

## 📁 FSD 프로젝트 구조

```
src/
├── app/              # 앱 초기화, 네비게이션
│   └── navigation/   # 네비게이션 설정 및 타입
├── pages/            # 5개 페이지
│   ├── onboarding/
│   ├── home/
│   ├── search-filter/
│   ├── truck-detail/
│   └── booking/
├── widgets/          # 복합 UI 컴포넌트
├── features/         # 비즈니스 로직
├── entities/         # 데이터 모델
└── shared/           # 공통 리소스
    └── ui/           # 14개 재사용 UI 컴포넌트
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm start
```

그리고 Expo Go 앱에서 QR 코드를 스캔하거나:

```bash
# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android

# 웹 브라우저
npm run web
```

## 🎨 디자인 시스템

### 색상 팔레트

- **Primary**: `#F5A623` (오렌지/골드)
- **Background**: `#F9F9F9`
- **Card**: `#FFFFFF`
- **Text Primary**: `#1A1A1A`
- **Text Secondary**: `#666666`

### 공통 컴포넌트 (14개)

- Button, Input, SearchBar
- Card, Chip, Badge, Tag
- Avatar, Rating
- IconButton, Divider
- Loading, EmptyState, TouchableCard

## 📱 화면 구성

1. **Onboarding** - 3개 슬라이드 + 페이지네이션
2. **Home** - 검색 + 프로모션 + 트럭 리스트 + 하단 네비
3. **Search Filter** - 필터칩, 날짜/지역 선택, 가격 슬라이더, 스타일 선택
4. **Truck Detail** - 이미지, 탭(메뉴/정보/리뷰), 메뉴 리스트, 리뷰
5. **Booking** - 3단계 예약 (날짜 → 장소/정보 → 요청사항)

## 🛠️ 개발 환경

- Node.js 20.18.1+
- Expo SDK 54
- TypeScript 5.9.2
- React 19.1.0
- React Native 0.81.5

## ✅ 타입 체크

```bash
npx tsc --noEmit
```

## 📦 빌드

```bash
# Android
eas build --platform android

# iOS
eas build --platform ios
```

## 🎯 다음 단계

- [ ] API 연동
- [ ] 상태 관리 (Zustand/Redux)
- [ ] 실제 지도 연동 (react-native-maps)
- [ ] 이미지 업로드 기능 완성
- [ ] 푸시 알림
- [ ] 결제 시스템

---

🤖 Generated with Claude Code
