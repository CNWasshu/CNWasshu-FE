import type {
  ActivityHomeSort,
  HomeFilterOptionsResponse,
  HomeItemType,
  HomePageResponse,
  RestaurantHomeSort,
  WeatherResponse,
} from '@/types/home';

const HOME_PATH = '/api/home';

export class HomeApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);

    this.name = 'HomeApiError';
  }
}

function getBaseUrl() {
  const url =
    process.env.EXPO_PUBLIC_API_BASE_URL?.replace(
      /\/$/,
      ''
    );

  if (!url) {
    throw new HomeApiError(
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
    throw new HomeApiError(
      '서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.',
      0
    );
  }

  if (!response.ok) {
    throw new HomeApiError(
      '요청을 처리하지 못했습니다.',
      response.status
    );
  }

  return response.json() as Promise<T>;
}

interface GetActivitiesParams {
  sort?: ActivityHomeSort;
  regionId?: number | null;
  categoryId?: number | null;
  keyword?: string | null;
  page?: number;
  size?: number;
}

interface GetRestaurantsParams {
  sort?: RestaurantHomeSort;
  regionId?: number | null;
  keyword?: string | null;
  page?: number;
  size?: number;
}

function buildQueryString(
  params: Record<
    string,
    string | number | null | undefined
  >
) {
  const searchParams =
    new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value === null ||
        value === undefined
      ) {
        return;
      }

      searchParams.append(
        key,
        String(value)
      );
    }
  );

  const queryString =
    searchParams.toString();

  return queryString
    ? `?${queryString}`
    : '';
}

export const homeApi = {
  getActivities: (
    accessToken: string,
    params: GetActivitiesParams = {}
  ) => {
    const {
      sort = 'DEFAULT',
      regionId = null,
      categoryId = null,
      keyword = null,
      page = 0,
      size = 8,
    } = params;

    const queryString =
      buildQueryString({
        sort,
        regionId,
        categoryId,
        keyword,
        page,
        size,
      });

    return request<HomePageResponse>(
      `${HOME_PATH}/activities${queryString}`,
      accessToken
    );
  },

  getRestaurants: (
    accessToken: string,
    params: GetRestaurantsParams = {}
  ) => {
    const {
      sort = 'NAME',
      regionId = null,
      keyword = null,
      page = 0,
      size = 8,
    } = params;

    const queryString =
      buildQueryString({
        sort,
        regionId,
        keyword,
        page,
        size,
      });

    return request<HomePageResponse>(
      `${HOME_PATH}/restaurants${queryString}`,
      accessToken
    );
  },

  getFilterOptions: (
    accessToken: string,
    type: HomeItemType
  ) => {
    const queryString =
      buildQueryString({
        type,
      });

    return request<HomeFilterOptionsResponse>(
      `${HOME_PATH}/filters${queryString}`,
      accessToken
    );
  },

  getWeather: (
    accessToken: string
  ) => {
    return request<WeatherResponse[]>(
      `${HOME_PATH}/weather`,
      accessToken
    );
  },
};

export function getHomeErrorMessage(
  error: unknown
) {
  if (error instanceof Error) {
    if (
      error.message ===
      '로그인이 필요합니다.'
    ) {
      return error.message;
    }
  }

  if (!(error instanceof HomeApiError)) {
    return '알 수 없는 오류가 발생했습니다.';
  }

  if (error.status === 401) {
    return '로그인이 필요합니다.';
  }

  if (error.status === 403) {
    return '접근 권한이 없습니다.';
  }

  if (error.status >= 500) {
    return '서버에서 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
  }

  return error.message;
}