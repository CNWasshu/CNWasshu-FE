import { useMemo, useState } from 'react';

import type {
  TimetableDay,
  TimetableSchedule,
  TimetableSchedulesByDay,
} from '@/types/timetable';
import {
  addDays,
  createTimetableDays,
  formatDate,
  MAX_TRIP_DAY_COUNT,
  startOfDay,
  validateTravelPeriod,
} from '@/utils/timetable/date';

function synchronizeSchedules(
  days: TimetableDay[],
  schedulesByDay: TimetableSchedulesByDay
) {
  return Object.fromEntries(
    days.map((day) => [day.id, schedulesByDay[day.id] ?? []])
  );
}

export function useTimetable() {
  const minimumStartDate = useMemo(() => startOfDay(new Date()), []);
  const [startDate, setStartDate] = useState(minimumStartDate);
  const [endDate, setEndDate] = useState(minimumStartDate);
  const [dateErrorMessage, setDateErrorMessage] = useState<string | null>(null);
  const days = useMemo(() => createTimetableDays(startDate, endDate), [endDate, startDate]);
  const [selectedDayId, setSelectedDayId] = useState(formatDate(minimumStartDate));
  const [schedulesByDay, setSchedulesByDay] = useState<TimetableSchedulesByDay>(() =>
    synchronizeSchedules(createTimetableDays(minimumStartDate, minimumStartDate), {})
  );
  const maximumEndDate = useMemo(
    () => addDays(startDate, MAX_TRIP_DAY_COUNT - 1),
    [startDate]
  );
  const selectedSchedules = schedulesByDay[selectedDayId] ?? [];

  const handleChangeStartDate = (date: Date) => {
    const nextStartDate = startOfDay(date);
    const nextDays = createTimetableDays(nextStartDate, nextStartDate);

    setStartDate(nextStartDate);
    setEndDate(nextStartDate);
    setDateErrorMessage(null);
    setSelectedDayId(formatDate(nextStartDate));
    setSchedulesByDay((currentSchedules) =>
      synchronizeSchedules(nextDays, currentSchedules)
    );
  };

  const handleChangeEndDate = (date: Date) => {
    const nextEndDate = startOfDay(date);
    const errorMessage = validateTravelPeriod(startDate, nextEndDate);
    setDateErrorMessage(errorMessage);

    if (errorMessage) {
      return;
    }

    const nextDays = createTimetableDays(startDate, nextEndDate);
    setEndDate(nextEndDate);
    setSchedulesByDay((currentSchedules) =>
      synchronizeSchedules(nextDays, currentSchedules)
    );
    setSelectedDayId((currentDayId) =>
      nextDays.some((day) => day.id === currentDayId)
        ? currentDayId
        : nextDays.at(-1)?.id ?? formatDate(startDate)
    );
  };

  const addSchedule = (dayId: string, schedule: TimetableSchedule) => {
    setSchedulesByDay((currentSchedules) => ({
      ...currentSchedules,
      [dayId]: [...(currentSchedules[dayId] ?? []), schedule],
    }));
  };

  const updateSchedule = (dayId: string, schedule: TimetableSchedule) => {
    setSchedulesByDay((currentSchedules) => ({
      ...currentSchedules,
      [dayId]: (currentSchedules[dayId] ?? []).map((currentSchedule) =>
        currentSchedule.id === schedule.id ? schedule : currentSchedule
      ),
    }));
  };

  const removeSchedule = (dayId: string, scheduleId: string) => {
    setSchedulesByDay((currentSchedules) => ({
      ...currentSchedules,
      [dayId]: (currentSchedules[dayId] ?? []).filter(
        (schedule) => schedule.id !== scheduleId
      ),
    }));
  };

  return {
    addSchedule,
    dateErrorMessage,
    days,
    endDate,
    handleChangeEndDate,
    handleChangeStartDate,
    maximumEndDate,
    minimumStartDate,
    removeSchedule,
    selectedDayId,
    selectedSchedules,
    setSelectedDayId,
    startDate,
    updateSchedule,
  };
}
