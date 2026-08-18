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
  endTime: string;
  id: string;
  requiresReservation: boolean;
  startTime: string;
  title: string;
};

export type TimetableFreeSchedule = TimetableScheduleBase & {
  kind: 'free';
};

export type TimetableActivitySchedule = TimetableScheduleBase & {
  activityId: SavedActivity['id'];
  kind: 'activity';
  operatingEndTime: string;
  operatingStartTime: string;
  requiresReservation: boolean;
};

export type TimetableSchedule =
  | TimetableActivitySchedule
  | TimetableFreeSchedule;

export type TimetableScheduleKind = TimetableSchedule['kind'];

export type TimetableSchedulesByDay = Record<string, TimetableSchedule[]>;
