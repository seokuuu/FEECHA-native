import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Button, Input } from '@/shared/ui';
import { useRequestStore } from '@/entities/request/model';
import type { MainStackScreenProps } from '@/core/navigation/types';

type Props = MainStackScreenProps<'RequestCreate'>;

export default function RequestCreateScreen({ route, navigation }: Props) {
  const { vendorId } = route.params || {};
  const { createRequest, isLoading } = useRequestStore();

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [address, setAddress] = useState('');
  const [estimatedPeople, setEstimatedPeople] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Services
  const [services, setServices] = useState({
    coffee: true,
    lunchBox: false,
    banner: false,
    xBanner: false,
    dessert: false,
  });

  const toggleService = (service: keyof typeof services) => {
    setServices((prev) => ({ ...prev, [service]: !prev[service] }));
  };

  const handleSubmit = async () => {
    // 필수 필드 검증
    if (!title || !date || !startTime || !endTime || !address || !estimatedPeople || !budgetMin || !budgetMax) {
      Alert.alert('입력 오류', '필수 항목을 모두 입력해주세요.');
      return;
    }

    // 서비스 선택 검증
    if (!Object.values(services).some((v) => v)) {
      Alert.alert('입력 오류', '최소 하나의 서비스를 선택해주세요.');
      return;
    }

    try {
      // TODO: API 연동 후 주석 해제
      // await createRequest({
      //   title,
      //   date,
      //   startTime,
      //   endTime,
      //   location: { address, latitude: 0, longitude: 0 },
      //   estimatedPeople: parseInt(estimatedPeople),
      //   budgetMin: parseInt(budgetMin) * 10000,
      //   budgetMax: parseInt(budgetMax) * 10000,
      //   services,
      //   additionalInfo,
      // });

      // Mock: 임시로 성공 처리
      Alert.alert('성공', '의뢰가 등록되었습니다!', [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);

      console.log('Request created:', {
        title,
        date,
        startTime,
        endTime,
        address,
        estimatedPeople,
        budgetMin,
        budgetMax,
        services,
        additionalInfo,
        vendorId,
      });
    } catch (error) {
      Alert.alert('오류', '의뢰 등록에 실패했습니다. 다시 시도해주세요.');
      console.error('Request creation error:', error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-2">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <Text className="text-xl">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-dark">의뢰 작성</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          {/* Title */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-dark mb-2">제목 *</Text>
            <Input
              value={title}
              onChangeText={setTitle}
              placeholder="예) 12/31 경기 남양주 드라마 촬영장 커피차"
            />
          </View>

          {/* Date & Time */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-dark mb-2">일정 *</Text>
            <Input
              value={date}
              onChangeText={setDate}
              placeholder="날짜 (YYYY-MM-DD)"
              className="mb-3"
            />
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Input
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholder="시작 시간 (HH:MM)"
                />
              </View>
              <View className="flex-1">
                <Input
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholder="종료 시간 (HH:MM)"
                />
              </View>
            </View>
          </View>

          {/* Location */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-dark mb-2">장소 *</Text>
            <Input
              value={address}
              onChangeText={setAddress}
              placeholder="예) 경기도 남양주시 OO동"
            />
            <Text className="text-sm text-gray-6 mt-2">
              💡 상세 주소는 채팅에서 공유할 수 있어요
            </Text>
          </View>

          {/* Estimated People & Budget */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-dark mb-2">예상 인원 *</Text>
            <Input
              value={estimatedPeople}
              onChangeText={setEstimatedPeople}
              placeholder="예) 150"
              keyboardType="numeric"
              className="mb-3"
            />

            <Text className="text-base font-semibold text-dark mb-2 mt-4">예산 *</Text>
            <View className="flex-row gap-3 items-center">
              <View className="flex-1">
                <Input
                  value={budgetMin}
                  onChangeText={setBudgetMin}
                  placeholder="최소 (만원)"
                  keyboardType="numeric"
                />
              </View>
              <Text className="text-gray-6">~</Text>
              <View className="flex-1">
                <Input
                  value={budgetMax}
                  onChangeText={setBudgetMax}
                  placeholder="최대 (만원)"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Services */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-dark mb-3">필요한 서비스 *</Text>
            <View className="flex-row flex-wrap gap-3">
              {[
                { key: 'coffee', label: '☕ 커피/음료' },
                { key: 'lunchBox', label: '🍱 도시락' },
                { key: 'banner', label: '🪧 현수막' },
                { key: 'xBanner', label: '📋 X배너' },
                { key: 'dessert', label: '🍰 디저트' },
              ].map((service) => (
                <TouchableOpacity
                  key={service.key}
                  onPress={() => toggleService(service.key as keyof typeof services)}
                  className={`px-4 py-3 rounded-full border ${
                    services[service.key as keyof typeof services]
                      ? 'bg-primary border-primary'
                      : 'bg-white border-gray-3'
                  }`}
                >
                  <Text
                    className={
                      services[service.key as keyof typeof services]
                        ? 'text-white font-semibold'
                        : 'text-gray-6'
                    }
                  >
                    {service.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Additional Info */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-dark mb-2">
              추가 요청사항 (선택)
            </Text>
            <Input
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
              placeholder="주차 공간, 전기 공급, 디자인 요청 등"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="bg-white border-t border-gray-2 px-6 py-4">
        <Button onPress={handleSubmit} loading={isLoading} className="w-full">
          {vendorId ? '특정 사장님에게 견적 요청' : '견적 요청하기'}
        </Button>
      </View>
    </View>
  );
}
