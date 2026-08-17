import type { ComponentType } from 'react';

export type TimetableTimeInputProps = {
  label: string;
  onChangeTime: (time: string) => void;
  value: string;
};

export const TimetableTimeInput: ComponentType<TimetableTimeInputProps>;
