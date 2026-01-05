import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import type { VendorProfile } from "@/shared/types/api";

interface VendorCardProps {
  vendor: VendorProfile;
  onPress?: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
  className?: string;
}

export const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  onPress,
  onFavoritePress,
  isFavorite = false,
  className = "",
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`bg-white rounded-lg overflow-hidden shadow-sm ${className}`}
    >
      {/* 이미지 영역 */}
      <View className="relative">
        <Image
          source={{ uri: vendor.portfolioImages[0] || "https://via.placeholder.com/300" }}
          className="w-full h-40"
          resizeMode="cover"
        />

        {/* PREMIUM Badge (예시) */}
        <View className="absolute top-3 left-3 bg-primary px-2 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">PREMIUM</Text>
        </View>

        {/* 별점 */}
        <View className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full flex-row items-center">
          <Text className="text-primary mr-1">⭐</Text>
          <Text className="text-gray-900 font-semibold text-sm">
            {vendor.rating.toFixed(1)}
          </Text>
          <Text className="text-gray-600 text-xs ml-1">
            ({vendor.reviewCount})
          </Text>
        </View>

        {/* 하트 아이콘 */}
        <TouchableOpacity
          onPress={onFavoritePress}
          className="absolute bottom-3 right-3 bg-white w-10 h-10 rounded-full items-center justify-center"
        >
          <Text className="text-xl">{isFavorite ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
      </View>

      {/* 정보 영역 */}
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-900 mb-1">
          {vendor.businessName}
        </Text>
        <Text className="text-sm text-gray-600 mb-3">
          {vendor.regions.join(", ")}
        </Text>

        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xs text-gray-500">MIN. ORDER</Text>
            <Text className="text-base font-bold text-gray-900">
              {(vendor.basePrice / 10000).toFixed(0)}만원
            </Text>
          </View>
          <View>
            <Text className="text-xs text-gray-500">LOCATION</Text>
            <Text className="text-sm text-gray-700">
              {vendor.regions[0]}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
