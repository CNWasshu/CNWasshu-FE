import { useCallback, useRef, useState } from 'react';

import { courseApi, getCourseErrorMessage } from '@/api/courseApi';

type ManageStatus = 'error' | 'idle' | 'submitting' | 'success';

export function useManageCourse() {
  const submittingRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<ManageStatus>('idle');

  const renameCourse = useCallback(
    async (courseId: number, courseName: string, accessToken: string) => {
      if (submittingRef.current) {
        return false;
      }

      submittingRef.current = true;
      setErrorMessage(null);
      setStatus('submitting');

      try {
        await courseApi.renameCourse(courseId, { courseName }, accessToken);
        setStatus('success');
        return true;
      } catch (requestError) {
        setErrorMessage(getCourseErrorMessage(requestError));
        setStatus('error');
        return false;
      } finally {
        submittingRef.current = false;
      }
    },
    []
  );

  const deleteCourse = useCallback(async (courseId: number, accessToken: string) => {
    if (submittingRef.current) {
      return false;
    }

    submittingRef.current = true;
    setErrorMessage(null);
    setStatus('submitting');

    try {
      await courseApi.deleteCourse(courseId, accessToken);
      setStatus('success');
      return true;
    } catch (requestError) {
      setErrorMessage(getCourseErrorMessage(requestError));
      setStatus('error');
      return false;
    } finally {
      submittingRef.current = false;
    }
  }, []);

  const reset = useCallback(() => {
    if (submittingRef.current) {
      return;
    }

    setErrorMessage(null);
    setStatus('idle');
  }, []);

  return {
    deleteCourse,
    errorMessage,
    isSubmitting: status === 'submitting',
    renameCourse,
    reset,
  };
}
