import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface IconButtonProps {
  icon: string;
  onPress?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary";
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = "md",
  variant = "default",
  className = "",
}) => {
  const sizeStyles = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizeStyles = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const variantStyles = {
    default: "bg-gray-100",
    primary: "bg-primary",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${sizeStyles[size]} ${variantStyles[variant]} rounded-full items-center justify-center ${className}`}
      activeOpacity={0.7}
    >
      <Text className={iconSizeStyles[size]}>{icon}</Text>
    </TouchableOpacity>
  );
};
