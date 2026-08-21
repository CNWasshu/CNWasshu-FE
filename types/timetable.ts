export type TimetableDay = {
  date: string;
  dayLabel: string;
  id: string;
  weekDay: string;
};

type TimetableScheduleBase = {
  endTime: string;
  id: string;
  startTime: string;
  title: string;
};

export type SavedActivity = {
  durationMinutes: number | null;
  endTime: string;
  icon: string;
  id: string;
  location: string;
  operatingType: 'always' | 'hours';
  requiresReservation: boolean;
  startTime: string;
  thumbnailUrl: string | null;
  title: string;
};

export type TimetableFreeSchedule = TimetableScheduleBase & {
  kind: 'free';
};

export type TimetableActivitySchedule = TimetableScheduleBase & {
  activityId: SavedActivity['id'];
  activityIcon: SavedActivity['icon'];
  kind: 'activity';
  location: SavedActivity['location'];
  operatingEndTime: string;
  operatingStartTime: string;
  operatingType: SavedActivity['operatingType'];
  requiresReservation: boolean;
};

export type TimetableSchedule =
  | TimetableActivitySchedule
  | TimetableFreeSchedule;

export type TimetableScheduleKind = TimetableSchedule['kind'];

export type TimetableSchedulesByDay = Record<string, TimetableSchedule[]>;

export type TimetableScheduleType = 'ACTIVITY' | 'FREE';

export type ActivityOperatingType = 'ALWAYS' | 'HOURS';

export interface TimetableScheduleRequest {
  activityId: number | null;
  clientScheduleId: string;
  endTime: string;
  memo: string | null;
  reservationId: number | null;
  scheduleType: TimetableScheduleType;
  sortOrder: number;
  startTime: string;
  title: string;
}

export interface TimetableDayRequest {
  date: string;
  dayNo: number;
  schedules: TimetableScheduleRequest[];
}

export interface TimetableSaveRequest {
  days: TimetableDayRequest[];
  endDate: string;
  startDate: string;
  timetableName: string;
}

export interface TimetableScheduleResponse {
  activityId: number | null;
  endTime: string;
  memo: string | null;
  reservationId: number | null;
  scheduleId: number;
  scheduleType: TimetableScheduleType;
  sortOrder: number;
  startTime: string;
  title: string;
}

export interface TimetableDayResponse {
  date: string;
  dayNo: number;
  schedules: TimetableScheduleResponse[];
}

export interface TimetableDetailResponse {
  days: TimetableDayResponse[];
  endDate: string;
  startDate: string;
  timetableId: number;
  timetableName: string;
}

type SavedActivityResponseBase = {
  activityId: number;
  durationMinutes: number | null;
  region: string;
  reservationRequired: boolean;
  thumbnailUrl: string | null;
  title: string;
};

export type SavedActivityResponse = SavedActivityResponseBase &
  (
    | {
        operatingEndTime: null;
        operatingStartTime: null;
        operatingType: Extract<ActivityOperatingType, 'ALWAYS'>;
      }
    | {
        operatingEndTime: string;
        operatingStartTime: string;
        operatingType: Extract<ActivityOperatingType, 'HOURS'>;
      }
  );

export interface SavedActivityListResponse {
  items: SavedActivityResponse[];
}

export interface TimetableApiErrorBody {
  code?: string;
  message?: string;
}
