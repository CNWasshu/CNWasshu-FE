import { useCallback, useEffect, useMemo, useState } from 'react';

import { getTimetableErrorMessage, timetableApi } from '@/api/timetableApi';
import type { SavedActivity, SavedActivityResponse } from '@/types/timetable';

const DEFAULT_ACTIVITY_ICON = '📍';
const DEFAULT_START_TIME = '09:00';
const DEFAULT_END_TIME = '10:00';

export function toSavedActivity(
  response: SavedActivityResponse
): SavedActivity {
  const alwaysOpen = response.operatingType === 'ALWAYS';

  return {
    durationMinutes: response.durationMinutes,
    endTime: alwaysOpen
      ? DEFAULT_END_TIME
      : response.operatingEndTime,
    icon: DEFAULT_ACTIVITY_ICON,
    id: String(response.activityId),
    location: response.region,
    operatingType: alwaysOpen ? 'always' : 'hours',
    requiresReservation: response.reservationRequired,
    startTime: alwaysOpen
      ? DEFAULT_START_TIME
      : response.operatingStartTime,
    thumbnailUrl: response.thumbnailUrl,
    title: response.title,
  };
}

export function useSavedActivities(accessToken?: string) {
  const [activities, setActivities] = useState<SavedActivity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const selectedActivity = useMemo(
    () =>
      activities.find((activity) => activity.id === selectedActivityId) ?? null,
    [activities, selectedActivityId]
  );

  const refetch = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await timetableApi.getSavedActivities(accessToken);
      setActivities(response.items.map(toSavedActivity));
    } catch (requestError) {
      setError(getTimetableErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const clearSelectedActivity = () => {
    setSelectedActivityId(null);
  };

  return {
    activities,
    clearSelectedActivity,
    error,
    isLoading,
    refetch,
    selectedActivity,
    selectedActivityId,
    selectActivity: setSelectedActivityId,
  };
}
