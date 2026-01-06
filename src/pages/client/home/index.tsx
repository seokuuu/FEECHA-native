import { View, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '@/core/navigation/types';
import { SearchInput, VendorCard, PromotionBanner, Chip } from '@/shared/ui';
import { MOCK_VENDORS } from '@/shared/lib/mockData';

const CATEGORIES = [
  { id: 'all', label: '전체', icon: '☕' },
  { id: 'drama', label: '드라마 촬영장', icon: '🎬' },
  { id: 'movie', label: '영화 촬영장', icon: '🎥' },
  { id: 'event', label: '이벤트', icon: '🎉' },
  { id: 'party', label: '행사', icon: '🎊' },
];

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4 bg-white">
          <Text className="text-2xl font-bold text-dark mb-4">
            어떤 <Text className="text-primary">커피차</Text>를{'\n'}찾으시나요?
          </Text>

          <SearchInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="커피차를 검색해보세요"
          />
        </View>

        {/* Promotion Banner */}
        <View className="px-6 py-4">
          <PromotionBanner
            title="Cool Down the Set!"
            subtitle="7월 촬영장 업무 응원 패키지 15% 할인"
            label="SUMMER SPECIAL"
            imageUrl="https://picsum.photos/800/400?random=10"
            ctaText="자세히 보기"
            onPress={() => console.log('Banner clicked')}
          />
        </View>

        {/* Category Filters */}
        <View className="px-6 py-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {CATEGORIES.map((category) => (
                <Chip
                  key={category.id}
                  label={`${category.icon} ${category.label}`}
                  selected={selectedCategory === category.id}
                  onPress={() => setSelectedCategory(category.id)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Featured Trucks */}
        <View className="px-6 py-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-dark">인기 커피차</Text>
            <Text className="text-primary text-sm">전체보기</Text>
          </View>

          {MOCK_VENDORS.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onPress={() => navigation.navigate('VendorDetail', { vendorId: vendor.id })}
              className="mb-4"
            />
          ))}
        </View>

        {/* Recommended Section */}
        <View className="px-6 py-4">
          <Text className="text-xl font-bold text-dark mb-4">
            맞춤 견적 받아보기
          </Text>
          <View className="bg-primary-light-muted rounded-large p-6">
            <Text className="text-base text-dark font-semibold mb-2">
              내 연예인을 위한 선물
            </Text>
            <Text className="text-sm text-text-secondary mb-4">
              맞춤 견적 받아보기
            </Text>
            <View className="bg-primary rounded-large px-4 py-3 self-start flex-row items-center">
              <Text className="text-white font-semibold mr-2">견적 요청하기</Text>
              <Text className="text-white">✏️</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
