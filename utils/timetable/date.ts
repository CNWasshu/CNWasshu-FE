import type { TimetableDay } from '@/types/timetable';

export const MAX_TRIP_DAY_COUNT = 7;

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const WEEK_DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, dayCount: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + dayCount);
  return startOfDay(nextDate);
}

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
}

export function parseDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getTripDayCount(startDate: Date, endDate: Date) {
  const difference = startOfDay(endDate).getTime() - startOfDay(startDate).getTime();
  return Math.floor(difference / MILLISECONDS_PER_DAY) + 1;
}

export function validateTravelPeriod(startDate: Date, endDate: Date) {
  const tripDayCount = getTripDayCount(startDate, endDate);

  if (tripDayCount < 1) {
    return '도착일은 출발일보다 빠를 수 없습니다.';
  }

  if (tripDayCount > MAX_TRIP_DAY_COUNT) {
    return `여행 기간은 최대 ${MAX_TRIP_DAY_COUNT}일까지 선택할 수 있습니다.`;
  }

  return null;
}

export function createTimetableDays(startDate: Date, endDate: Date): TimetableDay[] {
  const tripDayCount = getTripDayCount(startDate, endDate);

  if (tripDayCount < 1 || tripDayCount > MAX_TRIP_DAY_COUNT) {
    return [];
  }

  return Array.from({ length: tripDayCount }, (_, index) => {
    const date = addDays(startDate, index);

    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      dayLabel: `Day ${index + 1}`,
      id: formatDate(date),
      weekDay: WEEK_DAY_LABELS[date.getDay()],
    };
  });
}
