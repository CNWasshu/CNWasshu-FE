import type {
  ReservationCreateRequest,
  ReservationResponse,
  ReservationTimeSlot,
} from '@/types/reservation';

const RESERVATION_PATH = '/api/reservations';

function getBaseUrl() {
  const url =
    process.env.EXPO_PUBLIC_API_BASE_URL?.replace(
      /\/$/,
      ''
    );

  if (!url) {
    throw new Error(
      'API 서버 주소가 설정되지 않았습니다.'
    );
  }

  return url;
}

function getAuthorizationHeaders(
  accessToken: string
) {
  const token = accessToken.trim();

  if (!token) {
    throw new Error(
      '로그인이 필요합니다.'
    );
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

async function request<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(
      `${getBaseUrl()}${path}`,
      init
    );
  } catch {
    throw new Error(
      '서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.'
    );
  }

  if (!response.ok) {
    let message =
      '요청을 처리하지 못했습니다.';

    try {
      const body =
        await response.json();

      if (body?.message) {
        message = body.message;
      }
    } catch {
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export const reservationApi = {
  getAvailableTimes: (
    activityId: number,
    date: string,
    accessToken: string
  ) =>
    request<ReservationTimeSlot[]>(
      `${RESERVATION_PATH}/activities/${activityId}/available-times?date=${encodeURIComponent(
        date
      )}`,
      {
        method: 'GET',
        headers:
          getAuthorizationHeaders(
            accessToken
          ),
      }
    ),

  getReservationsByDate: (
    date: string,
    accessToken: string
  ) =>
    request<ReservationResponse[]>(
      `${RESERVATION_PATH}?date=${encodeURIComponent(
        date
      )}`,
      {
        method: 'GET',
        headers:
          getAuthorizationHeaders(
            accessToken
          ),
      }
    ),

  createReservation: (
    payload: ReservationCreateRequest,
    accessToken: string
  ) =>
    request<ReservationResponse>(
      RESERVATION_PATH,
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
          ...getAuthorizationHeaders(
            accessToken
          ),
        },
        body: JSON.stringify(payload),
      }
    ),
};