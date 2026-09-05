import { activityApi } from '@/api/activityApi';
import { restaurantApi } from '@/api/restaurantApi';
import type { CourseDetail, CourseItem } from '@/types/course';
import type { TimetableSchedule, TimetableSchedulesByDay } from '@/types/timetable';
import { addDays, formatDate, parseDate } from '@/utils/timetable/date';

export type HydratedTimetableInitialState = {
  endDate: Date;
  schedulesByDay: TimetableSchedulesByDay;
  startDate: Date;
  timetableName: string;
};

function operatingTypeOf(start: string | null, end: string | null): 'always' | 'hours' {
  return start && end ? 'hours' : 'always';
}

// 저장된 코스 일정을 편집기가 쓰는 풍부한 스케줄 모양으로 되살린다.
// 체험/음식점 상세 조회가 실패해도(삭제된 항목 등) 최소 정보로 편집은 계속 가능하게 한다.
async function toSchedule(item: CourseItem, accessToken: string): Promise<TimetableSchedule> {
  const base = {
    endTime: item.endTime.slice(0, 5),
    id: `course-item-${item.id}`,
    startTime: item.startTime.slice(0, 5),
    title: item.title,
  };

  if (item.activityId != null) {
    const activity = await activityApi
      .getActivityDetail(item.activityId, accessToken)
      .catch(() => null);

    return {
      ...base,
      activityId: String(item.activityId),
      activityIcon: '📍',
      kind: 'activity',
      location: activity?.address ?? item.address ?? '',
      operatingEndTime: activity?.operatingEndTime ?? '',
      operatingStartTime: activity?.operatingStartTime ?? '',
      operatingType: operatingTypeOf(
        activity?.operatingStartTime ?? null,
        activity?.operatingEndTime ?? null
      ),
      reservationId: item.reservationId,
      requiresReservation: activity
        ? Boolean(activity.reservationRequired)
        : item.reservationId != null,
      source: item.reservationId != null ? 'reservation' : 'local',
    };
  }

  if (item.restaurantId != null) {
    const restaurant = await restaurantApi
      .getRestaurantDetail(item.restaurantId, accessToken)
      .catch(() => null);

    return {
      ...base,
      kind: 'restaurant',
      location: restaurant?.address ?? item.address ?? '',
      operatingEndTime: restaurant?.operatingEndTime ?? '',
      operatingStartTime: restaurant?.operatingStartTime ?? '',
      operatingType: operatingTypeOf(
        restaurant?.operatingStartTime ?? null,
        restaurant?.operatingEndTime ?? null
      ),
      restaurantIcon: '🍽️',
      restaurantId: String(item.restaurantId),
    };
  }

  return { ...base, kind: 'free' };
}

export async function hydrateTimetableFromCourse(
  course: CourseDetail,
  accessToken: string
): Promise<HydratedTimetableInitialState> {
  const startDate = parseDate(course.startDate);
  const endDate = parseDate(course.endDate);

  const schedules = await Promise.all(
    course.items.map((item) => toSchedule(item, accessToken))
  );

  const schedulesByDay: TimetableSchedulesByDay = {};
  course.items.forEach((item, index) => {
    const dayId = formatDate(addDays(startDate, item.dayNo - 1));
    schedulesByDay[dayId] = [...(schedulesByDay[dayId] ?? []), schedules[index]];
  });

  return {
    endDate,
    schedulesByDay,
    startDate,
    timetableName: course.courseName,
  };
}
