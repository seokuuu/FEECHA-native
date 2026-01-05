import React, { useState } from "react";
import { TextInput, View, Text, KeyboardTypeOptions } from "react-native";

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
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
  keyboardType,
  autoCapitalize,
  leftIcon,
  rightIcon,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return "border-red-500";
    if (isFocused) return "border-primary";
    return "border-gray-200";
  };

  return (
    <View className={className}>
      {label && (
        <Text className="text-text-primary font-medium mb-2">{label}</Text>
      )}
      <View
        className={`bg-white border ${getBorderColor()} rounded-xl px-4 py-3 flex-row items-center ${
          multiline ? "min-h-[100px]" : ""
        }`}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999999"
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 text-text-primary"
        />
        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};
