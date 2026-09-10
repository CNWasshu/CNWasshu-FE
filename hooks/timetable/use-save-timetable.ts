import { useCallback, useRef, useState } from 'react';

import {
  normalizeTimetableApiError,
  timetableApi,
  TimetableApiError,
} from '@/api/timetableApi';
import type {
  TimetableDetailResponse,
  TimetableSaveRequest,
} from '@/types/timetable';

type SaveStatus = 'error' | 'idle' | 'submitting' | 'success';

// courseId를 넘기면 새로 만들지 않고 그 코스의 내용을 통째로 교체(수정)한다.
export function useSaveTimetable(accessToken?: string, courseId?: number) {
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
        const response = courseId != null
          ? await timetableApi.updateTimetable(courseId, payload, accessToken ?? '')
          : await timetableApi.createTimetable(payload, accessToken ?? '');

        if (!Number.isSafeInteger(response.timetableId) || response.timetableId <= 0) {
          throw new TimetableApiError(
            '저장된 코스 번호를 확인할 수 없습니다. 다시 시도해 주세요.',
            0,
            'INVALID_TIMETABLE_RESPONSE'
          );
        }

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
    [accessToken, courseId]
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
