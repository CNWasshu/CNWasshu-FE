import type { ComponentType } from 'react';

export type TimetableDateRangeProps = {
  endDate: Date;
  errorMessage: string | null;
  maximumEndDate: Date;
  minimumStartDate: Date;
  onChangeEndDate: (date: Date) => void;
  onChangeStartDate: (date: Date) => void;
  startDate: Date;
};

export const TimetableDateRange: ComponentType<TimetableDateRangeProps>;
