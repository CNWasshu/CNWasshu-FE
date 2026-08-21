import type {
  SavedActivityListResponse,
  TimetableApiErrorBody,
  TimetableDetailResponse,
  TimetableSaveRequest,
} from '@/types/timetable';

const TIMETABLE_PATH = '/api/timetables';

export class TimetableApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'TimetableApiError';
  }
}

function getBaseUrl() {
  const url = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
  if (!url) {
    throw new TimetableApiError(
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
    throw new TimetableApiError(
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
    throw new TimetableApiError(
      '서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.',
      0
    );
  }

  if (!response.ok) {
    let body: TimetableApiErrorBody | undefined;
    try {
      body = (await response.json()) as TimetableApiErrorBody;
    } catch {
      body = undefined;
    }
    throw new TimetableApiError(
      body?.message || '요청을 처리하지 못했습니다.',
      response.status,
      body?.code
    );
  }

  return response.json() as Promise<T>;
}

export const timetableApi = {
  getSavedActivities: (accessToken: string) =>
    request<SavedActivityListResponse>(`${TIMETABLE_PATH}/saved-activities`, {
      headers: getAuthorizationHeaders(accessToken),
    }),

  createTimetable: (payload: TimetableSaveRequest, accessToken: string) =>
    request<TimetableDetailResponse>(TIMETABLE_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthorizationHeaders(accessToken),
      },
      body: JSON.stringify(payload),
    }),
};

export function getTimetableErrorMessage(error: unknown) {
  return error instanceof TimetableApiError
    ? error.message
    : '알 수 없는 오류가 발생했습니다.';
}
