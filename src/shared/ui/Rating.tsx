import React from "react";
import { View, Text } from "react-native";

interface RatingProps {
  rating: number;
  maxRating?: number;
  showNumber?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  maxRating = 5,
  showNumber = true,
  size = "md",
  className = "",
}) => {
  const sizeStyles = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <Text key={i} className={sizeStyles[size]}>
          {i <= Math.floor(rating) ? "⭐" : i <= rating ? "⭐" : "☆"}
        </Text>
      );
    }
    return stars;
  };

  return (
    <View className={`flex-row items-center ${className}`}>
      {renderStars()}
      {showNumber && (
        <Text className={`ml-1 ${sizeStyles[size]} text-text-secondary font-medium`}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
};
