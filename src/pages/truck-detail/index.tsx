import React, { useState } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, IconButton, Rating, Avatar, Tag, Divider } from "../../shared/ui";
import type { RootStackScreenProps } from "../../core/navigation/types";

const MOCK_MENUS = [
  {
    id: "1",
    name: "아메리카노 (HOT/CE)",
    description: "가장 인기 있는 커피로 찾는데 쉽지 않나",
    price: "4,000원",
    image: "https://via.placeholder.com/60x60/D2691E/FFFFFF?text=Coffee",
  },
  {
    id: "2",
    name: "리얼 땅기 라떼",
    description: "딸기가 자라오마라...",
    price: "5,500원",
    image: "https://via.placeholder.com/60x60/FFB6C1/FFFFFF?text=Latte",
  },
];

const MOCK_REVIEWS = [
  {
    id: "1",
    author: "지훈 든든한",
    date: "2023년 10월 5일",
    rating: 5.0,
    content:
      "배우 님 촬영장 배려도 체웠고 메뉴도 매우 맛있어서 모두 만족하시더라고요! 🎬 사진도 보내주시고... 막장 촬영갔다 돌때마다 진짜 만족이었습니다.",
    images: ["🍰", "🍰"],
  },
];

export const TruckDetailPage: React.FC<RootStackScreenProps<"TruckDetail">> = ({
  navigation,
  route,
}) => {
  const [selectedTab, setSelectedTab] = useState<"menu" | "info" | "reviews">("menu");

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white">
          <IconButton icon="←" onPress={() => navigation.goBack()} />
          <IconButton icon="❤️" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Truck Images */}
          <Image
            source={{ uri: "https://via.placeholder.com/400x250/FFD700/000000?text=Yellow+Truck" }}
            className="w-full h-64"
            resizeMode="cover"
          />

          {/* Truck Info */}
          <View className="px-4 py-4 bg-white">
            <View className="flex-row items-center mb-2">
              <Text className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded mr-2">
                #커피&amp;스낵
              </Text>
              <Text className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded mr-2">
                #프리미엄서비스
              </Text>
              <Text className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded">
                #대표메뉴
              </Text>
            </View>
            <Text className="text-2xl font-bold text-text-primary mb-2">
              Yellow Beans Coffee Truck
            </Text>
            <Text className="text-text-secondary mb-3">
              트렌디한 영상 촬영 시,트 라인 프리 + 이벤트 참여 시♥
            </Text>
            <View className="flex-row items-center">
              <Rating rating={4.8} size="md" />
              <Text className="text-text-secondary ml-2">(156)</Text>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row bg-white border-t border-b border-gray-200">
            {(["menu", "info", "reviews"] as const).map((tab) => (
              <Button
                key={tab}
                onPress={() => setSelectedTab(tab)}
                variant="outline"
                className={`flex-1 rounded-none border-0 ${
                  selectedTab === tab ? "border-b-2 border-primary" : ""
                }`}
              >
                <Text
                  className={`${
                    selectedTab === tab ? "text-primary font-bold" : "text-text-secondary"
                  }`}
                >
                  {tab === "menu" ? "메뉴" : tab === "info" ? "정보" : "리뷰 120"}
                </Text>
              </Button>
            ))}
          </View>

          {/* Content */}
          {selectedTab === "menu" && (
            <View className="px-4 py-4">
              <Text className="text-lg font-bold text-text-primary mb-4">대표 메뉴</Text>
              {MOCK_MENUS.map((menu) => (
                <View key={menu.id} className="flex-row mb-4 bg-white p-3 rounded-xl">
                  <Image
                    source={{ uri: menu.image }}
                    className="w-16 h-16 rounded-xl"
                  />
                  <View className="flex-1 ml-3">
                    <Text className="text-base font-bold text-text-primary">
                      {menu.name}
                    </Text>
                    <Text className="text-text-secondary text-sm mt-1">
                      {menu.description}
                    </Text>
                    <Text className="text-primary font-bold mt-1">{menu.price}</Text>
                  </View>
                </View>
              ))}
              <Button variant="outline">메뉴 전문보기 →</Button>
            </View>
          )}

          {selectedTab === "info" && (
            <View className="px-4 py-4 bg-white">
              <Text className="text-lg font-bold text-text-primary mb-4">
                가격 및 조건
              </Text>
              <View className="flex-row items-center mb-3">
                <Text className="text-text-secondary w-32">촬영 인원(사람 기준)</Text>
                <Text className="text-text-primary font-semibold">300,000원</Text>
                <Text className="ml-2 text-text-secondary">무료</Text>
              </View>
              <Divider className="my-3" />
              <Text className="text-text-secondary text-sm">
                * 시간외 데마 추 손님 외시요+ 추가요금 발생 공휴일 및 새벽/밤 데만
                시간대 베상비가 이빌...
              </Text>

              <View className="mt-6">
                <Text className="text-lg font-bold text-text-primary mb-4">
                  리뷰 120
                </Text>
                <View className="flex-row items-center mb-3">
                  <Text className="text-5xl font-bold text-text-primary mr-4">4.8</Text>
                  <View>
                    <Rating rating={4.8} size="lg" showNumber={false} />
                    <Text className="text-text-secondary text-sm mt-1">
                      "손님이 걱정앨 만이야!"
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {selectedTab === "reviews" && (
            <View className="px-4 py-4">
              {MOCK_REVIEWS.map((review) => (
                <View key={review.id} className="bg-white p-4 rounded-xl mb-4">
                  <View className="flex-row items-center mb-2">
                    <Avatar name={review.author} size="sm" />
                    <View className="flex-1 ml-3">
                      <Text className="font-semibold text-text-primary">
                        {review.author}
                      </Text>
                      <View className="flex-row items-center">
                        <Rating rating={review.rating} size="sm" />
                      </View>
                    </View>
                    <Text className="text-text-secondary text-xs">{review.date}</Text>
                  </View>
                  <Text className="text-text-primary mt-2">{review.content}</Text>
                  <View className="flex-row mt-3 gap-2">
                    {review.images.map((img, idx) => (
                      <View
                        key={idx}
                        className="w-16 h-16 bg-gray-200 rounded-lg items-center justify-center"
                      >
                        <Text className="text-2xl">{img}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          <View className="h-24" />
        </ScrollView>

        {/* Bottom CTA */}
        <View className="px-4 py-4 bg-white border-t border-gray-200">
          <Button
            variant="primary"
            size="lg"
            onPress={() => navigation.navigate("Booking", { truckId: route.params.truckId })}
          >
            예약 요청하기 →
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};
