import { create } from 'zustand';
import { apiClient } from '@/shared/api/client';
import type { User } from '@/shared/types/api';

interface UserState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setProfile: (profile: User) => void;
}

export const useUserStore = create<UserState & UserActions>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.get<{ data: User }>('/users/me');

      set({ profile: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '프로필 조회에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  updateProfile: async (data: Partial<User>) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.patch<{ data: User }>('/users/me', data);

      set({ profile: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '프로필 수정에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  setProfile: (profile: User) => {
    set({ profile });
  },
}));
