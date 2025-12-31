import React from "react";
import { View, Text } from "react-native";

interface TagProps {
  label: string;
  icon?: string;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ label, icon, className = "" }) => {
  return (
    <View className={`px-3 py-1 rounded-lg bg-gray-100 flex-row items-center ${className}`}>
      {icon && <Text className="mr-1">{icon}</Text>}
      <Text className="text-text-secondary text-xs">#{label}</Text>
    </View>
  );
};
