import { View, Text } from 'react-native';
import { Button } from '@/shared/ui';
import { useAuthStore } from '@/entities/auth/model';

export default function MyPageScreen() {
  const { logout, user } = useAuthStore();

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-gray-900 mb-4">마이페이지</Text>
      <Text className="text-gray-600 mb-6">{user?.name}님</Text>
      <Button onPress={logout}>로그아웃</Button>
    </View>
  );
}
