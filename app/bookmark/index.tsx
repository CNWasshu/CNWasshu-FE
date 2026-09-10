import { useRouter } from 'expo-router';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { BookmarkContent } from '@/components/bookmark/BookmarkContent';
import { BookmarkDeleteModal } from '@/components/bookmark/BookmarkDeleteModal';
import { useBookmarks } from '@/hooks/bookmark/use-bookmarks';

import type {
  BookmarkResponse,
} from '@/types/bookmark';

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

  const [
    selectedRegion,
    setSelectedRegion,
  ] = useState('전체');

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const regions =
    useMemo(() => {
      const regionNames =
        Array.from(
          new Set(
            bookmarks
              .map(
                (bookmark) =>
                  bookmark.regionName
              )
              .filter(Boolean)
          )
        ).sort((a, b) =>
          a.localeCompare(b, 'ko')
        );

      return [
        '전체',
        ...regionNames,
      ];
    }, [bookmarks]);

  const filteredBookmarks =
    useMemo(() => {
      if (
        selectedRegion === '전체'
      ) {
        return bookmarks;
      }

      return bookmarks.filter(
        (bookmark) =>
          bookmark.regionName ===
          selectedRegion
      );
    }, [
      bookmarks,
      selectedRegion,
    ]);

  useEffect(() => {
    if (
      selectedRegion === '전체'
    ) {
      return;
    }

    const regionExists =
      bookmarks.some(
        (bookmark) =>
          bookmark.regionName ===
          selectedRegion
      );

    if (!regionExists) {
      setSelectedRegion('전체');
    }
  }, [
    bookmarks,
    selectedRegion,
  ]);

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
        bookmarks={
          filteredBookmarks
        }
        totalBookmarkCount={
          bookmarks.length
        }
        regions={regions}
        selectedRegion={
          selectedRegion
        }
        loading={loading}
        errorMessage={
          errorMessage
        }
        onSelectRegion={
          setSelectedRegion
        }
        onPress={
          handleBookmarkPress
        }
        onRemove={
          handleRemovePress
        }
        onRetry={
          handleRetry
        }
      />

      <BookmarkDeleteModal
        visible={
          deleteModalVisible
        }
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