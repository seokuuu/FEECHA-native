import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MainStackParamList } from './types';
import { useAuthStore } from '@/entities/auth/model';
import { UserRole } from '@/shared/types/api';

import { ClientTabNavigator } from './ClientTabNavigator';
import { VendorTabNavigator } from './VendorTabNavigator';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  const { user } = useAuthStore();

  // í`Ð 0| 0 Tt °
  const initialRouteName = user?.role === UserRole.VENDOR ? 'VendorTab' : 'ClientTab';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Tabs */}
      <Stack.Screen name="ClientTab" component={ClientTabNavigator} />
      <Stack.Screen name="VendorTab" component={VendorTabNavigator} />

      {/* Common Stack Screens (TODO: ”Ä l) */}
      {/* <Stack.Screen name="VendorDetail" component={VendorDetailScreen} /> */}
      {/* <Stack.Screen name="RequestDetail" component={RequestDetailScreen} /> */}
      {/* <Stack.Screen name="ChatRoom" component={ChatRoomScreen} /> */}
    </Stack.Navigator>
  );
}
