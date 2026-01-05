# FEE-CHA 데이터베이스 스키마

## 개요

- **데이터베이스**: PostgreSQL 15+
- **ORM**: Prisma 5.x
- **스키마 언어**: Prisma Schema Language

---

## ER Diagram 개요

```
User (사용자)
├── VendorProfile (사장님 프로필)
│   ├── VendorCertification (인증)
│   ├── UnavailableDate (예약 불가 날짜)
│   └── Review (리뷰 - 받는 쪽)
├── Request (의뢰)
│   ├── Quotation (견적)
│   └── Booking (예약)
├── ChatRoom (채팅방)
│   └── Message (메시지)
├── Review (리뷰 - 작성자)
├── Payment (결제)
├── Settlement (정산)
└── Notification (알림)
```

---

## Prisma 스키마

### 0. 기본 설정

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

### 1. User (사용자)

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String?  // 소셜 로그인 시 null
  name          String
  phone         String?
  role          UserRole
  profileImage  String?
  provider      AuthProvider? // 소셜 로그인 제공자
  providerId    String?       // 소셜 로그인 ID
  status        UserStatus    @default(ACTIVE)

  // 타임스탬프
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime?
  lastLoginAt   DateTime?

  // 관계
  vendorProfile      VendorProfile?
  clientRequests     Request[]        @relation("ClientRequests")
  clientBookings     Booking[]        @relation("ClientBookings")
  vendorQuotations   Quotation[]      @relation("VendorQuotations")
  vendorBookings     Booking[]        @relation("VendorBookings")
  clientChatRooms    ChatRoom[]       @relation("ClientChatRooms")
  vendorChatRooms    ChatRoom[]       @relation("VendorChatRooms")
  messages           Message[]
  reviews            Review[]         @relation("ClientReviews")
  receivedReviews    Review[]         @relation("VendorReviews")
  payments           Payment[]
  settlements        Settlement[]
  notifications      Notification[]
  fcmTokens          FcmToken[]

  @@index([email])
  @@index([role])
  @@map("users")
}

enum UserRole {
  CLIENT
  VENDOR
  ADMIN
}

enum AuthProvider {
  KAKAO
  GOOGLE
  APPLE
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  DELETED
}
```

---

### 2. VendorProfile (사장님 프로필)

```prisma
model VendorProfile {
  id               String   @id @default(uuid())
  userId           String   @unique
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // 기본 정보
  businessName     String
  description      String   @db.Text
  regions          String[] // 활동 지역

  // 가격 정보
  basePrice        Int      // 기본 가격
  basePeople       Int      // 기본 인원

  // 제공 서비스 (JSON)
  services         Json     // { coffee: true, lunchBox: true, ... }
  priceOptions     Json     // { lunchBox: 8000, banner: 150000, ... }

  // 포트폴리오
  portfolioImages  String[] // 이미지 URL 배열

  // 차량 정보 (JSON)
  vehicleInfo      Json     // { size: "5m x 5m", requiresElectricity: true }

  // 통계
  rating           Float    @default(0)
  reviewCount      Int      @default(0)
  responseRate     Float    @default(0) // 응답률 (0-1)
  fastResponseCount Int     @default(0) // 빠른 응답 횟수

  // 타임스탬프
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  // 관계
  certification    VendorCertification?
  unavailableDates UnavailableDate[]
  quotations       Quotation[]
  bookings         Booking[]
  reviews          Review[]
  settlements      Settlement[]

  @@index([userId])
  @@index([regions])
  @@map("vendor_profiles")
}
```

---

### 3. VendorCertification (사장님 인증)

```prisma
model VendorCertification {
  id                    String   @id @default(uuid())
  vendorProfileId       String   @unique
  vendorProfile         VendorProfile @relation(fields: [vendorProfileId], references: [id], onDelete: Cascade)

  // 인증 서류 URL
  businessLicense       String   // 사업자등록증
  businessReportCert    String   // 영업신고증
  hygieneCert           String   // 위생교육증
  vehicleImages         String[] // 차량 사진

  // 상태
  status                CertificationStatus @default(PENDING)
  rejectionReason       String?  @db.Text

  // 타임스탬프
  submittedAt           DateTime @default(now())
  reviewedAt            DateTime?
  reviewedBy            String?  // Admin User ID

  @@index([vendorProfileId])
  @@index([status])
  @@map("vendor_certifications")
}

enum CertificationStatus {
  PENDING
  APPROVED
  REJECTED
}
```

---

### 4. UnavailableDate (예약 불가 날짜)

```prisma
model UnavailableDate {
  id              String   @id @default(uuid())
  vendorProfileId String
  vendorProfile   VendorProfile @relation(fields: [vendorProfileId], references: [id], onDelete: Cascade)

  date            DateTime @db.Date
  reason          String?  // "개인 사정", "예약됨" 등

  createdAt       DateTime @default(now())

  @@unique([vendorProfileId, date])
  @@index([vendorProfileId, date])
  @@map("unavailable_dates")
}
```

---

### 5. Request (의뢰)

```prisma
model Request {
  id               String   @id @default(uuid())
  clientId         String
  client           User     @relation("ClientRequests", fields: [clientId], references: [id], onDelete: Cascade)

  // 기본 정보
  title            String
  date             DateTime @db.Date
  startTime        String   // "10:00"
  endTime          String   // "18:00"

  // 장소 (JSON)
  location         Json     // { address: "", latitude: 0, longitude: 0 }

  // 예산 및 인원
  estimatedPeople  Int
  budgetMin        Int
  budgetMax        Int

  // 필요 서비스 (JSON)
  services         Json     // { coffee: true, lunchBox: true, ... }

  // 추가 정보
  additionalInfo   String?  @db.Text
  designFiles      String[] // 디자인 파일 URL

  // 현장 정보
  filmType         String?  // "드라마", "영화", "예능" 등
  agencyApproval   AgencyApprovalStatus @default(PENDING)

  // 상태
  status           RequestStatus @default(OPEN)

  // 타임스탬프
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  closedAt         DateTime?

  // 관계
  quotations       Quotation[]
  bookings         Booking[]
  chatRooms        ChatRoom[]

  @@index([clientId])
  @@index([date])
  @@index([status])
  @@map("requests")
}

enum RequestStatus {
  OPEN           // 견적 모집 중
  IN_PROGRESS    // 예약 진행 중
  COMPLETED      // 완료
  CANCELLED      // 취소
}

enum AgencyApprovalStatus {
  PENDING        // 진행 예정
  IN_PROGRESS    // 진행 중
  COMPLETED      // 완료
}
```

---

### 6. Quotation (견적)

```prisma
model Quotation {
  id               String   @id @default(uuid())
  requestId        String
  request          Request  @relation(fields: [requestId], references: [id], onDelete: Cascade)
  vendorId         String
  vendor           User     @relation("VendorQuotations", fields: [vendorId], references: [id], onDelete: Cascade)
  vendorProfileId  String
  vendorProfile    VendorProfile @relation(fields: [vendorProfileId], references: [id], onDelete: Cascade)

  // 견적 항목 (JSON 배열)
  items            Json     // [{ name: "커피", price: 900000 }, ...]

  // 금액
  subtotal         Int      // 소계
  travelFee        Int      // 출장비
  vat              Int      // 부가세
  totalPrice       Int      // 총액

  // 예약금 정보
  depositRate      Int      // 예약금 비율 (%)
  depositPrice     Int      // 예약금
  remainingPrice   Int      // 잔금

  // 추가 정보
  notes            String?  @db.Text
  expiresAt        DateTime // 유효기간

  // 상태
  status           QuotationStatus @default(SUBMITTED)

  // 타임스탬프
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  selectedAt       DateTime?

  // 관계
  bookings         Booking[]

  @@index([requestId])
  @@index([vendorId])
  @@index([status])
  @@map("quotations")
}

enum QuotationStatus {
  SUBMITTED      // 제출됨
  SELECTED       // 선택됨
  REJECTED       // 거절됨
  EXPIRED        // 만료됨
  CANCELLED      // 취소됨
}
```

---

### 7. Booking (예약)

```prisma
model Booking {
  id              String   @id @default(uuid())
  requestId       String
  request         Request  @relation(fields: [requestId], references: [id], onDelete: Cascade)
  quotationId     String
  quotation       Quotation @relation(fields: [quotationId], references: [id], onDelete: Cascade)
  clientId        String
  client          User     @relation("ClientBookings", fields: [clientId], references: [id], onDelete: Cascade)
  vendorId        String
  vendor          User     @relation("VendorBookings", fields: [vendorId], references: [id], onDelete: Cascade)
  vendorProfileId String
  vendorProfile   VendorProfile @relation(fields: [vendorProfileId], references: [id], onDelete: Cascade)

  // 이벤트 정보
  eventDate       DateTime @db.Date
  eventStartTime  String
  eventEndTime    String
  location        Json     // 최종 확정된 장소

  // 금액
  totalPrice      Int
  depositPrice    Int
  remainingPrice  Int

  // 매칭 방식 (수수료 계산용)
  matchingType    MatchingType

  // 상태
  status          BookingStatus @default(PENDING_DEPOSIT)

  // 취소 정보
  cancellationReason String? @db.Text
  cancelledBy     String?  // User ID

  // 타임스탬프
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  confirmedAt     DateTime?
  completedAt     DateTime?
  cancelledAt     DateTime?

  // 관계
  payments        Payment[]
  reviews         Review[]
  settlements     Settlement[]

  @@index([clientId])
  @@index([vendorId])
  @@index([eventDate])
  @@index([status])
  @@map("bookings")
}

enum MatchingType {
  DIRECT         // 직접 선택 (5%)
  BIDDING        // 견적 비교 (10%)
}

enum BookingStatus {
  PENDING_DEPOSIT  // 예약금 결제 대기
  CONFIRMED        // 예약 확정
  IN_PROGRESS      // 진행 중
  COMPLETED        // 완료
  CANCELLED        // 취소
  REFUNDED         // 환불 완료
}
```

---

### 8. ChatRoom (채팅방)

```prisma
model ChatRoom {
  id              String   @id @default(uuid())
  requestId       String
  request         Request  @relation(fields: [requestId], references: [id], onDelete: Cascade)
  clientId        String
  client          User     @relation("ClientChatRooms", fields: [clientId], references: [id], onDelete: Cascade)
  vendorId        String
  vendor          User     @relation("VendorChatRooms", fields: [vendorId], references: [id], onDelete: Cascade)

  // 마지막 메시지 정보 (성능 최적화)
  lastMessage     String?
  lastMessageAt   DateTime?

  // 타임스탬프
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // 관계
  messages        Message[]

  @@unique([requestId, clientId, vendorId])
  @@index([clientId])
  @@index([vendorId])
  @@map("chat_rooms")
}
```

---

### 9. Message (메시지)

```prisma
model Message {
  id              String   @id @default(uuid())
  roomId          String
  room            ChatRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)
  senderId        String
  sender          User     @relation(fields: [senderId], references: [id], onDelete: Cascade)

  // 메시지 내용
  content         String   @db.Text
  type            MessageType @default(TEXT)

  // 파일 정보 (type이 IMAGE, FILE일 때)
  fileUrl         String?
  fileName        String?
  fileSize        Int?

  // 읽음 처리
  isRead          Boolean  @default(false)
  readAt          DateTime?

  // 타임스탬프
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([roomId, createdAt])
  @@index([senderId])
  @@map("messages")
}

enum MessageType {
  TEXT
  IMAGE
  FILE
  SYSTEM  // 시스템 메시지 (견적 확정, 예약 확정 등)
}
```

---

### 10. Review (리뷰)

```prisma
model Review {
  id              String   @id @default(uuid())
  bookingId       String   @unique
  booking         Booking  @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  clientId        String
  client          User     @relation("ClientReviews", fields: [clientId], references: [id], onDelete: Cascade)
  vendorId        String
  vendor          User     @relation("VendorReviews", fields: [vendorId], references: [id], onDelete: Cascade)
  vendorProfileId String
  vendorProfile   VendorProfile @relation(fields: [vendorProfileId], references: [id], onDelete: Cascade)

  // 평점
  rating          Int      // 1-5
  ratings         Json     // { serviceQuality: 5, kindness: 5, ... }

  // 리뷰 내용
  content         String   @db.Text
  images          String[] // 사진 URL

  // 신고 정보
  isReported      Boolean  @default(false)
  reportReason    String?

  // 상태
  status          ReviewStatus @default(PUBLISHED)

  // 타임스탬프
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([vendorId])
  @@index([vendorProfileId])
  @@index([rating])
  @@map("reviews")
}

enum ReviewStatus {
  PUBLISHED
  HIDDEN
  DELETED
}
```

---

### 11. Payment (결제)

```prisma
model Payment {
  id              String   @id @default(uuid())
  bookingId       String
  booking         Booking  @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // 결제 정보
  type            PaymentType
  method          PaymentMethod
  amount          Int

  // 포트원 정보
  impUid          String?  @unique // 포트원 결제 고유번호
  merchantUid     String   @unique // 가맹점 주문번호

  // 상태
  status          PaymentStatus @default(PENDING)

  // 실패/취소 정보
  failReason      String?

  // 환불 정보
  refundAmount    Int?
  refundReason    String?  @db.Text
  refundedAt      DateTime?

  // 타임스탬프
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  paidAt          DateTime?
  cancelledAt     DateTime?

  @@index([bookingId])
  @@index([userId])
  @@index([impUid])
  @@index([merchantUid])
  @@map("payments")
}

enum PaymentType {
  DEPOSIT        // 예약금
  REMAINING      // 잔금
}

enum PaymentMethod {
  CARD           // 신용카드
  KAKAOPAY       // 카카오페이
  NAVERPAY       // 네이버페이
  TOSS           // 토스
  BANK_TRANSFER  // 계좌이체
}

enum PaymentStatus {
  PENDING        // 대기
  PAID           // 결제 완료
  FAILED         // 실패
  CANCELLED      // 취소
  REFUNDED       // 환불 완료
}
```

---

### 12. Settlement (정산)

```prisma
model Settlement {
  id              String   @id @default(uuid())
  bookingId       String
  booking         Booking  @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  vendorId        String
  vendor          User     @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  vendorProfileId String
  vendorProfile   VendorProfile @relation(fields: [vendorProfileId], references: [id], onDelete: Cascade)

  // 금액 정보
  totalPrice      Int      // 총 거래액
  depositPrice    Int      // 예약금
  platformFee     Int      // 플랫폼 수수료
  vendorAmount    Int      // 사장님 정산액

  // 계좌 정보 (정산 시점 스냅샷)
  bankCode        String?
  bankName        String?
  accountNumber   String?
  accountHolder   String?

  // 상태
  status          SettlementStatus @default(PENDING)

  // 타임스탬프
  scheduledAt     DateTime // 정산 예정일
  completedAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([vendorId])
  @@index([status])
  @@index([scheduledAt])
  @@map("settlements")
}

enum SettlementStatus {
  PENDING        // 정산 대기
  PROCESSING     // 처리 중
  COMPLETED      // 완료
  FAILED         // 실패
}
```

---

### 13. Notification (알림)

```prisma
model Notification {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // 알림 내용
  title           String
  body            String   @db.Text
  type            NotificationType

  // 추가 데이터 (JSON)
  data            Json?    // { requestId: "", quotationId: "", ... }

  // 읽음 처리
  isRead          Boolean  @default(false)
  readAt          DateTime?

  // 타임스탬프
  createdAt       DateTime @default(now())

  @@index([userId, isRead])
  @@index([createdAt])
  @@map("notifications")
}

enum NotificationType {
  NEW_REQUEST         // 새 의뢰 등록
  NEW_QUOTATION       // 새 견적 도착
  QUOTATION_SELECTED  // 견적 선택됨
  BOOKING_CONFIRMED   // 예약 확정
  PAYMENT_COMPLETED   // 결제 완료
  BOOKING_CANCELLED   // 예약 취소
  REVIEW_REQUESTED    // 리뷰 요청
  REVIEW_WRITTEN      // 리뷰 작성됨
  SETTLEMENT_COMPLETED // 정산 완료
  CERTIFICATION_APPROVED // 인증 승인
  CERTIFICATION_REJECTED // 인증 거절
  SYSTEM             // 시스템 공지
}
```

---

### 14. FcmToken (푸시 알림 토큰)

```prisma
model FcmToken {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  token           String   @unique
  deviceId        String
  platform        Platform

  // 타임스탬프
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([userId, deviceId])
  @@index([userId])
  @@map("fcm_tokens")
}

enum Platform {
  IOS
  ANDROID
}
```

---

## 인덱스 전략

### 주요 인덱스

1. **User**
   - `email` (unique, 로그인)
   - `role` (권한 필터링)

2. **VendorProfile**
   - `userId` (관계)
   - `regions` (지역 검색)

3. **Request**
   - `clientId` (사용자별 조회)
   - `date` (날짜별 검색)
   - `status` (상태별 필터)

4. **Quotation**
   - `requestId`, `vendorId` (관계)
   - `status` (상태 필터)

5. **Booking**
   - `clientId`, `vendorId` (양쪽 조회)
   - `eventDate` (일정 조회)
   - `status` (상태 필터)

6. **Message**
   - `roomId`, `createdAt` (채팅 메시지 조회)
   - `senderId` (발신자별 조회)

7. **Payment**
   - `bookingId` (예약별 결제)
   - `impUid`, `merchantUid` (포트원 검증)

8. **Settlement**
   - `vendorId` (사장님별 정산)
   - `status`, `scheduledAt` (정산 처리)

---

## 마이그레이션 전략

### 초기 마이그레이션

```bash
# 스키마 생성
npx prisma migrate dev --name init

# Prisma Client 생성
npx prisma generate
```

### 시드 데이터

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Admin 사용자 생성
  const adminPassword = await bcrypt.hash('admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@fee-cha.com' },
    update: {},
    create: {
      email: 'admin@fee-cha.com',
      password: adminPassword,
      name: '관리자',
      role: 'ADMIN',
    },
  });

  console.log('✅ Seed data created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 관계 설명

### 1:1 관계
- `User` ↔ `VendorProfile`
- `VendorProfile` ↔ `VendorCertification`
- `Booking` ↔ `Review`

### 1:N 관계
- `User` → `Request` (클라이언트가 여러 의뢰)
- `Request` → `Quotation` (의뢰에 여러 견적)
- `User` → `Message` (사용자가 여러 메시지)
- `VendorProfile` → `Review` (사장님이 여러 리뷰 받음)

### N:M 관계
- 없음 (중간 테이블로 명시적 관리)

---

## 성능 최적화

### 1. 읽기 성능
- 자주 조회되는 필드에 인덱스 설정
- `ChatRoom.lastMessage`, `lastMessageAt` 비정규화
- `VendorProfile.rating`, `reviewCount` 캐싱

### 2. 쓰기 성능
- 배치 작업은 Transaction 사용
- 정산은 Cron Job으로 비동기 처리

### 3. 확장성
- Sharding 고려: `userId`로 샤딩 가능
- Read Replica 사용 (읽기 부하 분산)

---

## 백업 전략

### 자동 백업
- 일일 자동 백업 (PostgreSQL pg_dump)
- 주간 전체 백업
- 트랜잭션 로그 실시간 백업

### 백업 보관
- 최근 7일: 일일 백업
- 최근 4주: 주간 백업
- 1년: 월간 백업

---

## 관련 문서

- [백엔드 요구사항](./03_BACKEND_REQUIREMENTS.md)
- [API 명세서](./04_API_SPECS.md)
- [배포 가이드](./07_DEPLOYMENT.md)
