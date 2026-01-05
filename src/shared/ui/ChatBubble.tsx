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
  const bubbleColor = isOwn ? "bg-blue-500" : "bg-gray-100";
  const textColor = isOwn ? "text-white" : "text-gray-900";
  const timeColor = isOwn ? "text-blue-200" : "text-gray-500";

  if (isOwn) {
    // 클라이언트 (내 메시지) - 오른쪽 정렬, 파란색
    return (
      <View className="flex-row justify-end items-end mb-3">
        <View className="max-w-[75%]">
          <View className={`${bubbleColor} rounded-2xl rounded-br-sm px-4 py-3`}>
            <Text className={`${textColor} text-base`}>{message.content}</Text>
          </View>
          <View className="flex-row justify-end items-center mt-1">
            {message.isRead && (
              <Text className="text-xs text-blue-500 mr-2">읽음</Text>
            )}
            <Text className="text-xs text-gray-500">
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
            <View className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center">
              <Text className="text-gray-600 font-semibold">
                {senderName?.charAt(0) || "?"}
              </Text>
            </View>
          )}
        </View>
      )}

      <View className="max-w-[75%]">
        {senderName && (
          <Text className="text-xs text-gray-600 mb-1 ml-1">{senderName}</Text>
        )}
        <View className={`${bubbleColor} rounded-2xl rounded-bl-sm px-4 py-3`}>
          <Text className={`${textColor} text-base`}>{message.content}</Text>
        </View>
        <Text className="text-xs text-gray-500 mt-1 ml-1">
          {new Date(message.createdAt).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
};
