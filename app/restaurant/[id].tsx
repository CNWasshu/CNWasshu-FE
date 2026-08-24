import {
    useLocalSearchParams,
    useRouter,
} from 'expo-router';
import { useEffect } from 'react';

import { RestaurantDetailContent } from '@/components/restaurant/RestaurantDetailContent';
import { useBookmarks } from '@/hooks/bookmark/use-bookmarks';
import { useRestaurantDetail } from '@/hooks/restaurant/use-restaurant-detail';

export default function RestaurantDetailScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const restaurantId = Number(id);

  const {
    restaurant,
    loading,
    errorMessage,
    fetchRestaurantDetail,
  } = useRestaurantDetail(restaurantId);

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
    'RESTAURANT',
    restaurantId
  );

  const handleBack = () => {
    router.back();
  };

  const handleBookmarkPress = async () => {
    if (!restaurantId) {
      return;
    }

    if (bookmarked) {
      await removeBookmark({
        type: 'RESTAURANT',
        targetId: restaurantId,
      });

      return;
    }

    const success = await addBookmark({
      type: 'RESTAURANT',
      targetId: restaurantId,
    });

    if (success) {
      await fetchBookmarks();
    }
  };

  return (
    <RestaurantDetailContent
      restaurant={restaurant}
      loading={loading}
      errorMessage={errorMessage}
      isBookmarked={bookmarked}
      onBack={handleBack}
      onRetry={fetchRestaurantDetail}
      onBookmarkPress={handleBookmarkPress}
    />
  );
}