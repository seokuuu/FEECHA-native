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
    primary: "bg-primary text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    info: "bg-info text-white",
    default: "bg-gray-2 text-gray-6",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <View className={`${variantStyles[variant]} ${sizeStyles[size]} rounded-full self-start ${className}`}>
      <Text className="font-semibold">
        {children}
      </Text>
    </View>
  );
};
