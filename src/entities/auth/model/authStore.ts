import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/shared/api/client';
import type { User, LoginResponse, AuthTokens } from '@/shared/types/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  socialLogin: (provider: 'kakao' | 'google' | 'apple', token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  // State
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  hasSeenOnboarding: false,
  isLoading: false,
  error: null,

  // Actions
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API 연동 후 주석 해제
      // const response = await apiClient.post<{ data: LoginResponse }>('/auth/login', {
      //   email,
      //   password,
      // });
      // const { user, accessToken, refreshToken } = response.data.data;

      // Mock 데이터 (임시)
      const user: User = {
        id: 'mock-user-id',
        email,
        name: '테스트 유저',
        role: 'CLIENT' as any,
        status: 'ACTIVE' as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const accessToken = 'mock-access-token';
      const refreshToken = 'mock-refresh-token';

      // 토큰 저장
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  socialLogin: async (provider: 'kakao' | 'google' | 'apple', token: string) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: API 연동 후 주석 해제
      // const response = await apiClient.post<{ data: LoginResponse }>(`/auth/${provider}`, {
      //   token,
      // });
      // const { user, accessToken, refreshToken } = response.data.data;

      // Mock 데이터
      const user: User = {
        id: 'mock-social-user-id',
        email: `${provider}@example.com`,
        name: `${provider} 유저`,
        role: 'CLIENT' as any,
        status: 'ACTIVE' as any,
        provider: provider.toUpperCase() as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const accessToken = 'mock-access-token';
      const refreshToken = 'mock-refresh-token';

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '소셜 로그인에 실패했습니다.';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      // TODO: API 연동 후 주석 해제
      // await apiClient.post('/auth/logout').catch(() => {});

      // 로컬 저장소 삭제
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  },

  refreshAccessToken: async () => {
    try {
      const refreshToken = get().refreshToken;
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // TODO: API 연동 후 주석 해제
      // const response = await apiClient.post<{ data: { accessToken: string } }>(
      //   '/auth/refresh',
      //   { refreshToken }
      // );
      // const { accessToken } = response.data.data;

      // Mock 데이터
      const accessToken = 'mock-refreshed-token';

      await AsyncStorage.setItem('accessToken', accessToken);

      set({ accessToken });
    } catch (error) {
      // Refresh 실패시 로그아웃
      await get().logout();
      throw error;
    }
  },

  loadStoredAuth: async () => {
    try {
      const [accessToken, refreshToken, userString, hasSeenOnboarding] = await AsyncStorage.multiGet([
        'accessToken',
        'refreshToken',
        'user',
        'hasSeenOnboarding',
      ]);

      set({
        hasSeenOnboarding: hasSeenOnboarding[1] === 'true',
      });

      if (accessToken[1] && refreshToken[1] && userString[1]) {
        const user = JSON.parse(userString[1]);

        set({
          user,
          accessToken: accessToken[1],
          refreshToken: refreshToken[1],
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
    }
  },

  completeOnboarding: async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    set({ hasSeenOnboarding: true });
  },

  setUser: (user: User) => {
    set({ user });
    AsyncStorage.setItem('user', JSON.stringify(user));
  },

  setTokens: (tokens: AuthTokens) => {
    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
    AsyncStorage.setItem('accessToken', tokens.accessToken);
    AsyncStorage.setItem('refreshToken', tokens.refreshToken);
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
