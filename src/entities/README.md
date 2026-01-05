# Zustand Stores 사용 가이드

## 📋 개요

FEE-CHA 프로젝트의 상태 관리는 Zustand를 사용합니다. FSD (Feature-Sliced Design) 아키텍처를 따라 `entities` 폴더에 도메인별 stores가 구성되어 있습니다.

## 🗂️ Store 목록

- **authStore**: 인증 (로그인, 로그아웃, 토큰 관리)
- **userStore**: 사용자 프로필
- **vendorStore**: 사장님 프로필
- **requestStore**: 의뢰 관리
- **quotationStore**: 견적 관리
- **bookingStore**: 예약 관리
- **chatStore**: 채팅 (Socket.io)
- **reviewStore**: 리뷰
- **notificationStore**: 알림

## 🚀 사용 예시

### 1. authStore - 로그인

```typescript
import { useAuthStore } from '@/entities/auth/model';

function LoginScreen() {
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
      // 로그인 성공 시 네비게이션
    } catch (err) {
      console.error(error);
    }
  };

  return (
    <View>
      <Button onPress={handleLogin} disabled={isLoading}>
        {isLoading ? '로그인 중...' : '로그인'}
      </Button>
      {error && <Text>{error}</Text>}
    </View>
  );
}
```

### 2. authStore - 초기 인증 상태 로드

```typescript
import { useAuthStore } from '@/entities/auth/model';
import { useEffect } from 'react';

function App() {
  const { loadStoredAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadStoredAuth(); // AsyncStorage에서 토큰 복원
  }, []);

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
}
```

### 3. requestStore - 의뢰 목록 조회

```typescript
import { useRequestStore } from '@/entities/request/model';
import { useEffect } from 'react';

function RequestListScreen() {
  const { requests, fetchRequests, isLoading } = useRequestStore();

  useEffect(() => {
    fetchRequests({ status: 'OPEN', region: '서울' });
  }, []);

  if (isLoading) return <Loading />;

  return (
    <FlatList
      data={requests}
      renderItem={({ item }) => <RequestCard request={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
```

### 4. quotationStore - 견적 제출 (사장님)

```typescript
import { useQuotationStore } from '@/entities/quotation/model';

function QuotationSubmitScreen({ requestId }) {
  const { submitQuotation, isLoading } = useQuotationStore();

  const handleSubmit = async (formData) => {
    try {
      await submitQuotation({
        requestId,
        items: [
          { name: '커피/음료 (150인)', price: 900000 },
          { name: '도시락 (150인)', price: 1200000 },
        ],
        subtotal: 2100000,
        travelFee: 30000,
        vat: 213000,
        totalPrice: 2343000,
        depositRate: 30,
        depositPrice: 702900,
        remainingPrice: 1640100,
        expiresAt: '2026-01-06T00:00:00Z',
      });

      // 성공 시 처리
    } catch (error) {
      console.error(error);
    }
  };

  return <QuotationForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
```

### 5. chatStore - 실시간 채팅

```typescript
import { useChatStore } from '@/entities/chat/model';
import { useAuthStore } from '@/entities/auth/model';
import { useEffect } from 'react';

function ChatScreen({ roomId }) {
  const { accessToken } = useAuthStore();
  const {
    messages,
    connectSocket,
    disconnectSocket,
    joinRoom,
    sendMessage,
    fetchMessages
  } = useChatStore();

  useEffect(() => {
    if (accessToken) {
      connectSocket(accessToken);
      joinRoom(roomId);
      fetchMessages(roomId);
    }

    return () => {
      disconnectSocket();
    };
  }, [accessToken, roomId]);

  const handleSend = (text: string) => {
    sendMessage(roomId, text);
  };

  const roomMessages = messages.get(roomId) || [];

  return (
    <View>
      <FlatList
        data={roomMessages}
        renderItem={({ item }) => <MessageBubble message={item} />}
        keyExtractor={(item) => item.id}
      />
      <MessageInput onSend={handleSend} />
    </View>
  );
}
```

### 6. vendorStore - 사장님 프로필 목록

```typescript
import { useVendorStore } from '@/entities/vendor/model';
import { useEffect } from 'react';

function VendorListScreen() {
  const { vendorProfiles, fetchVendorProfiles, isLoading } = useVendorStore();

  useEffect(() => {
    fetchVendorProfiles({
      region: '서울',
      services: 'coffee,lunchBox',
      sort: 'rating',
    });
  }, []);

  return (
    <FlatList
      data={vendorProfiles}
      renderItem={({ item }) => <VendorCard vendor={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
```

### 7. bookingStore - 예약 목록

```typescript
import { useBookingStore } from '@/entities/booking/model';
import { useEffect } from 'react';

function MyBookingsScreen() {
  const { bookings, fetchBookings, cancelBooking, isLoading } = useBookingStore();

  useEffect(() => {
    fetchBookings({ status: 'CONFIRMED' });
  }, []);

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId, '일정 변경으로 인한 취소');
      await fetchBookings(); // 목록 새로고침
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FlatList
      data={bookings}
      renderItem={({ item }) => (
        <BookingCard
          booking={item}
          onCancel={() => handleCancel(item.id)}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
```

### 8. notificationStore - 알림

```typescript
import { useNotificationStore } from '@/entities/notification/model';
import { useEffect } from 'react';

function NotificationScreen() {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>읽지 않은 알림: {unreadCount}개</Text>
      <Button onPress={markAllAsRead}>전체 읽음</Button>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleMarkAsRead(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
```

## 🔑 주요 기능

### 인증 토큰 자동 관리

API 클라이언트는 자동으로 토큰을 관리합니다:
- 모든 요청에 Access Token 자동 추가
- 401 에러 시 Refresh Token으로 자동 갱신
- Refresh 실패 시 자동 로그아웃

### AsyncStorage 연동

authStore는 AsyncStorage를 사용하여:
- 로그인 정보 자동 저장
- 앱 재시작 시 자동 복원
- 로그아웃 시 자동 삭제

### Socket.io 실시간 통신

chatStore는 Socket.io를 사용하여:
- 실시간 메시지 송수신
- 읽음 처리
- 입력 중 표시 (구현 가능)

## 📚 API 타입

모든 API 타입은 `@/shared/types/api`에 정의되어 있습니다:

```typescript
import type {
  User,
  VendorProfile,
  Request,
  Quotation,
  Booking,
  ChatRoom,
  Message,
  Review,
  Notification
} from '@/shared/types/api';
```

## 🛠️ 확장 방법

새로운 기능이 필요하면 store에 액션을 추가하세요:

```typescript
// entities/booking/model/bookingStore.ts
export const useBookingStore = create<BookingState & BookingActions>((set) => ({
  // ... 기존 코드

  // 새로운 액션 추가
  rateBooking: async (bookingId: string, rating: number) => {
    try {
      set({ isLoading: true, error: null });

      await apiClient.post(`/bookings/${bookingId}/rate`, { rating });

      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '평가에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },
}));
```

## 🔗 관련 문서

- [Zustand 공식 문서](https://zustand-demo.pmnd.rs/)
- [FSD 아키텍처](https://feature-sliced.design/)
- [API 명세서](../../../docs/04_API_SPECS.md)
