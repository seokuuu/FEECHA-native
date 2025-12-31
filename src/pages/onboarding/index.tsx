import React, { useRef, useState } from "react";
import { View, Text, FlatList, Dimensions, Image } from "react-native";
import { Button } from "../../shared/ui";
import type { RootStackScreenProps } from "../../core/navigation/types";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    icon: "☕",
    title: "내 스타를 위한\n가장 특별한 선물",
    subtitle: "The most special gift for your star",
    image: require("../../../assets/icon.png"),
  },
  {
    id: "2",
    icon: "🔍",
    title: "간편한 검색과\n투명한 예약",
    subtitle: "원하는 커피차를 빠르게 찾고, 정직한 가격으로 예약하세요",
  },
  {
    id: "3",
    icon: "🤝",
    title: "안심하고 맡길 수 있는 신뢰",
    subtitle: "투명한 견적과 검증된 푸드트럭, FEE-CHA가 안전하게 연결해 드립니다",
  },
];

export const OnboardingPage: React.FC<RootStackScreenProps<"Onboarding">> = ({
  navigation,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace("MainTabs", { screen: "Home" });
    }
  };

  const handleSkip = () => {
    navigation.replace("MainTabs", { screen: "Home" });
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row justify-between p-4">
        <Text className="text-2xl font-bold text-text-primary">☕ FEE-CHA</Text>
        {currentIndex < slides.length - 1 && (
          <Button onPress={handleSkip} variant="outline" size="sm">
            건너뛰기
          </Button>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1 items-center justify-center px-8">
            <Text className="text-7xl mb-8">{item.icon}</Text>
            <Text className="text-3xl font-bold text-center text-text-primary mb-4">
              {item.title}
            </Text>
            <Text className="text-text-secondary text-center text-base">
              {item.subtitle}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View className="px-6 pb-12">
        <View className="flex-row justify-center mb-8">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${
                index === currentIndex
                  ? "bg-primary w-8"
                  : "bg-gray-300 w-2"
              }`}
            />
          ))}
        </View>

        <Button onPress={handleNext} variant="primary" size="lg">
          {currentIndex === slides.length - 1 ? "FEE-CHA 시작하기" : "다음"}
        </Button>

        {currentIndex === slides.length - 1 && (
          <Text className="text-center text-text-secondary mt-4">
            이미 계정이 있나요?{" "}
            <Text className="text-primary font-semibold">로그인</Text>
          </Text>
        )}
      </View>
    </View>
  );
};
