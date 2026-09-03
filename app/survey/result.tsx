import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseColors } from '@/constants/course-colors';

export default function SurveyResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    courseName?: string | string[];
    result?: string | string[];
  }>();
  const courseName = Array.isArray(params.courseName) ? params.courseName[0] : params.courseName;
  const result = Array.isArray(params.result) ? params.result[0] : params.result;
  const notUsed = result === 'NOT_USED';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>{notUsed ? '✓' : '🌿'}</Text>
          </View>
          <Text style={styles.title}>
            {notUsed ? '응답이 저장되었어요' : '소중한 의견 감사합니다!'}
          </Text>
          {courseName ? <Text style={styles.courseName}>{courseName}</Text> : null}
          <Text style={styles.description}>
            {notUsed
              ? 'AI 추천 코스를 이용하지 않은 이유를 다음 추천 개선에 참고할게요.'
              : '남겨주신 의견은 더 좋은 충남 여행 경험을 만드는 데 활용할게요.'}
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={() => router.replace('/')} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>홈으로 가기</Text>
          </Pressable>
          <Pressable onPress={() => router.replace('/notification')} style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>알림함으로 돌아가기</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { alignItems: 'center', backgroundColor: '#F3EFE6', flex: 1 },
  screen: {
    backgroundColor: CourseColors.background,
    flex: 1,
    justifyContent: 'space-between',
    maxWidth: 430,
    paddingBottom: 34,
    paddingHorizontal: 22,
    paddingTop: 80,
    width: '100%',
  },
  content: { alignItems: 'center', gap: 14 },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: CourseColors.primarySoft,
    borderRadius: 45,
    height: 90,
    justifyContent: 'center',
    marginBottom: 8,
    width: 90,
  },
  icon: { color: CourseColors.primary, fontSize: 38, fontWeight: '900' },
  title: { color: CourseColors.text, fontSize: 25, fontWeight: '900', textAlign: 'center' },
  courseName: { color: CourseColors.primaryDark, fontSize: 16, fontWeight: '800', textAlign: 'center' },
  description: { color: CourseColors.muted, fontSize: 14, lineHeight: 22, maxWidth: 310, textAlign: 'center' },
  actions: { gap: 10 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: CourseColors.primary,
    borderRadius: 15,
    justifyContent: 'center',
    minHeight: 54,
  },
  primaryButtonText: { color: CourseColors.white, fontWeight: '900' },
  outlineButton: {
    alignItems: 'center',
    borderColor: CourseColors.primary,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
  },
  outlineButtonText: { color: CourseColors.primary, fontWeight: '900' },
});
