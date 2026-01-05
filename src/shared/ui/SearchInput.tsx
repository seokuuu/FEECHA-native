import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onFocus?: () => void;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = "Search...",
  onClear,
  onFocus,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChangeText("");
    onClear?.();
  };

  return (
    <View
      className={`bg-gray-100 rounded flex-row items-center px-4 py-3 ${
        isFocused ? "border border-primary" : ""
      } ${className}`}
    >
      {/* Search Icon */}
      <Text className="text-gray-400 mr-2 text-xl">🔍</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        onFocus={() => {
          setIsFocused(true);
          onFocus?.();
        }}
        onBlur={() => setIsFocused(false)}
        className="flex-1 text-text-primary"
      />

      {/* Clear Button */}
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} className="ml-2">
          <Text className="text-gray-400 text-lg">✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
