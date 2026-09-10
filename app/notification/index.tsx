import { useEffect, useState } from 'react';
import { type Href, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackHeader } from '@/components/common/BackHeader';
import { NotificationListItem } from '@/components/notification/NotificationListItem';
import { CourseColors } from '@/constants/course-colors';
import { PAGE_LAYOUT } from '@/constants/layout';
import { useNotifications } from '@/hooks/notification/use-notifications';
import { getAccessToken } from '@/utils/auth';

export default function NotificationScreen() {
  const router = useRouter();
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

  const {
    error,
    hasNext,
    loading,
    loadingMore,
    loadMore,
    markAsRead,
    notifications,
    refetch,
  } = useNotifications(accessToken ?? null);

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
          <BackHeader />
          <Text style={styles.heroTitle}>알림함</Text>
          <Text style={styles.heroDescription}>
            코스, 예약, 만족도 조사 알림을{`\n`}이곳에서 확인할 수 있어요.
          </Text>
        </View>

        <View style={styles.body}>
          {loading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator color={CourseColors.primary} size="large" />
              <Text style={styles.loadingText}>알림을 불러오고 있어요.</Text>
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

          {!loading && !error && notifications.length === 0 ? (
            <View style={styles.stateCard}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>🔔</Text>
              </View>
              <Text style={styles.emptyTitle}>아직 받은 알림이 없어요</Text>
              <Text style={styles.stateDescription}>
                코스 일정이나 예약이 다가오면{`\n`}여기에서 알려드릴게요.
              </Text>
            </View>
          ) : null}

          {!loading && !error && notifications.length > 0 ? (
            <View style={styles.list}>
              {notifications.map((notification) => (
                <NotificationListItem
                  key={notification.notificationId}
                  notification={notification}
                  onPress={() => {
                    if (!notification.isRead) {
                      void markAsRead(notification.notificationId);
                    }
                    if (
                      notification.notificationType === 'SURVEY'
                      && notification.courseSurveyId != null
                    ) {
                      router.push(
                        `/survey?surveyId=${notification.courseSurveyId}` as Href
                      );
                    }
                  }}
                />
              ))}

              {hasNext ? (
                <Pressable
                  disabled={loadingMore}
                  onPress={loadMore}
                  style={[styles.moreButton, loadingMore && styles.disabled]}>
                  {loadingMore ? (
                    <ActivityIndicator color={CourseColors.primary} size="small" />
                  ) : (
                    <Text style={styles.moreButtonText}>더보기</Text>
                  )}
                </Pressable>
              ) : null}
            </View>
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
    maxWidth: PAGE_LAYOUT.desktopMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: 18,
    marginTop: -18,
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
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: CourseColors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconText: { fontSize: 28 },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: CourseColors.text, textAlign: 'center' },
  stateDescription: { color: CourseColors.muted, textAlign: 'center', lineHeight: 22 },
  list: { gap: 12 },
  moreButton: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: CourseColors.border,
    backgroundColor: CourseColors.white,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButtonText: { color: CourseColors.primary, fontWeight: '900' },
  disabled: { opacity: 0.6 },
});
