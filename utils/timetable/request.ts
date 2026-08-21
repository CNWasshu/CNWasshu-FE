import type {
  TimetableDay,
  TimetableSaveRequest,
  TimetableSchedule,
  TimetableSchedulesByDay,
} from '@/types/timetable';
import { formatDate } from '@/utils/timetable/date';

type CreateTimetableSaveRequestParams = {
  days: TimetableDay[];
  endDate: Date;
  schedulesByDay: TimetableSchedulesByDay;
  startDate: Date;
  timetableName: string;
};

export function validateTimetableSaveInput(
  timetableName: string,
  schedulesByDay: TimetableSchedulesByDay
) {
  if (!timetableName.trim()) {
    return '코스 이름을 입력해 주세요.';
  }

  if (timetableName.trim().length > 100) {
    return '코스 이름은 100자 이하로 입력해 주세요.';
  }

  const hasSchedule = Object.values(schedulesByDay).some(
    (schedules) => schedules.length > 0
  );
  if (!hasSchedule) {
    return '저장할 일정을 한 개 이상 추가해 주세요.';
  }

  return null;
}

function compareSchedules(first: TimetableSchedule, second: TimetableSchedule) {
  return first.startTime.localeCompare(second.startTime)
    || first.endTime.localeCompare(second.endTime)
    || first.id.localeCompare(second.id);
}

export function createTimetableSaveRequest({
  days,
  endDate,
  schedulesByDay,
  startDate,
  timetableName,
}: CreateTimetableSaveRequestParams): TimetableSaveRequest {
  return {
    days: days.map((day, dayIndex) => ({
      date: day.id,
      dayNo: dayIndex + 1,
      schedules: [...(schedulesByDay[day.id] ?? [])]
        .sort(compareSchedules)
        .map((schedule, scheduleIndex) => ({
          activityId: schedule.kind === 'activity' ? Number(schedule.activityId) : null,
          clientScheduleId: schedule.id,
          endTime: schedule.endTime,
          memo: null,
          reservationId: null,
          scheduleType: schedule.kind === 'activity' ? 'ACTIVITY' : 'FREE',
          sortOrder: scheduleIndex + 1,
          startTime: schedule.startTime,
          title: schedule.title.trim(),
        })),
    })),
    endDate: formatDate(endDate),
    startDate: formatDate(startDate),
    timetableName: timetableName.trim(),
  };
}
