import { create } from 'zustand';
import { apiClient } from '@/shared/api/client';
import type { Quotation } from '@/shared/types/api';

interface QuotationState {
  quotations: Quotation[];
  currentQuotation: Quotation | null;
  isLoading: boolean;
  error: string | null;
}

interface QuotationActions {
  fetchQuotations: (requestId: string) => Promise<void>;
  fetchQuotationDetail: (id: string) => Promise<void>;
  submitQuotation: (data: Partial<Quotation>) => Promise<void>;
  selectQuotation: (id: string) => Promise<void>;
  updateQuotation: (id: string, data: Partial<Quotation>) => Promise<void>;
  deleteQuotation: (id: string) => Promise<void>;
}

export const useQuotationStore = create<QuotationState & QuotationActions>((set) => ({
  quotations: [],
  currentQuotation: null,
  isLoading: false,
  error: null,

  fetchQuotations: async (requestId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.get<{ data: Quotation[] }>(
        `/requests/${requestId}/quotations`
      );

      set({ quotations: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '견적 목록 조회에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchQuotationDetail: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.get<{ data: Quotation }>(`/quotations/${id}`);

      set({ currentQuotation: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '견적 상세 조회에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  submitQuotation: async (data: Partial<Quotation>) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.post<{ data: Quotation }>('/quotations', data);

      set({ currentQuotation: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '견적 제출에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  selectQuotation: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.post<{ data: any }>(`/quotations/${id}/select`);

      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '견적 선택에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  updateQuotation: async (id: string, data: Partial<Quotation>) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.patch<{ data: Quotation }>(
        `/quotations/${id}`,
        data
      );

      set({ currentQuotation: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '견적 수정에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteQuotation: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      await apiClient.delete(`/quotations/${id}`);

      set({ currentQuotation: null, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '견적 삭제에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },
}));
