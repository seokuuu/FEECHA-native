import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/shared/api/client';
import type { User, LoginResponse, AuthTokens } from '@/shared/types/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  socialLogin: (provider: 'kakao' | 'google' | 'apple', token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
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
  isLoading: false,
  error: null,

  // Actions
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.post<{ data: LoginResponse }>('/auth/login', {
        email,
        password,
      });

      const { user, accessToken, refreshToken } = response.data.data;

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

      const response = await apiClient.post<{ data: LoginResponse }>(`/auth/${provider}`, {
        token,
      });

      const { user, accessToken, refreshToken } = response.data.data;

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
      // 서버에 로그아웃 요청 (선택적)
      await apiClient.post('/auth/logout').catch(() => {});

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

      const response = await apiClient.post<{ data: { accessToken: string } }>(
        '/auth/refresh',
        { refreshToken }
      );

      const { accessToken } = response.data.data;

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
      const [accessToken, refreshToken, userString] = await AsyncStorage.multiGet([
        'accessToken',
        'refreshToken',
        'user',
      ]);

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
