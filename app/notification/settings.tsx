import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseColors } from '@/constants/course-colors';
import { useNotificationSettings } from '@/hooks/notification/use-notification-settings';
import type { NotificationSettingResponse } from '@/types/notification';
import { getAccessToken } from '@/utils/auth';

type SettingKey = keyof NotificationSettingResponse;

const RESERVATION_CHIPS: { key: SettingKey; label: string }[] = [
  { key: 'reservationDayBefore', label: '하루 전' },
  { key: 'reservation3hBefore', label: '3시간 전' },
  { key: 'reservation1hBefore', label: '1시간 전' },
  { key: 'reservation30mBefore', label: '30분 전' },
];

function SettingChip({
  active,
  disabled,
  label,
  onPress,
}: {
  active: boolean;
  disabled: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive, disabled && styles.chipDisabled]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function NotificationSettingsScreen() {
  const [accessToken, setAccessToken] = useState<string | null | undefined>(undefined);

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

  const { error, loading, refetch, saveErrorMessage, savingKey, settings, toggle } =
    useNotificationSettings(accessToken ?? null);

  // AuthGate가 전역에서 비로그인 접근을 리다이렉트하므로, 토큰 확인 중에는
  // 조회를 미루고 대기 화면만 보여준다.
  if (accessToken === undefined || accessToken === null) {
    return (
      <SafeAreaView style={styles.checkingSafe}>
        <ActivityIndicator color={CourseColors.white} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>알림톡 설정</Text>
          <Text style={styles.heroDescription}>
            코스와 예약 일정을 카카오 알림톡으로{`\n`}언제 받을지 정할 수 있어요.
          </Text>
        </View>

        <View style={styles.body}>
          {loading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator color={CourseColors.primary} size="large" />
              <Text style={styles.loadingText}>설정을 불러오고 있어요.</Text>
            </View>
          ) : null}

          {!loading && error ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateIcon}>!</Text>
              <Text style={styles.error}>{error}</Text>
              <Pressable onPress={() => void refetch()} style={styles.outlineButton}>
                <Text style={styles.outlineButtonText}>다시 시도</Text>
              </Pressable>
            </View>
          ) : null}

          {!loading && !error && settings ? (
            <>
              <View style={styles.whiteCard}>
                <Text style={styles.cardTitle}>코스 알림</Text>
                <Text style={styles.cardDesc}>
                  저장한 코스가 시작되기 전에 알려드려요.
                </Text>
                <View style={styles.chipRow}>
                  <SettingChip
                    active={settings.courseDayBefore}
                    disabled={savingKey === 'courseDayBefore'}
                    label="코스 시작 하루 전"
                    onPress={() => void toggle('courseDayBefore')}
                  />
                </View>
              </View>

              <View style={styles.whiteCard}>
                <Text style={styles.cardTitle}>예약 알림</Text>
                <Text style={styles.cardDesc}>
                  예약한 체험 시간이 다가오면 알려드려요. 여러 개를 동시에 켤 수 있어요.
                </Text>
                <View style={styles.chipRow}>
                  {RESERVATION_CHIPS.map(({ key, label }) => (
                    <SettingChip
                      active={settings[key]}
                      disabled={savingKey === key}
                      key={key}
                      label={label}
                      onPress={() => void toggle(key)}
                    />
                  ))}
                </View>
              </View>

              {saveErrorMessage ? (
                <Text style={styles.saveError}>{saveErrorMessage}</Text>
              ) : null}
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  checkingSafe: {
    alignItems: 'center',
    backgroundColor: CourseColors.primary,
    flex: 1,
    justifyContent: 'center',
  },
  safe: { flex: 1, backgroundColor: CourseColors.primary },
  container: { flexGrow: 1, backgroundColor: CourseColors.background, paddingBottom: 44 },
  hero: {
    backgroundColor: CourseColors.primary,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 42,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    gap: 12,
  },
  heroTitle: { color: CourseColors.white, fontSize: 30, fontWeight: '900' },
  heroDescription: { color: '#E4EFE1', fontSize: 14, lineHeight: 22 },
  body: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: 18,
    marginTop: -18,
    gap: 12,
  },
  loadingCard: {
    minHeight: 220,
    backgroundColor: CourseColors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: CourseColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 13,
  },
  loadingText: { color: CourseColors.muted },
  stateCard: {
    backgroundColor: CourseColors.white,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: CourseColors.border,
    paddingHorizontal: 24,
    paddingVertical: 31,
    alignItems: 'center',
    gap: 14,
  },
  stateIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    textAlign: 'center',
    paddingTop: 8,
    backgroundColor: '#FFF1ED',
    color: CourseColors.error,
    fontWeight: '900',
    overflow: 'hidden',
  },
  error: { color: CourseColors.error, textAlign: 'center' },
  outlineButton: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: CourseColors.primary,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    alignSelf: 'stretch',
  },
  outlineButtonText: { color: CourseColors.primary, fontWeight: '900' },
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: CourseColors.border,
    backgroundColor: CourseColors.white,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipActive: {
    backgroundColor: CourseColors.primary,
    borderColor: CourseColors.primary,
  },
  chipDisabled: { opacity: 0.5 },
  chipText: { color: CourseColors.text, fontWeight: '800', fontSize: 13 },
  chipTextActive: { color: CourseColors.white },
  saveError: { color: CourseColors.error, fontSize: 12.5, textAlign: 'center' },
});
