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
import { PAGE_LAYOUT } from '@/constants/layout';
import type { ActivityDetailResponse } from '@/types/activity';

type ActivityDetailContentProps = {
  activity: ActivityDetailResponse | null;
  loading: boolean;
  errorMessage: string;

  isBookmarked: boolean;

  onBack: () => void;
  onRetry: () => void;
  onBookmarkPress: () => void;
  onReservationPress: () => void;
};

export function ActivityDetailContent({
  activity,
  loading,
  errorMessage,
  isBookmarked,
  onBack,
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
          <View style={styles.banner}>
            <Text style={styles.bannerStatusTitle}>
              체험 상세
            </Text>

            <Text style={styles.bannerTitle}>
              {activity.title}
            </Text>

            <Text style={styles.bannerDescription}>
              체험 내용, 위치, 전화번호, 예약 가능 여부를
              확인할 수 있어요.
            </Text>
          </View>

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

            <Pressable
              accessibilityRole="button"
              style={styles.backButton}
              onPress={onBack}
            >
              <Text style={styles.backButtonText}>
                목록으로 돌아가기
              </Text>
            </Pressable>

            {activity.description && (
              <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>
                  체험 소개
                </Text>

                <Text style={styles.description}>
                  {activity.description}
                </Text>
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
    backgroundColor: '#FFFAF1',
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    backgroundColor: '#FFFAF1',
  },

  screen: {
    width: '100%',
    flex: 1,
    backgroundColor: '#FFFAF1',
  },

  banner: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
    backgroundColor: '#4C884D',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  bannerStatusTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  bannerTitle: {
    marginTop: 18,
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 32,
    letterSpacing: -0.7,
  },

  bannerDescription: {
    marginTop: 7,
    color: 'rgba(255, 255, 255, 0.93)',
    fontSize: 13,
    lineHeight: 20,
  },

  content: {
    width: '100%',
    maxWidth: PAGE_LAYOUT.desktopMaxWidth,
    alignSelf: 'center',
    padding: 18,
    paddingBottom: 40,
  },

  backButton: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#C7DFBE',
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },

  backButtonText: {
    color: '#3F7D46',
    fontSize: 13,
    fontWeight: '900',
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

  description: {
    marginTop: 12,
    color: '#5F5A51',
    fontSize: 13,
    lineHeight: 22,
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
