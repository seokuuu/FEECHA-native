# FEE-CHA API 명세서

## 기본 정보

- **Base URL**: `https://api.fee-cha.com/v1`
- **인증 방식**: Bearer Token (JWT)
- **Content-Type**: `application/json` (파일 업로드 시: `multipart/form-data`)

## 공통 헤더

```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

## 공통 응답 형식

### 성공 응답
```json
{
  "data": {...},
  "message": "성공 메시지" (선택적)
}
```

### 에러 응답
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

## 목차

1. [인증 (Authentication)](#1-인증-authentication)
2. [사용자 (Users)](#2-사용자-users)
3. [사장님 (Vendors)](#3-사장님-vendors)
4. [의뢰 (Requests)](#4-의뢰-requests)
5. [견적 (Quotations)](#5-견적-quotations)
6. [예약 (Bookings)](#6-예약-bookings)
7. [결제 (Payments)](#7-결제-payments)
8. [채팅 (Chat)](#8-채팅-chat)
9. [리뷰 (Reviews)](#9-리뷰-reviews)
10. [정산 (Settlements)](#10-정산-settlements)
11. [파일 (Files)](#11-파일-files)
12. [알림 (Notifications)](#12-알림-notifications)
13. [관리자 (Admin)](#13-관리자-admin)

---

## 1. 인증 (Authentication)

### 1.1 회원가입

```
POST /auth/signup
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "role": "CLIENT"
}
```

**Response (200):**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "홍길동",
      "role": "CLIENT"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 1.2 로그인

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (200):** 회원가입과 동일

### 1.3 토큰 갱신

```
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

### 1.4 로그아웃

```
POST /auth/logout
```

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "message": "로그아웃되었습니다."
}
```

### 1.5 카카오 로그인

```
GET /auth/kakao
```

→ 카카오 OAuth 페이지로 리다이렉트

```
GET /auth/kakao/callback?code={authCode}
```

**Response (200):**
```json
{
  "data": {
    "user": {...},
    "accessToken": "...",
    "refreshToken": "...",
    "isNewUser": true
  }
}
```

### 1.6 구글 로그인

```
GET /auth/google
GET /auth/google/callback?code={authCode}
```

응답 형식은 카카오와 동일

### 1.7 애플 로그인

```
GET /auth/apple
GET /auth/apple/callback
```

응답 형식은 카카오와 동일

---

## 2. 사용자 (Users)

### 2.1 내 정보 조회

```
GET /users/me
```

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "role": "CLIENT",
    "profileImage": "https://...",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

### 2.2 내 정보 수정

```
PATCH /users/me
```

**Request Body:**
```json
{
  "name": "홍길동",
  "phone": "010-9999-9999",
  "profileImage": "https://..."
}
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "name": "홍길동",
    ...
  }
}
```

### 2.3 비밀번호 변경

```
PATCH /users/me/password
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Response (200):**
```json
{
  "message": "비밀번호가 변경되었습니다."
}
```

### 2.4 회원 탈퇴

```
DELETE /users/me
```

**Request Body:**
```json
{
  "password": "Password123!",
  "reason": "서비스가 만족스럽지 않아서"
}
```

**Response (200):**
```json
{
  "message": "회원 탈퇴가 완료되었습니다."
}
```

---

## 3. 사장님 (Vendors)

### 3.1 사장님 프로필 생성

```
POST /vendor-profiles
```

**Role:** `VENDOR`

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

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "vendorId": "uuid",
    "businessName": "OO커피차",
    ...
  }
}
```

### 3.2 사장님 프로필 목록

```
GET /vendor-profiles
```

**Query Parameters:**
- `region`: 지역 필터 (예: "서울", "경기")
- `minPrice`: 최소 가격
- `maxPrice`: 최대 가격
- `services`: 서비스 필터 (예: "coffee,lunchBox")
- `sort`: 정렬 (예: "rating", "price", "recent")
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지 크기 (기본값: 20)

**예시:**
```
GET /vendor-profiles?region=서울&services=coffee,lunchBox&sort=rating&page=1&limit=20
```

**Response (200):**
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

### 3.3 사장님 프로필 상세

```
GET /vendor-profiles/:id
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "vendorId": "uuid",
    "businessName": "OO커피차",
    "description": "...",
    "regions": [...],
    "basePrice": 1000000,
    "rating": 4.8,
    "reviewCount": 42,
    "services": {...},
    "priceOptions": {...},
    "portfolioImages": [...],
    "vehicleInfo": {...},
    "unavailableDates": ["2025-12-31", "2026-01-01"],
    "reviews": [...]
  }
}
```

### 3.4 사장님 프로필 수정

```
PATCH /vendor-profiles/:id
```

**Role:** `VENDOR` (본인만)

**Request Body:** 생성 시와 동일 (부분 업데이트 가능)

### 3.5 사장님 캘린더 조회

```
GET /vendor-profiles/:id/calendar
```

**Query Parameters:**
- `year`: 연도 (예: 2025)
- `month`: 월 (예: 12)

**Response (200):**
```json
{
  "data": {
    "unavailableDates": ["2025-12-31", "2026-01-01"],
    "bookings": [
      {
        "date": "2025-12-31",
        "status": "CONFIRMED"
      }
    ]
  }
}
```

### 3.6 사장님 예약 불가 날짜 설정

```
POST /vendor-profiles/:id/unavailable-dates
```

**Request Body:**
```json
{
  "dates": ["2025-12-31", "2026-01-01"]
}
```

**Response (200):**
```json
{
  "message": "예약 불가 날짜가 설정되었습니다."
}
```

### 3.7 사장님 인증 제출

```
POST /vendors/certification
```

**Role:** `VENDOR`

**Request (multipart/form-data):**
```
businessLicense: File
businessReportCert: File
hygieneCert: File
vehicleImages[]: File[]
```

**Response (201):**
```json
{
  "data": {
    "certificationId": "uuid",
    "status": "PENDING",
    "submittedAt": "2025-01-01T00:00:00Z"
  }
}
```

### 3.8 사장님 인증 상태 조회

```
GET /vendors/certification
```

**Role:** `VENDOR`

**Response (200):**
```json
{
  "data": {
    "certificationId": "uuid",
    "status": "PENDING",
    "rejectionReason": null,
    "submittedAt": "2025-01-01T00:00:00Z",
    "reviewedAt": null
  }
}
```

---

## 4. 의뢰 (Requests)

### 4.1 의뢰 생성

```
POST /requests
```

**Role:** `CLIENT`

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

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "clientId": "uuid",
    "title": "12/31 경기 남양주 드라마 촬영장 커피차",
    "status": "OPEN",
    "quotationCount": 0,
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

### 4.2 의뢰 목록

```
GET /requests
```

**Query Parameters:**
- `region`: 지역
- `date`: 날짜 (YYYY-MM-DD)
- `status`: 상태 (`OPEN`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`)
- `page`, `limit`

**예시:**
```
GET /requests?region=서울&status=OPEN&page=1&limit=20
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "clientId": "uuid",
      "title": "...",
      "date": "2025-12-31",
      "location": {...},
      "estimatedPeople": 150,
      "budget": {...},
      "status": "OPEN",
      "quotationCount": 5,
      "createdAt": "..."
    }
  ],
  "pagination": {...}
}
```

### 4.3 의뢰 상세

```
GET /requests/:id
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "clientId": "uuid",
    "client": {
      "id": "uuid",
      "name": "홍길동",
      "profileImage": "..."
    },
    "title": "...",
    "date": "2025-12-31",
    "startTime": "10:00",
    "endTime": "18:00",
    "location": {...},
    "estimatedPeople": 150,
    "budget": {...},
    "services": {...},
    "additionalInfo": "...",
    "designFiles": [...],
    "status": "OPEN",
    "quotationCount": 5,
    "quotations": [...]
  }
}
```

### 4.4 의뢰 수정

```
PATCH /requests/:id
```

**Role:** `CLIENT` (본인만)

**Request Body:** 생성 시와 동일 (부분 업데이트 가능)

### 4.5 의뢰 취소

```
DELETE /requests/:id
```

**Role:** `CLIENT` (본인만)

**Response (200):**
```json
{
  "message": "의뢰가 취소되었습니다."
}
```

### 4.6 내 의뢰 목록

```
GET /requests/my
```

**Role:** `CLIENT`

**Query Parameters:** `status`, `page`, `limit`

---

## 5. 견적 (Quotations)

### 5.1 견적 제출

```
POST /quotations
```

**Role:** `VENDOR`

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

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "requestId": "uuid",
    "vendorId": "uuid",
    "status": "SUBMITTED",
    "totalPrice": 2563000,
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

### 5.2 견적 목록 (의뢰별)

```
GET /requests/:requestId/quotations
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "vendor": {
        "id": "uuid",
        "businessName": "OO커피차",
        "rating": 4.8,
        "responseTime": "5분"
      },
      "items": [...],
      "totalPrice": 2563000,
      "status": "SUBMITTED",
      "createdAt": "..."
    }
  ]
}
```

### 5.3 견적 상세

```
GET /quotations/:id
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "requestId": "uuid",
    "vendorId": "uuid",
    "vendor": {...},
    "items": [...],
    "travelFee": 30000,
    "vat": 233000,
    "totalPrice": 2563000,
    "depositRate": 30,
    "depositPrice": 768900,
    "remainingPrice": 1794100,
    "notes": "...",
    "status": "SUBMITTED",
    "expiresAt": "...",
    "createdAt": "..."
  }
}
```

### 5.4 견적 선택

```
POST /quotations/:id/select
```

**Role:** `CLIENT`

**Response (200):**
```json
{
  "data": {
    "quotationId": "uuid",
    "bookingId": "uuid",
    "status": "SELECTED"
  }
}
```

### 5.5 견적 수정

```
PATCH /quotations/:id
```

**Role:** `VENDOR` (본인만, `SUBMITTED` 상태만)

### 5.6 견적 취소

```
DELETE /quotations/:id
```

**Role:** `VENDOR` (본인만, `SUBMITTED` 상태만)

---

## 6. 예약 (Bookings)

### 6.1 예약 목록

```
GET /bookings
```

**Query Parameters:**
- `status`: 상태
- `page`, `limit`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "requestId": "uuid",
      "quotationId": "uuid",
      "clientId": "uuid",
      "vendorId": "uuid",
      "client": {...},
      "vendor": {...},
      "eventDate": "2025-12-31",
      "totalPrice": 2563000,
      "depositPrice": 768900,
      "status": "CONFIRMED",
      "createdAt": "..."
    }
  ],
  "pagination": {...}
}
```

### 6.2 예약 상세

```
GET /bookings/:id
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "request": {...},
    "quotation": {...},
    "client": {...},
    "vendor": {...},
    "eventDate": "2025-12-31",
    "totalPrice": 2563000,
    "depositPrice": 768900,
    "remainingPrice": 1794100,
    "status": "CONFIRMED",
    "payment": {
      "depositPaid": true,
      "depositPaidAt": "...",
      "remainingPaid": false
    },
    "createdAt": "...",
    "confirmedAt": "..."
  }
}
```

### 6.3 예약 완료 처리

```
POST /bookings/:id/complete
```

**Role:** `VENDOR`

**Response (200):**
```json
{
  "message": "예약이 완료 처리되었습니다."
}
```

### 6.4 예약 취소

```
POST /bookings/:id/cancel
```

**Request Body:**
```json
{
  "reason": "촬영 일정 변경"
}
```

**Response (200):**
```json
{
  "data": {
    "bookingId": "uuid",
    "refundAmount": 384450,
    "refundRate": 50
  }
}
```

---

## 7. 결제 (Payments)

### 7.1 예약금 결제 요청

```
POST /payments/deposit
```

**Request Body:**
```json
{
  "bookingId": "uuid",
  "paymentMethod": "CARD",
  "amount": 768900
}
```

**Response (200):**
```json
{
  "data": {
    "paymentId": "uuid",
    "merchantUid": "booking_uuid",
    "amount": 768900,
    "portoneData": {
      "pg": "nice",
      "pay_method": "card",
      "merchant_uid": "booking_uuid",
      "name": "커피차 예약금",
      "amount": 768900,
      "buyer_email": "...",
      "buyer_name": "...",
      "buyer_tel": "..."
    }
  }
}
```

### 7.2 결제 검증

```
POST /payments/verify
```

**Request Body:**
```json
{
  "imp_uid": "imp_123456",
  "merchant_uid": "booking_uuid"
}
```

**Response (200):**
```json
{
  "data": {
    "paymentId": "uuid",
    "status": "PAID",
    "amount": 768900,
    "paidAt": "2025-01-01T00:00:00Z"
  }
}
```

### 7.3 포트원 웹훅

```
POST /payments/webhook
```

**Request Body (포트원):**
```json
{
  "imp_uid": "imp_123456",
  "merchant_uid": "booking_uuid",
  "status": "paid",
  "amount": 768900
}
```

### 7.4 환불 요청

```
POST /payments/:id/refund
```

**Request Body:**
```json
{
  "reason": "촬영 취소",
  "refundAmount": 768900
}
```

**Response (200):**
```json
{
  "data": {
    "refundId": "uuid",
    "refundAmount": 768900,
    "status": "REFUNDED",
    "refundedAt": "2025-01-01T00:00:00Z"
  }
}
```

### 7.5 결제 내역

```
GET /payments
```

**Query Parameters:** `status`, `page`, `limit`

---

## 8. 채팅 (Chat)

### 8.1 채팅방 목록

```
GET /chat/rooms
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "requestId": "uuid",
      "clientId": "uuid",
      "vendorId": "uuid",
      "otherUser": {
        "id": "uuid",
        "name": "홍길동",
        "profileImage": "..."
      },
      "lastMessage": "견적서 확인했습니다",
      "lastMessageAt": "2025-01-01T12:00:00Z",
      "unreadCount": 3
    }
  ]
}
```

### 8.2 채팅방 생성 또는 조회

```
POST /chat/rooms
```

**Request Body:**
```json
{
  "requestId": "uuid",
  "vendorId": "uuid"
}
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "requestId": "uuid",
    "clientId": "uuid",
    "vendorId": "uuid",
    "createdAt": "..."
  }
}
```

### 8.3 채팅 메시지 조회

```
GET /chat/rooms/:roomId/messages
```

**Query Parameters:**
- `page`, `limit`
- `before`: 특정 시간 이전 메시지 (ISO 8601)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "roomId": "uuid",
      "senderId": "uuid",
      "content": "안녕하세요",
      "type": "TEXT",
      "isRead": true,
      "createdAt": "2025-01-01T10:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### 8.4 파일 업로드 (채팅용)

```
POST /chat/rooms/:roomId/files
```

**Request (multipart/form-data):**
```
file: File
```

**Response (200):**
```json
{
  "data": {
    "url": "https://...",
    "fileName": "design.pdf",
    "size": 1024000,
    "type": "FILE"
  }
}
```

### 8.5 읽음 처리

```
POST /chat/rooms/:roomId/read
```

**Request Body:**
```json
{
  "messageIds": ["uuid1", "uuid2"]
}
```

**Response (200):**
```json
{
  "message": "읽음 처리되었습니다."
}
```

---

## 9. 리뷰 (Reviews)

### 9.1 리뷰 작성

```
POST /reviews
```

**Role:** `CLIENT`

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

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "bookingId": "uuid",
    "vendorId": "uuid",
    "rating": 5,
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

### 9.2 리뷰 목록

```
GET /reviews
```

**Query Parameters:**
- `vendorId`: 사장님 ID
- `page`, `limit`
- `sort`: `recent`, `rating_high`, `rating_low`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "client": {
        "name": "홍길동",
        "profileImage": "..."
      },
      "booking": {
        "eventDate": "2025-12-31"
      },
      "rating": 5,
      "content": "...",
      "images": [...],
      "createdAt": "..."
    }
  ],
  "summary": {
    "averageRating": 4.8,
    "totalCount": 42
  },
  "pagination": {...}
}
```

### 9.3 리뷰 상세

```
GET /reviews/:id
```

### 9.4 리뷰 신고

```
POST /reviews/:id/report
```

**Request Body:**
```json
{
  "reason": "허위 리뷰",
  "description": "상세 설명..."
}
```

**Response (200):**
```json
{
  "message": "신고가 접수되었습니다."
}
```

---

## 10. 정산 (Settlements)

### 10.1 정산 내역

```
GET /settlements
```

**Role:** `VENDOR`

**Query Parameters:**
- `status`: `PENDING`, `COMPLETED`
- `month`: `2025-01` (YYYY-MM)
- `page`, `limit`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "bookingId": "uuid",
      "booking": {...},
      "totalPrice": 2563000,
      "platformFee": 256300,
      "vendorAmount": 512600,
      "status": "COMPLETED",
      "scheduledAt": "2025-01-08T00:00:00Z",
      "completedAt": "2025-01-08T00:00:00Z"
    }
  ],
  "summary": {
    "pendingAmount": 1000000,
    "completedAmount": 5000000,
    "pendingCount": 5,
    "completedCount": 20
  },
  "pagination": {...}
}
```

### 10.2 정산 상세

```
GET /settlements/:id
```

### 10.3 정산 계좌 등록

```
POST /settlements/bank-account
```

**Role:** `VENDOR`

**Request Body:**
```json
{
  "bankCode": "004",
  "bankName": "KB국민은행",
  "accountNumber": "123456789012",
  "accountHolder": "홍길동"
}
```

**Response (200):**
```json
{
  "message": "정산 계좌가 등록되었습니다."
}
```

---

## 11. 파일 (Files)

### 11.1 파일 업로드

```
POST /files/upload
```

**Request (multipart/form-data):**
```
file: File
type: 'PROFILE' | 'PORTFOLIO' | 'CERTIFICATION' | 'CHAT' | 'DESIGN'
```

**Response (200):**
```json
{
  "data": {
    "url": "https://s3.amazonaws.com/.../file.jpg",
    "key": "uploads/2025/01/uuid.jpg",
    "size": 1024000,
    "mimeType": "image/jpeg"
  }
}
```

### 11.2 다중 파일 업로드

```
POST /files/upload-multiple
```

**Request (multipart/form-data):**
```
files[]: File[]
type: string
```

**Response (200):**
```json
{
  "data": [
    {
      "url": "...",
      "key": "...",
      ...
    }
  ]
}
```

---

## 12. 알림 (Notifications)

### 12.1 FCM 토큰 등록

```
POST /notifications/fcm-token
```

**Request Body:**
```json
{
  "fcmToken": "fcm_token_string",
  "deviceId": "device_uuid",
  "platform": "IOS" | "ANDROID"
}
```

**Response (200):**
```json
{
  "message": "FCM 토큰이 등록되었습니다."
}
```

### 12.2 알림 목록

```
GET /notifications
```

**Query Parameters:**
- `isRead`: `true` | `false`
- `page`, `limit`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "새로운 견적이 도착했습니다",
      "body": "OO커피차님이 견적을 제출했습니다",
      "type": "NEW_QUOTATION",
      "data": {
        "quotationId": "uuid"
      },
      "isRead": false,
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "unreadCount": 5,
  "pagination": {...}
}
```

### 12.3 알림 읽음 처리

```
PATCH /notifications/:id/read
```

**Response (200):**
```json
{
  "message": "알림이 읽음 처리되었습니다."
}
```

### 12.4 전체 알림 읽음 처리

```
POST /notifications/read-all
```

**Response (200):**
```json
{
  "message": "모든 알림이 읽음 처리되었습니다."
}
```

---

## 13. 관리자 (Admin)

### 13.1 대시보드 통계

```
GET /admin/dashboard
```

**Role:** `ADMIN`

**Response (200):**
```json
{
  "data": {
    "totalUsers": 1000,
    "totalVendors": 50,
    "totalBookings": 200,
    "totalRevenue": 50000000,
    "thisMonthRevenue": 10000000,
    "pendingCertifications": 5,
    "pendingSettlements": 10
  }
}
```

### 13.2 사용자 목록

```
GET /admin/users
```

**Query Parameters:**
- `role`: 역할
- `status`: `ACTIVE`, `SUSPENDED`, `DELETED`
- `search`: 검색어 (이름, 이메일)
- `page`, `limit`

### 13.3 사용자 상세

```
GET /admin/users/:id
```

### 13.4 사용자 정지

```
POST /admin/users/:id/suspend
```

**Request Body:**
```json
{
  "reason": "규정 위반",
  "duration": 30
}
```

### 13.5 사장님 인증 승인

```
POST /admin/certifications/:id/approve
```

**Response (200):**
```json
{
  "message": "인증이 승인되었습니다."
}
```

### 13.6 사장님 인증 거절

```
POST /admin/certifications/:id/reject
```

**Request Body:**
```json
{
  "reason": "서류가 불명확합니다."
}
```

### 13.7 정산 처리

```
POST /admin/settlements/process
```

**Request Body:**
```json
{
  "settlementIds": ["uuid1", "uuid2"]
}
```

**Response (200):**
```json
{
  "data": {
    "processedCount": 10,
    "totalAmount": 5000000
  }
}
```

---

## WebSocket API (Socket.io)

### 연결

```javascript
const socket = io('wss://api.fee-cha.com', {
  auth: {
    token: accessToken
  }
});
```

### 이벤트

#### 채팅방 입장
```javascript
// Client → Server
socket.emit('join-room', { roomId: 'uuid' });

// Server → Client
socket.on('room-joined', (data) => {
  // data: { roomId: 'uuid', messages: [...] }
});
```

#### 메시지 전송
```javascript
// Client → Server
socket.emit('send-message', {
  roomId: 'uuid',
  content: '안녕하세요',
  type: 'TEXT'
});

// Server → All Clients in Room
socket.on('new-message', (message) => {
  // message: { id, roomId, senderId, content, type, createdAt }
});
```

#### 읽음 처리
```javascript
// Client → Server
socket.emit('mark-as-read', {
  roomId: 'uuid',
  messageId: 'uuid'
});

// Server → All Clients
socket.on('message-read', (data) => {
  // data: { messageId, readBy }
});
```

#### 입력 중 표시
```javascript
// Client → Server
socket.emit('typing', { roomId: 'uuid' });

// Server → Other Client
socket.on('user-typing', (data) => {
  // data: { userId, roomId }
});
```

---

## 에러 코드

| 코드 | 메시지 | 설명 |
|------|--------|------|
| 1001 | INVALID_CREDENTIALS | 이메일 또는 비밀번호가 올바르지 않습니다 |
| 1002 | TOKEN_EXPIRED | 토큰이 만료되었습니다 |
| 1003 | UNAUTHORIZED | 인증이 필요합니다 |
| 2001 | USER_NOT_FOUND | 사용자를 찾을 수 없습니다 |
| 2002 | EMAIL_ALREADY_EXISTS | 이미 존재하는 이메일입니다 |
| 3001 | REQUEST_NOT_FOUND | 의뢰를 찾을 수 없습니다 |
| 3002 | BOOKING_NOT_FOUND | 예약을 찾을 수 없습니다 |
| 4001 | PAYMENT_FAILED | 결제에 실패했습니다 |
| 4002 | REFUND_NOT_ALLOWED | 환불이 불가능합니다 |
| 5001 | CERTIFICATION_PENDING | 인증 대기 중입니다 |
| 5002 | CERTIFICATION_REJECTED | 인증이 거절되었습니다 |

---

## 부록

### Pagination 형식

```json
{
  "page": 1,
  "limit": 20,
  "total": 150,
  "totalPages": 8
}
```

### Date/Time 형식

모든 날짜와 시간은 ISO 8601 형식을 사용합니다.

```
2025-01-01T00:00:00Z (UTC)
2025-01-01T09:00:00+09:00 (KST)
```

### 통화 형식

모든 금액은 원(KRW) 단위의 정수로 표현됩니다.

```json
{
  "price": 1000000
}
```

---

## 관련 문서

- [백엔드 요구사항](./03_BACKEND_REQUIREMENTS.md)
- [데이터베이스 스키마](./05_DB_SCHEMA.md)
