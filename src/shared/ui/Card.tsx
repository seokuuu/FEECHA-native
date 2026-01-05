import React from "react";
import { View, TouchableOpacity } from "react-native";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  padding = "md",
  shadow = true,
  className = "",
}) => {
  const paddingStyles = {
    none: "",
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
  };

  const baseStyles = `bg-white rounded-lg ${paddingStyles[padding]} ${
    shadow ? "shadow-sm" : ""
  }`;

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
