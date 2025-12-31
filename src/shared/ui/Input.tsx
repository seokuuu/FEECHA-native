import React from "react";
import { TextInput, View, Text } from "react-native";

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry,
  multiline,
  numberOfLines,
  className = "",
}) => {
  return (
    <View className={className}>
      {label && (
        <Text className="text-text-primary font-medium mb-2">{label}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999999"
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        className={`bg-white border ${
          error ? "border-red-500" : "border-gray-200"
        } rounded-xl px-4 py-3 text-text-primary ${
          multiline ? "min-h-[100px]" : ""
        }`}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};
