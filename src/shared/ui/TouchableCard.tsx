import React from "react";
import { TouchableOpacity, View } from "react-native";

interface TouchableCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
}

export const TouchableCard: React.FC<TouchableCardProps> = ({
  children,
  onPress,
  disabled,
  className = "",
}) => {
  const baseStyles = "bg-white rounded-2xl p-4 shadow-sm";

  if (!onPress || disabled) {
    return (
      <View className={`${baseStyles} ${disabled ? "opacity-50" : ""} ${className}`}>
        {children}
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`${baseStyles} ${className}`}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};
