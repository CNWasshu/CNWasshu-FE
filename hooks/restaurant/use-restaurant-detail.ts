import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import {
    getRestaurantErrorMessage,
    restaurantApi,
} from '@/api/restaurantApi';
import type { RestaurantDetailResponse } from '@/types/restaurant';
import { getAccessToken } from '@/utils/auth';

export function useRestaurantDetail(
  restaurantId: number
) {
  const [restaurant, setRestaurant] =
    useState<RestaurantDetailResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState('');

  const fetchRestaurantDetail =
    useCallback(async () => {
      if (!restaurantId) {
        setErrorMessage(
          '올바르지 않은 맛집입니다.'
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage('');

        const accessToken =
          await getAccessToken();

        if (!accessToken) {
          throw new Error(
            '로그인이 필요합니다.'
          );
        }

        const data =
          await restaurantApi.getRestaurantDetail(
            restaurantId,
            accessToken
          );

        setRestaurant(data);
      } catch (error) {
        setErrorMessage(
          getRestaurantErrorMessage(error)
        );
      } finally {
        setLoading(false);
      }
    }, [restaurantId]);

  useEffect(() => {
    fetchRestaurantDetail();
  }, [fetchRestaurantDetail]);

  return {
    restaurant,
    loading,
    errorMessage,
    fetchRestaurantDetail,
  };
}