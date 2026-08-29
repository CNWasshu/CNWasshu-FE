import {
  useEffect,
  useState,
} from 'react';

import { getAccessToken } from '@/utils/auth';

type TimetableAccessTokenState =
  | string
  | null
  | undefined;

export function useTimetableAccessToken() {
  const [accessToken, setAccessToken] =
    useState<TimetableAccessTokenState>(
      undefined
    );

  useEffect(() => {
    let active = true;

    const loadAccessToken = async () => {
      const token = await getAccessToken();

      if (active) {
        setAccessToken(token);
      }
    };

    void loadAccessToken();

    return () => {
      active = false;
    };
  }, []);

  return {
    accessToken,
    isLoading:
      accessToken === undefined,
  };
}
