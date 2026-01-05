import React from "react";
import { View, Text } from "react-native";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "info" | "default";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "sm",
  className = "",
}) => {
  const variantStyles = {
    primary: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
    default: "bg-gray-200",
  };

  const textColorStyles = {
    primary: "text-white",
    success: "text-white",
    warning: "text-white",
    info: "text-white",
    default: "text-gray-700",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5",
    md: "px-3 py-1",
  };

  const textSizeStyles = {
    sm: "text-xs",
    md: "text-sm",
  };

  return (
    <View
      className={`${variantStyles[variant]} ${sizeStyles[size]} rounded-full self-start ${className}`}
    >
      <Text className={`${textColorStyles[variant]} ${textSizeStyles[size]} font-semibold`}>
        {children}
      </Text>
    </View>
  );
};
