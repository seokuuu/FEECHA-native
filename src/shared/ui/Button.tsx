import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
}) => {
  const baseStyles = "rounded-2xl items-center justify-center flex-row";

  const variantStyles = {
    primary: "bg-primary",
    secondary: "bg-gray-200",
    outline: "bg-transparent border-2 border-primary",
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
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled ? "opacity-50" : ""
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#fff" : "#F5A623"}
        />
      ) : (
        <Text
          className={`font-semibold ${textSizeStyles[size]} ${textColorStyles[variant]}`}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};
