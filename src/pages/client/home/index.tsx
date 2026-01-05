import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-gray-900">홈</Text>
      <Text className="text-gray-600 mt-2">사장님 목록</Text>
    </View>
  );
}
