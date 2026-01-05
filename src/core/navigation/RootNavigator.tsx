import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootNavigatorParamList } from './types';
import { useAuthStore } from '@/entities/auth/model';

import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

const Stack = createNativeStackNavigator<RootNavigatorParamList>();

export function RootNavigator() {
  const { isAuthenticated, loadStoredAuth } = useAuthStore();

  // 앱 시작시 저장된 인증 정보 로드
  useEffect(() => {
    loadStoredAuth();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
