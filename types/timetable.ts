export type TimetableDay = {
  date: string;
  dayLabel: string;
  id: string;
  weekDay: string;
};

export type TimetableScheduleKind = 'activity' | 'free';

export type TimetableSchedule = {
  endTime: string;
  id: string;
  kind: TimetableScheduleKind;
  startTime: string;
  title: string;
};

export type TimetableSchedulesByDay = Record<string, TimetableSchedule[]>;
