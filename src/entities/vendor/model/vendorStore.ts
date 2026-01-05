import { create } from 'zustand';
import { apiClient } from '@/shared/api/client';
import type { VendorProfile, PaginatedResponse } from '@/shared/types/api';

interface VendorState {
  vendorProfile: VendorProfile | null;
  vendorProfiles: VendorProfile[];
  isLoading: boolean;
  error: string | null;
}

interface VendorActions {
  fetchVendorProfile: (id?: string) => Promise<void>;
  fetchVendorProfiles: (filters?: any) => Promise<void>;
  createVendorProfile: (data: Partial<VendorProfile>) => Promise<void>;
  updateVendorProfile: (id: string, data: Partial<VendorProfile>) => Promise<void>;
}

export const useVendorStore = create<VendorState & VendorActions>((set) => ({
  vendorProfile: null,
  vendorProfiles: [],
  isLoading: false,
  error: null,

  fetchVendorProfile: async (id?: string) => {
    try {
      set({ isLoading: true, error: null });

      const url = id ? `/vendor-profiles/${id}` : '/vendor-profiles/me';
      const response = await apiClient.get<{ data: VendorProfile }>(url);

      set({ vendorProfile: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '프로필 조회에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchVendorProfiles: async (filters = {}) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.get<PaginatedResponse<VendorProfile>>(
        '/vendor-profiles',
        { params: filters }
      );

      set({ vendorProfiles: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '목록 조회에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  createVendorProfile: async (data: Partial<VendorProfile>) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.post<{ data: VendorProfile }>(
        '/vendor-profiles',
        data
      );

      set({ vendorProfile: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '프로필 생성에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  updateVendorProfile: async (id: string, data: Partial<VendorProfile>) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.patch<{ data: VendorProfile }>(
        `/vendor-profiles/${id}`,
        data
      );

      set({ vendorProfile: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '프로필 수정에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },
}));
