import React from "react";
import { View, TouchableOpacity } from "react-native";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, onPress, className = "" }) => {
  const baseStyles = "bg-white rounded-2xl p-4 shadow-sm";

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className={`${baseStyles} ${className}`}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View className={`${baseStyles} ${className}`}>{children}</View>;
};
