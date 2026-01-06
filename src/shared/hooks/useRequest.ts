import { useState, useCallback } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { apiClient } from '@/shared/api/client';
import { useAuthStore } from '@/entities/auth/model';

interface UseRequestOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: RequestError) => void;
  showErrorToast?: boolean;
}

interface RequestError {
  statusCode: number;
  errorCode?: number;
  message: string;
  type: 'network' | 'server' | 'auth' | 'validation' | 'unknown';
}

interface UseRequestReturn<T> {
  data: T | null;
  error: RequestError | null;
  isLoading: boolean;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useRequest<T = any>(
  requestFn: (...args: any[]) => Promise<AxiosResponse<any>>,
  options: UseRequestOptions = {}
): UseRequestReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<RequestError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuthStore();

  const parseError = useCallback((err: any): RequestError => {
    if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
      return {
        statusCode: 0,
        message: '네트워크 연결을 확인해주세요.',
        type: 'network',
      };
    }

    if (err.response) {
      const status = err.response.status;
      const responseData = err.response.data;

      // 401: 인증 만료
      if (status === 401) {
        return {
          statusCode: 401,
          errorCode: responseData?.errorCode,
          message: '로그인이 필요합니다.',
          type: 'auth',
        };
      }

      // 403: 권한 없음
      if (status === 403) {
        return {
          statusCode: 403,
          errorCode: responseData?.errorCode,
          message: responseData?.message || '접근 권한이 없습니다.',
          type: 'auth',
        };
      }

      // 404: 리소스 없음
      if (status === 404) {
        return {
          statusCode: 404,
          message: responseData?.message || '요청한 정보를 찾을 수 없습니다.',
          type: 'server',
        };
      }

      // 422: 유효성 검증 실패
      if (status === 422 || status === 400) {
        return {
          statusCode: status,
          errorCode: responseData?.errorCode,
          message: responseData?.message || '입력 정보를 확인해주세요.',
          type: 'validation',
        };
      }

      // 500: 서버 에러
      if (status >= 500) {
        return {
          statusCode: status,
          message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          type: 'server',
        };
      }

      return {
        statusCode: status,
        errorCode: responseData?.errorCode,
        message: responseData?.message || '오류가 발생했습니다.',
        type: 'server',
      };
    }

    return {
      statusCode: 0,
      message: err.message || '알 수 없는 오류가 발생했습니다.',
      type: 'unknown',
    };
  }, []);

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await requestFn(...args);
        const result = response.data?.data || response.data;

        setData(result);
        options.onSuccess?.(result);

        return result;
      } catch (err) {
        const parsedError = parseError(err);
        setError(parsedError);

        // 401 에러시 자동 로그아웃 (refresh 실패한 경우)
        if (parsedError.statusCode === 401) {
          await logout();
        }

        // 403 에러 처리
        if (parsedError.statusCode === 403) {
          console.warn('403 Forbidden:', parsedError.message);
        }

        options.onError?.(parsedError);

        if (options.showErrorToast) {
          // TODO: Toast 알림 표시
          console.error('Error:', parsedError.message);
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [requestFn, options, parseError, logout]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  };
}
