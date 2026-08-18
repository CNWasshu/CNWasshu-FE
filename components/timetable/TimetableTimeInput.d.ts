import type { ComponentType } from 'react';

export type TimetableTimeInputProps = {
  disabled?: boolean;
  label: string;
  maximumTime?: string;
  minimumTime?: string;
  onChangeTime: (time: string) => void;
  value: string;
};

export const TimetableTimeInput: ComponentType<TimetableTimeInputProps>;
