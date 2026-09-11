import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useEffect } from 'react';

import { ActivityDetailContent } from '@/components/activity/ActivityDetailContent';
import { useActivityDetail } from '@/hooks/activity/use-activity-detail';
import { useBookmarks } from '@/hooks/bookmark/use-bookmarks';

export default function ActivityDetailScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const activityId = Number(id);

  const {
    activity,
    loading,
    errorMessage,
    fetchActivityDetail,
  } = useActivityDetail(activityId);

  const {
    fetchBookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
  } = useBookmarks();

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const bookmarked = isBookmarked(
    'ACTIVITY',
    activityId
  );

  const handleBookmarkPress = async () => {
    if (!activityId) {
      return;
    }

    if (bookmarked) {
      await removeBookmark({
        type: 'ACTIVITY',
        targetId: activityId,
      });

      return;
    }

    const success = await addBookmark({
      type: 'ACTIVITY',
      targetId: activityId,
    });

    if (success) {
      await fetchBookmarks();
    }
  };

  const handleReservationPress = () => {
    router.push(
      `/reservation/${activityId}`
    );
  };

  return (
    <ActivityDetailContent
      activity={activity}
      loading={loading}
      errorMessage={errorMessage}
      isBookmarked={bookmarked}
      onRetry={fetchActivityDetail}
      onBookmarkPress={handleBookmarkPress}
      onReservationPress={
        handleReservationPress
      }
    />
  );
}
