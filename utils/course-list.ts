import type { CourseSummary } from '@/types/course';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export type CourseFilter = 'ALL' | CourseSummary['courseType'];
export type CourseSort = 'NEAREST' | 'LATEST_START' | 'NAME';
export type TripStatus = 'ONGOING' | 'UPCOMING' | 'PAST';
export type CourseStatusFilter = 'ALL' | TripStatus;

function toCalendarDay(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return Math.floor(Date.UTC(year, month - 1, day) / DAY_IN_MS);
}

function getTodayCalendarDay(now = new Date()) {
  return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY_IN_MS);
}

export function getTripStatus(course: Pick<CourseSummary, 'startDate' | 'endDate'>, now = new Date()) {
  const today = getTodayCalendarDay(now);
  const start = toCalendarDay(course.startDate);
  const end = toCalendarDay(course.endDate);

  if (start == null || end == null) return { type: 'UPCOMING' as TripStatus, label: '예정' };
  if (today < start) return { type: 'UPCOMING' as TripStatus, label: `D-${start - today}` };
  if (today <= end) return { type: 'ONGOING' as TripStatus, label: '여행 중' };
  return { type: 'PAST' as TripStatus, label: '지난 여행' };
}

export function filterCourses(courses: CourseSummary[], filter: CourseFilter) {
  return filter === 'ALL' ? courses : courses.filter((course) => course.courseType === filter);
}

export function sortCourses(courses: CourseSummary[], sort: CourseSort, now = new Date()) {
  return [...courses].sort((left, right) => {
    if (sort === 'NAME') return left.courseName.localeCompare(right.courseName, 'ko-KR');

    const leftStart = toCalendarDay(left.startDate) ?? 0;
    const rightStart = toCalendarDay(right.startDate) ?? 0;
    if (sort === 'LATEST_START') return rightStart - leftStart;

    const priority: Record<TripStatus, number> = { ONGOING: 0, UPCOMING: 1, PAST: 2 };
    const leftStatus = getTripStatus(left, now).type;
    const rightStatus = getTripStatus(right, now).type;
    const statusDifference = priority[leftStatus] - priority[rightStatus];
    if (statusDifference !== 0) return statusDifference;

    if (leftStatus === 'PAST') {
      const leftEnd = toCalendarDay(left.endDate) ?? 0;
      const rightEnd = toCalendarDay(right.endDate) ?? 0;
      return rightEnd - leftEnd;
    }
    return leftStart - rightStart;
  });
}
