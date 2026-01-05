import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { ClientTabParamList } from './types';

import HomeScreen from '@/pages/client/home';
import RequestsScreen from '@/pages/client/requests';
import BookingsScreen from '@/pages/client/bookings';
import MyPageScreen from '@/pages/client/my-page';

const Tab = createBottomTabNavigator<ClientTabParamList>();

export function ClientTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#f5870f',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'H' }}
      />
      <Tab.Screen
        name="Requests"
        component={RequestsScreen}
        options={{ title: '´ X°' }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{ title: '´ }' }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{ title: 'Èt˜tÀ' }}
      />
    </Tab.Navigator>
  );
}
