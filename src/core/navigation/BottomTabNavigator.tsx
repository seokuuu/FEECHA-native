import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "./types";
import { HomePage } from "../../pages/home";

const Tab = createBottomTabNavigator<MainTabParamList>();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F5A623",
        tabBarInactiveTintColor: "#999999",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarLabel: "홈",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Search"
        component={HomePage}
        options={{
          tabBarLabel: "검색",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="Wishlist"
        component={HomePage}
        options={{
          tabBarLabel: "찜",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>❤️</Text>,
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={HomePage}
        options={{
          tabBarLabel: "예약",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📋</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={HomePage}
        options={{
          tabBarLabel: "내 정보",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};
