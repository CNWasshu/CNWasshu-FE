import { useCallback, useState } from 'react';

import { notificationApi } from '@/api/notificationApi';
import { getAccessToken } from '@/utils/auth';

// 안 읽은 개수만 알려주는 API가 없어서, 최신순 첫 페이지만 가져와
// isRead: false 개수를 센다. 두 번째 페이지 이후의 안 읽은 알림은
// 배지 숫자에 반영되지 않는 근사치다.
const UNREAD_COUNT_PAGE_SIZE = 20;

export function useUnreadNotificationCount() {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadNotificationCount = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        setUnreadCount(0);
        return;
      }

      const response = await notificationApi.getNotifications(
        accessToken,
        { page: 0, size: UNREAD_COUNT_PAGE_SIZE }
      );

      setUnreadCount(
        response.notifications.filter(
          (notification) => !notification.isRead
        ).length
      );
    } catch {
      // 배지는 부가 정보이므로 실패해도 화면 전체를 막지 않고 조용히 무시한다.
    }
  }, []);

  return {
    fetchUnreadNotificationCount,
    unreadCount,
  };
}
