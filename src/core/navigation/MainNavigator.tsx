import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MainStackParamList } from './types';
import { useAuthStore } from '@/entities/auth/model';
import { UserRole } from '@/shared/types/api';

import { ClientTabNavigator } from './ClientTabNavigator';
import { VendorTabNavigator } from './VendorTabNavigator';
import VendorDetailScreen from '@/pages/common/vendor-detail';
import RequestCreateScreen from '@/pages/client/request-create';
import QuotationListScreen from '@/pages/client/quotation-list';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  const { user } = useAuthStore();

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

      {/* Common Stack Screens */}
      <Stack.Screen name="VendorDetail" component={VendorDetailScreen} />
      <Stack.Screen name="RequestCreate" component={RequestCreateScreen} />
      <Stack.Screen name="QuotationList" component={QuotationListScreen} />
    </Stack.Navigator>
  );
}
