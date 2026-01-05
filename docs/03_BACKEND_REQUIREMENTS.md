# FEE-CHA 백엔드 요구사항

## 목차
1. [기술 스택](#1-기술-스택)
2. [인증 및 권한](#2-인증-및-권한)
3. [사용자 관리](#3-사용자-관리)
4. [게시판 시스템](#4-게시판-시스템)
5. [매칭 및 알림](#5-매칭-및-알림)
6. [채팅 시스템](#6-채팅-시스템)
7. [견적 시스템](#7-견적-시스템)
8. [예약 및 결제](#8-예약-및-결제)
9. [리뷰 시스템](#9-리뷰-시스템)
10. [정산 시스템](#10-정산-시스템)
11. [파일 관리](#11-파일-관리)
12. [외부 서비스 연동](#12-외부-서비스-연동)

---

## 1. 기술 스택

### 필수 기술
- **프레임워크**: NestJS 10.x
- **언어**: TypeScript 5.3+
- **데이터베이스**: PostgreSQL 15+
- **ORM**: Prisma 5.x
- **캐시**: Redis 7.x
- **실시간 통신**: Socket.io
- **파일 저장소**: AWS S3 또는 Cloudflare R2

### 패키지 의존성
```json
{
  "@nestjs/core": "^10.0.0",
  "@nestjs/platform-express": "^10.0.0",
  "@nestjs/platform-socket.io": "^10.0.0",
  "@nestjs/websockets": "^10.0.0",
  "@prisma/client": "^5.0.0",
  "prisma": "^5.0.0",
  "redis": "^4.6.0",
  "socket.io": "^4.6.0",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2",
  "@nestjs/jwt": "^10.2.0",
  "@nestjs/passport": "^10.0.3",
  "passport": "^0.7.0",
  "passport-jwt": "^4.0.1",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.1",
  "multer": "^1.4.5-lts.1",
  "aws-sdk": "^2.1500.0"
}
```

---

## 2. 인증 및 권한

### 2.1 인증 방식

#### JWT 기반 인증
- **Access Token**
  - 유효 기간: 1시간
  - Payload: `{ userId, role, email }`
  - 모든 API 요청 시 `Authorization: Bearer <token>` 헤더에 포함

- **Refresh Token**
  - 유효 기간: 30일
  - Redis에 저장 (Key: `refresh:${userId}`, Value: token)
  - `/auth/refresh` 엔드포인트로 Access Token 갱신

#### 소셜 로그인
- **카카오 로그인**
  - Kakao OAuth 2.0 API 사용
  - Callback URL: `/auth/kakao/callback`
  - 최초 로그인 시 자동 회원가입

- **구글 로그인**
  - Google OAuth 2.0 API 사용
  - Callback URL: `/auth/google/callback`

- **애플 로그인** (iOS 필수)
  - Apple Sign In API 사용
  - Callback URL: `/auth/apple/callback`

### 2.2 권한 관리 (RBAC)

#### 역할 (Role)
```typescript
enum UserRole {
  CLIENT = 'CLIENT',     // 클라이언트 (팬)
  VENDOR = 'VENDOR',     // 사장님 (업체)
  ADMIN = 'ADMIN',       // 관리자
}
```

#### 권한 규칙
| 역할 | 접근 가능 기능 |
|------|---------------|
| **CLIENT** | 의뢰 작성, 견적 요청, 예약, 결제, 리뷰 작성 |
| **VENDOR** | 프로필 관리, 견적 제출, 예약 수락, 정산 조회 |
| **ADMIN** | 모든 기능 + 사용자 관리, 정산 관리, 통계 조회 |

#### Guard 구현
```typescript
// JWT Guard
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// Role Guard
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

---

## 3. 사용자 관리

### 3.1 회원가입/로그인

#### POST `/auth/signup`
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "role": "CLIENT" | "VENDOR"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "CLIENT"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**검증 규칙:**
- 이메일: 유효한 이메일 형식, 중복 확인
- 비밀번호: 최소 8자, 영문+숫자+특수문자 조합
- 전화번호: 한국 전화번호 형식 (010-xxxx-xxxx)

#### POST `/auth/login`
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** 회원가입과 동일

#### POST `/auth/refresh`
**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc..."
}
```

### 3.2 프로필 관리

#### GET `/users/me`
현재 로그인한 사용자 정보 조회

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "role": "CLIENT",
  "profileImage": "https://...",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

#### PATCH `/users/me`
프로필 수정

**Request Body:**
```json
{
  "name": "홍길동",
  "phone": "010-9999-9999",
  "profileImage": "https://..."
}
```

### 3.3 사장님 인증

#### POST `/vendors/certification`
사장님 인증 서류 제출

**Request Body (multipart/form-data):**
```
businessLicense: File          // 사업자등록증
businessReportCert: File       // 영업신고증
hygieneCert: File              // 위생교육증
vehicleImages: File[]          // 차량 사진 (정면, 측면, 내부)
```

**Response:**
```json
{
  "certificationId": "uuid",
  "status": "PENDING",
  "submittedAt": "2025-01-01T00:00:00Z"
}
```

#### GET `/vendors/certification/:id`
인증 상태 조회

**Response:**
```json
{
  "certificationId": "uuid",
  "status": "PENDING" | "APPROVED" | "REJECTED",
  "rejectionReason": "string or null",
  "submittedAt": "2025-01-01T00:00:00Z",
  "reviewedAt": "2025-01-02T00:00:00Z or null"
}
```

#### PATCH `/admin/certifications/:id/approve` (ADMIN 전용)
인증 승인

#### PATCH `/admin/certifications/:id/reject` (ADMIN 전용)
인증 거절

**Request Body:**
```json
{
  "reason": "서류가 불명확합니다."
}
```

---

## 4. 게시판 시스템

### 4.1 사장님 프로필 게시판

#### POST `/vendor-profiles`
사장님 프로필 생성 (VENDOR 전용)

**Request Body:**
```json
{
  "businessName": "OO커피차",
  "description": "프리미엄 커피차 서비스",
  "regions": ["서울 전역", "경기 남부"],
  "basePrice": 1000000,
  "basePeople": 200,
  "services": {
    "coffee": true,
    "lunchBox": true,
    "banner": true,
    "xBanner": true,
    "dessert": false
  },
  "priceOptions": {
    "lunchBox": 8000,
    "banner": 150000,
    "xBanner": 50000
  },
  "portfolioImages": ["https://...", "https://..."],
  "vehicleInfo": {
    "size": "5m x 5m",
    "requiresElectricity": true
  }
}
```

#### GET `/vendor-profiles`
사장님 프로필 목록 조회

**Query Parameters:**
```
?region=서울&minPrice=500000&maxPrice=1500000&services=coffee,lunchBox&page=1&limit=20&sort=rating
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "vendorId": "uuid",
      "businessName": "OO커피차",
      "regions": ["서울 전역"],
      "basePrice": 1000000,
      "rating": 4.8,
      "reviewCount": 42,
      "responseTime": "5분",
      "services": {...},
      "portfolioImages": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### GET `/vendor-profiles/:id`
사장님 프로필 상세 조회

### 4.2 클라이언트 의뢰 게시판

#### POST `/requests`
의뢰 작성 (CLIENT 전용)

**Request Body:**
```json
{
  "title": "12/31 경기 남양주 드라마 촬영장 커피차",
  "date": "2025-12-31",
  "startTime": "10:00",
  "endTime": "18:00",
  "location": {
    "address": "경기도 남양주시 OO동",
    "latitude": 37.123456,
    "longitude": 127.123456
  },
  "estimatedPeople": 150,
  "budget": {
    "min": 800000,
    "max": 1200000
  },
  "services": {
    "coffee": true,
    "lunchBox": true,
    "banner": true
  },
  "additionalInfo": "주차 공간 5m x 5m 확보 가능",
  "designFiles": ["https://..."]
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "OPEN",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

#### GET `/requests`
의뢰 목록 조회

**Query Parameters:**
```
?region=서울&date=2025-12-31&status=OPEN&page=1&limit=20
```

#### GET `/requests/:id`
의뢰 상세 조회

---

## 5. 매칭 및 알림

### 5.1 매칭 알림 시스템

#### 의뢰 등록 시 자동 매칭
```typescript
// 의뢰 등록 이벤트 발생 시
@OnEvent('request.created')
async handleRequestCreated(request: Request) {
  // 1. 조건에 맞는 사장님 찾기
  const vendors = await this.findMatchingVendors(request);

  // 2. 우선순위 정렬
  const sortedVendors = this.sortByPriority(vendors);

  // 3. 상위 5~10명에게 푸시 알림
  await this.sendPushNotifications(sortedVendors.slice(0, 10), request);

  // 4. 10분 후 반응 없으면 추가 알림
  await this.scheduleSecondaryNotification(request, sortedVendors.slice(10, 20));
}
```

#### 매칭 조건
1. 활동 지역 일치
2. 날짜 가능 여부 (캘린더 확인)
3. 제공 서비스 일치

#### 우선순위 알고리즘
```typescript
function calculatePriority(vendor: Vendor, request: Request): number {
  let score = 0;

  // 응답률 (0-40점)
  score += vendor.responseRate * 0.4;

  // 평균 별점 (0-30점)
  score += (vendor.rating / 5) * 30;

  // 거리 (0-20점)
  const distance = calculateDistance(vendor.location, request.location);
  score += Math.max(0, 20 - distance);

  // 빠른 응답 횟수 (0-10점)
  score += Math.min(vendor.fastResponseCount / 10, 10);

  return score;
}
```

### 5.2 푸시 알림

#### POST `/notifications/send`
푸시 알림 전송 (시스템 내부 API)

**Request Body:**
```json
{
  "userId": "uuid",
  "title": "새로운 의뢰가 등록되었습니다",
  "body": "12/31 경기 남양주 드라마 촬영장 (예산: 80-120만원)",
  "data": {
    "type": "NEW_REQUEST",
    "requestId": "uuid"
  }
}
```

#### Firebase Cloud Messaging 연동
- Mobile 앱에서 FCM 토큰 등록
- DB에 `user_fcm_tokens` 테이블로 관리
- 푸시 알림 전송 시 Firebase Admin SDK 사용

---

## 6. 채팅 시스템

### 6.1 Socket.io 실시간 채팅

#### 연결
```typescript
// Client → Server
socket.emit('join-room', { roomId: 'uuid' });

// Server → Client
socket.emit('room-joined', { roomId: 'uuid', messages: [...] });
```

#### 메시지 전송
```typescript
// Client → Server
socket.emit('send-message', {
  roomId: 'uuid',
  content: '안녕하세요',
  type: 'TEXT' | 'IMAGE' | 'FILE'
});

// Server → All Clients in Room
socket.to(roomId).emit('new-message', {
  id: 'uuid',
  roomId: 'uuid',
  senderId: 'uuid',
  content: '안녕하세요',
  type: 'TEXT',
  createdAt: '2025-01-01T00:00:00Z'
});
```

#### 읽음 처리
```typescript
// Client → Server
socket.emit('mark-as-read', { roomId: 'uuid', messageId: 'uuid' });

// Server → All Clients
socket.to(roomId).emit('message-read', { messageId: 'uuid', readBy: 'uuid' });
```

### 6.2 REST API (채팅 히스토리)

#### GET `/chat/rooms`
내 채팅방 목록

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "requestId": "uuid",
      "clientId": "uuid",
      "vendorId": "uuid",
      "lastMessage": "견적서 확인했습니다",
      "lastMessageAt": "2025-01-01T12:00:00Z",
      "unreadCount": 3
    }
  ]
}
```

#### GET `/chat/rooms/:id/messages`
채팅방 메시지 조회

**Query Parameters:**
```
?page=1&limit=50
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "senderId": "uuid",
      "content": "안녕하세요",
      "type": "TEXT",
      "createdAt": "2025-01-01T10:00:00Z",
      "isRead": true
    }
  ],
  "pagination": {...}
}
```

#### POST `/chat/rooms/:id/files`
파일 업로드

**Request (multipart/form-data):**
```
file: File
```

**Response:**
```json
{
  "url": "https://s3.../file.pdf",
  "type": "FILE",
  "size": 1024000,
  "fileName": "design.pdf"
}
```

---

## 7. 견적 시스템

### 7.1 견적 제출

#### POST `/quotations`
견적서 작성 (VENDOR 전용)

**Request Body:**
```json
{
  "requestId": "uuid",
  "items": [
    {
      "name": "커피/음료 (150인)",
      "price": 900000
    },
    {
      "name": "도시락 (150인)",
      "price": 1200000
    },
    {
      "name": "현수막 제작",
      "price": 150000
    }
  ],
  "travelFee": 30000,
  "vat": 233000,
  "totalPrice": 2563000,
  "depositRate": 30,
  "depositPrice": 768900,
  "remainingPrice": 1794100,
  "notes": "디자인 시안 확인 후 제작 시작",
  "expiresAt": "2026-01-06T00:00:00Z"
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "SUBMITTED",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

#### GET `/quotations/:id`
견적서 조회

#### PATCH `/quotations/:id/select` (CLIENT 전용)
견적 선택 (예약 확정)

---

## 8. 예약 및 결제

### 8.1 예약 생성

#### POST `/bookings`
예약 생성 (견적 선택 시 자동 생성)

**Response:**
```json
{
  "id": "uuid",
  "requestId": "uuid",
  "quotationId": "uuid",
  "clientId": "uuid",
  "vendorId": "uuid",
  "status": "PENDING_DEPOSIT",
  "totalPrice": 2563000,
  "depositPrice": 768900,
  "createdAt": "2025-01-01T00:00:00Z"
}
```

### 8.2 결제 연동 (포트원)

#### POST `/payments/deposit`
예약금 결제

**Request Body:**
```json
{
  "bookingId": "uuid",
  "paymentMethod": "CARD" | "KAKAOPAY" | "NAVERPAY" | "TOSS",
  "amount": 768900
}
```

**프로세스:**
1. 포트원 결제 요청
2. 포트원 콜백 수신
3. 결제 검증 (금액, 주문번호)
4. 예약 상태 업데이트: `PENDING_DEPOSIT` → `CONFIRMED`
5. 양쪽에 알림 전송

#### POST `/payments/webhook` (포트원 콜백)
포트원 웹훅 수신

**Request Body:**
```json
{
  "imp_uid": "imp_123456",
  "merchant_uid": "booking_uuid",
  "status": "paid",
  "amount": 768900
}
```

**처리:**
1. 서명 검증
2. 결제 정보 조회 (포트원 API)
3. DB 업데이트
4. 사장님에게 예약금 정산 금액 계산 (수수료 차감)

### 8.3 환불

#### POST `/payments/:id/refund`
환불 요청

**Request Body:**
```json
{
  "reason": "촬영 취소",
  "refundAmount": 768900
}
```

**환불 로직:**
```typescript
function calculateRefund(booking: Booking): number {
  const daysUntilEvent = daysBetween(now(), booking.eventDate);

  if (daysUntilEvent >= 7) {
    return booking.depositPrice * 1.0; // 100% 환불
  } else if (daysUntilEvent >= 3) {
    return booking.depositPrice * 0.5; // 50% 환불
  } else {
    return 0; // 환불 불가
  }
}
```

---

## 9. 리뷰 시스템

### 9.1 리뷰 작성

#### POST `/reviews`
리뷰 작성 (CLIENT 전용, 거래 완료 후)

**Request Body:**
```json
{
  "bookingId": "uuid",
  "rating": 5,
  "ratings": {
    "serviceQuality": 5,
    "kindness": 5,
    "punctuality": 5,
    "taste": 5,
    "value": 5
  },
  "content": "정말 만족스러웠습니다!",
  "images": ["https://...", "https://..."]
}
```

**검증:**
- 실제 거래 완료된 예약만 작성 가능
- 중복 작성 불가

#### GET `/reviews`
리뷰 목록 조회

**Query Parameters:**
```
?vendorId=uuid&page=1&limit=20&sort=recent
```

#### POST `/reviews/:id/report`
리뷰 신고

---

## 10. 정산 시스템

### 10.1 정산 계산

#### 수수료 구조
- 직접 선택: 5%
- 견적 비교: 10%

#### 정산 금액 계산
```typescript
function calculateSettlement(booking: Booking): Settlement {
  const feeRate = booking.matchingType === 'DIRECT' ? 0.05 : 0.10;
  const platformFee = booking.totalPrice * feeRate;
  const vendorAmount = booking.depositPrice - platformFee;

  return {
    bookingId: booking.id,
    totalPrice: booking.totalPrice,
    depositPrice: booking.depositPrice,
    platformFee: platformFee,
    vendorAmount: vendorAmount,
    status: 'PENDING',
    scheduledAt: addDays(booking.completedAt, 7), // D+7
  };
}
```

### 10.2 정산 API

#### GET `/settlements`
정산 내역 조회 (VENDOR 전용)

**Query Parameters:**
```
?status=PENDING&month=2025-01&page=1&limit=20
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "bookingId": "uuid",
      "totalPrice": 2563000,
      "platformFee": 256300,
      "vendorAmount": 512600,
      "status": "PENDING" | "COMPLETED",
      "scheduledAt": "2025-01-08T00:00:00Z",
      "completedAt": "2025-01-08T00:00:00Z or null"
    }
  ],
  "summary": {
    "pendingAmount": 1000000,
    "completedAmount": 5000000
  }
}
```

#### POST `/admin/settlements/process` (ADMIN 전용)
정산 실행

**Request Body:**
```json
{
  "settlementIds": ["uuid1", "uuid2", ...]
}
```

---

## 11. 파일 관리

### 11.1 파일 업로드

#### POST `/files/upload`
파일 업로드

**Request (multipart/form-data):**
```
file: File
type: 'PROFILE' | 'PORTFOLIO' | 'CERTIFICATION' | 'CHAT' | 'DESIGN'
```

**Response:**
```json
{
  "url": "https://s3.amazonaws.com/.../file.jpg",
  "key": "uploads/2025/01/uuid.jpg",
  "size": 1024000,
  "mimeType": "image/jpeg"
}
```

**검증:**
- 파일 크기: 최대 50MB
- 이미지: JPG, PNG, HEIC
- 문서: PDF, PSD, AI

### 11.2 S3 설정

```typescript
// AWS S3 Configuration
{
  region: 'ap-northeast-2',
  bucket: 'fee-cha-uploads',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}

// 업로드 경로 구조
uploads/{year}/{month}/{uuid}.{ext}
// 예: uploads/2025/01/123e4567-e89b-12d3-a456-426614174000.jpg
```

---

## 12. 외부 서비스 연동

### 12.1 포트원 (결제)

```typescript
// 포트원 SDK 초기화
import Iamport from 'iamport';
const iamport = new Iamport({
  impKey: process.env.PORTONE_API_KEY,
  impSecret: process.env.PORTONE_API_SECRET,
});

// 결제 검증
const payment = await iamport.payment.getByImpUid(imp_uid);
if (payment.amount !== expectedAmount) {
  throw new Error('결제 금액 불일치');
}
```

### 12.2 Firebase (푸시 알림)

```typescript
// Firebase Admin SDK 초기화
import admin from 'firebase-admin';
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 푸시 알림 전송
await admin.messaging().send({
  token: userFcmToken,
  notification: {
    title: '새로운 의뢰가 등록되었습니다',
    body: '12/31 경기 남양주 (예산: 80-120만원)',
  },
  data: {
    type: 'NEW_REQUEST',
    requestId: 'uuid',
  },
});
```

### 12.3 슬랙 (관리자 알림)

```typescript
// 슬랙 웹훅
await axios.post(process.env.SLACK_WEBHOOK_URL, {
  text: '🎉 새 사장님 인증 요청',
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*OO커피차*님이 인증 대기 중입니다.',
      },
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: '승인하기' },
          url: `https://cms.fee-cha.com/vendors/pending/123`,
        },
      ],
    },
  ],
});
```

---

## 13. 보안 고려사항

### 13.1 입력 검증
- 모든 DTO에 `class-validator` 사용
- SQL Injection 방지 (Prisma ORM 사용)
- XSS 방지 (입력 sanitization)

### 13.2 비밀번호 보안
```typescript
import * as bcrypt from 'bcrypt';

// 회원가입 시 해싱
const hashedPassword = await bcrypt.hash(password, 10);

// 로그인 시 비교
const isMatch = await bcrypt.compare(password, user.hashedPassword);
```

### 13.3 Rate Limiting
```typescript
// NestJS Throttler
@ThrottlerGuard()
@Post('login')
async login() {
  // 1분당 5회 제한
}
```

### 13.4 CORS 설정
```typescript
// main.ts
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://app.fee-cha.com',
    'https://cms.fee-cha.com',
  ],
  credentials: true,
});
```

---

## 14. 에러 처리

### 14.1 에러 코드 정의

```typescript
enum ErrorCode {
  // 인증 (1xxx)
  INVALID_CREDENTIALS = 1001,
  TOKEN_EXPIRED = 1002,
  UNAUTHORIZED = 1003,

  // 사용자 (2xxx)
  USER_NOT_FOUND = 2001,
  EMAIL_ALREADY_EXISTS = 2002,

  // 예약 (3xxx)
  BOOKING_NOT_FOUND = 3001,
  BOOKING_ALREADY_CONFIRMED = 3002,

  // 결제 (4xxx)
  PAYMENT_FAILED = 4001,
  REFUND_NOT_ALLOWED = 4002,
}
```

### 14.2 에러 응답 형식

```json
{
  "statusCode": 400,
  "errorCode": 2002,
  "message": "이미 존재하는 이메일입니다.",
  "timestamp": "2025-01-01T00:00:00Z",
  "path": "/auth/signup"
}
```

---

## 15. 로깅 및 모니터링

### 15.1 Winston 로깅

```typescript
// 로그 레벨
- error: 에러 발생 시
- warn: 경고 (예: 결제 실패)
- info: 주요 이벤트 (회원가입, 예약 확정 등)
- debug: 디버깅 정보

// 로그 포맷
{
  timestamp: '2025-01-01T00:00:00Z',
  level: 'info',
  message: 'User signed up',
  userId: 'uuid',
  context: {...}
}
```

### 15.2 Sentry 에러 추적

```typescript
// Sentry 초기화
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

---

## 16. 테스트 요구사항

### 16.1 단위 테스트 (Jest)
- 모든 Service 클래스 테스트 커버리지 80% 이상
- 주요 비즈니스 로직 테스트

### 16.2 E2E 테스트
- 인증 플로우
- 예약 및 결제 플로우
- 채팅 플로우

---

## 17. 환경 변수

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/fee_cha

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=30d

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=fee-cha-uploads

# 포트원
PORTONE_API_KEY=your-api-key
PORTONE_API_SECRET=your-api-secret

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# 슬랙
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# 카카오
KAKAO_CLIENT_ID=your-client-id
KAKAO_CLIENT_SECRET=your-client-secret

# 구글
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# 애플
APPLE_CLIENT_ID=your-client-id
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
APPLE_PRIVATE_KEY=your-private-key
```

---

## 관련 문서

- [API 명세서](./04_API_SPECS.md)
- [데이터베이스 스키마](./05_DB_SCHEMA.md)
- [배포 가이드](./07_DEPLOYMENT.md)
