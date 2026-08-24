import type { RestaurantDetailResponse } from '@/types/restaurant';

const RESTAURANT_PATH = '/api/restaurants';

export class RestaurantApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'RestaurantApiError';
  }
}

function getBaseUrl() {
  const url =
    process.env.EXPO_PUBLIC_API_BASE_URL?.replace(
      /\/$/,
      ''
    );

  if (!url) {
    throw new RestaurantApiError(
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
    throw new RestaurantApiError(
      '서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.',
      0
    );
  }

  if (!response.ok) {
    throw new RestaurantApiError(
      '요청을 처리하지 못했습니다.',
      response.status
    );
  }

  return response.json() as Promise<T>;
}

export const restaurantApi = {
  getRestaurantDetail: (
    restaurantId: number,
    accessToken: string
  ) =>
    request<RestaurantDetailResponse>(
      `${RESTAURANT_PATH}/${restaurantId}`,
      accessToken
    ),
};

export function getRestaurantErrorMessage(
  error: unknown
) {
  if (error instanceof Error) {
    if (error.message === '로그인이 필요합니다.') {
      return error.message;
    }
  }

  if (!(error instanceof RestaurantApiError)) {
    return '알 수 없는 오류가 발생했습니다.';
  }

  if (error.status === 401) {
    return '로그인이 필요합니다.';
  }

  if (error.status === 403) {
    return '접근 권한이 없습니다.';
  }

  if (error.status === 404) {
    return '존재하지 않는 맛집입니다.';
  }

  if (error.status >= 500) {
    return '서버에서 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
  }

  return error.message;
}