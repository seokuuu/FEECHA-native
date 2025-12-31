import React, { useState } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar, Card, Chip, Badge, Rating, TouchableCard } from "../../shared/ui";
import { useNavigation } from "@react-navigation/native";

const MOCK_TRUCKS = [
  {
    id: "1",
    name: "Star Coffee Truck",
    category: "Coffee, Churros, Tea",
    rating: 4.9,
    reviews: 156,
    price: "Min $300",
    image: "https://via.placeholder.com/300x200/FFB6C1/FFFFFF?text=Pink+Truck",
    promo: true,
  },
  {
    id: "2",
    name: "Midnight Snack Wagon",
    category: "Tteokbokki, Fish Cake",
    rating: 4.9,
    reviews: 89,
    price: "Min $250",
    image: "https://via.placeholder.com/300x200/FFD700/000000?text=Yellow+Truck",
  },
];

const PROMO_BANNERS = [
  {
    id: "1",
    title: "Summer Special",
    subtitle: "10% off for all drama shoots booked this week!",
    badge: "Promo",
  },
  {
    id: "2",
    title: "New Season",
    subtitle: "Search and book for your favorite events",
    badge: "New",
  },
];

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigation = useNavigation();

  const categories = ["All", "☕ Coffee", "🍰 Snacks", "🍜 Meal"];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-3xl font-bold text-primary">FEE-CHA</Text>
          <Text className="text-text-secondary mt-1">
            Hello, <Text className="font-semibold text-text-primary">Ji-won</Text>!
          </Text>
          <Text className="text-xl font-bold text-text-primary mt-2">
            Who are you supporting today?
          </Text>
        </View>

        {/* Search Bar */}
        <View className="px-4 mt-4">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Truck name, menu, or celebrity..."
          />
        </View>

        {/* Promo Banners */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-6 px-4"
          contentContainerStyle={{ gap: 12 }}
        >
          {PROMO_BANNERS.map((banner) => (
            <Card key={banner.id} className="w-80 p-4">
              <Badge label={banner.badge} variant="primary" className="self-start mb-2" />
              <Text className="text-lg font-bold text-text-primary mb-1">
                {banner.title}
              </Text>
              <Text className="text-text-secondary text-sm">{banner.subtitle}</Text>
            </Card>
          ))}
        </ScrollView>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-6 px-4"
          contentContainerStyle={{ gap: 8 }}
        >
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              variant="primary"
            />
          ))}
        </ScrollView>

        {/* Popular Trucks */}
        <View className="mt-8 px-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-text-primary">
              Popular Trucks
            </Text>
            <Text className="text-primary font-semibold">See All</Text>
          </View>

          <View className="gap-4">
            {MOCK_TRUCKS.map((truck) => (
              <TouchableCard
                key={truck.id}
                onPress={() => navigation.navigate("TruckDetail", { truckId: truck.id })}
              >
                <View className="flex-row">
                  <Image
                    source={{ uri: truck.image }}
                    className="w-24 h-24 rounded-xl"
                  />
                  <View className="flex-1 ml-4">
                    {truck.promo && (
                      <Badge label="Promo" variant="primary" className="self-start mb-1" />
                    )}
                    <Text className="text-lg font-bold text-text-primary">
                      {truck.name}
                    </Text>
                    <Text className="text-text-secondary text-sm mt-1">
                      {truck.category}
                    </Text>
                    <View className="flex-row items-center justify-between mt-2">
                      <Rating rating={truck.rating} size="sm" />
                      <Text className="text-text-primary font-semibold">
                        {truck.price}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableCard>
            ))}
          </View>
        </View>

        {/* Pick for You */}
        <View className="mt-8 px-4 pb-8">
          <Text className="text-xl font-bold text-text-primary mb-4">
            Pick for You
          </Text>

          <Card className="flex-row items-center">
            <Image
              source={{ uri: "https://via.placeholder.com/80x80/FFF5E1/000000?text=Dessert" }}
              className="w-20 h-20 rounded-xl"
            />
            <View className="flex-1 ml-4">
              <View className="flex-row items-center mb-1">
                <Rating rating={4.7} size="sm" showNumber={false} />
                <Text className="ml-2 text-text-secondary text-sm">4.7</Text>
              </View>
              <Text className="text-lg font-bold text-text-primary">
                Sweet Dreams Truck
              </Text>
              <Text className="text-text-secondary text-sm">
                Best for dessert lovers on set...
              </Text>
              <View className="flex-row gap-2 mt-2">
                <Badge label="Dessert" variant="warning" />
                <Badge label="Fast Setup" variant="success" />
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
