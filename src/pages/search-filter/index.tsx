import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { SearchBar, Chip, Button, IconButton } from "../../shared/ui";
import type { RootStackScreenProps } from "../../core/navigation/types";

export const SearchFilterPage: React.FC<RootStackScreenProps<"SearchFilter">> = ({
  navigation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>("평점높은순");
  const [priceRange, setPriceRange] = useState([50, 150]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const filters = ["평점높은순", "오늘 예약가능", "이벤트 할인"];
  const styles = ["☕ 모던", "🎉 큐티", "⭐ 럭셔리", "🎨 유니크"];
  const additionalOptions = [
    "간식포함(쿠키, 샌드위치 등)",
    "홍보물 제작 지원(스티커, 현수막)",
    "영상 제생 지원",
  ];

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
          <IconButton icon="←" onPress={() => navigation.goBack()} size="md" />
          <Text className="flex-1 text-xl font-bold text-center mr-10">커피차 찾기</Text>
        </View>

        <ScrollView className="flex-1">
          {/* Search */}
          <View className="px-4 mt-4">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="배우 이름, 트럭 이름 검색"
            />
          </View>

          {/* Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4 px-4"
            contentContainerStyle={{ gap: 8 }}
          >
            {filters.map((filter) => (
              <Chip
                key={filter}
                label={filter}
                selected={selectedFilter === filter}
                onPress={() => setSelectedFilter(filter)}
                variant="primary"
              />
            ))}
          </ScrollView>

          {/* Date Selection */}
          <View className="mt-6 px-4">
            <Text className="text-lg font-bold text-text-primary mb-3">일정</Text>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                <Text className="text-text-secondary text-sm mb-1">📅 시작일</Text>
                <Text className="text-text-primary font-semibold">날짜 선택</Text>
              </View>
              <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                <Text className="text-text-secondary text-sm mb-1">📅 종료일</Text>
                <Text className="text-text-primary font-semibold">날짜 선택</Text>
              </View>
            </View>
          </View>

          {/* Location */}
          <View className="mt-6 px-4">
            <Text className="text-lg font-bold text-text-primary mb-3">지역</Text>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                <Text className="text-text-secondary text-sm mb-1">서울</Text>
              </View>
              <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                <Text className="text-text-secondary text-sm mb-1">강남구</Text>
              </View>
            </View>
          </View>

          {/* Price Range */}
          <View className="mt-6 px-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-text-primary">예산 범위</Text>
              <Text className="text-primary font-bold">
                {priceRange[0]}만원 ~ {priceRange[1]}만원
              </Text>
            </View>
            <Slider
              minimumValue={0}
              maximumValue={300}
              step={10}
              value={priceRange[1]}
              onValueChange={(value) => setPriceRange([priceRange[0], value])}
              minimumTrackTintColor="#F5A623"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#F5A623"
            />
            <View className="flex-row justify-between">
              <Text className="text-text-secondary text-sm">0원</Text>
              <Text className="text-text-secondary text-sm">300만원+</Text>
            </View>
          </View>

          {/* Truck Style */}
          <View className="mt-6 px-4">
            <Text className="text-lg font-bold text-text-primary mb-3">
              트럭 스타일
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {styles.map((style) => (
                <Chip
                  key={style}
                  label={style}
                  selected={selectedStyles.includes(style)}
                  onPress={() => toggleStyle(style)}
                />
              ))}
            </View>
          </View>

          {/* Additional Options */}
          <View className="mt-6 px-4 pb-8">
            <Text className="text-lg font-bold text-text-primary mb-3">추가 옵션</Text>
            {additionalOptions.map((option) => (
              <View
                key={option}
                className="flex-row items-center py-3 border-b border-gray-100"
              >
                <View className="w-5 h-5 rounded border-2 border-gray-300 mr-3" />
                <Text className="text-text-primary">{option}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View className="px-4 py-4 bg-white border-t border-gray-200">
          <Button variant="primary" size="lg">
            15개 커피차 보기 →
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};
