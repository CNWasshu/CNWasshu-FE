import { useRouter } from 'expo-router';
import {
  useEffect,
  useState,
} from 'react';

import { BookmarkContent } from '@/components/bookmark/BookmarkContent';
import { BookmarkDeleteModal } from '@/components/bookmark/BookmarkDeleteModal';
import { useBookmarks } from '@/hooks/bookmark/use-bookmarks';
import type { BookmarkResponse } from '@/types/bookmark';

export default function BookmarkScreen() {
  const router = useRouter();

  const {
    bookmarks,
    loading,
    errorMessage,
    fetchBookmarks,
    removeBookmark,
    clearError,
  } = useBookmarks();

  const [
    selectedBookmark,
    setSelectedBookmark,
  ] =
    useState<BookmarkResponse | null>(
      null
    );

  const [
    deleteModalVisible,
    setDeleteModalVisible,
  ] = useState(false);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleBookmarkPress = (
    bookmark: BookmarkResponse
  ) => {
    if (
      bookmark.type === 'ACTIVITY'
    ) {
      router.push(
        `/activity/${bookmark.targetId}`
      );
      return;
    }

    if (
      bookmark.type === 'RESTAURANT'
    ) {
      router.push(
        `/restaurant/${bookmark.targetId}`
      );
    }
  };

  const handleRemovePress = (
    bookmark: BookmarkResponse
  ) => {
    clearError();

    setSelectedBookmark(bookmark);
    setDeleteModalVisible(true);
  };

  const handleConfirmRemove =
    async () => {
      if (!selectedBookmark) {
        return;
      }

      const success =
        await removeBookmark({
          type:
            selectedBookmark.type,
          targetId:
            selectedBookmark.targetId,
        });

      if (!success) {
        return;
      }

      setDeleteModalVisible(false);
      setSelectedBookmark(null);
    };

  const handleCancelRemove = () => {
    setDeleteModalVisible(false);
    setSelectedBookmark(null);
  };

  const handleRetry = () => {
    fetchBookmarks();
  };

  return (
    <>
      <BookmarkContent
        bookmarks={bookmarks}
        loading={loading}
        errorMessage={errorMessage}
        onPress={
          handleBookmarkPress
        }
        onRemove={
          handleRemovePress
        }
        onRetry={handleRetry}
      />

      <BookmarkDeleteModal
        visible={deleteModalVisible}
        onConfirm={
          handleConfirmRemove
        }
        onCancel={
          handleCancelRemove
        }
      />
    </>
  );
}