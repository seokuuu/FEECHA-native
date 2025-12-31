import React from "react";
import { View, Text } from "react-native";

interface BadgeProps {
  label: string;
  variant?: "primary" | "success" | "warning" | "error";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "primary",
  className = "",
}) => {
  const variantStyles = {
    primary: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  return (
    <View className={`px-3 py-1 rounded-full ${variantStyles[variant]} ${className}`}>
      <Text className="text-white text-xs font-bold">{label}</Text>
    </View>
  );
};
