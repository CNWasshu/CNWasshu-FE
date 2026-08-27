import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { getNotificationErrorMessage, notificationApi } from '@/api/notificationApi';
import type { NotificationSettingResponse } from '@/types/notification';
import { clearTokens, isSessionExpiredError } from '@/utils/auth';

type SettingKey = keyof NotificationSettingResponse;

export function useNotificationSettings(accessToken: string | null) {
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<SettingKey | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setSettings(await notificationApi.getSettings(accessToken));
    } catch (requestError) {
      if (isSessionExpiredError(requestError)) {
        await clearTokens();
        router.replace('/auth/login');
        return;
      }
      setError(getNotificationErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [accessToken, router]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  // 토글 하나를 누르면 그 자리에서 즉시 반영 + 저장한다(별도 "저장" 버튼 없음).
  // 낙관적으로 먼저 바꾼 뒤, 실패하면 이전 값으로 되돌리고 에러를 보여준다.
  const toggle = useCallback(
    async (key: SettingKey) => {
      if (!accessToken || !settings || savingKey) {
        return;
      }

      const previousValue = settings[key];
      const nextValue = !previousValue;

      setSaveErrorMessage(null);
      setSettings({ ...settings, [key]: nextValue });
      setSavingKey(key);

      try {
        const updated = await notificationApi.updateSettings(
          { [key]: nextValue },
          accessToken
        );
        setSettings(updated);
      } catch (requestError) {
        if (isSessionExpiredError(requestError)) {
          await clearTokens();
          router.replace('/auth/login');
          return;
        }
        setSettings((current) =>
          current ? { ...current, [key]: previousValue } : current
        );
        setSaveErrorMessage(getNotificationErrorMessage(requestError));
      } finally {
        setSavingKey(null);
      }
    },
    [accessToken, router, savingKey, settings]
  );

  return {
    error,
    loading,
    refetch,
    saveErrorMessage,
    savingKey,
    settings,
    toggle,
  };
}
