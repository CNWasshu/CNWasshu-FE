import type { ReservationResponse } from '@/types/reservation';
import type {
  TimetableActivitySchedule,
  TimetableSchedule,
  TimetableSchedulesByDay,
} from '@/types/timetable';
import {
  findOverlappingSchedule,
  timeToMinutes,
} from '@/utils/timetable/time';

const RESERVATION_ICON = '📅';
const RESERVATION_LOCATION = '예약 완료';

export type ReservationSyncIssue =
  | {
      reservationId: number | null;
      type: 'INVALID_RESERVATION';
    }
  | {
      dayId: string;
      reservationId: number;
      scheduleId: string;
      type: 'TIME_CONFLICT';
    };

export type ReservationSyncResult = {
  issues: ReservationSyncIssue[];
  schedulesByDay: TimetableSchedulesByDay;
  syncedReservationIds: number[];
};

type ValidReservation = ReservationResponse & {
  endTime: string;
  reservationTime: string;
  status: 'CONFIRMED';
};

function normalizeTime(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.slice(0, 5);
  return timeToMinutes(normalized) === null
    ? null
    : normalized;
}

function toValidReservation(
  reservation: ReservationResponse,
  validDayIds: Set<string>
): ValidReservation | null {
  if (
    reservation.status !== 'CONFIRMED' ||
    !Number.isInteger(reservation.reservationId) ||
    reservation.reservationId <= 0 ||
    !Number.isInteger(reservation.activityId) ||
    reservation.activityId <= 0 ||
    typeof reservation.reservationDate !==
      'string' ||
    !validDayIds.has(reservation.reservationDate) ||
    typeof reservation.activityTitle !==
      'string' ||
    !reservation.activityTitle.trim()
  ) {
    return null;
  }

  const reservationTime = normalizeTime(
    reservation.reservationTime
  );
  const endTime = normalizeTime(
    reservation.endTime
  );

  if (
    reservationTime === null ||
    endTime === null ||
    timeToMinutes(reservationTime)! >=
      timeToMinutes(endTime)!
  ) {
    return null;
  }

  return {
    ...reservation,
    activityTitle:
      reservation.activityTitle.trim(),
    endTime,
    reservationTime,
    status: 'CONFIRMED',
  };
}

function isReservationSchedule(
  schedule: TimetableSchedule
): schedule is TimetableActivitySchedule {
  return (
    schedule.kind === 'activity' &&
    schedule.reservationId !== null
  );
}

function createReservationSchedule(
  reservation: ValidReservation,
  existing?: TimetableActivitySchedule
): TimetableActivitySchedule {
  return {
    activityIcon:
      existing?.activityIcon ??
      RESERVATION_ICON,
    activityId: String(
      reservation.activityId
    ),
    endTime: reservation.endTime,
    id: `reservation-${reservation.reservationId}`,
    kind: 'activity',
    location:
      existing?.location ??
      RESERVATION_LOCATION,
    operatingEndTime:
      existing?.operatingEndTime ??
      reservation.endTime,
    operatingStartTime:
      existing?.operatingStartTime ??
      reservation.reservationTime,
    operatingType:
      existing?.operatingType ??
      'always',
    reservationId:
      reservation.reservationId,
    requiresReservation: true,
    source: 'reservation',
    startTime:
      reservation.reservationTime,
    title: reservation.activityTitle,
  };
}

function findMatchingLocalActivity(
  schedules: TimetableSchedule[],
  reservation: ValidReservation
) {
  return schedules.find(
    (schedule): schedule is TimetableActivitySchedule =>
      schedule.kind === 'activity' &&
      schedule.reservationId === null &&
      schedule.activityId ===
        String(reservation.activityId) &&
      schedule.startTime ===
        reservation.reservationTime &&
      schedule.endTime === reservation.endTime
  );
}

export function mergeConfirmedReservations(
  schedulesByDay: TimetableSchedulesByDay,
  reservations: ReservationResponse[],
  dayIds: string[]
): ReservationSyncResult {
  const validDayIds = new Set(dayIds);
  const nextSchedules = Object.fromEntries(
    dayIds.map((dayId) => [
      dayId,
      [...(schedulesByDay[dayId] ?? [])],
    ])
  );
  const issues: ReservationSyncIssue[] = [];
  const syncedReservationIds: number[] = [];
  const processedReservationIds = new Set<number>();

  reservations.forEach((response) => {
    if (response.status !== 'CONFIRMED') {
      return;
    }

    const reservation = toValidReservation(
      response,
      validDayIds
    );

    if (!reservation) {
      issues.push({
        reservationId:
          Number.isInteger(response.reservationId)
            ? response.reservationId
            : null,
        type: 'INVALID_RESERVATION',
      });
      return;
    }

    if (
      processedReservationIds.has(
        reservation.reservationId
      )
    ) {
      return;
    }
    processedReservationIds.add(
      reservation.reservationId
    );

    let existingReservationSchedule:
      | TimetableActivitySchedule
      | undefined;

    dayIds.forEach((dayId) => {
      nextSchedules[dayId] =
        nextSchedules[dayId].filter(
          (schedule) => {
            if (
              isReservationSchedule(schedule) &&
              schedule.reservationId ===
                reservation.reservationId
            ) {
              existingReservationSchedule ??=
                schedule;
              return false;
            }
            return true;
          }
        );
    });

    const targetSchedules =
      nextSchedules[
        reservation.reservationDate
      ];
    const matchingLocalActivity =
      findMatchingLocalActivity(
        targetSchedules,
        reservation
      );

    if (matchingLocalActivity) {
      nextSchedules[
        reservation.reservationDate
      ] = targetSchedules.filter(
        (schedule) =>
          schedule.id !==
          matchingLocalActivity.id
      );
    }

    const schedule =
      createReservationSchedule(
        reservation,
        existingReservationSchedule ??
          matchingLocalActivity
      );
    const schedulesForConflictCheck =
      nextSchedules[
        reservation.reservationDate
      ];
    const overlappingSchedule =
      findOverlappingSchedule(
        schedulesForConflictCheck,
        schedule
      );

    if (overlappingSchedule) {
      issues.push({
        dayId:
          reservation.reservationDate,
        reservationId:
          reservation.reservationId,
        scheduleId:
          overlappingSchedule.id,
        type: 'TIME_CONFLICT',
      });
    }

    nextSchedules[
      reservation.reservationDate
    ] = [
      ...schedulesForConflictCheck,
      schedule,
    ];
    syncedReservationIds.push(
      reservation.reservationId
    );
  });

  return {
    issues,
    schedulesByDay: nextSchedules,
    syncedReservationIds,
  };
}
