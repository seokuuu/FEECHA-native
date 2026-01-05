import { View, Text } from 'react-native';

export default function DashboardScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-gray-900">대시보드</Text>
      <Text className="text-gray-600 mt-2">사장님 홈</Text>
    </View>
  );
}
