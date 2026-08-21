import { useCallback, useRef, useState } from 'react';

import {
  normalizeTimetableApiError,
  timetableApi,
  type TimetableApiError,
} from '@/api/timetableApi';
import type {
  TimetableDetailResponse,
  TimetableSaveRequest,
} from '@/types/timetable';

type SaveStatus = 'error' | 'idle' | 'submitting' | 'success';

export function useSaveTimetable(accessToken?: string) {
  const submittingRef = useRef(false);
  const [error, setError] = useState<TimetableApiError | null>(null);
  const [result, setResult] = useState<TimetableDetailResponse | null>(null);
  const [status, setStatus] = useState<SaveStatus>('idle');

  const save = useCallback(
    async (payload: TimetableSaveRequest) => {
      if (submittingRef.current) {
        return null;
      }

      submittingRef.current = true;
      setError(null);
      setStatus('submitting');

      try {
        const response = await timetableApi.createTimetable(
          payload,
          accessToken ?? ''
        );
        setResult(response);
        setStatus('success');
        return response;
      } catch (requestError) {
        const apiError = normalizeTimetableApiError(requestError);
        setError(apiError);
        setStatus('error');
        return null;
      } finally {
        submittingRef.current = false;
      }
    },
    [accessToken]
  );

  const reset = useCallback(() => {
    if (submittingRef.current) {
      return;
    }

    setError(null);
    setResult(null);
    setStatus('idle');
  }, []);

  return {
    error,
    errorMessage: error?.message ?? null,
    isSubmitting: status === 'submitting',
    isSuccess: status === 'success',
    reset,
    result,
    save,
    status,
  };
}
