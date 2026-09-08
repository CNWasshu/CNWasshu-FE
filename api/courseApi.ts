import type {
  AiCourseSaveRequest,
  AiRecommendationRequest,
  AiRecommendationResponse,
  ApiErrorBody,
  CourseDetail,
  CourseRenameRequest,
  CourseSaveRequest,
  CourseSummary,
} from '@/types/course';

const COURSE_PATH = '/api/courses';
const AI_RECOMMENDATION_TIMEOUT_MS = 30_000;
const AI_RECOMMENDATION_MAX_ATTEMPTS = 3;
const RETRYABLE_AI_STATUSES = new Set([429, 500, 502, 503, 504]);

export class CourseApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly code?: string) {
    super(message);
    this.name = 'CourseApiError';
  }
}

function getBaseUrl() {
  const url = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
  if (!url) throw new CourseApiError('API 서버 주소가 설정되지 않았습니다.', 0, 'MISSING_API_URL');
  return url;
}

function getAuthorizationHeaders(accessToken: string) {
  const token = accessToken.trim();
  if (!token) {
    throw new CourseApiError('로그인이 필요한 서비스입니다.', 401, 'MISSING_ACCESS_TOKEN');
  }
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${getBaseUrl()}${path}`, init);
  } catch (error) {
    if (error instanceof CourseApiError) throw error;
    throw new CourseApiError('서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.', 0, 'NETWORK_ERROR');
  }

  if (!response.ok) {
    let body: ApiErrorBody | undefined;
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      body = undefined;
    }
    throw new CourseApiError(body?.message || '요청을 처리하지 못했습니다.', response.status, body?.code);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableAiError(error: unknown) {
  return error instanceof CourseApiError
    && (error.code === 'AI_RECOMMENDATION_TIMEOUT'
      || error.code === 'NETWORK_ERROR'
      || RETRYABLE_AI_STATUSES.has(error.status));
}

async function requestAiRecommendation(payload: AiRecommendationRequest, accessToken: string) {
  let lastError: unknown;

  for (let attempt = 0; attempt < AI_RECOMMENDATION_MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_RECOMMENDATION_TIMEOUT_MS);

    try {
      return await request<AiRecommendationResponse>(`${COURSE_PATH}/ai-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthorizationHeaders(accessToken),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (error) {
      const normalizedError = controller.signal.aborted
        ? new CourseApiError('AI 추천 응답이 지연되고 있습니다.', 408, 'AI_RECOMMENDATION_TIMEOUT')
        : error;
      lastError = normalizedError;

      const isLastAttempt = attempt === AI_RECOMMENDATION_MAX_ATTEMPTS - 1;
      if (isLastAttempt || !isRetryableAiError(normalizedError)) throw normalizedError;

      // 정상 요청에는 지연이 없고, 일시 실패한 경우에만 짧게 쉬었다 재시도한다.
      await wait(600 * (attempt + 1));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError;
}

export const courseApi = {
  getCourses: (accessToken: string) =>
    request<CourseSummary[]>(COURSE_PATH, {
      headers: getAuthorizationHeaders(accessToken),
    }),
  getCourse: (courseId: number, accessToken: string) =>
    request<CourseDetail>(`${COURSE_PATH}/${courseId}`, {
      headers: getAuthorizationHeaders(accessToken),
    }),
  createCourse: (payload: CourseSaveRequest, accessToken: string) =>
    request<CourseDetail>(COURSE_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthorizationHeaders(accessToken),
      },
      body: JSON.stringify(payload),
    }),
  renameCourse: (courseId: number, payload: CourseRenameRequest, accessToken: string) =>
    request<void>(`${COURSE_PATH}/${courseId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthorizationHeaders(accessToken),
      },
      body: JSON.stringify(payload),
    }),
  deleteCourse: (courseId: number, accessToken: string) =>
    request<void>(`${COURSE_PATH}/${courseId}`, {
      method: 'DELETE',
      headers: getAuthorizationHeaders(accessToken),
    }),
  recommend: requestAiRecommendation,
  saveRecommendation: (payload: AiCourseSaveRequest, accessToken: string) =>
    request<CourseDetail>(`${COURSE_PATH}/ai-recommendations/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthorizationHeaders(accessToken),
      },
      body: JSON.stringify(payload),
    }),
};

export function getCourseErrorMessage(error: unknown) {
  return error instanceof CourseApiError ? error.message : '알 수 없는 오류가 발생했습니다.';
}
