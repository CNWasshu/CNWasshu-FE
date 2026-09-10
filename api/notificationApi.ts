import type {
  NotificationApiErrorBody,
  NotificationListResponse,
  NotificationSettingResponse,
  NotificationSettingUpdateRequest,
} from '@/types/notification';

const NOTIFICATIONS_PATH = '/api/notifications';

const NOTIFICATION_ERROR_MESSAGES: Record<string, string> = {
  EXPIRED_TOKEN: '로그인이 만료되었습니다. 다시 로그인해 주세요.',
  INVALID_TOKEN: '유효하지 않은 토큰입니다. 다시 로그인해 주세요.',
  MISSING_ACCESS_TOKEN: '로그인이 필요한 서비스입니다.',
  MISSING_API_URL: 'API 서버 주소가 설정되지 않았습니다.',
  NOTIFICATION_NOT_FOUND: '알림을 찾을 수 없습니다.',
  REFRESH_TOKEN_NOT_FOUND: '로그인 정보가 만료되었습니다. 다시 로그인해 주세요.',
};

export class NotificationApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'NotificationApiError';
  }
}

function getBaseUrl() {
  const url = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
  if (!url) {
    throw new NotificationApiError(
      'API 서버 주소가 설정되지 않았습니다.',
      0,
      'MISSING_API_URL'
    );
  }
  return url;
}

function getAuthorizationHeaders(accessToken: string) {
  const token = accessToken.trim();
  if (!token) {
    throw new NotificationApiError(
      '로그인이 필요한 서비스입니다.',
      401,
      'MISSING_ACCESS_TOKEN'
    );
  }
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${getBaseUrl()}${path}`, init);
  } catch {
    throw new NotificationApiError(
      '서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.',
      0
    );
  }

  if (!response.ok) {
    let body: NotificationApiErrorBody | undefined;
    try {
      body = (await response.json()) as NotificationApiErrorBody;
    } catch {
      body = undefined;
    }
    throw new NotificationApiError(
      body?.message || '요청을 처리하지 못했습니다.',
      response.status,
      body?.code
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

type GetNotificationsParams = {
  page?: number;
  size?: number;
};

function buildNotificationsQuery({ page, size }: GetNotificationsParams) {
  const params = new URLSearchParams();
  if (page != null) params.set('page', String(page));
  if (size != null) params.set('size', String(size));
  const query = params.toString();
  return query ? `?${query}` : '';
}

export const notificationApi = {
  getNotifications: (accessToken: string, params: GetNotificationsParams = {}) =>
    request<NotificationListResponse>(
      `${NOTIFICATIONS_PATH}${buildNotificationsQuery(params)}`,
      { headers: getAuthorizationHeaders(accessToken) }
    ),

  markAsRead: (notificationId: number, accessToken: string) =>
    request<void>(`${NOTIFICATIONS_PATH}/${notificationId}/read`, {
      method: 'PATCH',
      headers: getAuthorizationHeaders(accessToken),
    }),

  getSettings: (accessToken: string) =>
    request<NotificationSettingResponse>(`${NOTIFICATIONS_PATH}/settings`, {
      headers: getAuthorizationHeaders(accessToken),
    }),

  updateSettings: (payload: NotificationSettingUpdateRequest, accessToken: string) =>
    request<NotificationSettingResponse>(`${NOTIFICATIONS_PATH}/settings`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthorizationHeaders(accessToken),
      },
      body: JSON.stringify(payload),
    }),
};

export function getNotificationErrorMessage(error: unknown) {
  if (!(error instanceof NotificationApiError)) {
    return '알 수 없는 오류가 발생했습니다.';
  }

  if (error.code && NOTIFICATION_ERROR_MESSAGES[error.code]) {
    return NOTIFICATION_ERROR_MESSAGES[error.code];
  }

  if (error.status === 401 || error.status === 403) {
    return '로그인이 필요합니다. 다시 로그인해 주세요.';
  }

  if (error.status >= 500) {
    return '서버에서 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
  }

  return error.message;
}

export function normalizeNotificationApiError(error: unknown) {
  if (error instanceof NotificationApiError) {
    return new NotificationApiError(
      getNotificationErrorMessage(error),
      error.status,
      error.code
    );
  }

  return new NotificationApiError(getNotificationErrorMessage(error), 0);
}
