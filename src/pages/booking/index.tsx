import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { Button, IconButton, Input } from "../../shared/ui";
import type { RootStackScreenProps } from "../../core/navigation/types";

export const BookingPage: React.FC<RootStackScreenProps<"Booking">> = ({
  navigation,
}) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("10:00 AM");
  const [endTime, setEndTime] = useState("02:00 PM");
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState("드라마 촬영 지원");
  const [attendees, setAttendees] = useState("100");
  const [requirements, setRequirements] = useState("");

  const renderProgressBar = () => (
    <View className="px-4 py-3 bg-white">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs text-text-secondary">1/3단계</Text>
        <Text className="text-xs text-primary font-semibold">33%</Text>
      </View>
      <View className="h-2 bg-gray-200 rounded-full">
        <View
          className="h-full bg-primary rounded-full"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
          <IconButton icon="←" onPress={() => navigation.goBack()} />
          <Text className="flex-1 text-xl font-bold text-center mr-10">예약 요청</Text>
        </View>

        {renderProgressBar()}

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {step === 1 && (
            <View className="px-4 py-6">
              <Text className="text-2xl font-bold text-text-primary mb-2">📅 일정 선택</Text>

              <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{
                  [selectedDate]: {
                    selected: true,
                    selectedColor: "#F5A623",
                  },
                }}
                theme={{
                  selectedDayBackgroundColor: "#F5A623",
                  todayTextColor: "#F5A623",
                  arrowColor: "#F5A623",
                }}
                className="rounded-2xl mb-6"
              />

              <View className="mt-6">
                <Text className="text-lg font-bold text-text-primary mb-4">
                  시작 시간
                </Text>
                <View className="flex-row gap-3 mb-6">
                  <View className="flex-1 bg-white rounded-xl p-4 border-2 border-primary">
                    <Text className="text-primary text-center font-semibold">
                      {startTime}
                    </Text>
                  </View>
                  <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                    <Text className="text-text-secondary text-center">{endTime}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {step === 2 && (
            <View className="px-4 py-6">
              <Text className="text-2xl font-bold text-text-primary mb-2">
                📍 장소 입력
              </Text>

              <Input
                value={location}
                onChangeText={setLocation}
                placeholder="지번, 도로명, 건물명으로 검색"
                className="mb-6"
              />

              <View className="bg-gray-200 h-48 rounded-2xl items-center justify-center mb-6">
                <Text className="text-4xl">🗺️</Text>
                <Text className="text-text-secondary mt-2">지도에서 위치 확인</Text>
              </View>

              <Text className="text-lg font-bold text-text-primary mb-4">📝 주문 정보</Text>

              <View className="bg-white rounded-xl p-4 mb-4">
                <Text className="text-text-secondary mb-2">행사 유형</Text>
                <TouchableOpacity className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <Text className="text-text-primary font-medium">{eventType}</Text>
                  <Text>▼</Text>
                </TouchableOpacity>
              </View>

              <View className="bg-white rounded-xl p-4 mb-4">
                <Text className="text-text-secondary mb-2">예상 인원 (명)</Text>
                <View className="flex-row items-center justify-between">
                  <IconButton icon="−" onPress={() => {}} variant="default" />
                  <Text className="text-2xl font-bold text-text-primary">{attendees}</Text>
                  <IconButton icon="+" onPress={() => {}} variant="primary" />
                </View>
              </View>
            </View>
          )}

          {step === 3 && (
            <View className="px-4 py-6">
              <Text className="text-2xl font-bold text-text-primary mb-2">
                🙏 요청 사항
              </Text>

              <Text className="text-text-secondary mb-4">연예인 응원 문구</Text>
              <Input
                value={requirements}
                onChangeText={setRequirements}
                placeholder="배우님 힘내세요! 응원의 메시지를 적어주세요"
                multiline
                numberOfLines={4}
                className="mb-6"
              />

              <Text className="text-text-secondary mb-4">현수막/컵슬리브 디자인</Text>
              <TouchableOpacity className="bg-white rounded-xl p-6 border-2 border-dashed border-gray-300 items-center">
                <Text className="text-4xl mb-2">📤</Text>
                <Text className="text-text-primary font-semibold">
                  디자인 파일 업로드
                </Text>
                <Text className="text-text-secondary text-sm mt-1">
                  JPG, PNG, PDF(최대 10MB)
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="h-24" />
        </ScrollView>

        {/* Bottom Navigation */}
        <View className="px-4 py-4 bg-white border-t border-gray-200">
          {step < 3 ? (
            <Button
              variant="primary"
              size="lg"
              onPress={() => setStep(step + 1)}
            >
              다음 단계 →
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onPress={() => {
                navigation.navigate("MainTabs", { screen: "Home" });
              }}
            >
              예약 요청하기 →
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
