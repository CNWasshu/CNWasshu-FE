import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
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
import { PAGE_LAYOUT } from '@/constants/layout';
import { APP_POINT_FONT } from '@/constants/typography';
import { useCompleteOnboarding } from '@/hooks/onboarding/use-complete-onboarding';

export function OnboardingCarousel() {
  const scrollRef = useRef<ScrollView>(null);
  const { height, width } = useWindowDimensions();
  const pageWidth = Math.min(width, PAGE_LAYOUT.desktopMaxWidth);
  const isMobile = width < PAGE_LAYOUT.desktopBreakpoint;
  const isDesktopWeb = Platform.OS === 'web' && !isMobile;
  const isShortScreen = height < 700;
  const imageHeight = isDesktopWeb
    ? Math.min(430, Math.max(360, height - 500))
    : Math.min(360, Math.max(210, height - 360));
  const [currentIndex, setCurrentIndex] = useState(0);
  const { completeOnboarding, errorMessage, isSubmitting } = useCompleteOnboarding();
  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  const closeOnboarding = () => void completeOnboarding('SKIPPED');

  const handlePrevious = () => {
    if (currentIndex === 0) {
      return;
    }

    scrollRef.current?.scrollTo({
      animated: true,
      x: (currentIndex - 1) * pageWidth,
    });
  };

  const handleNext = () => {
    if (isLastSlide) {
      void completeOnboarding('COMPLETED');
      return;
    }

    const nextIndex = currentIndex + 1;
    scrollRef.current?.scrollTo({ animated: true, x: nextIndex * pageWidth });
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    setCurrentIndex(nextIndex);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.max(
      0,
      Math.min(
        ONBOARDING_SLIDES.length - 1,
        Math.round(event.nativeEvent.contentOffset.x / pageWidth)
      )
    );

    if (nextIndex !== currentIndex) {
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
      <View style={[styles.container, { width: pageWidth }]}>
        <View style={styles.topActions}>
          <Text style={styles.brand}>충남왔슈</Text>
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
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScrollEnd}
          pagingEnabled
          ref={scrollRef}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}>
          {ONBOARDING_SLIDES.map((slide) => (
            <View
              key={slide.title}
              style={[
                styles.slide,
                isDesktopWeb && styles.slideDesktop,
                isShortScreen && styles.slideShort,
                { width: pageWidth },
              ]}>
              <View style={[styles.imageFrame, { height: imageHeight }]}>
                <Image
                  accessibilityLabel={slide.accessibilityLabel}
                  contentFit="contain"
                  source={slide.image}
                  style={styles.image}
                />
              </View>
              <View style={[styles.copy, isShortScreen && styles.copyShort]}>
                <Text
                  style={[
                    styles.eyebrow,
                    isDesktopWeb && styles.eyebrowDesktop,
                    isShortScreen && styles.eyebrowShort,
                  ]}>
                  {slide.eyebrow}
                </Text>
                <Text
                  style={[
                    styles.title,
                    isDesktopWeb && styles.titleDesktop,
                    isShortScreen && styles.titleShort,
                  ]}>
                  {slide.title}
                </Text>
                <Text
                  style={[
                    styles.description,
                    isDesktopWeb && styles.descriptionDesktop,
                    isShortScreen && styles.descriptionShort,
                  ]}>
                  {slide.description}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.footer, isShortScreen && styles.footerShort]}>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <View accessibilityLabel={`${currentIndex + 1} / ${ONBOARDING_SLIDES.length} 페이지`} style={styles.dots}>
            {ONBOARDING_SLIDES.map((slide, index) => (
              <View key={slide.title} style={styles.dotSlot}>
                <View style={[styles.dot, currentIndex === index && styles.activeDot]} />
              </View>
            ))}
          </View>
          {(!isMobile || isLastSlide) ? (
            <View style={[styles.buttonSlot, isDesktopWeb && styles.desktopButtonRow]}>
              {isDesktopWeb ? (
                <Pressable
                  accessibilityRole="button"
                  disabled={currentIndex === 0 || isSubmitting}
                  onPress={handlePrevious}
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    pressed && styles.secondaryButtonPressed,
                    (currentIndex === 0 || isSubmitting) && styles.disabled,
                  ]}>
                  <Text style={styles.secondaryButtonText}>이전</Text>
                </Pressable>
              ) : null}
              <Pressable
                accessibilityRole="button"
                disabled={isSubmitting}
                onPress={handleNext}
                style={({ pressed }) => [
                  styles.primaryButton,
                  isDesktopWeb && styles.desktopPrimaryButton,
                  pressed && styles.primaryButtonPressed,
                  isSubmitting && styles.disabled,
                ]}>
                <Text style={styles.primaryButtonText}>
                  {isSubmitting ? '저장 중...' : isLastSlide ? '충남 여행 시작하기' : '다음'}
                </Text>
              </Pressable>
            </View>
          ) : null}
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
    fontFamily: APP_POINT_FONT,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
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
  slideDesktop: {
    justifyContent: 'center',
  },
  slideShort: {
    paddingHorizontal: 18,
  },
  imageFrame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  copy: {
    alignItems: 'center',
    paddingBottom: 14,
    paddingTop: 6,
  },
  copyShort: {
    paddingBottom: 10,
    paddingTop: 2,
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
  eyebrowShort: {
    paddingVertical: 5,
  },
  eyebrowDesktop: {
    fontSize: 13,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  title: {
    color: CourseColors.text,
    fontFamily: APP_POINT_FONT,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 37,
    marginTop: 23,
    textAlign: 'center',
  },
  titleShort: {
    fontSize: 23,
    lineHeight: 31,
    marginTop: 15,
  },
  titleDesktop: {
    fontSize: 32,
    lineHeight: 42,
  },
  description: {
    color: CourseColors.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 13,
    textAlign: 'center',
  },
  descriptionShort: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  descriptionDesktop: {
    fontSize: 15,
    lineHeight: 24,
  },
  footer: {
    gap: 14,
    paddingBottom: 8,
    paddingHorizontal: 22,
  },
  footerShort: {
    gap: 10,
    paddingBottom: 4,
  },
  dots: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'center',
    minHeight: 12,
  },
  dotSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
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
  buttonSlot: {
    minHeight: 56,
  },
  desktopButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: CourseColors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 56,
    width: '100%',
  },
  desktopPrimaryButton: {
    flex: 1,
    width: 'auto',
  },
  primaryButtonPressed: {
    opacity: 0.86,
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: CourseColors.primary,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 56,
  },
  secondaryButtonPressed: {
    backgroundColor: CourseColors.primarySoft,
  },
  secondaryButtonText: {
    color: CourseColors.primary,
    fontSize: 16,
    fontWeight: '900',
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
