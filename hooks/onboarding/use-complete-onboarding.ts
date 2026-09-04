import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

import { getOnboardingErrorMessage, onboardingApi } from '@/api/onboardingApi';
import type { OnboardingCompletionType } from '@/types/onboarding';
import { getAccessToken } from '@/utils/auth';

export function useCompleteOnboarding() {
  const router = useRouter();
  const submittingRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeOnboarding = useCallback(async (completionType: OnboardingCompletionType) => {
    if (submittingRef.current) return false;

    submittingRef.current = true;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        router.replace('/auth/login');
        return false;
      }

      await onboardingApi.complete({ completionType }, accessToken);
      router.replace('/');
      return true;
    } catch (error) {
      setErrorMessage(getOnboardingErrorMessage(error));
      return false;
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [router]);

  return { completeOnboarding, errorMessage, isSubmitting };
}
