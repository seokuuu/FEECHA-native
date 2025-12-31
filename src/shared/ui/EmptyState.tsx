import React from "react";
import { View, Text } from "react-native";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "📭",
  title,
  message,
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <View className={`flex-1 items-center justify-center px-8 ${className}`}>
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className="text-xl font-bold text-text-primary text-center mb-2">
        {title}
      </Text>
      {message && (
        <Text className="text-text-secondary text-center mb-6">{message}</Text>
      )}
      {actionLabel && onAction && (
        <Button onPress={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </View>
  );
};
