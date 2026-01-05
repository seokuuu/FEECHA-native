import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { Quotation } from "@/shared/types/api";

interface QuotationListItemProps {
  quotation: Quotation;
  vendorName: string;
  onSelect?: () => void;
  isSelected?: boolean;
  className?: string;
}

export const QuotationListItem: React.FC<QuotationListItemProps> = ({
  quotation,
  vendorName,
  onSelect,
  isSelected = false,
  className = "",
}) => {
  return (
    <View
      className={`bg-white border ${
        isSelected ? "border-primary" : "border-gray-200"
      } rounded-lg p-4 mb-3 ${className}`}
    >
      <View className="flex-row justify-between items-start mb-3">
        {/* 업체명 */}
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">{vendorName}</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-gray-500 text-sm mr-2">⏱ 3 Hours</Text>
            <Text className="text-gray-500 text-sm">|</Text>
            <Text className="text-gray-500 text-sm ml-2">
              {quotation.items.map((item) => item.name).join(", ")}
            </Text>
          </View>
        </View>

        {/* 가격 */}
        <Text className="text-2xl font-bold text-primary ml-4">
          {(quotation.totalPrice / 10000).toFixed(0)}만원
        </Text>
      </View>

      {/* Select 버튼 */}
      <TouchableOpacity
        onPress={onSelect}
        className={`${
          isSelected ? "bg-primary" : "bg-primary"
        } py-3 rounded-lg items-center`}
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold">
          {isSelected ? "Selected" : "Select"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
