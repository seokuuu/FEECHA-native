import React from "react";
import { View, Image, Text } from "react-native";

interface AvatarProps {
  source?: { uri: string };
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = "md",
  className = "",
}) => {
  const sizeStyles = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizeStyles = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-xl",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View
      className={`${sizeStyles[size]} rounded-full bg-gray-3 items-center justify-center overflow-hidden ${className}`}
    >
      {source ? (
        <Image source={source} className="w-full h-full" resizeMode="cover" />
      ) : name ? (
        <Text className={`${textSizeStyles[size]} font-bold text-white`}>
          {getInitials(name)}
        </Text>
      ) : (
        <Text className={`${textSizeStyles[size]}`}>👤</Text>
      )}
    </View>
  );
};
