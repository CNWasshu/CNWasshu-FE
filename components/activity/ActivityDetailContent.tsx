import { Image } from 'expo-image';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityDetailActions } from '@/components/activity/ActivityDetailActions';
import { ActivityDetailHero } from '@/components/activity/ActivityDetailHero';
import { ActivityDetailInfo } from '@/components/activity/ActivityDetailInfo';
import { PageHero } from '@/components/layout';
import { CourseColors } from '@/constants/course-colors';
import { PAGE_LAYOUT } from '@/constants/layout';
import type { ActivityDetailResponse } from '@/types/activity';

type ActivityDetailContentProps = {
  activity: ActivityDetailResponse | null;
  loading: boolean;
  errorMessage: string;

  isBookmarked: boolean;

  onRetry: () => void;
  onBookmarkPress: () => void;
  onReservationPress: () => void;
};

export function ActivityDetailContent({
  activity,
  loading,
  errorMessage,
  isBookmarked,
  onRetry,
  onBookmarkPress,
  onReservationPress,
}: ActivityDetailContentProps) {
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />

          <Text style={styles.loadingText}>
            체험 정보를 불러오고 있어요.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage || !activity) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>
            체험 정보를 불러오지 못했어요.
          </Text>

          <Text style={styles.errorMessage}>
            {errorMessage}
          </Text>

          <Pressable
            accessibilityRole="button"
            style={styles.retryButton}
            onPress={onRetry}
          >
            <Text style={styles.retryButtonText}>
              다시 시도
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={styles.safeArea}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.screen}>
          <PageHero
            description="체험 내용, 위치, 전화번호, 예약 가능 여부를 확인할 수 있어요."
            eyebrow="체험 상세"
            icon="sparkles-outline"
            showBack
            title={activity.title}
          />

          <View style={styles.content}>
            <ActivityDetailHero
              activity={activity}
            />

            <ActivityDetailInfo
              activity={activity}
            />

            <ActivityDetailActions
              isBookmarked={isBookmarked}
              reservationRequired={
                activity.reservationRequired
              }
              onBookmarkPress={
                onBookmarkPress
              }
              onReservationPress={
                onReservationPress
              }
            />

            {activity.description && (
              <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>
                  체험 소개
                </Text>

                <View style={styles.descriptionList}>
                  {activity.description
                    .split(/\n\s*\n/)
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <Text key={index} style={styles.description}>
                        {paragraph.trim()}
                      </Text>
                    ))}
                </View>
              </View>
            )}

            {activity.images.length > 0 && (
              <View style={styles.imageSection}>
                <Text style={styles.sectionTitle}>
                  체험 사진
                </Text>

                {activity.images.map(
                  (imageUrl, index) => (
                    <Image
                      key={`${imageUrl}-${index}`}
                      source={{
                        uri: imageUrl,
                      }}
                      style={styles.detailImage}
                      contentFit="cover"
                      transition={200}
                    />
                  )
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CourseColors.background,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    backgroundColor: CourseColors.background,
  },

  screen: {
    width: '100%',
    flex: 1,
    backgroundColor: CourseColors.background,
  },

  content: {
    width: '100%',
    maxWidth: PAGE_LAYOUT.desktopMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: PAGE_LAYOUT.sectionSpacing,
    paddingBottom: 40,
  },

  descriptionSection: {
    marginTop: 28,
    paddingTop: 22,
    borderTopWidth: 1,
    borderTopColor: '#EFE3CE',
  },

  sectionTitle: {
    color: '#29251E',
    fontSize: 18,
    fontWeight: '900',
  },

  descriptionList: {
    gap: 14,
    marginTop: 12,
  },

  description: {
    color: '#5F5A51',
    fontSize: 14,
    lineHeight: 24,
  },

  imageSection: {
    marginTop: 28,
    gap: 12,
  },

  detailImage: {
    width: '100%',
    height: 190,
    borderRadius: 18,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 14,
    color: '#777777',
    fontSize: 14,
  },

  errorTitle: {
    color: '#29251E',
    fontSize: 18,
    fontWeight: '800',
  },

  errorMessage: {
    marginTop: 8,
    color: '#777777',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 13,
    backgroundColor: '#3F7D46',
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
