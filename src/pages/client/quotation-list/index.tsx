import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { Button, Badge, Rating, Divider } from '@/shared/ui';
import { MOCK_QUOTATIONS, MOCK_VENDORS } from '@/shared/lib/mockData';
import type { MainStackScreenProps } from '@/core/navigation/types';

type Props = MainStackScreenProps<'QuotationList'>;

export default function QuotationListScreen({ route, navigation }: Props) {
  const { requestId } = route.params;
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);

  // Mock 데이터
  const quotations = MOCK_QUOTATIONS.filter((q) => q.requestId === requestId);

  const handleSelectQuotation = (quotationId: string) => {
    // TODO: quotationStore에서 견적 선택 처리
    console.log('Selected quotation:', quotationId);

    // TODO: BookingConfirm 화면으로 이동
    navigation.navigate('QuotationDetail', { quotationId });
  };

  const renderQuotationCard = (quotation: typeof MOCK_QUOTATIONS[0], index: number) => {
    const vendor = MOCK_VENDORS.find((v) => v.id === quotation.vendorId);
    if (!vendor) return null;

    const isSelected = selectedQuotationId === quotation.id;

    return (
      <TouchableOpacity
        key={quotation.id}
        onPress={() => setSelectedQuotationId(quotation.id)}
        className={`bg-white rounded-large p-5 mb-4 border-2 ${
          isSelected ? 'border-primary' : 'border-gray-2'
        }`}
      >
        {/* 사장님 정보 */}
        <View className="flex-row items-center mb-4">
          <Image
            source={{ uri: vendor.portfolioImages[0] }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="text-base font-bold text-dark">
              {vendor.businessName}
            </Text>
            <View className="flex-row items-center mt-1">
              <Rating rating={vendor.rating} size="sm" />
              <Text className="text-sm text-gray-6 ml-1">
                {vendor.rating.toFixed(1)} ({vendor.reviewCount})
              </Text>
            </View>
          </View>
          {index === 0 && <Badge variant="success">인기</Badge>}
        </View>

        <Divider className="mb-4" />

        {/* 견적 항목 */}
        <View className="mb-4">
          {quotation.items.map((item: any, idx: number) => (
            <View key={idx} className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-6">{item.name}</Text>
              <Text className="text-sm text-dark font-medium">
                {(item.price / 10000).toFixed(0)}만원
              </Text>
            </View>
          ))}
          {quotation.travelFee > 0 && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-6">출장비</Text>
              <Text className="text-sm text-dark font-medium">
                {(quotation.travelFee / 10000).toFixed(0)}만원
              </Text>
            </View>
          )}
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-6">부가세 (10%)</Text>
            <Text className="text-sm text-dark font-medium">
              {(quotation.vat / 10000).toFixed(0)}만원
            </Text>
          </View>
        </View>

        <Divider className="mb-4" />

        {/* 총액 */}
        <View className="flex-row justify-between items-center">
          <Text className="text-base font-semibold text-dark">총액</Text>
          <Text className="text-2xl font-bold text-primary">
            {(quotation.totalPrice / 10000).toFixed(0)}만원
          </Text>
        </View>

        {/* 예약금 정보 */}
        <View className="mt-3 bg-gray-1 rounded-large p-3">
          <View className="flex-row justify-between mb-1">
            <Text className="text-sm text-gray-6">예약금 ({quotation.depositRate}%)</Text>
            <Text className="text-sm text-dark font-semibold">
              {(quotation.depositPrice / 10000).toFixed(1)}만원
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-6">잔금 (현장 결제)</Text>
            <Text className="text-sm text-dark font-semibold">
              {(quotation.remainingPrice / 10000).toFixed(1)}만원
            </Text>
          </View>
        </View>

        {/* 특이사항 */}
        {quotation.notes && (
          <View className="mt-3">
            <Text className="text-sm text-gray-6">💬 {quotation.notes}</Text>
          </View>
        )}

        {/* 유효기간 */}
        <Text className="text-xs text-gray-5 mt-3">
          유효기간: {new Date(quotation.expiresAt).toLocaleDateString()} 까지
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
              <Text className="text-xl">←</Text>
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-bold text-dark">견적 비교</Text>
              <Text className="text-sm text-gray-6 mt-1">
                {quotations.length}개의 견적서
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        {/* 비교 안내 */}
        <View className="bg-primary-light-muted rounded-large p-4 mb-6">
          <Text className="text-sm text-dark">
            💡 <Text className="font-semibold">Tip:</Text> 가격뿐만 아니라 평점, 리뷰, 응답 속도를
            함께 고려하세요!
          </Text>
        </View>

        {/* 견적서 목록 */}
        {quotations.length > 0 ? (
          quotations.map((quotation, index) => renderQuotationCard(quotation, index))
        ) : (
          <View className="items-center justify-center py-20">
            <Text className="text-6xl mb-4">📋</Text>
            <Text className="text-lg text-gray-6">아직 견적서가 없습니다</Text>
            <Text className="text-sm text-gray-5 mt-2">
              조금만 기다려주세요!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      {selectedQuotationId && (
        <View className="bg-white border-t border-gray-2 px-6 py-4">
          <Button
            onPress={() => handleSelectQuotation(selectedQuotationId)}
            className="w-full"
          >
            이 견적으로 예약하기
          </Button>
        </View>
      )}
    </View>
  );
}
