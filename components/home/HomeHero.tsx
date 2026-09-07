import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type HomeHeroProps = {
  onAiRecommend: () => void;
  onPromotionPress: () => void;
  onBookmarkPress: () => void;
  onMyPagePress: () => void;
  onNotificationPress: () => void;
  unreadNotificationCount: number;
};

const BANNER_COUNT = 3;
const SWIPE_THRESHOLD = 50;

export function HomeHero({
  onAiRecommend,
  onPromotionPress,
  onBookmarkPress,
  onMyPagePress,
  onNotificationPress,
  unreadNotificationCount,
}: HomeHeroProps) {
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

  const moveToBanner = (
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
  };

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
      [translateX]
    );

  return (
    <View style={styles.hero}>
      <View style={styles.statusRow}>
        <Text style={styles.statusTitle}>
          충남 체험 백과사전
        </Text>

        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="알림함"
            style={styles.headerButton}
            onPress={
              onNotificationPress
            }
          >
            <Text style={styles.headerIcon}>
              🔔
            </Text>

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
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="마이페이지"
            style={styles.headerButton}
            onPress={
              onMyPagePress
            }
          >
            <Text style={styles.headerIcon}>
              👤
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="장바구니"
            style={styles.headerButton}
            onPress={
              onBookmarkPress
            }
          >
            <Text style={styles.headerIcon}>
              ♡
            </Text>
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
                  styles.introCard,
                ]}
              >
                <View
                  style={
                    styles.bannerBadge
                  }
                >
                  <Text
                    style={
                      styles.bannerBadgeText
                    }
                  >
                    충남왔슈
                  </Text>
                </View>

                <View
                  style={
                    styles.introContent
                  }
                >
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
                  styles.aiCard,
                ]}
              >
                <View
                  style={
                    styles.bannerBadge
                  }
                >
                  <Text
                    style={
                      styles.bannerBadgeText
                    }
                  >
                    AI 추천
                  </Text>
                </View>

                <Text
                  style={
                    styles.aiTitle
                  }
                >
                  어디 갈지
                  {'\n'}
                  고민된다면?
                </Text>

                <Text
                  style={
                    styles.aiDescription
                  }
                >
                  여행 조건에 맞는
                  충남 코스를 AI에게
                  추천받아보세요.
                </Text>

                <Pressable
                  accessibilityRole="button"
                  style={
                    styles.aiButton
                  }
                  onPress={
                    onAiRecommend
                  }
                >
                  <Text
                    style={
                      styles.aiButtonText
                    }
                  >
                    AI 추천받기
                  </Text>
                </Pressable>
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
                  styles.promotionCard,
                ]}
              >
                <View
                  style={
                    styles.promotionTop
                  }
                >
                  <View
                    style={
                      styles.promotionBadge
                    }
                  >
                    <Text
                      style={
                        styles.promotionBadgeText
                      }
                    >
                      이번 주 추천 지역
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.promotionEmoji
                    }
                  >
                    🌶️
                  </Text>
                </View>

                <Text
                  style={
                    styles.promotionTitle
                  }
                >
                  이번 주,
                  {'\n'}
                  청양 어때요?
                </Text>

                <Text
                  style={
                    styles.promotionDescription
                  }
                >
                  청양고추로 유명한
                  청양에서 즐기는
                  {'\n'}
                  한적하고 특별한
                  농촌 여행
                </Text>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="청양 체험 둘러보기"
                  style={
                    styles.promotionAction
                  }
                  onPress={
                    onPromotionPress
                  }
                >
                  <Text
                    style={
                      styles.promotionActionText
                    }
                  >
                    청양 체험 둘러보기
                  </Text>

                  <Text
                    style={
                      styles.promotionArrow
                    }
                  >
                    →
                  </Text>
                </Pressable>
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
  );
}

const styles =
  StyleSheet.create({
    hero: {
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor:
        '#4C884D',
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
    },

    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    statusTitle: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
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

    headerIcon: {
      color: '#FFFFFF',
      fontSize: 23,
      fontWeight: '700',
      lineHeight: 25,
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
      borderColor:
        '#4C884D',
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
    },

    introCard: {
      backgroundColor:
        'rgba(255, 255, 255, 0.15)',
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

    introContent: {
      flex: 1,
      justifyContent:
        'center',
      paddingBottom: 10,
    },

    introTitle: {
      color: '#FFFFFF',
      fontSize: 27,
      fontWeight: '900',
      letterSpacing: -0.8,
      lineHeight: 34,
    },

    introDescription: {
      marginTop: 14,
      color:
        'rgba(255, 255, 255, 0.92)',
      fontSize: 13,
      lineHeight: 20,
    },

    aiCard: {
      backgroundColor:
        '#3F7447',
    },

    aiTitle: {
      marginTop: 18,
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

    aiButton: {
      position: 'absolute',
      left: 20,
      bottom: 20,
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
      backgroundColor:
        '#DDEEDB',
    },

    promotionTop: {
      flexDirection: 'row',
      alignItems:
        'flex-start',
      justifyContent:
        'space-between',
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

    promotionEmoji: {
      fontSize: 35,
    },

    promotionTitle: {
      marginTop: 12,
      color: '#315F38',
      fontSize: 26,
      fontWeight: '900',
      letterSpacing: -0.7,
      lineHeight: 32,
    },

    promotionDescription: {
      marginTop: 8,
      color: '#55725A',
      fontSize: 12,
      lineHeight: 18,
    },

    promotionAction: {
      position: 'absolute',
      left: 20,
      bottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 6,
      paddingRight: 8,
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