import type {
  OnboardingCompleteRequest,
  OnboardingStatusResponse,
} from '@/types/onboarding';

const ONBOARDING_PATH = '/api/users/me/onboarding';

type OnboardingApiErrorBody = {
  code?: string;
  message?: string;
};

export class OnboardingApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'OnboardingApiError';
  }
}

function getBaseUrl() {
  const url = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
  if (!url) {
    throw new OnboardingApiError(
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
    throw new OnboardingApiError(
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
    throw new OnboardingApiError(
      '서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.',
      0
    );
  }

  if (!response.ok) {
    let body: OnboardingApiErrorBody | undefined;
    try {
      body = (await response.json()) as OnboardingApiErrorBody;
    } catch {
      body = undefined;
    }
    throw new OnboardingApiError(
      body?.message || '온보딩 상태를 저장하지 못했습니다.',
      response.status,
      body?.code
    );
  }

  return response.json() as Promise<T>;
}

export const onboardingApi = {
  getStatus: (accessToken: string) =>
    request<OnboardingStatusResponse>(ONBOARDING_PATH, {
      headers: getAuthorizationHeaders(accessToken),
    }),

  complete: (payload: OnboardingCompleteRequest, accessToken: string) =>
    request<OnboardingStatusResponse>(ONBOARDING_PATH, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthorizationHeaders(accessToken),
      },
      body: JSON.stringify(payload),
    }),
};

export function getOnboardingErrorMessage(error: unknown) {
  if (!(error instanceof OnboardingApiError)) {
    return '알 수 없는 오류가 발생했습니다.';
  }
  if (error.status === 401 || error.status === 403) {
    return '로그인이 만료되었습니다. 다시 로그인해 주세요.';
  }
  if (error.status >= 500) {
    return '서버에서 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
  }
  return error.message;
}
