import { create } from 'zustand';
import { apiClient } from '@/shared/api/client';
import type { Booking, PaginatedResponse } from '@/shared/types/api';

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}

interface BookingActions {
  fetchBookings: (filters?: any) => Promise<void>;
  fetchBookingDetail: (id: string) => Promise<void>;
  cancelBooking: (id: string, reason: string) => Promise<void>;
  completeBooking: (id: string) => Promise<void>;
}

export const useBookingStore = create<BookingState & BookingActions>((set) => ({
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,

  fetchBookings: async (filters = {}) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.get<PaginatedResponse<Booking>>('/bookings', {
        params: filters,
      });

      set({ bookings: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '예약 목록 조회에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchBookingDetail: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.get<{ data: Booking }>(`/bookings/${id}`);

      set({ currentBooking: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '예약 상세 조회에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  cancelBooking: async (id: string, reason: string) => {
    try {
      set({ isLoading: true, error: null });

      await apiClient.post(`/bookings/${id}/cancel`, { reason });

      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '예약 취소에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  completeBooking: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      await apiClient.post(`/bookings/${id}/complete`);

      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '예약 완료 처리에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },
}));
