import { create } from 'zustand';
import { apiClient } from '@/shared/api/client';
import type { Notification } from '@/shared/types/api';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface NotificationActions {
  fetchNotifications: (filters?: any) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  registerFcmToken: (token: string, deviceId: string, platform: 'IOS' | 'ANDROID') => Promise<void>;
}

export const useNotificationStore = create<NotificationState & NotificationActions>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async (filters = {}) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.get<{ data: Notification[]; unreadCount: number }>(
        '/notifications',
        { params: filters }
      );

      set({
        notifications: response.data.data,
        unreadCount: response.data.unreadCount,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '알림 목록 조회에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  markAsRead: async (id: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);

      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '알림 읽음 처리에 실패했습니다.',
      });
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      await apiClient.post('/notifications/read-all');

      set((state) => ({
        notifications: state.notifications.map((notif) => ({ ...notif, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '전체 읽음 처리에 실패했습니다.',
      });
      throw error;
    }
  },

  registerFcmToken: async (token: string, deviceId: string, platform: 'IOS' | 'ANDROID') => {
    try {
      await apiClient.post('/notifications/fcm-token', {
        fcmToken: token,
        deviceId,
        platform,
      });
    } catch (error: any) {
      console.error('FCM 토큰 등록 실패:', error);
      throw error;
    }
  },
}));
