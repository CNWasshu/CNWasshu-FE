import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ONBOARDING_SLIDES } from '@/constants/onboarding-slides';
import { CourseColors } from '@/constants/course-colors';
import { useCompleteOnboarding } from '@/hooks/onboarding/use-complete-onboarding';

const CONTENT_MAX_WIDTH = 480;

export function OnboardingCarousel() {
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const pageWidth = Math.min(width, CONTENT_MAX_WIDTH);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { completeOnboarding, errorMessage, isSubmitting } = useCompleteOnboarding();
  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  const closeOnboarding = () => void completeOnboarding('SKIPPED');

  const handleNext = () => {
    if (isLastSlide) {
      void completeOnboarding('COMPLETED');
      return;
    }

    const nextIndex = currentIndex + 1;
    scrollRef.current?.scrollTo({ animated: true, x: nextIndex * pageWidth });
    setCurrentIndex(nextIndex);
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    setCurrentIndex(nextIndex);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
      <View style={[styles.container, { width: pageWidth }]}>
        <View style={styles.topActions}>
          <Text style={styles.brand}>CNWASSHU</Text>
          <Pressable
            accessibilityHint="온보딩을 종료하고 홈으로 이동합니다."
            accessibilityRole="button"
            hitSlop={10}
            disabled={isSubmitting}
            onPress={closeOnboarding}
            style={[styles.skipButton, isSubmitting && styles.disabled]}>
            <Text style={styles.skipText}>건너뛰기</Text>
          </Pressable>
        </View>

        <ScrollView
          accessibilityRole="adjustable"
          bounces={false}
          horizontal
          onMomentumScrollEnd={handleScrollEnd}
          pagingEnabled
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}>
          {ONBOARDING_SLIDES.map((slide) => (
            <View key={slide.title} style={[styles.slide, { width: pageWidth }]}>
              <View style={styles.imageFrame}>
                <Image
                  accessibilityLabel={slide.accessibilityLabel}
                  contentFit="contain"
                  source={slide.image}
                  style={styles.image}
                />
              </View>
              <View style={styles.copy}>
                <Text style={styles.eyebrow}>{slide.eyebrow}</Text>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <View accessibilityLabel={`${currentIndex + 1} / ${ONBOARDING_SLIDES.length} 페이지`} style={styles.dots}>
            {ONBOARDING_SLIDES.map((slide, index) => (
              <View
                key={slide.title}
                style={[styles.dot, currentIndex === index && styles.activeDot]}
              />
            ))}
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={handleNext}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
              isSubmitting && styles.disabled,
            ]}>
            <Text style={styles.primaryButtonText}>
              {isSubmitting ? '저장 중...' : isLastSlide ? '충남 여행 시작하기' : '다음'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    alignItems: 'center',
    backgroundColor: CourseColors.background,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  topActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: 22,
  },
  brand: {
    color: CourseColors.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  skipButton: {
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 4,
  },
  skipText: {
    color: CourseColors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  slide: {
    flex: 1,
    paddingHorizontal: 22,
  },
  imageFrame: {
    alignItems: 'center',
    flex: 1.15,
    justifyContent: 'center',
    minHeight: 250,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  copy: {
    alignItems: 'center',
    flex: 0.85,
    paddingTop: 8,
  },
  eyebrow: {
    backgroundColor: CourseColors.primarySoft,
    borderRadius: 999,
    color: CourseColors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  title: {
    color: CourseColors.text,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 37,
    marginTop: 17,
    textAlign: 'center',
  },
  description: {
    color: CourseColors.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 13,
    textAlign: 'center',
  },
  footer: {
    gap: 18,
    paddingBottom: 8,
    paddingHorizontal: 22,
  },
  dots: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    minHeight: 12,
  },
  dot: {
    backgroundColor: CourseColors.border,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  activeDot: {
    backgroundColor: CourseColors.primary,
    width: 24,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: CourseColors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryButtonPressed: {
    opacity: 0.86,
  },
  disabled: {
    opacity: 0.55,
  },
  errorText: {
    color: CourseColors.error,
    fontSize: 13,
    textAlign: 'center',
  },
  primaryButtonText: {
    color: CourseColors.white,
    fontSize: 16,
    fontWeight: '900',
  },
});
