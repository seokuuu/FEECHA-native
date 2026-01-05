import { View, Text } from 'react-native';
import { Button } from '@/shared/ui';
import type { AuthStackScreenProps } from '@/core/navigation/types';

type Props = AuthStackScreenProps<'Onboarding'>;

export default function OnboardingScreen({ navigation }: Props) {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-3xl font-bold text-primary-500 mb-4">
        FEE-CHA
      </Text>
      <Text className="text-base text-gray-600 text-center mb-8">
        Coffee Truck Matching Platform
      </Text>

      <Button
        onPress={() => navigation.navigate('Login')}
        className="w-full"
      >
        Get Started
      </Button>
    </View>
  );
}
