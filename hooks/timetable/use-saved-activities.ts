import { useCallback, useMemo, useState } from 'react';

import { bookmarkApi } from '@/api/bookmarkApi';
import type { BookmarkResponse } from '@/types/bookmark';
import type { SavedPlace } from '@/types/timetable';

const DEFAULT_ACTIVITY_ICON = '📍';
const DEFAULT_RESTAURANT_ICON = '🍽️';
const DEFAULT_START_TIME = '09:00';
const DEFAULT_END_TIME = '10:00';

export function toSavedPlace(
  response: BookmarkResponse
): SavedPlace | null {
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
    icon:
      response.type === 'ACTIVITY'
        ? DEFAULT_ACTIVITY_ICON
        : DEFAULT_RESTAURANT_ICON,
    id: String(response.targetId),
    location: response.regionName,
    operatingType: alwaysOpen ? 'always' : 'hours',
    placeType:
      response.type === 'ACTIVITY'
        ? 'activity'
        : 'restaurant',
    requiresReservation:
      response.type === 'ACTIVITY' &&
      response.reservationRequired === true,
    startTime: alwaysOpen
      ? DEFAULT_START_TIME
      : response.operatingStartTime!.slice(0, 5),
    thumbnailUrl: response.thumbnail,
    title: response.title,
  };
}

function toSavedPlaces(
  bookmarks: BookmarkResponse[]
) {
  return bookmarks.flatMap((bookmark) => {
    const place = toSavedPlace(bookmark);

    return place ? [place] : [];
  });
}

export function useSavedActivities(accessToken?: string) {
  const [activities, setActivities] = useState<SavedPlace[]>([]);
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
        toSavedPlaces(response)
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : '담아둔 장소를 불러오지 못했습니다.'
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
