import type {
    BookmarkRequest,
    BookmarkResponse,
} from '@/types/bookmark';

const BOOKMARK_PATH = '/api/bookmarks';

function getBaseUrl() {
  const url = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

  if (!url) {
    throw new Error('API 서버 주소가 설정되지 않았습니다.');
  }

  return url;
}

function getAuthorizationHeaders(accessToken: string) {
  const token = accessToken.trim();

  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

async function request<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${getBaseUrl()}${path}`,
    init
  );

  if (!response.ok) {
    let message = '요청을 처리하지 못했습니다.';

    try {
      const body = await response.json();

      if (body?.message) {
        message = body.message;
      }
    } catch {
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export const bookmarkApi = {

  addBookmark: (
    payload: BookmarkRequest,
    accessToken: string
  ) =>
    request<void>(BOOKMARK_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthorizationHeaders(accessToken),
      },
      body: JSON.stringify(payload),
    }),

  getBookmarks: (
    accessToken: string
  ) =>
    request<BookmarkResponse[]>(
      BOOKMARK_PATH,
      {
        method: 'GET',
        headers: getAuthorizationHeaders(
          accessToken
        ),
      }
    ),

  deleteBookmark: (
    payload: BookmarkRequest,
    accessToken: string
  ) =>
    request<void>(BOOKMARK_PATH, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthorizationHeaders(accessToken),
      },
      body: JSON.stringify(payload),
    }),
};