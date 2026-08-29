import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

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
  ] = useState<BookmarkResponse | null>(null);

  const [
    deleteModalVisible,
    setDeleteModalVisible,
  ] = useState(false);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);


  const handleBack = () => {
    router.back();
  };

  const handleBookmarkPress = (
    bookmark: BookmarkResponse
  ) => {
    if (bookmark.type === 'ACTIVITY') {
      // 추후 체험 상세 페이지 이동
      return;
    }

    if (bookmark.type === 'RESTAURANT') {
      // 추후 맛집 상세 페이지 이동
      return;
    }
  };

  const handleRemovePress = (
    bookmark: BookmarkResponse
  ) => {
    clearError();

    setSelectedBookmark(bookmark);
    setDeleteModalVisible(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedBookmark) {
      return;
    }

    const success = await removeBookmark({
      type: selectedBookmark.type,
      targetId: selectedBookmark.targetId,
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
        onBack={handleBack}
        onPress={handleBookmarkPress}
        onRemove={handleRemovePress}
        onRetry={handleRetry}
      />

      <BookmarkDeleteModal
        visible={deleteModalVisible}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
    </>
  );
}