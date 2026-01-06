import { View, Text } from 'react-native';
import { Button } from '@/shared/ui';
import { useAuthStore } from '@/entities/auth/model';
import type { AuthStackScreenProps } from '@/core/navigation/types';

type Props = AuthStackScreenProps<'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const handleSelectRole = (role: 'CLIENT' | 'VENDOR') => {
    // TODO: API 연동 후 회원가입 플로우 구현
    // 임시로 바로 로그인 처리
    const email = role === 'CLIENT' ? 'client@test.com' : 'vendor@test.com';
    useAuthStore.getState().login(email, 'password');
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-2xl font-bold text-gray-900 mb-8">
        Sign Up
      </Text>

      <Text className="text-base text-gray-600 mb-6">
        Choose your account type
      </Text>

      <Button className="mb-4" onPress={() => handleSelectRole('CLIENT')}>
        Client (Order Coffee Truck)
      </Button>

      <Button variant="outline" onPress={() => handleSelectRole('VENDOR')}>
        Vendor (Provide Coffee Truck)
      </Button>
    </View>
  );
}
