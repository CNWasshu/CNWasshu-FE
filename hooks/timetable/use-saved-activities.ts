import { useCallback, useMemo, useState } from 'react';

import { bookmarkApi } from '@/api/bookmarkApi';
import type { BookmarkResponse } from '@/types/bookmark';
import type { SavedActivity } from '@/types/timetable';

const DEFAULT_ACTIVITY_ICON = '📍';
const DEFAULT_START_TIME = '09:00';
const DEFAULT_END_TIME = '10:00';

export function toSavedActivity(
  response: BookmarkResponse
): SavedActivity | null {
  if (response.type !== 'ACTIVITY') {
    return null;
  }

  const hasOperatingHours =
    response.operatingStartTime !== null &&
    response.operatingEndTime !== null;
  const alwaysOpen =
    response.operatingStartTime === null &&
    response.operatingEndTime === null;

  if (!hasOperatingHours && !alwaysOpen) {
    return null;
  }

  return {
    durationMinutes: null,
    endTime: alwaysOpen
      ? DEFAULT_END_TIME
      : response.operatingEndTime!.slice(0, 5),
    icon: DEFAULT_ACTIVITY_ICON,
    id: String(response.targetId),
    location: response.regionName,
    operatingType: alwaysOpen ? 'always' : 'hours',
    requiresReservation:
      response.reservationRequired === true,
    startTime: alwaysOpen
      ? DEFAULT_START_TIME
      : response.operatingStartTime!.slice(0, 5),
    thumbnailUrl: response.thumbnail,
    title: response.title,
  };
}

function toSavedActivities(
  bookmarks: BookmarkResponse[]
) {
  return bookmarks.flatMap((bookmark) => {
    const activity =
      toSavedActivity(bookmark);

    return activity ? [activity] : [];
  });
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
      const response =
        await bookmarkApi.getBookmarks(
          accessToken
        );
      setActivities(
        toSavedActivities(response)
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : '담아둔 체험을 불러오지 못했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

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
