import { useCallback, useState } from 'react';

import { bookmarkApi } from '@/api/bookmarkApi';
import type {
    BookmarkRequest,
    BookmarkResponse,
} from '@/types/bookmark';
import { getAccessToken } from '@/utils/auth';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const requireAccessToken = useCallback(async () => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error('로그인이 필요합니다.');
    }

    return accessToken;
  }, []);

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const accessToken = await requireAccessToken();

      const response =
        await bookmarkApi.getBookmarks(accessToken);

      setBookmarks(response);

      return response;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '장바구니 목록을 불러오지 못했습니다.';

      setErrorMessage(message);

      return [];
    } finally {
      setLoading(false);
    }
  }, [requireAccessToken]);

  const addBookmark = useCallback(
    async (request: BookmarkRequest) => {
      try {
        setErrorMessage('');

        const accessToken =
          await requireAccessToken();

        await bookmarkApi.addBookmark(
          request,
          accessToken
        );

        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : '장바구니에 담지 못했습니다.';

        setErrorMessage(message);

        return false;
      }
    },
    [requireAccessToken]
  );

  const removeBookmark = useCallback(
    async (request: BookmarkRequest) => {
      try {
        setErrorMessage('');

        const accessToken =
          await requireAccessToken();

        await bookmarkApi.deleteBookmark(
          request,
          accessToken
        );

        setBookmarks((previousBookmarks) =>
          previousBookmarks.filter(
            (bookmark) =>
              !(
                bookmark.type === request.type &&
                bookmark.targetId === request.targetId
              )
          )
        );

        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : '장바구니에서 삭제하지 못했습니다.';

        setErrorMessage(message);

        return false;
      }
    },
    [requireAccessToken]
  );

  const isBookmarked = useCallback(
    (
      type: BookmarkRequest['type'],
      targetId: number
    ) => {
      return bookmarks.some(
        (bookmark) =>
          bookmark.type === type &&
          bookmark.targetId === targetId
      );
    },
    [bookmarks]
  );

  const clearError = useCallback(() => {
    setErrorMessage('');
  }, []);

  return {
    bookmarks,
    loading,
    errorMessage,

    fetchBookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearError,
  };
}