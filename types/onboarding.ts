import type { ImageSource } from 'expo-image';

export type OnboardingSlide = {
  accessibilityLabel: string;
  description: string;
  eyebrow: string;
  image: ImageSource;
  title: string;
};

export type OnboardingStatus = 'NOT_STARTED' | 'COMPLETED' | 'SKIPPED';

export type OnboardingCompletionType = Exclude<OnboardingStatus, 'NOT_STARTED'>;

export type OnboardingStatusResponse = {
  onboardingStatus: OnboardingStatus;
  onboardingCompletedAt: string | null;
};

export type OnboardingCompleteRequest = {
  completionType: OnboardingCompletionType;
};
