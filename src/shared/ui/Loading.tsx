import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

interface LoadingProps {
  message?: string;
  size?: "small" | "large";
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  message,
  size = "large",
  className = "",
}) => {
  return (
    <View className={`flex-1 items-center justify-center ${className}`}>
      <ActivityIndicator size={size} color="#F5A623" />
      {message && (
        <Text className="mt-4 text-text-secondary text-center">{message}</Text>
      )}
    </View>
  );
};
