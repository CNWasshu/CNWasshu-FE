import type { ComponentType } from 'react';

export type CourseDateFieldProps = {
  error?: boolean;
  label: string;
  minimumDate?: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

export const CourseDateField: ComponentType<CourseDateFieldProps>;
