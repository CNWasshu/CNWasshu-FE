import type {
  SurveyApiErrorBody,
  SurveyDetailApiResponse,
  SurveyDetailResponse,
  SurveyDraftRequest,
} from '@/types/survey';

const SURVEYS_PATH = '/api/surveys';

const SURVEY_ERROR_MESSAGES: Record<string, string> = {
  ACTIVITY_SURVEY_NOT_FOUND: '평가할 체험 정보를 찾을 수 없습니다.',
  EXPIRED_TOKEN: '로그인이 만료되었습니다. 다시 로그인해 주세요.',
  INVALID_SURVEY_RESPONSE: '필수 만족도 항목을 확인해 주세요.',
  INVALID_TOKEN: '유효하지 않은 토큰입니다. 다시 로그인해 주세요.',
  MISSING_ACCESS_TOKEN: '로그인이 필요한 서비스입니다.',
  MISSING_API_URL: 'API 서버 주소가 설정되지 않았습니다.',
  REFRESH_TOKEN_NOT_FOUND: '로그인 정보가 만료되었습니다. 다시 로그인해 주세요.',
  SURVEY_ALREADY_SNOOZED: '이미 내일 다시 알림이 예약되었습니다.',
  SURVEY_NOT_EDITABLE: '더 이상 수정할 수 없는 만족도 조사입니다.',
  SURVEY_NOT_FOUND: '만족도 조사를 찾을 수 없습니다.',
};

export class SurveyApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'SurveyApiError';
  }
}

function getBaseUrl() {
  const url = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
  if (!url) {
    throw new SurveyApiError(
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
    throw new SurveyApiError(
      '로그인이 필요한 서비스입니다.',
      401,
      'MISSING_ACCESS_TOKEN'
    );
  }
  return { Authorization: `Bearer ${token}` };
}

function parseTags(value: string | null): string[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((tag): tag is string => typeof tag === 'string')
      : [];
  } catch {
    return [];
  }
}

function normalizeSurvey(response: SurveyDetailApiResponse): SurveyDetailResponse {
  return {
    ...response,
    issueTags: parseTags(response.issueTags),
    notUsedReasonTags: parseTags(response.notUsedReasonTags),
    activities: response.activities.map((activity) => ({
      ...activity,
      reasonTags: parseTags(activity.reasonTags),
    })),
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${getBaseUrl()}${path}`, init);
  } catch {
    throw new SurveyApiError(
      '서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.',
      0
    );
  }

  if (!response.ok) {
    let body: SurveyApiErrorBody | undefined;
    try {
      body = (await response.json()) as SurveyApiErrorBody;
    } catch {
      body = undefined;
    }
    throw new SurveyApiError(
      body?.message || '요청을 처리하지 못했습니다.',
      response.status,
      body?.code
    );
  }

  return response.json() as Promise<T>;
}

async function requestSurvey(path: string, init?: RequestInit) {
  const response = await request<SurveyDetailApiResponse>(path, init);
  return normalizeSurvey(response);
}

export const surveyApi = {
  getSurvey: (surveyId: number, accessToken: string) =>
    requestSurvey(`${SURVEYS_PATH}/${surveyId}`, {
      headers: getAuthorizationHeaders(accessToken),
    }),

  saveDraft: (
    surveyId: number,
    payload: SurveyDraftRequest,
    accessToken: string
  ) =>
    requestSurvey(`${SURVEYS_PATH}/${surveyId}/draft`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthorizationHeaders(accessToken),
      },
      body: JSON.stringify(payload),
    }),

  submit: (surveyId: number, accessToken: string) =>
    requestSurvey(`${SURVEYS_PATH}/${surveyId}/submit`, {
      method: 'POST',
      headers: getAuthorizationHeaders(accessToken),
    }),

  snooze: (surveyId: number, accessToken: string) =>
    requestSurvey(`${SURVEYS_PATH}/${surveyId}/snooze`, {
      method: 'PATCH',
      headers: getAuthorizationHeaders(accessToken),
    }),
};

export function getSurveyErrorMessage(error: unknown) {
  if (!(error instanceof SurveyApiError)) {
    return '알 수 없는 오류가 발생했습니다.';
  }

  if (error.code && SURVEY_ERROR_MESSAGES[error.code]) {
    return SURVEY_ERROR_MESSAGES[error.code];
  }

  if (error.status === 401 || error.status === 403) {
    return '로그인이 필요합니다. 다시 로그인해 주세요.';
  }

  if (error.status >= 500) {
    return '서버에서 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
  }

  return error.message;
}

export function normalizeSurveyApiError(error: unknown) {
  if (error instanceof SurveyApiError) {
    return new SurveyApiError(
      getSurveyErrorMessage(error),
      error.status,
      error.code
    );
  }

  return new SurveyApiError(getSurveyErrorMessage(error), 0);
}
