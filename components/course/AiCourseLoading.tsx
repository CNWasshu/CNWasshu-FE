import { CourseColors } from '@/constants/course-colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

const STEPS = [
  { icon: 'location-outline', label: '여행 조건 확인 중' },
  { icon: 'search-outline', label: '지역별 체험 장소 찾는 중' },
  { icon: 'car-outline', label: '이동 동선 정리 중' },
  { icon: 'calendar-outline', label: '일정 순서 구성 중' },
  { icon: 'sparkles-outline', label: '추천 코스 마무리 중' },
] as const;

export function AiCourseLoading() {
  const [currentStep, setCurrentStep] = useState(0);
  const pulse = useRef(new Animated.Value(0.65)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((step) => Math.min(step + 1, STEPS.length - 1));
    }, 1700);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { duration: 650, toValue: 1, useNativeDriver: true }),
      Animated.timing(pulse, { duration: 650, toValue: 0.65, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <View accessibilityLabel={`AI 코스 생성 중, ${STEPS[currentStep].label}`} accessibilityLiveRegion="polite" style={styles.container}>
      <View style={styles.headingIcon}><Ionicons color={CourseColors.primary} name="sparkles-outline" size={24} /></View>
      <Text style={styles.title}>AI가 나만의 여행 코스를 만들고 있어요</Text>
      <Text style={styles.description}>선택한 조건에 어울리는 장소와 동선을 정리하고 있습니다.</Text>
      <View style={styles.steps}>
        {STEPS.map((step, index) => {
          const completed = index < currentStep;
          const active = index === currentStep;
          return (
            <View key={step.label} style={[styles.step, !completed && !active && styles.upcomingStep]}>
              <View style={[styles.stepIcon, completed && styles.completedIcon]}>
                {completed ? <Ionicons color={CourseColors.white} name="checkmark" size={16} /> : active ? <Animated.View style={{ opacity: pulse }}><Ionicons color={CourseColors.primary} name={step.icon} size={17} /></Animated.View> : <Ionicons color="#A49A8A" name={step.icon} size={17} />}
              </View>
              <Text style={[styles.stepText, active && styles.activeText, completed && styles.completedText]}>{step.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: CourseColors.white, borderColor: CourseColors.border, borderRadius: 18, borderWidth: 1, gap: 7, padding: 20 },
  headingIcon: { alignItems: 'center', backgroundColor: CourseColors.primarySoft, borderRadius: 22, height: 44, justifyContent: 'center', marginBottom: 2, width: 44 },
  title: { color: CourseColors.text, fontSize: 17, fontWeight: '900', textAlign: 'center' },
  description: { color: CourseColors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  steps: { alignSelf: 'stretch', gap: 7, marginTop: 8 },
  step: { alignItems: 'center', backgroundColor: CourseColors.background, borderRadius: 12, flexDirection: 'row', gap: 9, minHeight: 42, paddingHorizontal: 10 },
  upcomingStep: { opacity: 0.5 },
  stepIcon: { alignItems: 'center', borderColor: '#C9DCC6', borderRadius: 14, borderWidth: 1, height: 28, justifyContent: 'center', width: 28 },
  completedIcon: { backgroundColor: CourseColors.primary, borderColor: CourseColors.primary },
  stepText: { color: CourseColors.muted, flex: 1, fontSize: 12, fontWeight: '700' },
  activeText: { color: CourseColors.primaryDark, fontWeight: '900' },
  completedText: { color: CourseColors.text },
});
