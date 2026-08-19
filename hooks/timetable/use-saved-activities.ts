import { useMemo, useState } from 'react';

import { SAVED_ACTIVITIES } from '@/data/timetable/saved-activities';

export function useSavedActivities() {
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const selectedActivity = useMemo(
    () =>
      SAVED_ACTIVITIES.find((activity) => activity.id === selectedActivityId) ?? null,
    [selectedActivityId]
  );

  const clearSelectedActivity = () => {
    setSelectedActivityId(null);
  };

  return {
    activities: SAVED_ACTIVITIES,
    clearSelectedActivity,
    selectedActivity,
    selectedActivityId,
    selectActivity: setSelectedActivityId,
  };
}
