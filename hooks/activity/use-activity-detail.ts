import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import {
    activityApi,
    getActivityErrorMessage,
} from '@/api/activityApi';
import type { ActivityDetailResponse } from '@/types/activity';
import { getAccessToken } from '@/utils/auth';

export function useActivityDetail(
  activityId: number
) {
  const [activity, setActivity] =
    useState<ActivityDetailResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState('');

  const fetchActivityDetail =
    useCallback(async () => {
      if (!activityId) {
        setErrorMessage(
          '올바르지 않은 체험입니다.'
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage('');

        const accessToken =
          await getAccessToken();

        if (!accessToken) {
          throw new Error(
            '로그인이 필요합니다.'
          );
        }

        const data =
          await activityApi.getActivityDetail(
            activityId,
            accessToken
          );

        setActivity(data);
      } catch (error) {
        setErrorMessage(
          getActivityErrorMessage(error)
        );
      } finally {
        setLoading(false);
      }
    }, [activityId]);

  useEffect(() => {
    fetchActivityDetail();
  }, [fetchActivityDetail]);

  return {
    activity,
    loading,
    errorMessage,
    fetchActivityDetail,
  };
}