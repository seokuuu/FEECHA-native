# useRequest Hook 사용 가이드

## 개요

`useRequest`는 API 호출을 간편하게 관리하고 에러를 처리하는 커스텀 훅입니다.

## 주요 기능

- ✅ **자동 에러 파싱**: 401, 403, 404, 500 등 HTTP 에러 자동 처리
- ✅ **로딩 상태 관리**: isLoading 자동 관리
- ✅ **네트워크 에러 처리**: 네트워크 연결 끊김 감지
- ✅ **401 자동 로그아웃**: 인증 만료 시 자동 로그아웃
- ✅ **403 권한 에러**: 접근 권한 없음 처리
- ✅ **타입 안전성**: TypeScript 제네릭 지원

## 기본 사용법

```typescript
import { useRequest } from '@/shared/hooks';
import { apiClient } from '@/shared/api';

function MyComponent() {
  const { data, error, isLoading, execute } = useRequest<User>(
    (userId: string) => apiClient.get(`/users/${userId}`)
  );

  const handleFetch = async () => {
    const result = await execute('user-123');
    if (result) {
      console.log('Success:', result);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <Text>{error.message}</Text>;

  return <View>{/* UI */}</View>;
}
```

## 고급 사용법

### 1. 성공/실패 콜백

```typescript
const { execute } = useRequest<Booking>(
  (bookingId: string) => apiClient.post(`/bookings/${bookingId}/confirm`),
  {
    onSuccess: (data) => {
      console.log('Booking confirmed:', data);
      navigation.navigate('BookingDetail', { bookingId: data.id });
    },
    onError: (error) => {
      if (error.statusCode === 403) {
        Alert.alert('권한 없음', '예약 권한이 없습니다.');
      }
    },
  }
);
```

### 2. 에러 타입별 처리

```typescript
const { error, execute } = useRequest<VendorProfile>(
  (data) => apiClient.post('/vendor-profiles', data)
);

const handleSubmit = async () => {
  const result = await execute(formData);

  if (!result && error) {
    switch (error.type) {
      case 'network':
        Alert.alert('네트워크 오류', '인터넷 연결을 확인해주세요.');
        break;
      case 'auth':
        // 자동 로그아웃 처리됨 (401)
        // 또는 권한 없음 (403)
        Alert.alert('권한 오류', error.message);
        break;
      case 'validation':
        // 400, 422 에러
        Alert.alert('입력 오류', error.message);
        break;
      case 'server':
        // 500 에러
        Alert.alert('서버 오류', error.message);
        break;
    }
  }
};
```

### 3. Store에서 사용

```typescript
// entities/vendor/model/vendorStore.ts
import { create } from 'zustand';
import { apiClient } from '@/shared/api/client';
import { useRequest } from '@/shared/hooks';

export const useVendorStore = create<VendorState & VendorActions>((set) => ({
  vendors: [],

  // Store는 그대로 두고, 컴포넌트에서 useRequest 사용
}));

// Component에서 사용
function VendorListScreen() {
  const { vendors } = useVendorStore();
  const { isLoading, error, execute } = useRequest(
    (filters) => apiClient.get('/vendor-profiles', { params: filters })
  );

  useEffect(() => {
    execute({ region: '서울' });
  }, []);

  if (error?.statusCode === 403) {
    return <Text>접근 권한이 없습니다.</Text>;
  }

  return <FlatList data={vendors} />;
}
```

## 에러 타입

```typescript
type RequestError = {
  statusCode: number;      // HTTP 상태 코드
  errorCode?: number;      // 백엔드 커스텀 에러 코드
  message: string;         // 에러 메시지
  type: 'network' | 'server' | 'auth' | 'validation' | 'unknown';
}
```

### 에러 타입별 의미

| 타입 | 설명 | 예시 |
|------|------|------|
| `network` | 네트워크 연결 실패 | 인터넷 없음, 타임아웃 |
| `auth` | 인증/권한 오류 | 401 (로그아웃됨), 403 (권한 없음) |
| `validation` | 입력 검증 실패 | 400, 422 (잘못된 입력) |
| `server` | 서버 오류 | 500, 502, 503 |
| `unknown` | 알 수 없는 오류 | 기타 |

## 자동 처리되는 것들

### 401 에러 (인증 만료)
- API 클라이언트가 자동으로 refresh token 시도
- refresh 실패 시 useRequest가 자동 로그아웃 처리

### 403 에러 (권한 없음)
- 에러 메시지 파싱
- onError 콜백 호출
- 자동 로그아웃은 하지 않음 (권한이 없는 것일 뿐)

### 네트워크 에러
- 타임아웃, 연결 실패 감지
- 사용자에게 친화적인 메시지 제공

## 실전 예제

### 예약 취소 (403 가능성 있음)

```typescript
function BookingCancelButton({ bookingId }: { bookingId: string }) {
  const { isLoading, error, execute } = useRequest(
    (id: string, reason: string) => apiClient.post(`/bookings/${id}/cancel`, { reason }),
    {
      onSuccess: () => {
        Alert.alert('취소 완료', '예약이 취소되었습니다.');
        navigation.goBack();
      },
      onError: (err) => {
        if (err.statusCode === 403) {
          Alert.alert('취소 불가', '취소 가능 기간이 지났습니다.');
        }
      },
    }
  );

  const handleCancel = () => {
    Alert.alert(
      '예약 취소',
      '정말 취소하시겠습니까?',
      [
        { text: '아니요' },
        {
          text: '예',
          onPress: () => execute(bookingId, '일정 변경'),
        },
      ]
    );
  };

  return (
    <Button onPress={handleCancel} loading={isLoading} variant="outline">
      예약 취소
    </Button>
  );
}
```

### 견적 제출 (유효성 검증)

```typescript
function QuotationSubmitScreen({ requestId }: { requestId: string }) {
  const { execute, isLoading, error } = useRequest(
    (data) => apiClient.post('/quotations', data),
    {
      onSuccess: () => {
        Alert.alert('제출 완료', '견적이 제출되었습니다.');
        navigation.goBack();
      },
    }
  );

  const handleSubmit = async (formData: any) => {
    await execute({ requestId, ...formData });
  };

  return (
    <View>
      <QuotationForm onSubmit={handleSubmit} />
      {error?.type === 'validation' && (
        <Text className="text-red-500">{error.message}</Text>
      )}
      <Button onPress={handleSubmit} loading={isLoading}>
        견적 제출
      </Button>
    </View>
  );
}
```

## 주의사항

1. **Store와 함께 사용**: Store에 데이터를 저장하고, useRequest로 API 호출
2. **재사용 가능**: 여러 컴포넌트에서 같은 API 호출 시 각각 useRequest 사용
3. **에러 처리 필수**: error 상태를 확인하고 UI에 표시
4. **로딩 상태 표시**: isLoading으로 사용자 피드백 제공
