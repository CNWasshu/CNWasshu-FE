import { useCallback, useEffect, useState } from 'react';

import { getNotificationErrorMessage, notificationApi } from '@/api/notificationApi';
import type { NotificationResponse } from '@/types/notification';

const PAGE_SIZE = 20;

export function useNotifications(accessToken: string | null) {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (targetPage: number, append: boolean) => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await notificationApi.getNotifications(accessToken, {
          page: targetPage,
          size: PAGE_SIZE,
        });
        setNotifications((current) =>
          append ? [...current, ...response.notifications] : response.notifications
        );
        setPage(response.page);
        setHasNext(response.hasNext);
      } catch (requestError) {
        setError(getNotificationErrorMessage(requestError));
      } finally {
        if (append) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [accessToken]
  );

  const refetch = useCallback(() => fetchPage(0, false), [fetchPage]);

  const loadMore = useCallback(() => {
    if (hasNext && !loadingMore) {
      void fetchPage(page + 1, true);
    }
  }, [fetchPage, hasNext, loadingMore, page]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const markAsRead = useCallback(
    async (notificationId: number) => {
      if (!accessToken) {
        return;
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification.notificationId === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      try {
        await notificationApi.markAsRead(notificationId, accessToken);
      } catch {
        // 읽음 처리 실패는 조용히 무시한다. 다음 새로고침 때 서버 상태로 재동기화된다.
      }
    },
    [accessToken]
  );

  return {
    error,
    hasNext,
    loading,
    loadingMore,
    loadMore,
    markAsRead,
    notifications,
    refetch,
  };
}
