import type {
  SavedActivityListResponse,
  TimetableApiErrorBody,
  TimetableDetailResponse,
  TimetableSaveRequest,
} from '@/types/timetable';

const TIMETABLE_PATH = '/api/timetables';

const TIMETABLE_ERROR_MESSAGES: Record<string, string> = {
  ACTIVITY_OUTSIDE_OPERATING_HOURS:
    '체험 운영 시간 안에서 일정을 선택해 주세요.',
  ACTIVITY_RESERVATION_REQUIRED:
    '예약이 필요한 체험입니다. 예약을 완료한 후 일정에 추가해 주세요.',
  EXPIRED_TOKEN: '로그인이 만료되었습니다. 다시 로그인해 주세요.',
  INVALID_ACTIVITY_RESERVATION:
    '예약 정보가 일정과 일치하지 않습니다. 예약 내용을 확인해 주세요.',
  INVALID_SCHEDULE_TIME: '일정의 시작 시간과 종료 시간을 확인해 주세요.',
  INVALID_SCHEDULE_TYPE: '저장할 일정 종류가 올바르지 않습니다.',
  INVALID_TIMETABLE_DAY: '여행 날짜별 일정 구성을 확인해 주세요.',
  INVALID_TIMETABLE_PERIOD: '여행 시작일과 종료일을 확인해 주세요.',
  INVALID_TOKEN: '로그인이 필요합니다. 다시 로그인해 주세요.',
  MISSING_ACCESS_TOKEN: '로그인이 필요한 서비스입니다.',
  MISSING_API_URL: 'API 서버 주소가 설정되지 않았습니다.',
  SCHEDULE_TIME_CONFLICT: '같은 날짜에 시간이 겹치는 일정이 있습니다.',
  TIMETABLE_ACTIVITY_NOT_FOUND:
    '선택한 체험 정보를 찾을 수 없습니다. 체험을 다시 선택해 주세요.',
  TIMETABLE_SCHEDULE_REQUIRED: '저장할 일정을 한 개 이상 추가해 주세요.',
};

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
  if (!(error instanceof TimetableApiError)) {
    return '알 수 없는 오류가 발생했습니다.';
  }

  if (error.code && TIMETABLE_ERROR_MESSAGES[error.code]) {
    return TIMETABLE_ERROR_MESSAGES[error.code];
  }

  if (error.status === 401 || error.status === 403) {
    return '로그인이 필요합니다. 다시 로그인해 주세요.';
  }

  if (error.status >= 500) {
    return '서버에서 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
  }

  return error.message;
}

export function normalizeTimetableApiError(error: unknown) {
  if (error instanceof TimetableApiError) {
    return new TimetableApiError(
      getTimetableErrorMessage(error),
      error.status,
      error.code
    );
  }

  return new TimetableApiError(getTimetableErrorMessage(error), 0);
}
