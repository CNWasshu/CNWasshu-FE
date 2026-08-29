import { useCallback, useMemo, useState } from 'react';

import type { ReservationResponse } from '@/types/reservation';
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
import {
  createTimetableSaveRequest,
  validateTimetableSaveInput,
} from '@/utils/timetable/request';
import {
  mergeConfirmedReservations,
  type ReservationSyncIssue,
} from '@/utils/timetable/reservation-sync';

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
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [reservationSyncIssues, setReservationSyncIssues] = useState<ReservationSyncIssue[]>([]);
  const [syncedReservationCount, setSyncedReservationCount] = useState(0);
  const [timetableName, setTimetableName] = useState('');
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

  const synchronizeReservations = useCallback(
    (reservations: ReservationResponse[]) => {
      setSchedulesByDay((currentSchedules) => {
        const result = mergeConfirmedReservations(
          currentSchedules,
          reservations,
          days.map((day) => day.id)
        );
        setSyncedReservationCount(
          result.syncedReservationIds.length
        );
        setReservationSyncIssues(result.issues);
        return result.schedulesByDay;
      });
    },
    [days]
  );

  const handleChangeStartDate = (date: Date) => {
    const nextStartDate = startOfDay(date);
    const nextDays = createTimetableDays(nextStartDate, nextStartDate);

    setStartDate(nextStartDate);
    setEndDate(nextStartDate);
    setDateErrorMessage(null);
    setSaveErrorMessage(null);
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

    setSaveErrorMessage(null);

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
    setSaveErrorMessage(null);
    setSchedulesByDay((currentSchedules) => ({
      ...currentSchedules,
      [dayId]: [...(currentSchedules[dayId] ?? []), schedule],
    }));
  };

  const updateSchedule = (dayId: string, schedule: TimetableSchedule) => {
    setSaveErrorMessage(null);
    setSchedulesByDay((currentSchedules) => ({
      ...currentSchedules,
      [dayId]: (currentSchedules[dayId] ?? []).map((currentSchedule) =>
        currentSchedule.id === schedule.id ? schedule : currentSchedule
      ),
    }));
  };

  const removeSchedule = (dayId: string, scheduleId: string) => {
    setSaveErrorMessage(null);
    setSchedulesByDay((currentSchedules) => ({
      ...currentSchedules,
      [dayId]: (currentSchedules[dayId] ?? []).filter(
        (schedule) => schedule.id !== scheduleId
      ),
    }));
  };

  const handleChangeTimetableName = (name: string) => {
    setTimetableName(name);
    setSaveErrorMessage(null);
  };

  const prepareSaveRequest = () => {
    const validationMessage = validateTimetableSaveInput(
      timetableName,
      schedulesByDay
    );
    setSaveErrorMessage(validationMessage);

    if (validationMessage) {
      return null;
    }

    return createTimetableSaveRequest({
      days,
      endDate,
      schedulesByDay,
      startDate,
      timetableName,
    });
  };

  const validateSchedulesForSave = () => {
    const hasSchedule = Object.values(schedulesByDay).some(
      (schedules) => schedules.length > 0
    );
    const validationMessage = hasSchedule
      ? null
      : '저장할 일정을 한 개 이상 추가해 주세요.';
    setSaveErrorMessage(validationMessage);
    return hasSchedule;
  };

  const clearSaveError = () => {
    setSaveErrorMessage(null);
  };

  const scheduleCount = Object.values(schedulesByDay).reduce(
    (count, schedules) => count + schedules.length,
    0
  );

  return {
    addSchedule,
    clearSaveError,
    dateErrorMessage,
    days,
    endDate,
    handleChangeEndDate,
    handleChangeStartDate,
    handleChangeTimetableName,
    maximumEndDate,
    minimumStartDate,
    removeSchedule,
    reservationSyncIssues,
    prepareSaveRequest,
    saveErrorMessage,
    scheduleCount,
    selectedDayId,
    selectedSchedules,
    setSelectedDayId,
    startDate,
    syncedReservationCount,
    synchronizeReservations,
    timetableName,
    updateSchedule,
    validateSchedulesForSave,
  };
}
