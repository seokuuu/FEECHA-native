import { create } from 'zustand';
import { apiClient } from '@/shared/api/client';
import type { Request, PaginatedResponse } from '@/shared/types/api';

interface RequestState {
  requests: Request[];
  currentRequest: Request | null;
  isLoading: boolean;
  error: string | null;
}

interface RequestActions {
  fetchRequests: (filters?: any) => Promise<void>;
  fetchRequestDetail: (id: string) => Promise<void>;
  createRequest: (data: Partial<Request>) => Promise<void>;
  updateRequest: (id: string, data: Partial<Request>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
}

export const useRequestStore = create<RequestState & RequestActions>((set) => ({
  requests: [],
  currentRequest: null,
  isLoading: false,
  error: null,

  fetchRequests: async (filters = {}) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.get<PaginatedResponse<Request>>('/requests', {
        params: filters,
      });

      set({ requests: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '의뢰 목록 조회에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchRequestDetail: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.get<{ data: Request }>(`/requests/${id}`);

      set({ currentRequest: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '의뢰 상세 조회에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  createRequest: async (data: Partial<Request>) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.post<{ data: Request }>('/requests', data);

      set({ currentRequest: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '의뢰 작성에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  updateRequest: async (id: string, data: Partial<Request>) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.patch<{ data: Request }>(`/requests/${id}`, data);

      set({ currentRequest: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '의뢰 수정에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteRequest: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      await apiClient.delete(`/requests/${id}`);

      set({ currentRequest: null, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '의뢰 삭제에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },
}));
