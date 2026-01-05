import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = "",
}) => {
  const baseStyles = "rounded-2xl items-center justify-center flex-row";

  const variantStyles = {
    primary: "bg-primary",
    secondary: "bg-gray-200",
    outline: "bg-transparent border-2 border-primary",
    text: "bg-transparent",
  };

  const sizeStyles = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4",
  };

  const textSizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const textColorStyles = {
    primary: "text-white",
    secondary: "text-text-primary",
    outline: "text-primary",
    text: "text-primary",
  };

  const getLoaderColor = () => {
    if (variant === "primary") return "#fff";
    return "#F5A623";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${
        variant !== "text" ? sizeStyles[size] : "px-2 py-1"
      } ${disabled ? "opacity-50" : ""} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={getLoaderColor()} />
      ) : (
        <>
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <Text
            className={`font-semibold ${textSizeStyles[size]} ${textColorStyles[variant]}`}
          >
            {children}
          </Text>
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};
