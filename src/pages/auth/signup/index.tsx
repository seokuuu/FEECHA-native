import { View, Text } from 'react-native';
import { Button } from '@/shared/ui';
import type { AuthStackScreenProps } from '@/core/navigation/types';

type Props = AuthStackScreenProps<'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-2xl font-bold text-gray-900 mb-8">
        Sign Up
      </Text>

      <Text className="text-base text-gray-600 mb-6">
        Choose your account type
      </Text>

      <Button className="mb-4">
        Client (Order Coffee Truck)
      </Button>

      <Button variant="outline">
        Vendor (Provide Coffee Truck)
      </Button>
    </View>
  );
}
