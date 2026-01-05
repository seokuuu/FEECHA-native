import { create } from 'zustand';
import { apiClient } from '@/shared/api/client';
import type { Review, PaginatedResponse } from '@/shared/types/api';

interface ReviewState {
  reviews: Review[];
  currentReview: Review | null;
  isLoading: boolean;
  error: string | null;
}

interface ReviewActions {
  fetchReviews: (vendorId: string, filters?: any) => Promise<void>;
  createReview: (bookingId: string, data: Partial<Review>) => Promise<void>;
  reportReview: (id: string, reason: string) => Promise<void>;
}

export const useReviewStore = create<ReviewState & ReviewActions>((set) => ({
  reviews: [],
  currentReview: null,
  isLoading: false,
  error: null,

  fetchReviews: async (vendorId: string, filters = {}) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.get<PaginatedResponse<Review>>('/reviews', {
        params: { vendorId, ...filters },
      });

      set({ reviews: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '리뷰 목록 조회에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  createReview: async (bookingId: string, data: Partial<Review>) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.post<{ data: Review }>('/reviews', {
        bookingId,
        ...data,
      });

      set({ currentReview: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '리뷰 작성에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  reportReview: async (id: string, reason: string) => {
    try {
      set({ isLoading: true, error: null });

      await apiClient.post(`/reviews/${id}/report`, { reason });

      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '리뷰 신고에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },
}));
