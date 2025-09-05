// API 클라이언트 유틸리티 함수들

// API 응답 타입 정의
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  status?: number;
  message?: string;
  fromCache?: boolean;
}

export interface ApiError {
  success: false;
  error: string;
  status: number;
  details?: any;
}

// API 응답을 표준화하는 함수
export const formatApiResponse = <T = any>(response: any): ApiResponse<T> => {
  return {
    success: true,
    data: response.data,
    status: response.status,
    message: response.data?.message || 'Success',
  };
};

// API 에러를 표준화하는 함수
export const formatApiError = (error: any): ApiError => {
  return {
    success: false,
    error: error.response?.data?.message || error.message || 'An error occurred',
    status: error.response?.status || 500,
    details: error.response?.data || null,
  };
};

// 로딩 상태를 관리하는 함수
export const withLoading = async <T>(
  asyncFunction: () => Promise<T>, 
  setLoading: (loading: boolean) => void
): Promise<T> => {
  try {
    setLoading(true);
    const result = await asyncFunction();
    return result;
  } finally {
    setLoading(false);
  }
};

// 에러 처리를 위한 함수
export const handleApiError = (error: any, setError: (error: string) => void): ApiError => {
  const formattedError = formatApiError(error);
  setError(formattedError.error);
  console.error('API Error:', formattedError);
  return formattedError;
};

// 성공 메시지를 표시하는 함수
export const showSuccessMessage = (message: string): void => {
  // 실제 프로젝트에서는 toast 라이브러리 사용 권장
  console.log('Success:', message);
  // 예: toast.success(message);
};

// 에러 메시지를 표시하는 함수
export const showErrorMessage = (error: string | any): void => {
  // 실제 프로젝트에서는 toast 라이브러리 사용 권장
  console.error('Error:', error);
  // 예: toast.error(error);
};

// API 호출을 래핑하는 고차 함수
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  apiFunction: T
): T => {
  return (async (...args: any[]) => {
    try {
      const result = await apiFunction(...args);
      return result;
    } catch (error) {
      return formatApiError(error);
    }
  }) as T;
};

// 재시도 로직이 포함된 API 호출 함수
export const withRetry = <T extends (...args: any[]) => Promise<any>>(
  apiFunction: T, 
  maxRetries: number = 3, 
  delay: number = 1000
): T => {
  return (async (...args: any[]) => {
    let lastError: any;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await apiFunction(...args);
        return result;
      } catch (error) {
        lastError = error;
        
        // 마지막 시도가 아니면 대기 후 재시도
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }
    
    throw lastError;
  }) as T;
};

// API 호출 결과를 캐시하는 함수
export const withCache = <T extends (...args: any[]) => Promise<ApiResponse>>(
  apiFunction: T, 
  cacheKey: string, 
  ttl: number = 5 * 60 * 1000
): T => {
  const cache = new Map<string, { data: any; timestamp: number }>();
  
  return (async (...args: any[]) => {
    const key = `${cacheKey}_${JSON.stringify(args)}`;
    const now = Date.now();
    
    // 캐시에서 확인
    if (cache.has(key)) {
      const { data, timestamp } = cache.get(key)!;
      if (now - timestamp < ttl) {
        return { success: true, data, fromCache: true };
      }
    }
    
    // API 호출
    const result = await apiFunction(...args);
    
    // 성공 시 캐시에 저장
    if (result.success) {
      cache.set(key, { data: result.data, timestamp: now });
    }
    
    return result;
  }) as T;
};
