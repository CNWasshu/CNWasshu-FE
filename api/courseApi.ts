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
  recommend: (payload: AiRecommendationRequest, accessToken: string) =>
    request<AiRecommendationResponse>(`${COURSE_PATH}/ai-recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthorizationHeaders(accessToken),
      },
      body: JSON.stringify(payload),
    }),
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
