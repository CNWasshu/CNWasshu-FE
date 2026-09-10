import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { getStampErrorMessage, stampApi } from '@/api/stampApi';
import { CourseColors } from '@/constants/course-colors';
import { PageHero } from '@/components/layout';
import { PAGE_LAYOUT } from '@/constants/layout';
import type { StampResponse } from '@/types/stamp';
import { clearTokens, getAccessToken, isSessionExpiredError } from '@/utils/auth';

const STAMP_GOAL = 10;

export default function StampListScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isCompact = width < PAGE_LAYOUT.desktopBreakpoint;
  const [accessToken, setAccessToken] = useState<string | null | undefined>(undefined);
  const [stamps, setStamps] = useState<StampResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const token = await getAccessToken();
      if (!cancelled) {
        setAccessToken(token);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchStamps = useCallback(async (token: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await stampApi.getMyStamps(token);
      setStamps(response.stamps);
    } catch (requestError) {
      if (isSessionExpiredError(requestError)) {
        await clearTokens();
        router.replace('/auth/login');
        return;
      }
      setErrorMessage(getStampErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      if (accessToken) {
        void fetchStamps(accessToken);
      }
    }, [accessToken, fetchStamps])
  );

  const remaining = Math.max(STAMP_GOAL - stamps.length, 0);
  const slots = Array.from({ length: STAMP_GOAL }, (_, index) => stamps[index] ?? null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <PageHero description="체험지를 방문해서 QR 인증하고 충남 여행 기록을 완성해보세요." eyebrow="충남 여행 기록" icon="ribbon-outline" title="스탬프를 모아보세요" />

        <View style={styles.body}>
          <View style={styles.whiteCard}>
            <View style={styles.cardHeadingRow}>
              <View style={styles.cardIcon}><Ionicons color={CourseColors.primary} name="qr-code-outline" size={20} /></View>
              <View style={styles.cardHeadingText}>
                <Text style={styles.cardTitle}>방문 인증</Text>
                <Text style={styles.cardDesc}>체험지 QR 인증 후 스탬프를 받아보세요.</Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              style={styles.scanButton}
              onPress={() => router.push('/stamp/scan')}>
              <Ionicons color={CourseColors.white} name="scan-outline" size={18} />
              <Text style={styles.scanButtonText}>QR 인증하기</Text>
            </Pressable>
          </View>

          <View style={styles.whiteCard}>
            <View style={styles.stampHeadingRow}>
              <Text style={styles.cardTitle}>내 스탬프</Text>
              <Text style={styles.progressCount}>{stamps.length} / {STAMP_GOAL}</Text>
            </View>
            <Text style={styles.cardDesc}>
              예: 1박 2일 동안 지역이 다른 체험 2개를 방문하면 스탬프 2개를 받을 수 있어요.
            </Text>

            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator color={CourseColors.primary} />
              </View>
            ) : errorMessage ? (
              <View style={styles.loadingBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                <Pressable
                  style={styles.retryButton}
                  onPress={() => accessToken && void fetchStamps(accessToken)}>
                  <Text style={styles.retryButtonText}>다시 시도</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <View style={styles.stampBoard}>
                  <View style={styles.stampGrid}>
                    {slots.map((stamp, index) =>
                      stamp ? (
                        <View key={stamp.stampId} style={[styles.stampCell, isCompact && styles.stampCellCompact, styles.stampCellDone]}>
                          <View style={[styles.stampInner, styles.stampInnerDone]}>
                            <Ionicons color={CourseColors.primaryDark} name="leaf" size={21} />
                            <Text style={styles.stampCellDoneText} numberOfLines={1}>{stamp.regionName}</Text>
                            <Text style={styles.stampNumber}>STAMP {String(index + 1).padStart(2, '0')}</Text>
                          </View>
                        </View>
                      ) : (
                        <View key={`empty-${index}`} style={[styles.stampCell, isCompact && styles.stampCellCompact]}>
                          <View style={styles.stampInner}>
                            <Ionicons color="#B29D73" name="footsteps-outline" size={19} />
                            <Text style={styles.nextTripText}>다음 여행</Text>
                            <Text style={styles.stampCellText}>STAMP {String(index + 1).padStart(2, '0')}</Text>
                          </View>
                        </View>
                      )
                    )}
                  </View>
                </View>

                <View style={styles.coupon}>
                  <View style={styles.couponIcon}><Ionicons color="#9B6B13" name="ticket-outline" size={21} /></View>
                  <View style={styles.couponText}>
                    <Text style={styles.couponTitle}>
                      {remaining > 0
                        ? `할인 쿠폰까지 ${remaining}개 남았어요`
                        : '할인 쿠폰을 받을 수 있어요!'}
                    </Text>
                    <Text style={styles.cardDesc}>{STAMP_GOAL}개 달성 시 지역화폐 또는 체험 할인 쿠폰 발급</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CourseColors.primary },
  container: { flexGrow: 1, backgroundColor: CourseColors.background, paddingBottom: 44 },
  hero: {
    backgroundColor: CourseColors.primary,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 42,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    gap: 8,
  },
  heroTitle: { color: CourseColors.white, fontSize: 28, fontWeight: '900' },
  heroDescription: { color: '#E4EFE1', fontSize: 13, lineHeight: 20 },
  body: {
    width: '100%',
    maxWidth: PAGE_LAYOUT.desktopMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: 18,
    marginTop: PAGE_LAYOUT.sectionSpacing,
    gap: 12,
  },
  whiteCard: {
    backgroundColor: CourseColors.white,
    borderWidth: 1,
    borderColor: CourseColors.border,
    borderRadius: 22,
    padding: 16,
    gap: 6,
  },
  cardHeadingRow: { alignItems: 'center', flexDirection: 'row', gap: 11 },
  cardHeadingText: { flex: 1, gap: 2 },
  cardIcon: { alignItems: 'center', backgroundColor: CourseColors.primarySoft, borderRadius: 18, height: 36, justifyContent: 'center', width: 36 },
  cardTitle: { fontSize: 16, fontWeight: '900', color: CourseColors.text },
  cardDesc: { fontSize: 14, color: CourseColors.muted, lineHeight: 20 },
  scanButton: {
    marginTop: 10,
    minHeight: 50,
    borderRadius: 15,
    backgroundColor: CourseColors.primary,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
  },
  scanButtonText: { color: CourseColors.white, fontWeight: '900', fontSize: 14 },
  loadingBox: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  errorText: { color: CourseColors.error, fontSize: 14, textAlign: 'center' },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CourseColors.primary,
  },
  retryButtonText: { color: CourseColors.primary, fontWeight: '800', fontSize: 14 },
  stampGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    zIndex: 1,
  },
  stampBoard: { backgroundColor: '#EAF3DE', borderColor: '#C9DEB5', borderRadius: 24, borderWidth: 1, marginTop: 12, overflow: 'hidden', padding: 14 },
  stampHeadingRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  progressCount: { backgroundColor: CourseColors.primarySoft, borderRadius: 999, color: CourseColors.primaryDark, fontSize: 13, fontWeight: '900', overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 5 },
  stampCell: {
    width: '18.5%',
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderColor: '#D9C7A3',
    borderStyle: 'dashed',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  stampCellCompact: { width: '31%' },
  stampCellDone: {
    backgroundColor: '#D9ECD2',
    borderColor: CourseColors.primary,
    borderStyle: 'dashed',
  },
  stampInner: { alignItems: 'center', borderColor: '#DDCBAA', borderRadius: 999, borderWidth: 1, gap: 2, height: '100%', justifyContent: 'center', width: '100%' },
  stampInnerDone: { borderColor: '#86B487' },
  nextTripText: { color: '#9C875F', fontSize: 12, fontWeight: '800' },
  stampCellText: { color: '#8F7950', fontWeight: '900', fontSize: 9, letterSpacing: 0.2 },
  stampCellDoneText: {
    color: CourseColors.primaryDark,
    fontWeight: '900',
    fontSize: 13,
    paddingHorizontal: 2,
  },
  stampNumber: { color: '#668565', fontSize: 8, fontWeight: '800', letterSpacing: 0.15 },
  coupon: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 11,
    marginTop: 14,
    padding: 14,
    borderRadius: 20,
    backgroundColor: '#FFF7DF',
    borderWidth: 1,
    borderColor: '#F0CD7B',
  },
  couponIcon: { alignItems: 'center', backgroundColor: '#FFE9AD', borderRadius: 18, height: 36, justifyContent: 'center', width: 36 },
  couponText: { flex: 1, gap: 3 },
  couponTitle: { color: CourseColors.text, fontWeight: '900', fontSize: 14 },
});
