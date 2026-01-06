import { View, Text, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useState, useRef } from 'react';
import { CommonActions } from '@react-navigation/native';
import { Button } from '@/shared/ui';
import { useAuthStore } from '@/entities/auth/model';
import type { AuthStackScreenProps } from '@/core/navigation/types';

type Props = AuthStackScreenProps<'Onboarding'>;

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: '원하는 커피차를\n쉽게 찾아보세요',
    description: '촬영장에 보낼 최고의 커피차를\n간편하게 검색하고 비교할 수 있어요',
    emoji: '☕',
  },
  {
    id: '2',
    title: '견적 비교로\n합리적인 선택',
    description: '여러 업체의 견적을 한눈에 비교하고\n최적의 조건을 선택하세요',
    emoji: '📋',
  },
  {
    id: '3',
    title: '안전한 예약과\n투명한 거래',
    description: '예약금 결제부터 후기까지\n모든 과정을 안전하게 관리해요',
    emoji: '✅',
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { completeOnboarding } = useAuthStore();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      await completeOnboarding();

      // Root navigation stack 리셋하고 Main으로 이동
      navigation.getParent()?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      );
    }
  };

  const renderSlide = ({ item }: { item: typeof SLIDES[0] }) => (
    <View className="items-center justify-center px-6" style={{ width }}>
      <Text className="text-7xl mb-8">{item.emoji}</Text>
      <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">
        {item.title}
      </Text>
      <Text className="text-base text-gray-600 text-center">
        {item.description}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Logo */}
      <View className="pt-16 pb-8 px-6">
        <Text className="text-center text-2xl font-bold text-primary">FEE-CHA</Text>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Pagination Dots */}
      <View className="flex-row justify-center py-8">
        {SLIDES.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full mx-1 ${
              index === currentIndex
                ? 'w-8 bg-primary'
                : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </View>

      {/* Next/Get Started Button */}
      <View className="px-6 pb-12">
        <Button onPress={handleNext} className="w-full">
          {currentIndex === SLIDES.length - 1 ? '시작하기' : '다음'}
        </Button>
      </View>
    </View>
  );
}
