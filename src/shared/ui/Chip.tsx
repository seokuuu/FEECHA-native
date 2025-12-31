import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface ChipProps {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  variant?: "default" | "primary";
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onPress,
  selected = false,
  variant = "default",
  className = "",
}) => {
  const getBackgroundColor = () => {
    if (selected) {
      return variant === "primary" ? "bg-primary" : "bg-gray-800";
    }
    return "bg-white border border-gray-300";
  };

  const getTextColor = () => {
    return selected ? "text-white" : "text-text-secondary";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full ${getBackgroundColor()} ${className}`}
      activeOpacity={0.7}
    >
      <Text className={`text-sm font-medium ${getTextColor()}`}>{label}</Text>
    </TouchableOpacity>
  );
};
