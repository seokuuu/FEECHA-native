# FEE-CHA Mobile 개발 진행상황

> 마지막 업데이트: 2026-01-05

## 📊 전체 진행률

- **Phase 1 (MVP)**: 14/27 화면 (52%)
- **Phase 2 (고급)**: 0/8 화면 (0%)
- **Phase 3 (부가)**: 0/5 화면 (0%)
- **총 진행률**: 14/40 화면 (35%)

---

## 🔓 인증 화면 (3/3) ✅

- [x] **Onboarding** - 3개 슬라이드 + 페이지네이션
- [x] **Login** - 이메일 로그인 (Mock 데이터)
- [x] **Signup** - 역할 선택 (CLIENT/VENDOR)

---

## 👤 클라이언트 화면 (4/15)

### Tab Navigation (1/4)
- [x] **Home** - 검색바, 프로모션 배너, 카테고리, 사장님 카드 목록
- [ ] **Requests** - 내 의뢰 목록
- [ ] **Bookings** - 내 예약 목록
- [ ] **MyPage** - 프로필, 설정, 로그아웃

### Stack Navigation (3/11)
#### 사장님 탐색
- [ ] **VendorList** - 사장님 목록 (필터, 정렬)
- [x] **VendorDetail** - 프로필 상세 (포트폴리오, 메뉴, 리뷰, 견적 요청)

#### 의뢰 플로우
- [x] **RequestCreate** - 의뢰 작성 (날짜, 장소, 인원, 예산, 서비스 선택)
- [ ] **RequestDetail** - 의뢰 상세 (받은 견적 목록)
- [ ] **RequestEdit** - 의뢰 수정

#### 견적 플로우
- [x] **QuotationList** - 견적 비교 테이블
- [ ] **QuotationDetail** - 견적 상세 (항목별 가격, 확정하기)

#### 예약 & 결제
- [ ] **BookingConfirm** - 예약 확정 확인
- [ ] **BookingDetail** - 예약 상세 (일정, 사장님 정보, 취소)
- [ ] **Payment** - 포트원 결제 (예약금)
- [ ] **PaymentSuccess** - 결제 완료

---

## 🚚 사장님 화면 (0/11)

### Tab Navigation (0/4)
- [ ] **Dashboard** - 이번 달 매출, 예약 현황, 통계
- [ ] **Quotations** - 견적 관리 (제출, 선택됨, 만료)
- [ ] **Calendar** - 예약 일정, 예약 불가 날짜 설정
- [ ] **MyPage** - 프로필, 정산, 설정

### Stack Navigation (0/7)
#### 프로필 관리
- [ ] **VendorProfileCreate** - 프로필 등록 (상호명, 지역, 가격, 서비스, 포트폴리오)
- [ ] **VendorProfileEdit** - 프로필 수정
- [ ] **VendorCertification** - 인증 서류 제출 (사업자등록증 등)

#### 의뢰 & 견적
- [ ] **RequestList** - 새 의뢰 목록 (지역 기반 필터)
- [ ] **RequestDetailForVendor** - 의뢰 상세 (견적 제출하기)
- [ ] **QuotationCreate** - 견적 제출 (항목별 가격 입력)
- [ ] **QuotationDetailForVendor** - 내 견적 상세

---

## 💬 공통 화면 (0/5)

### 채팅
- [ ] **ChatRoomList** - 채팅 목록 (읽지 않은 개수)
- [ ] **ChatRoom** - 1:1 채팅 (Socket.io, 파일 전송, 견적 확정 버튼)

### 리뷰
- [ ] **ReviewWrite** - 리뷰 작성 (별점, 사진)
- [ ] **ReviewList** - 리뷰 목록 (사장님별)

### 알림
- [ ] **NotificationCenter** - 알림 센터

---

## 🎨 UI 컴포넌트 상태 (19/19) ✅

### Atoms (기본)
- [x] Button (primary, secondary, outline, text + icon 지원)
- [x] Input (focus, error, icon 지원)
- [x] SearchInput (검색바)
- [x] Badge (variant 5종)
- [x] Chip
- [x] Tag
- [x] Avatar (이미지/이니셜/아이콘)
- [x] Rating (별점)
- [x] IconButton
- [x] Divider
- [x] Loading
- [x] EmptyState

### Molecules (조합)
- [x] Card (padding, shadow 옵션)
- [x] TouchableCard
- [x] VendorCard (사장님 카드 - 이미지, 별점, 가격, 찜)
- [x] ChatBubble (클라이언트/사장님 말풍선)
- [x] PromotionBanner (배너 + CTA)
- [x] QuotationListItem (견적 리스트 아이템)
- [x] VendorInfoBlock (프로필 헤더 블록)

---

## 🗂️ 상태 관리 (완료) ✅

### Zustand Stores (9개)
- [x] authStore (로그인, 로그아웃, 토큰)
- [x] userStore (프로필)
- [x] vendorStore (사장님 프로필)
- [x] requestStore (의뢰)
- [x] quotationStore (견적)
- [x] bookingStore (예약)
- [x] chatStore (채팅 + Socket.io)
- [x] reviewStore (리뷰)
- [x] notificationStore (알림)

### API & Hooks
- [x] API Client (Axios + 자동 토큰 갱신)
- [x] useRequest hook (에러 처리: 401, 403, 404, 500)
- [x] Mock 데이터 (vendors, requests, quotations)

---

## 🎯 Phase 1 (MVP) 목표

### 필수 화면 (16개 추가 필요)
1. VendorDetail
2. RequestCreate
3. RequestDetail
4. QuotationList
5. QuotationDetail
6. BookingConfirm
7. BookingDetail
8. Payment
9. VendorProfileCreate
10. RequestListForVendor
11. QuotationCreate
12. ChatRoomList
13. ChatRoom
14. ReviewWrite (간단 버전)

### 완료 기준
- 클라이언트: 의뢰 → 견적 비교 → 예약 → 결제 플로우 작동
- 사장님: 프로필 등록 → 의뢰 확인 → 견적 제출 플로우 작동
- 채팅: 기본 메시지 송수신

---

## 📍 다음 작업 우선순위

### 🔴 High (이번 주)
1. [x] VendorDetail - 사장님 프로필 상세 화면 ✅
2. [x] RequestCreate - 의뢰 작성 화면 ✅
3. [x] QuotationList - 견적 비교 화면 ✅
4. [ ] QuotationDetail - 견적 상세 및 예약 확정
5. [ ] RequestDetail - 의뢰 상세 및 받은 견적 목록

### 🟡 Medium (다음 주)
4. [ ] VendorProfileCreate - 사장님 프로필 등록
5. [ ] ChatRoom - 채팅방 (Socket.io)
6. [ ] Payment - 결제 화면

### 🟢 Low (이후)
7. [ ] ReviewWrite
8. [ ] NotificationCenter
9. [ ] Settings

---

## 🛠️ 기술 스택 현황

- [x] React Native 0.81 (Expo SDK 54)
- [x] TypeScript 5
- [x] NativeWind 4 (Tailwind CSS)
- [x] React Navigation 6
- [x] Zustand 5 (상태 관리)
- [x] Axios + Socket.io-client
- [x] AsyncStorage
- [ ] 포트원 SDK (결제) - 미구현
- [ ] Expo Notifications (푸시) - 미구현
- [ ] React Hook Form + Zod (폼 검증) - 미설치

---

## 📝 참고 문서

- [프로젝트 개요](./01_OVERVIEW.md)
- [기능 명세서](./02_FEATURES.md)
- [API 명세서](./04_API_SPECS.md)
- [로드맵](./08_ROADMAP.md)
