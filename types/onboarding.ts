import type { ImageSource } from 'expo-image';

export type OnboardingSlide = {
  accessibilityLabel: string;
  description: string;
  eyebrow: string;
  image: ImageSource;
  title: string;
};
