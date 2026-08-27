import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { getStampErrorMessage, stampApi } from '@/api/stampApi';
import { CourseColors } from '@/constants/course-colors';
import type { StampResponse } from '@/types/stamp';
import { clearTokens, getAccessToken, isSessionExpiredError } from '@/utils/auth';

const STAMP_GOAL = 10;

export default function StampListScreen() {
  const router = useRouter();
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
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>스탬프</Text>
          <Text style={styles.heroDescription}>
            체험지를 방문해서 QR 인증하면{`\n`}스탬프를 모을 수 있어요.
          </Text>
        </View>

        <View style={styles.body}>
          <View style={styles.whiteCard}>
            <Text style={styles.cardTitle}>방문 인증</Text>
            <Text style={styles.cardDesc}>
              체험지 QR 인증 후 스탬프를 받아보세요.
            </Text>
            <Pressable
              accessibilityRole="button"
              style={styles.scanButton}
              onPress={() => router.push('/stamp/scan')}>
              <Text style={styles.scanButtonText}>QR 인증하기</Text>
            </Pressable>
          </View>

          <View style={styles.whiteCard}>
            <Text style={styles.cardTitle}>내 스탬프</Text>
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
                <View style={styles.stampGrid}>
                  {slots.map((stamp, index) =>
                    stamp ? (
                      <View key={stamp.stampId} style={[styles.stampCell, styles.stampCellDone]}>
                        <Text style={styles.stampCellDoneText} numberOfLines={1}>
                          {stamp.regionName}
                        </Text>
                      </View>
                    ) : (
                      <View key={`empty-${index}`} style={styles.stampCell}>
                        <Text style={styles.stampCellText}>{index + 1}</Text>
                      </View>
                    )
                  )}
                </View>

                <View style={styles.coupon}>
                  <Text style={styles.couponTitle}>
                    {remaining > 0
                      ? `할인 쿠폰까지 ${remaining}개 남았어요`
                      : '할인 쿠폰을 받을 수 있어요!'}
                  </Text>
                  <Text style={styles.cardDesc}>
                    {STAMP_GOAL}개 달성 시 지역화폐 또는 체험 할인 쿠폰 발급
                  </Text>
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
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: 18,
    marginTop: -18,
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
  cardTitle: { fontSize: 16, fontWeight: '900', color: CourseColors.text },
  cardDesc: { fontSize: 12.5, color: CourseColors.muted, lineHeight: 19 },
  scanButton: {
    marginTop: 10,
    minHeight: 50,
    borderRadius: 15,
    backgroundColor: CourseColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: { color: CourseColors.white, fontWeight: '900', fontSize: 14 },
  loadingBox: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  errorText: { color: CourseColors.error, fontSize: 13, textAlign: 'center' },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CourseColors.primary,
  },
  retryButtonText: { color: CourseColors.primary, fontWeight: '800', fontSize: 12 },
  stampGrid: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stampCell: {
    width: '17.5%',
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: CourseColors.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampCellDone: {
    backgroundColor: CourseColors.primary,
  },
  stampCellText: { color: '#a49069', fontWeight: '900', fontSize: 13 },
  stampCellDoneText: {
    color: CourseColors.white,
    fontWeight: '900',
    fontSize: 10,
    paddingHorizontal: 2,
  },
  coupon: {
    marginTop: 14,
    padding: 14,
    borderRadius: 20,
    backgroundColor: '#FFF7DF',
    borderWidth: 1,
    borderColor: '#F0CD7B',
    gap: 4,
  },
  couponTitle: { color: CourseColors.text, fontWeight: '900', fontSize: 14 },
});
