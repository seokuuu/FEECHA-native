import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Badge } from "./Badge";
import type { VendorProfile } from "@/shared/types/api";

interface VendorInfoBlockProps {
  vendor: VendorProfile;
  showButtons?: boolean;
  onContact?: () => void;
  onBook?: () => void;
  className?: string;
}

export const VendorInfoBlock: React.FC<VendorInfoBlockProps> = ({
  vendor,
  showButtons = true,
  onContact,
  onBook,
  className = "",
}) => {
  return (
    <View className={`bg-primary-50 rounded-2xl p-6 items-center ${className}`}>
      {/* 프로필 이미지 */}
      <View className="relative mb-4">
        <Image
          source={{
            uri: vendor.portfolioImages[0] || "https://via.placeholder.com/120",
          }}
          className="w-28 h-28 rounded-full"
        />
        {/* 인증 배지 */}
        <View className="absolute bottom-0 right-0 bg-primary px-2 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">인증됨</Text>
        </View>
      </View>

      {/* 업체명 */}
      <Text className="text-2xl font-bold text-gray-900 mb-2">
        {vendor.businessName}
      </Text>

      {/* 별점 */}
      <View className="flex-row items-center mb-3">
        <Text className="text-primary mr-1">⭐</Text>
        <Text className="text-lg font-bold text-gray-900">
          {vendor.rating.toFixed(1)}
        </Text>
        <Text className="text-gray-600 text-sm ml-1">
          (후기 {vendor.reviewCount}개)
        </Text>
      </View>

      {/* 가격 범위 */}
      <Text className="text-base text-gray-700 mb-6">
        평균 {(vendor.basePrice / 10000).toFixed(0)}만원 ~ {(vendor.basePrice * 1.5 / 10000).toFixed(0)}만원
      </Text>

      {/* 버튼 */}
      {showButtons && (
        <View className="flex-row gap-3 w-full">
          <TouchableOpacity
            onPress={onContact}
            className="flex-1 bg-white border-2 border-primary py-3 rounded-lg items-center"
          >
            <Text className="text-primary font-semibold">문의하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onBook}
            className="flex-1 bg-primary py-3 rounded-lg items-center"
          >
            <Text className="text-white font-semibold">예약하기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
