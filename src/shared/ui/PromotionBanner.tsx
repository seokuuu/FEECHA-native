import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";

interface PromotionBannerProps {
  title: string;
  subtitle?: string;
  label?: string;
  imageUrl: string;
  onPress?: () => void;
  ctaText?: string;
  className?: string;
}

export const PromotionBanner: React.FC<PromotionBannerProps> = ({
  title,
  subtitle,
  label,
  imageUrl,
  onPress,
  ctaText = "View Details",
  className = "",
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className={`rounded-2xl overflow-hidden ${className}`}
    >
      <ImageBackground
        source={{ uri: imageUrl }}
        className="w-full h-48"
        resizeMode="cover"
      >
        {/* Overlay */}
        <View className="flex-1 bg-black/30 p-5 justify-between">
          {/* Label */}
          {label && (
            <View className="self-start bg-primary px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-bold uppercase">
                {label}
              </Text>
            </View>
          )}

          {/* Content */}
          <View>
            <Text className="text-white text-2xl font-bold mb-1">{title}</Text>
            {subtitle && (
              <Text className="text-white/90 text-sm mb-3">{subtitle}</Text>
            )}

            {/* CTA */}
            {ctaText && (
              <View className="self-start bg-primary px-4 py-2 rounded-full flex-row items-center">
                <Text className="text-white font-semibold mr-1">{ctaText}</Text>
                <Text className="text-white">→</Text>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
