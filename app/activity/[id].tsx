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

  /**
   * 상세 화면 진입 시
   * 로그인 사용자의 장바구니 조회
   */
  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  /**
   * 현재 체험 장바구니 등록 여부
   */
  const bookmarked = isBookmarked(
    'ACTIVITY',
    activityId
  );

  /**
   * 뒤로 가기
   */
  const handleBack = () => {
    router.back();
  };

  /**
   * 장바구니 추가 / 삭제
   */
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

  /**
   * 예약하기
   *
   * 예약 화면은 다음 작업에서 연결
   */
  const handleReservationPress = () => {
    console.log(
      '예약할 체험 ID:',
      activityId
    );
  };

  return (
    <ActivityDetailContent
      activity={activity}
      loading={loading}
      errorMessage={errorMessage}
      isBookmarked={bookmarked}
      onBack={handleBack}
      onRetry={fetchActivityDetail}
      onBookmarkPress={handleBookmarkPress}
      onReservationPress={
        handleReservationPress
      }
    />
  );
}