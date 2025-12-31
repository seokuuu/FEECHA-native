import React from "react";
import { View, TextInput, Text } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "검색...",
  className = "",
}) => {
  return (
    <View className={`flex-row items-center bg-white rounded-2xl px-4 py-3 ${className}`}>
      <Text className="text-2xl mr-2">🔍</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999999"
        className="flex-1 text-text-primary"
      />
    </View>
  );
};
