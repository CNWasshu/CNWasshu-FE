import type { TimetableSchedule } from '@/types/timetable';

export const TIMETABLE_START_TIME = '09:00';
export const TIMETABLE_END_TIME = '22:00';

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const TIME_INPUT_PATTERN = /^(\d{2}):([0-5]\d)$/;

function parseTimeInput(time: string) {
  const match = TIME_INPUT_PATTERN.exec(time);

  if (!match) {
    return null;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

export function timeToMinutes(time: string) {
  const match = TIME_PATTERN.exec(time);

  if (!match) {
    return null;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

type ScheduleTimeRange = Pick<TimetableSchedule, 'endTime' | 'startTime'>;

export function findOverlappingSchedule(
  schedules: TimetableSchedule[],
  candidate: ScheduleTimeRange,
  excludedScheduleId?: string
) {
  const candidateStart = timeToMinutes(candidate.startTime);
  const candidateEnd = timeToMinutes(candidate.endTime);

  if (candidateStart === null || candidateEnd === null) {
    return null;
  }

  return schedules.find((schedule) => {
    if (schedule.id === excludedScheduleId) {
      return false;
    }

    const scheduleStart = timeToMinutes(schedule.startTime);
    const scheduleEnd = timeToMinutes(schedule.endTime);

    if (scheduleStart === null || scheduleEnd === null) {
      return false;
    }

    return candidateStart < scheduleEnd && scheduleStart < candidateEnd;
  }) ?? null;
}

export function validateScheduleInput(title: string, startTime: string, endTime: string) {
  if (!title.trim()) {
    return '일정 제목을 입력해 주세요.';
  }

  const startMinutes = parseTimeInput(startTime);
  const endMinutes = parseTimeInput(endTime);

  if (startMinutes === null || endMinutes === null) {
    return '시간을 HH:mm 형식으로 입력해 주세요.';
  }

  const timelineStart = timeToMinutes(TIMETABLE_START_TIME) ?? 0;
  const timelineEnd = timeToMinutes(TIMETABLE_END_TIME) ?? 24 * 60;

  if (startMinutes < timelineStart || endMinutes > timelineEnd) {
    return `일정 시간은 ${TIMETABLE_START_TIME}~${TIMETABLE_END_TIME} 사이여야 합니다.`;
  }

  if (startMinutes >= endMinutes) {
    return '종료 시간은 시작 시간보다 늦어야 합니다.';
  }

  return null;
}
