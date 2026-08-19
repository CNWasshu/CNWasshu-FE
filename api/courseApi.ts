import type {
  AiCourseSaveRequest,
  AiRecommendationRequest,
  AiRecommendationResponse,
  ApiErrorBody,
  CourseDetail,
  CourseSummary,
} from '@/types/course';

const COURSE_PATH = '/api/courses';
const DEV_USER_HEADERS = { 'X-USER-ID': '1' };

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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${getBaseUrl()}${path}`, init);
  } catch {
    throw new CourseApiError('서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.', 0);
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

export const courseApi = {
  getCourses: () => request<CourseSummary[]>(COURSE_PATH, { headers: DEV_USER_HEADERS }),
  getCourse: (courseId: number) =>
    request<CourseDetail>(`${COURSE_PATH}/${courseId}`, { headers: DEV_USER_HEADERS }),
  recommend: (payload: AiRecommendationRequest) =>
    request<AiRecommendationResponse>(`${COURSE_PATH}/ai-recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  saveRecommendation: (payload: AiCourseSaveRequest) =>
    request<CourseDetail>(`${COURSE_PATH}/ai-recommendations/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...DEV_USER_HEADERS },
      body: JSON.stringify(payload),
    }),
};

export function getCourseErrorMessage(error: unknown) {
  return error instanceof CourseApiError ? error.message : '알 수 없는 오류가 발생했습니다.';
}
