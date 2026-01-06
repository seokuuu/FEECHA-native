import React from "react";
import { View, Text, Image } from "react-native";
import type { Message } from "@/shared/types/api";

interface ChatBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName?: string;
  senderImage?: string;
  showAvatar?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isOwn,
  senderName,
  senderImage,
  showAvatar = true,
}) => {
  const bubbleStyles = {
    client: "bg-blue",
    vendor: "bg-gray-1",
  };

  const textStyles = {
    client: "text-white",
    vendor: "text-dark",
  };

  const bubbleClass = isOwn ? bubbleStyles.client : bubbleStyles.vendor;
  const textClass = isOwn ? textStyles.client : textStyles.vendor;

  if (isOwn) {
    // 클라이언트 (내 메시지) - 오른쪽 정렬, 파란색
    return (
      <View className="flex-row justify-end items-end mb-3">
        <View className="max-w-[75%]">
          <View className={`${bubbleClass} rounded-extra-extra-large rounded-br-sm px-4 py-3`}>
            <Text className={`${textClass} text-base`}>{message.content}</Text>
          </View>
          <View className="flex-row justify-end items-center mt-1">
            {message.isRead && (
              <Text className="text-xs text-blue mr-2">읽음</Text>
            )}
            <Text className="text-xs text-gray-5">
              {new Date(message.createdAt).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // 사장님 (상대 메시지) - 왼쪽 정렬, 회색
  return (
    <View className="flex-row items-end mb-3">
      {showAvatar && (
        <View className="mr-2">
          {senderImage ? (
            <Image
              source={{ uri: senderImage }}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-gray-3 items-center justify-center">
              <Text className="text-gray-6 font-semibold">
                {senderName?.charAt(0) || "?"}
              </Text>
            </View>
          )}
        </View>
      )}

      <View className="max-w-[75%]">
        {senderName && (
          <Text className="text-xs text-gray-6 mb-1 ml-1">{senderName}</Text>
        )}
        <View className={`${bubbleClass} rounded-extra-extra-large rounded-bl-sm px-4 py-3`}>
          <Text className={`${textClass} text-base`}>{message.content}</Text>
        </View>
        <Text className="text-xs text-gray-5 mt-1 ml-1">
          {new Date(message.createdAt).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
};
