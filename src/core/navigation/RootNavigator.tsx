import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";
import { OnboardingPage } from "../../pages/onboarding";
import { SearchFilterPage } from "../../pages/search-filter";
import { TruckDetailPage } from "../../pages/truck-detail";
import { BookingPage } from "../../pages/booking";
import { BottomTabNavigator } from "./BottomTabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingPage} />
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="SearchFilter" component={SearchFilterPage} />
        <Stack.Screen name="TruckDetail" component={TruckDetailPage} />
        <Stack.Screen name="Booking" component={BookingPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
