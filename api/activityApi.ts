import type { ActivityDetailResponse } from '@/types/activity';

const ACTIVITY_PATH = '/api/activities';

export class ActivityApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'ActivityApiError';
  }
}

function getBaseUrl() {
  const url =
    process.env.EXPO_PUBLIC_API_BASE_URL?.replace(
      /\/$/,
      ''
    );

  if (!url) {
    throw new ActivityApiError(
      'API 서버 주소가 설정되지 않았습니다.',
      0
    );
  }

  return url;
}

async function request<T>(
  path: string,
  accessToken: string
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(
      `${getBaseUrl()}${path}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch {
    throw new ActivityApiError(
      '서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.',
      0
    );
  }

  if (!response.ok) {
    throw new ActivityApiError(
      '요청을 처리하지 못했습니다.',
      response.status
    );
  }

  return response.json() as Promise<T>;
}

export const activityApi = {
  getActivityDetail: (
    activityId: number,
    accessToken: string
  ) =>
    request<ActivityDetailResponse>(
      `${ACTIVITY_PATH}/${activityId}`,
      accessToken
    ),
};

export function getActivityErrorMessage(
  error: unknown
) {
  if (error instanceof Error) {
    if (error.message === '로그인이 필요합니다.') {
      return error.message;
    }
  }

  if (!(error instanceof ActivityApiError)) {
    return '알 수 없는 오류가 발생했습니다.';
  }

  if (error.status === 401) {
    return '로그인이 필요합니다.';
  }

  if (error.status === 403) {
    return '접근 권한이 없습니다.';
  }

  if (error.status === 404) {
    return '존재하지 않는 체험입니다.';
  }

  if (error.status >= 500) {
    return '서버에서 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
  }

  return error.message;
}