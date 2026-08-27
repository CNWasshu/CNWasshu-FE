import type {
  AuthApiErrorBody,
  DeviceRegisterRequest,
  KakaoLoginRequest,
  TokenResponse,
  UserDeviceResponse,
  UserSummary,
  UserUpdateRequest,
} from '@/types/auth';

const AUTH_PATH = '/api/auth';
const USERS_PATH = '/api/users';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  EXPIRED_TOKEN: '로그인이 만료되었습니다. 다시 로그인해 주세요.',
  INVALID_KAKAO_LOGIN_REQUEST: '카카오 인가코드 또는 액세스 토큰이 필요합니다.',
  INVALID_NICKNAME: '닉네임은 공백일 수 없습니다.',
  INVALID_TOKEN: '유효하지 않은 토큰입니다. 다시 로그인해 주세요.',
  KAKAO_API_ERROR: '카카오 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.',
  MISSING_ACCESS_TOKEN: '로그인이 필요한 서비스입니다.',
  MISSING_API_URL: 'API 서버 주소가 설정되지 않았습니다.',
  REFRESH_TOKEN_NOT_FOUND: '로그인 정보가 만료되었습니다. 다시 로그인해 주세요.',
  USER_NOT_FOUND: '사용자 정보를 찾을 수 없습니다.',
};

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

function getBaseUrl() {
  const url = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
  if (!url) {
    throw new AuthApiError(
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
    throw new AuthApiError(
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
    response = await fetch(`${getBaseUrl()}${path}`, {
      ...init,
      // ngrok 무료 티어가 브라우저성 요청에 경고 인터스티셜(HTML)을 대신 주는 걸 막는 헤더.
      // 실제 배포 서버에는 영향 없다.
      headers: { ...init?.headers, 'ngrok-skip-browser-warning': 'true' },
    });
  } catch {
    throw new AuthApiError(
      '서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.',
      0
    );
  }

  if (!response.ok) {
    let body: AuthApiErrorBody | undefined;
    try {
      body = (await response.json()) as AuthApiErrorBody;
    } catch {
      body = undefined;
    }
    throw new AuthApiError(
      body?.message || '요청을 처리하지 못했습니다.',
      response.status,
      body?.code
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const authApi = {
  kakaoLogin: (payload: KakaoLoginRequest) =>
    request<TokenResponse>(`${AUTH_PATH}/kakao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  refresh: (refreshToken: string) =>
    request<TokenResponse>(`${AUTH_PATH}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    }),

  logout: (refreshToken: string, accessToken: string) =>
    request<void>(`${AUTH_PATH}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthorizationHeaders(accessToken),
      },
      body: JSON.stringify({ refreshToken }),
    }),

  getMe: (accessToken: string) =>
    request<UserSummary>(`${USERS_PATH}/me`, {
      headers: getAuthorizationHeaders(accessToken),
    }),

  updateMe: (payload: UserUpdateRequest, accessToken: string) =>
    request<UserSummary>(`${USERS_PATH}/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthorizationHeaders(accessToken),
      },
      body: JSON.stringify(payload),
    }),

  deleteMe: (accessToken: string) =>
    request<void>(`${USERS_PATH}/me`, {
      method: 'DELETE',
      headers: getAuthorizationHeaders(accessToken),
    }),

  registerDevice: (payload: DeviceRegisterRequest, accessToken: string) =>
    request<UserDeviceResponse>(`${USERS_PATH}/me/devices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthorizationHeaders(accessToken),
      },
      body: JSON.stringify(payload),
    }),
};

export function getAuthErrorMessage(error: unknown) {
  if (!(error instanceof AuthApiError)) {
    return '알 수 없는 오류가 발생했습니다.';
  }

  if (error.code && AUTH_ERROR_MESSAGES[error.code]) {
    return AUTH_ERROR_MESSAGES[error.code];
  }

  if (error.status === 401 || error.status === 403) {
    return '로그인이 필요합니다. 다시 로그인해 주세요.';
  }

  if (error.status >= 500) {
    return '서버에서 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
  }

  return error.message;
}

export function normalizeAuthApiError(error: unknown) {
  if (error instanceof AuthApiError) {
    return new AuthApiError(
      getAuthErrorMessage(error),
      error.status,
      error.code
    );
  }

  return new AuthApiError(getAuthErrorMessage(error), 0);
}
