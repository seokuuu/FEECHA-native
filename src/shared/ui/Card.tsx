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

  const baseClass = `bg-card rounded-large ${paddingStyles[padding]} ${shadow ? "shadow-card" : ""}`;

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className={`${baseClass} ${className}`}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View className={`${baseClass} ${className}`}>{children}</View>;
};
