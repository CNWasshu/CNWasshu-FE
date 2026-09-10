import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Animated,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';

import { CourseColors } from '@/constants/course-colors';
import { PAGE_LAYOUT } from '@/constants/layout';

type HomeHeroProps = {
  onAiRecommend: () => void;
  onPromotionPress: () => void;
  onBookmarkPress: () => void;
  onNotificationPress: () => void;
  unreadNotificationCount: number;
};

const BANNER_COUNT = 3;
const SWIPE_THRESHOLD = 50;
const HERO_IMAGES = {
  discover: require('@/assets/images/home-hero/discover.png'),
  aiCourse: require('@/assets/images/home-hero/ai-course.png'),
  cheongyang: require('@/assets/images/home-hero/cheongyang.png'),
} as const;

export function HomeHero({
  onAiRecommend,
  onPromotionPress,
  onBookmarkPress,
  onNotificationPress,
  unreadNotificationCount,
}: HomeHeroProps) {
  const { width } = useWindowDimensions();
  const isDesktopWeb =
    Platform.OS === 'web' && width >= PAGE_LAYOUT.desktopNavigationBreakpoint;
  const [
    activeBannerIndex,
    setActiveBannerIndex,
  ] = useState(0);

  const [
    bannerWidth,
    setBannerWidth,
  ] = useState(0);

  const translateX =
    useRef(
      new Animated.Value(0)
    ).current;

  const activeIndexRef =
    useRef(0);

  const bannerWidthRef =
    useRef(0);

  useEffect(() => {
    activeIndexRef.current =
      activeBannerIndex;
  }, [activeBannerIndex]);

  useEffect(() => {
    bannerWidthRef.current =
      bannerWidth;

    if (!bannerWidth) {
      return;
    }

    translateX.setValue(
      -activeIndexRef.current *
        bannerWidth
    );
  }, [
    bannerWidth,
    translateX,
  ]);

  const moveToBanner = useCallback((
    index: number
  ) => {
    const targetIndex =
      Math.max(
        0,
        Math.min(
          BANNER_COUNT - 1,
          index
        )
      );

    activeIndexRef.current =
      targetIndex;

    setActiveBannerIndex(
      targetIndex
    );

    Animated.spring(
      translateX,
      {
        toValue:
          -targetIndex *
          bannerWidthRef.current,
        useNativeDriver: false,
        friction: 9,
        tension: 80,
      }
    ).start();
  }, [translateX]);

  const panResponder =
    useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder:
            () => false,

          onMoveShouldSetPanResponder:
            (_, gestureState) => {
              const horizontal =
                Math.abs(
                  gestureState.dx
                );

              const vertical =
                Math.abs(
                  gestureState.dy
                );

              return (
                horizontal > 6 &&
                horizontal > vertical
              );
            },

          onPanResponderGrant:
            () => {
              translateX.stopAnimation();
            },

          onPanResponderMove: (
            _,
            gestureState
          ) => {
            const width =
              bannerWidthRef.current;

            if (!width) {
              return;
            }

            const currentIndex =
              activeIndexRef.current;

            const basePosition =
              -currentIndex *
              width;

            let dragX =
              gestureState.dx;

            if (
              currentIndex === 0 &&
              dragX > 0
            ) {
              dragX *= 0.25;
            }

            if (
              currentIndex ===
                BANNER_COUNT - 1 &&
              dragX < 0
            ) {
              dragX *= 0.25;
            }

            translateX.setValue(
              basePosition +
                dragX
            );
          },

          onPanResponderRelease: (
            _,
            gestureState
          ) => {
            const currentIndex =
              activeIndexRef.current;

            const swipedLeft =
              gestureState.dx <=
                -SWIPE_THRESHOLD ||
              gestureState.vx <=
                -0.35;

            const swipedRight =
              gestureState.dx >=
                SWIPE_THRESHOLD ||
              gestureState.vx >=
                0.35;

            if (swipedLeft) {
              moveToBanner(
                currentIndex + 1
              );
              return;
            }

            if (swipedRight) {
              moveToBanner(
                currentIndex - 1
              );
              return;
            }

            moveToBanner(
              currentIndex
            );
          },

          onPanResponderTerminate:
            () => {
              moveToBanner(
                activeIndexRef.current
              );
            },
        }),
      [moveToBanner, translateX]
    );

  return (
    <View style={[styles.hero, isDesktopWeb && styles.heroDesktop]}>
      <View style={styles.heroInner}>
      <View style={styles.statusRow}>
        <View style={styles.statusTitleRow}>
          <Ionicons color="#FFFFFF" name="leaf-outline" size={isDesktopWeb ? 19 : 16} />
          <Text style={[styles.statusTitle, isDesktopWeb && styles.statusTitleDesktop]}>
            충남 체험 백과사전
          </Text>
        </View>

        <View style={styles.headerActions}>
          {!isDesktopWeb ? <Pressable
            accessibilityRole="button"
            accessibilityLabel="알림함"
            style={styles.headerButton}
            onPress={
              onNotificationPress
            }
          >
            <Ionicons color="#FFFFFF" name="notifications-outline" size={21} />

            {unreadNotificationCount >
            0 ? (
              <View
                style={
                  styles.notificationBadge
                }
              >
                <Text
                  style={
                    styles.notificationBadgeText
                  }
                >
                  {
                    unreadNotificationCount
                  }
                </Text>
              </View>
            ) : null}
          </Pressable> : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="담은 장소 목록 열기"
            style={[styles.headerButton, isDesktopWeb && styles.bookmarkButtonDesktop]}
            onPress={
              onBookmarkPress
            }
          >
            <Ionicons color="#FFFFFF" name="heart-outline" size={21} />
            {isDesktopWeb ? <Text style={styles.bookmarkLabel}>담은 장소</Text> : null}
          </Pressable>
        </View>
      </View>

      <View
        style={
          styles.bannerViewport
        }
        onLayout={(event) => {
          setBannerWidth(
            event.nativeEvent.layout
              .width
          );
        }}
        {...panResponder.panHandlers}
      >
        {bannerWidth > 0 ? (
          <Animated.View
            style={[
              styles.bannerTrack,
              {
                width:
                  bannerWidth *
                  BANNER_COUNT,
                transform: [
                  {
                    translateX,
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.bannerSlide,
                {
                  width:
                    bannerWidth,
                },
              ]}
            >
              <View
                style={[
                styles.bannerCard,
                  isDesktopWeb && styles.bannerCardDesktop,
                  styles.introCard,
                ]}
              >
                <View
                  style={[styles.bannerCopy, isDesktopWeb && styles.bannerCopyDesktop]}
                >
                  <View style={styles.bannerBadge}>
                    <Text style={styles.bannerBadgeText}>충남왔슈</Text>
                  </View>
                  <Text
                    style={
                      styles.introTitle
                    }
                  >
                    충남에서 뭐하지?
                    {'\n'}
                    충남왔슈!
                  </Text>

                  <Text
                    style={
                      styles.introDescription
                    }
                  >
                    마음에 드는 체험과
                    맛집을 둘러보고
                    {'\n'}
                    나만의 충남 여행을
                    만들어보세요.
                  </Text>
                </View>
                <Image
                  accessibilityLabel="충남의 바다와 농촌, 백제 문화유산을 여행하는 가족"
                  contentFit="contain"
                  source={HERO_IMAGES.discover}
                  style={[
                    styles.bannerArtwork,
                    isDesktopWeb ? styles.bannerArtworkDesktop : styles.bannerArtworkMobile,
                  ]}
                />
              </View>
            </View>

            <View
              style={[
                styles.bannerSlide,
                {
                  width:
                    bannerWidth,
                },
              ]}
            >
              <View
                style={[
                styles.bannerCard,
                  isDesktopWeb && styles.bannerCardDesktop,
                  styles.aiCard,
                ]}
              >
                <View style={[styles.bannerCopy, isDesktopWeb && styles.bannerCopyDesktop]}>
                  <View style={styles.bannerBadge}>
                    <Text style={styles.bannerBadgeText}>AI 추천</Text>
                  </View>
                  <Text style={styles.aiTitle}>어디 갈지{'\n'}고민된다면?</Text>
                  <Text style={styles.aiDescription}>
                    날짜와 취향만 알려주면{`\n`}AI가 충남 여행 코스를 만들어드려요.
                  </Text>
                  <Pressable accessibilityRole="button" style={styles.bannerButton} onPress={onAiRecommend}>
                    <Text style={styles.aiButtonText}>AI 코스 만들기</Text>
                  </Pressable>
                </View>
                <Image
                  accessibilityLabel="충남의 명소와 체험, 맛집이 경로로 연결된 여행 지도"
                  contentFit="contain"
                  source={HERO_IMAGES.aiCourse}
                  style={[
                    styles.bannerArtwork,
                    isDesktopWeb ? styles.bannerArtworkDesktop : styles.bannerArtworkMobile,
                  ]}
                />
              </View>
            </View>

            <View
              style={[
                styles.bannerSlide,
                {
                  width:
                    bannerWidth,
                },
              ]}
            >
              <View
                style={[
                styles.bannerCard,
                  isDesktopWeb && styles.bannerCardDesktop,
                  styles.promotionCard,
                ]}
              >
                <View style={[styles.bannerCopy, isDesktopWeb && styles.bannerCopyDesktop]}>
                  <View style={styles.promotionBadge}>
                    <Text style={styles.promotionBadgeText}>이번 주 추천 지역</Text>
                  </View>
                  <Text style={styles.promotionTitle}>이번 주,{`\n`}청양 어때요?</Text>
                  <Text style={styles.promotionDescription}>
                    청양고추로 유명한 청양에서{`\n`}특별한 농촌 체험을 만나보세요.
                  </Text>
                  <Pressable
                    accessibilityLabel="청양 체험 둘러보기"
                    accessibilityRole="button"
                    style={styles.promotionAction}
                    onPress={onPromotionPress}>
                    <Text style={styles.promotionActionText}>청양 체험 둘러보기</Text>
                    <Text style={styles.promotionArrow}>→</Text>
                  </Pressable>
                </View>
                <Image
                  accessibilityLabel="청양고추를 수확하며 농촌 체험을 즐기는 여행자"
                  contentFit="contain"
                  source={HERO_IMAGES.cheongyang}
                  style={[
                    styles.bannerArtwork,
                    isDesktopWeb ? styles.bannerArtworkDesktop : styles.bannerArtworkMobile,
                  ]}
                />
              </View>
            </View>
          </Animated.View>
        ) : null}
      </View>

      <View
        style={
          styles.indicatorRow
        }
      >
        {[0, 1, 2].map(
          (index) => (
            <Pressable
              key={index}
              onPress={() =>
                moveToBanner(
                  index
                )
              }
            >
              <View
                style={[
                  styles.indicator,
                  activeBannerIndex ===
                    index &&
                    styles.indicatorActive,
                ]}
              />
            </Pressable>
          )
        )}
      </View>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    hero: {
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor: CourseColors.hero,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
    },

    heroDesktop: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      paddingHorizontal: 24,
      paddingTop: 20,
    },

    heroInner: {
      alignSelf: 'center',
      maxWidth: PAGE_LAYOUT.desktopHeroMaxWidth,
      width: '100%',
    },

    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    statusTitleRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 7,
    },

    statusTitle: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
    },

    statusTitleDesktop: {
      fontSize: 16,
      fontWeight: '900',
    },

    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    headerButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
      backgroundColor:
        'rgba(255, 255, 255, 0.18)',
      position: 'relative',
    },

    bookmarkButtonDesktop: {
      flexDirection: 'row',
      gap: 7,
      paddingHorizontal: 14,
      width: 'auto',
    },

    bookmarkLabel: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
    },

    notificationBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      minWidth: 16,
      height: 16,
      paddingHorizontal: 3,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        '#E25C3E',
      borderWidth: 1.5,
      borderColor: CourseColors.hero,
    },

    notificationBadgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '900',
      lineHeight: 12,
    },

    bannerViewport: {
      width: '100%',
      marginTop: 16,
      overflow: 'hidden',
      borderRadius: 24,
    },

    bannerTrack: {
      flexDirection: 'row',
    },

    bannerSlide: {
      flexShrink: 0,
    },

    bannerCard: {
      height: 264,
      padding: 20,
      borderRadius: 24,
      overflow: 'hidden',
      position: 'relative',
      flexDirection: 'row',
    },

    bannerCardDesktop: {
      height: 280,
      padding: 28,
    },

    introCard: {
      backgroundColor: '#659B69',
    },

    bannerBadge: {
      alignSelf:
        'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor:
        'rgba(255, 255, 255, 0.94)',
    },

    bannerBadgeText: {
      color: '#3F7D46',
      fontSize: 11,
      fontWeight: '900',
    },

    bannerCopy: {
      flex: 1,
      justifyContent: 'center',
      maxWidth: 480,
      zIndex: 2,
    },

    bannerCopyDesktop: {
      flexBasis: '52%',
      flexGrow: 0,
      paddingLeft: 4,
    },

    introTitle: {
      color: '#FFFFFF',
      fontSize: 27,
      fontWeight: '900',
      letterSpacing: -0.8,
      lineHeight: 34,
      marginTop: 20,
    },

    introDescription: {
      marginTop: 14,
      color:
        'rgba(255, 255, 255, 0.92)',
      fontSize: 13,
      lineHeight: 20,
    },

    aiCard: {
      backgroundColor: '#397446',
    },

    aiTitle: {
      marginTop: 20,
      color: '#FFFFFF',
      fontSize: 27,
      fontWeight: '900',
      letterSpacing: -0.8,
      lineHeight: 34,
    },

    aiDescription: {
      marginTop: 12,
      color:
        'rgba(255, 255, 255, 0.9)',
      fontSize: 13,
      lineHeight: 20,
    },

    bannerButton: {
      alignSelf: 'flex-start',
      marginTop: 18,
      paddingHorizontal: 16,
      paddingVertical: 11,
      borderRadius: 14,
      backgroundColor:
        '#FFFFFF',
    },

    aiButtonText: {
      color: '#3F7D46',
      fontSize: 12,
      fontWeight: '900',
    },

    promotionCard: {
      backgroundColor: '#6F9F68',
    },

    promotionBadge: {
      alignSelf:
        'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor:
        'rgba(255, 255, 255, 0.82)',
    },

    promotionBadgeText: {
      color: '#3F7D46',
      fontSize: 11,
      fontWeight: '900',
    },

    promotionTitle: {
      marginTop: 20,
      color: '#FFFFFF',
      fontSize: 26,
      fontWeight: '900',
      letterSpacing: -0.7,
      lineHeight: 32,
    },

    promotionDescription: {
      marginTop: 8,
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: 12,
      lineHeight: 18,
    },

    promotionAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
      marginTop: 17,
      paddingVertical: 7,
      paddingRight: 10,
      paddingLeft: 13,
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
    },

    promotionActionText: {
      color: '#3F7D46',
      fontSize: 12,
      fontWeight: '900',
    },

    promotionArrow: {
      color: '#3F7D46',
      fontSize: 16,
      fontWeight: '800',
    },

    bannerArtwork: {
      zIndex: 1,
    },

    bannerArtworkDesktop: {
      bottom: -40,
      height: 330,
      position: 'absolute',
      right: -6,
      width: '50%',
    },

    bannerArtworkMobile: {
      bottom: -18,
      height: 190,
      opacity: 0.32,
      position: 'absolute',
      right: -54,
      width: '58%',
    },

    indicatorRow: {
      marginTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'center',
      gap: 7,
    },

    indicator: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor:
        'rgba(255, 255, 255, 0.4)',
    },

    indicatorActive: {
      width: 20,
      backgroundColor:
        '#FFFFFF',
    },
  });
