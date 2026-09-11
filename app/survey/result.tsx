import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageHero } from '@/components/layout';
import { CourseColors } from '@/constants/course-colors';
import { PAGE_LAYOUT } from '@/constants/layout';

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
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.screen}>
        <PageHero
          description="남겨주신 의견을 소중히 반영할게요."
          eyebrow="만족도 조사 완료"
          icon="checkmark-circle-outline"
          title="참여해 주셔서 감사합니다"
        />

        <View style={styles.body}>
          <View style={styles.resultCard}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>{notUsed ? '✓' : '🌿'}</Text>
            </View>
            <View style={styles.content}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: CourseColors.primary, flex: 1 },
  screen: {
    backgroundColor: CourseColors.background,
    flexGrow: 1,
    paddingBottom: 40,
  },
  body: { alignSelf: 'center', maxWidth: 560, paddingHorizontal: 18, paddingTop: PAGE_LAYOUT.sectionSpacing, width: '100%' },
  resultCard: { alignItems: 'center', backgroundColor: CourseColors.white, borderColor: CourseColors.border, borderRadius: 22, borderWidth: 1, gap: 18, padding: 26 },
  content: { alignItems: 'center', gap: 10 },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: CourseColors.primarySoft,
    borderRadius: 34,
    height: 68,
    justifyContent: 'center',
    marginBottom: 8,
    width: 68,
  },
  icon: { color: CourseColors.primary, fontSize: 30, fontWeight: '900' },
  title: { color: CourseColors.text, fontSize: 22, fontWeight: '900', textAlign: 'center' },
  courseName: { color: CourseColors.primaryDark, fontSize: 15, fontWeight: '800', textAlign: 'center' },
  description: { color: CourseColors.muted, fontSize: 14, lineHeight: 22, maxWidth: 360, textAlign: 'center' },
  actions: { alignSelf: 'stretch', gap: 10 },
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
