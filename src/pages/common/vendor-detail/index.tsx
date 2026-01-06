import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';
import { Button, Badge, Rating, Divider } from '@/shared/ui';
import { MOCK_VENDORS } from '@/shared/lib/mockData';
import type { MainStackScreenProps } from '@/core/navigation/types';

type Props = MainStackScreenProps<'VendorDetail'>;

const { width } = Dimensions.get('window');

const TABS = ['메뉴', '정보', '리뷰'] as const;
type TabType = typeof TABS[number];

export default function VendorDetailScreen({ route, navigation }: Props) {
  const { vendorId } = route.params;
  const [activeTab, setActiveTab] = useState<TabType>('메뉴');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock 데이터
  const vendor = MOCK_VENDORS.find((v) => v.id === vendorId) || MOCK_VENDORS[0];

  const renderTabContent = () => {
    switch (activeTab) {
      case '메뉴':
        return (
          <View className="p-6">
            <Text className="text-lg font-bold text-dark mb-4">제공 서비스</Text>

            <View className="bg-white rounded-large p-4 mb-3">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-base text-dark">커피/음료</Text>
                <Text className="text-base font-bold text-primary">
                  {(vendor.basePrice / 10000).toFixed(0)}만원
                </Text>
              </View>
              <Text className="text-sm text-text-secondary">{vendor.basePeople}인 기준</Text>
            </View>

            {vendor.services.lunchBox && (
              <View className="bg-white rounded-large p-4 mb-3">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-base text-dark">도시락</Text>
                  <Text className="text-base font-bold text-primary">
                    {(vendor.priceOptions.lunchBox / 1000).toFixed(0)}천원
                  </Text>
                </View>
                <Text className="text-sm text-text-secondary">1인 기준</Text>
              </View>
            )}

            {vendor.services.banner && (
              <View className="bg-white rounded-large p-4 mb-3">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-base text-dark">현수막 제작</Text>
                  <Text className="text-base font-bold text-primary">
                    {(vendor.priceOptions.banner / 10000).toFixed(0)}만원
                  </Text>
                </View>
                <Text className="text-sm text-text-secondary">3m 기준</Text>
              </View>
            )}
          </View>
        );

      case '정보':
        return (
          <View className="p-6">
            <View className="mb-6">
              <Text className="text-lg font-bold text-dark mb-3">활동 지역</Text>
              <View className="flex-row flex-wrap gap-2">
                {vendor.regions.map((region) => (
                  <Badge key={region} variant="default">
                    {region}
                  </Badge>
                ))}
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-lg font-bold text-dark mb-3">차량 정보</Text>
              <View className="bg-white rounded-large p-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-6">크기</Text>
                  <Text className="text-dark">{vendor.vehicleInfo.size}</Text>
                </View>
                <Divider className="my-2" />
                <View className="flex-row justify-between">
                  <Text className="text-gray-6">전기 필요</Text>
                  <Text className="text-dark">
                    {vendor.vehicleInfo.requiresElectricity ? '필요' : '불필요'}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <Text className="text-lg font-bold text-dark mb-3">소개</Text>
              <Text className="text-base text-text-secondary leading-6">
                {vendor.description}
              </Text>
            </View>
          </View>
        );

      case '리뷰':
        return (
          <View className="p-6">
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-3xl font-bold text-dark mb-1">
                  {vendor.rating.toFixed(1)}
                </Text>
                <Rating rating={vendor.rating} size="sm" />
                <Text className="text-sm text-gray-6 mt-1">
                  {vendor.reviewCount}개의 리뷰
                </Text>
              </View>
            </View>

            <View className="bg-white rounded-large p-4 mb-3">
              <View className="flex-row items-center mb-2">
                <Image
                  source={{ uri: 'https://i.pravatar.cc/50?img=1' }}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <View className="flex-1">
                  <Text className="font-semibold text-dark">김민지</Text>
                  <Rating rating={5} size="sm" />
                </View>
                <Text className="text-xs text-gray-5">2일 전</Text>
              </View>
              <Text className="text-sm text-text-secondary">
                정말 만족스러운 서비스였어요! 연예인들도 좋아하셨고, 커피 맛도 훌륭했습니다.
              </Text>
            </View>

            <View className="bg-white rounded-large p-4">
              <View className="flex-row items-center mb-2">
                <Image
                  source={{ uri: 'https://i.pravatar.cc/50?img=2' }}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <View className="flex-1">
                  <Text className="font-semibold text-dark">박서준</Text>
                  <Rating rating={4} size="sm" />
                </View>
                <Text className="text-xs text-gray-5">1주 전</Text>
              </View>
              <Text className="text-sm text-text-secondary">
                친절하시고 시간도 정확하게 오셨어요. 다음에도 이용하고 싶습니다.
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 이미지 갤러리 */}
        <View className="relative">
          <Image
            source={{ uri: vendor.portfolioImages[currentImageIndex] }}
            style={{ width, height: 300 }}
            resizeMode="cover"
          />

          {/* 뒤로가기 버튼 */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-12 left-4 bg-white/80 w-10 h-10 rounded-full items-center justify-center"
          >
            <Text className="text-xl">←</Text>
          </TouchableOpacity>

          {/* PREMIUM 배지 */}
          <View className="absolute top-12 right-4">
            <Badge variant="primary">PREMIUM</Badge>
          </View>

          {/* 이미지 인디케이터 */}
          <View className="absolute bottom-4 self-center flex-row">
            {vendor.portfolioImages.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full mx-1 ${
                  index === currentImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </View>
        </View>

        {/* 사장님 정보 */}
        <View className="bg-white px-6 py-5">
          <Text className="text-2xl font-bold text-dark mb-2">
            {vendor.businessName}
          </Text>

          <View className="flex-row items-center mb-3">
            <Rating rating={vendor.rating} size="sm" />
            <Text className="text-base font-bold text-dark ml-2">
              {vendor.rating.toFixed(1)}
            </Text>
            <Text className="text-sm text-gray-6 ml-1">
              ({vendor.reviewCount})
            </Text>
          </View>

          <View className="flex-row items-center">
            <Text className="text-sm text-gray-6 mr-4">
              📍 {vendor.regions.join(', ')}
            </Text>
            <Badge variant="success">빠른 응답</Badge>
          </View>
        </View>

        {/* Tabs */}
        <View className="bg-white border-b border-gray-2">
          <View className="flex-row">
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className="flex-1 py-4"
              >
                <Text
                  className={`text-center font-semibold ${
                    activeTab === tab ? 'text-primary' : 'text-gray-5'
                  }`}
                >
                  {tab}
                </Text>
                {activeTab === tab && (
                  <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>

      {/* Bottom CTA */}
      <View className="bg-white border-t border-gray-2 px-6 py-4">
        <Button
          onPress={() => navigation.navigate('RequestCreate', { vendorId: vendor.id })}
          className="w-full"
        >
          견적 요청하기
        </Button>
      </View>
    </View>
  );
}
