import type {
  StampApiErrorBody,
  StampCreateRequest,
  StampListResponse,
  StampResponse,
} from '@/types/stamp';

const STAMPS_PATH = '/api/stamps';

const STAMP_ERROR_MESSAGES: Record<string, string> = {
  EXPIRED_TOKEN: '로그인이 만료되었습니다. 다시 로그인해 주세요.',
  INVALID_TOKEN: '유효하지 않은 토큰입니다. 다시 로그인해 주세요.',
  MISSING_ACCESS_TOKEN: '로그인이 필요한 서비스입니다.',
  MISSING_API_URL: 'API 서버 주소가 설정되지 않았습니다.',
  REFRESH_TOKEN_NOT_FOUND: '로그인 정보가 만료되었습니다. 다시 로그인해 주세요.',
  STAMP_ACTIVITY_NOT_FOUND: '등록되지 않은 QR 코드입니다.',
  STAMP_ALREADY_EXISTS: '이미 스탬프를 받은 체험입니다.',
};

export class StampApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'StampApiError';
  }
}

function getBaseUrl() {
  const url = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
  if (!url) {
    throw new StampApiError(
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
    throw new StampApiError(
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
    throw new StampApiError(
      '서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.',
      0
    );
  }

  if (!response.ok) {
    let body: StampApiErrorBody | undefined;
    try {
      body = (await response.json()) as StampApiErrorBody;
    } catch {
      body = undefined;
    }
    throw new StampApiError(
      body?.message || '요청을 처리하지 못했습니다.',
      response.status,
      body?.code
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const stampApi = {
  createStamp: (payload: StampCreateRequest, accessToken: string) =>
    request<StampResponse>(STAMPS_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthorizationHeaders(accessToken),
      },
      body: JSON.stringify(payload),
    }),

  getMyStamps: (accessToken: string) =>
    request<StampListResponse>(`${STAMPS_PATH}/me`, {
      headers: getAuthorizationHeaders(accessToken),
    }),
};

export function getStampErrorMessage(error: unknown) {
  if (!(error instanceof StampApiError)) {
    return '알 수 없는 오류가 발생했습니다.';
  }

  if (error.code && STAMP_ERROR_MESSAGES[error.code]) {
    return STAMP_ERROR_MESSAGES[error.code];
  }

  if (error.status === 401 || error.status === 403) {
    return '로그인이 필요합니다. 다시 로그인해 주세요.';
  }

  if (error.status >= 500) {
    return '서버에서 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
  }

  return error.message;
}

export function normalizeStampApiError(error: unknown) {
  if (error instanceof StampApiError) {
    return new StampApiError(
      getStampErrorMessage(error),
      error.status,
      error.code
    );
  }

  return new StampApiError(getStampErrorMessage(error), 0);
}
