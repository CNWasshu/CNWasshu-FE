import { CourseColors } from '@/constants/course-colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

const STEPS = [
  { icon: 'location-outline', label: '여행 조건을 살펴보고 있어요', detail: '날짜와 인원, 여행 스타일 확인 중' },
  { icon: 'search-outline', label: '어울리는 장소를 찾고 있어요', detail: '선택한 지역의 체험과 명소 탐색 중' },
  { icon: 'car-outline', label: '편한 이동 동선을 짜고 있어요', detail: '장소 사이 거리와 이동 순서 계산 중' },
  { icon: 'calendar-outline', label: '하루 일정을 채우고 있어요', detail: '시간대별로 알맞은 장소 배치 중' },
  { icon: 'sparkles-outline', label: '추천 코스를 마무리하고 있어요', detail: '조금만 기다리면 여행 코스가 완성돼요' },
] as const;

// 응답이 오래 걸려도 마지막 단계에만 멈춰 보이지 않도록 앞 단계의 체류 시간을 충분히 둔다.
const STEP_DURATIONS = [2500, 2500, 2500, 2500] as const;

const TRAVEL_TIPS = [
  '충남의 숨은 명소까지 꼼꼼히 살펴보고 있어요.',
  '이동은 덜 하고 여행은 더 즐길 수 있게 구성해요.',
  '식사와 체험 시간이 겹치지 않도록 확인하고 있어요.',
  '완성된 코스는 저장해두고 언제든 다시 볼 수 있어요.',
] as const;

export function AiCourseLoading() {
  const [currentStep, setCurrentStep] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const pulse = useRef(new Animated.Value(0.65)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let step = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const advance = () => {
      timer = setTimeout(() => {
        step += 1;
        setCurrentStep(step);
        if (step < STEPS.length - 1) advance();
      }, STEP_DURATIONS[step]);
    };

    advance();
    return () => { if (timer) clearTimeout(timer); };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((index) => (index + 1) % TRAVEL_TIPS.length);
    }, 4800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const animation = Animated.loop(Animated.parallel([
      Animated.sequence([
        Animated.timing(pulse, { duration: 800, toValue: 1, useNativeDriver: true }),
        Animated.timing(pulse, { duration: 800, toValue: 0.65, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(float, { duration: 1100, easing: Easing.inOut(Easing.quad), toValue: -6, useNativeDriver: true }),
        Animated.timing(float, { duration: 1100, easing: Easing.inOut(Easing.quad), toValue: 0, useNativeDriver: true }),
      ]),
    ]));
    animation.start();
    return () => animation.stop();
  }, [float, pulse]);

  return (
    <View accessibilityLabel={`AI 코스 생성 중, ${STEPS[currentStep].label}`} accessibilityLiveRegion="polite" style={styles.container}>
      <View style={styles.illustration}>
        <Text style={[styles.decorativeSparkle, styles.leftSparkle]}>✦</Text>
        <Animated.View style={[styles.headingIcon, { transform: [{ translateY: float }] }]}>
          <Ionicons color={CourseColors.primary} name="map-outline" size={30} />
          <View style={styles.headingSparkle}><Text style={styles.headingSparkleText}>✦</Text></View>
        </Animated.View>
        <Text style={[styles.decorativeSparkle, styles.rightSparkle]}>✦</Text>
      </View>
      <Text style={styles.eyebrow}>AI TRIP PLANNER</Text>
      <Text style={styles.title}>나만의 여행 코스를 만들고 있어요</Text>
      <Text style={styles.description}>여행이 즐거워질 수 있도록 한 곳씩 신중하게 고르고 있습니다.</Text>

      <View style={styles.progressTrack}>
        {STEPS.map((step, index) => (
          <View key={step.label} style={[styles.progressBar, index <= currentStep && styles.progressBarActive]} />
        ))}
      </View>

      <View style={styles.steps}>
        {STEPS.map((step, index) => {
          const completed = index < currentStep;
          const active = index === currentStep;
          return (
            <View key={step.label} style={[styles.step, active && styles.activeStep, !completed && !active && styles.upcomingStep]}>
              <View style={[styles.stepIcon, completed && styles.completedIcon, active && styles.activeIcon]}>
                {completed ? <Ionicons color={CourseColors.white} name="checkmark" size={16} /> : active ? <Animated.View style={{ opacity: pulse }}><Ionicons color={CourseColors.primary} name={step.icon} size={18} /></Animated.View> : <Text style={styles.stepNumber}>{index + 1}</Text>}
              </View>
              <View style={styles.stepCopy}>
                <Text style={[styles.stepText, active && styles.activeText, completed && styles.completedText]}>{step.label}</Text>
                {active ? <Text style={styles.stepDetail}>{step.detail}</Text> : null}
              </View>
              {active ? <View style={styles.dots}><Animated.View style={[styles.dot, { opacity: pulse }]} /><View style={styles.dot} /><View style={[styles.dot, styles.faintDot]} /></View> : null}
            </View>
          );
        })}
      </View>

      <View style={styles.tipCard}>
        <Ionicons color={CourseColors.primary} name="bulb-outline" size={18} />
        <Text style={styles.tipText}>{TRAVEL_TIPS[tipIndex]}</Text>
      </View>
      <Text style={styles.waitMessage}>화면을 그대로 두면 완성되는 즉시 보여드릴게요.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: CourseColors.white, borderColor: CourseColors.border, borderRadius: 22, borderWidth: 1, gap: 7, overflow: 'hidden', paddingHorizontal: 18, paddingVertical: 24 },
  illustration: { alignItems: 'center', height: 66, justifyContent: 'center', marginBottom: 1, width: 150 },
  headingIcon: { alignItems: 'center', backgroundColor: CourseColors.primarySoft, borderColor: '#D4E7D0', borderRadius: 30, borderWidth: 1, height: 60, justifyContent: 'center', width: 60 },
  headingSparkle: { alignItems: 'center', backgroundColor: CourseColors.primary, borderRadius: 10, bottom: -2, height: 20, justifyContent: 'center', position: 'absolute', right: -4, width: 20 },
  headingSparkleText: { color: CourseColors.white, fontSize: 11, fontWeight: '900' },
  decorativeSparkle: { color: '#B9D6B5', fontSize: 13, position: 'absolute' }, leftSparkle: { left: 18, top: 15 }, rightSparkle: { right: 15, top: 34 },
  eyebrow: { color: CourseColors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  title: { color: CourseColors.text, fontSize: 18, fontWeight: '900', textAlign: 'center' },
  description: { color: CourseColors.muted, fontSize: 12, lineHeight: 18, maxWidth: 360, textAlign: 'center' },
  progressTrack: { alignSelf: 'stretch', flexDirection: 'row', gap: 5, marginBottom: 4, marginTop: 10 },
  progressBar: { backgroundColor: '#E8E4DB', borderRadius: 3, flex: 1, height: 4 }, progressBarActive: { backgroundColor: CourseColors.primary },
  steps: { alignSelf: 'stretch', gap: 7 },
  step: { alignItems: 'center', backgroundColor: CourseColors.background, borderColor: 'transparent', borderRadius: 13, borderWidth: 1, flexDirection: 'row', gap: 10, minHeight: 46, paddingHorizontal: 11, paddingVertical: 7 },
  activeStep: { backgroundColor: '#F3F8F1', borderColor: '#C7DEC3', minHeight: 58 }, upcomingStep: { opacity: 0.48 },
  stepIcon: { alignItems: 'center', borderColor: '#C9DCC6', borderRadius: 15, borderWidth: 1, height: 30, justifyContent: 'center', width: 30 },
  completedIcon: { backgroundColor: CourseColors.primary, borderColor: CourseColors.primary }, activeIcon: { backgroundColor: CourseColors.white, borderColor: CourseColors.primary },
  stepNumber: { color: '#8D8374', fontSize: 11, fontWeight: '900' }, stepCopy: { flex: 1, gap: 2 },
  stepText: { color: CourseColors.muted, fontSize: 12, fontWeight: '700' }, activeText: { color: CourseColors.primaryDark, fontWeight: '900' }, completedText: { color: CourseColors.text },
  stepDetail: { color: CourseColors.muted, fontSize: 10, lineHeight: 15 }, dots: { flexDirection: 'row', gap: 3 }, dot: { backgroundColor: CourseColors.primary, borderRadius: 3, height: 5, width: 5 }, faintDot: { opacity: 0.35 },
  tipCard: { alignItems: 'center', alignSelf: 'stretch', backgroundColor: '#FFF9E9', borderRadius: 12, flexDirection: 'row', gap: 8, marginTop: 7, minHeight: 44, paddingHorizontal: 12, paddingVertical: 9 },
  tipText: { color: '#6F5B34', flex: 1, fontSize: 11, fontWeight: '700', lineHeight: 16 }, waitMessage: { color: CourseColors.muted, fontSize: 10, marginTop: 2, textAlign: 'center' },
});
