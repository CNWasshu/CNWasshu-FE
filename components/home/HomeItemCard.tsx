import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { memo } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { PAGE_LAYOUT } from '@/constants/layout';
import type { HomeItem } from '@/types/home';

type HomeItemCardProps = {
  item: HomeItem;
  isBookmarked: boolean;
  onPress: (item: HomeItem) => void;
  onBookmarkPress: (item: HomeItem) => void;
};

export const HomeItemCard = memo(
  function HomeItemCard({
    item,
    isBookmarked,
    onPress,
    onBookmarkPress,
  }: HomeItemCardProps) {
    const { width } = useWindowDimensions();

    const isDesktopWeb =
      Platform.OS === 'web' &&
      width >= PAGE_LAYOUT.desktopNavigationBreakpoint;

    const isActivity =
      item.type === 'ACTIVITY';

    const showMaxParticipants =
      isActivity &&
      item.reservationRequired === true &&
      item.maxParticipants !== null &&
      item.maxParticipants > 0;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${item.title} 상세 보기`}
        style={({ pressed }) => [
          styles.card,
          isDesktopWeb && styles.cardDesktop,
          pressed && styles.cardPressed,
        ]}
        onPress={() => onPress(item)}
      >
        {item.thumbnail ? (
          <Image
            source={{
              uri: item.thumbnail,
            }}
            style={[
              styles.cardImage,
              isDesktopWeb && styles.cardImageDesktop,
            ]}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              isDesktopWeb &&
                styles.imagePlaceholderDesktop,
            ]}
          >
            <Text
              style={styles.placeholderEmoji}
            >
              {isActivity ? '🌿' : '🍽️'}
            </Text>
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isBookmarked
              ? '장바구니에서 삭제'
              : '장바구니에 담기'
          }
          style={[
            styles.heartButton,
            isDesktopWeb &&
              styles.heartButtonDesktop,
          ]}
          onPress={(event) => {
            event.stopPropagation();
            onBookmarkPress(item);
          }}
        >
          <Text
            style={[
              styles.heartIcon,
              isBookmarked &&
                styles.bookmarkedHeartIcon,
            ]}
          >
            {isBookmarked ? '♥' : '♡'}
          </Text>
        </Pressable>

        <View
          style={[
            styles.typeBadge,
            isDesktopWeb &&
              styles.typeBadgeDesktop,
          ]}
        >
          <Text style={styles.typeBadgeText}>
            {isActivity ? '체험' : '맛집'}
          </Text>
        </View>

        <View
          style={[
            styles.cardContent,
            isDesktopWeb &&
              styles.cardContentDesktop,
          ]}
        >
          <View
            style={[
              styles.tagList,
              isDesktopWeb &&
                styles.tagListDesktop,
            ]}
          >
            <View
              style={[
                styles.tag,
                styles.regionTag,
              ]}
            >
              <Text
                style={styles.regionTagText}
              >
                {item.regionName}
              </Text>
            </View>

            <View
              style={[
                styles.tag,
                styles.categoryTag,
              ]}
            >
              <Text
                style={styles.categoryTagText}
              >
                {item.categoryName}
              </Text>
            </View>

            {isActivity &&
              item.weatherTags.length > 0 &&
              item.weatherTags
                .slice(0, 1)
                .map((tag) => (
                  <View
                    key={tag}
                    style={[
                      styles.tag,
                      styles.weatherTag,
                    ]}
                  >
                    <Text
                      style={
                        styles.weatherTagText
                      }
                    >
                      {tag}
                    </Text>
                  </View>
                ))}

            {item.todayAvailable === true && (
              <View
                style={[
                  styles.tag,
                  styles.todayTag,
                ]}
              >
                <Text
                  style={styles.todayTagText}
                >
                  당일 참여 O
                </Text>
              </View>
            )}
          </View>

          <Text
            style={[
              styles.cardTitle,
              isDesktopWeb &&
                styles.cardTitleDesktop,
            ]}
          >
            {item.title}
          </Text>

          {(item.operatingStartTime ||
            item.operatingEndTime) && (
            <Text
              style={styles.operatingTime}
            >
              🕒 {formatOperatingTime(item)}
            </Text>
          )}

          {item.shortDescription && (
            <Text
              style={styles.cardDescription}
              numberOfLines={2}
            >
              {item.shortDescription}
            </Text>
          )}

          {item.tags.length > 0 && (
            <View style={styles.extraTagList}>
              {item.tags
                .slice(0, 3)
                .map((tag) => (
                  <Text
                    key={tag}
                    style={styles.extraTagText}
                  >
                    #{tag}
                  </Text>
                ))}
            </View>
          )}

          <View
            style={[
              styles.cardFooter,
              isDesktopWeb &&
                styles.cardFooterDesktop,
            ]}
          >
            {item.reservationRequired ===
            true ? (
              <View
                style={styles.reservationInfo}
              >
                {isDesktopWeb ? (
                  <Ionicons
                    color="#8A7450"
                    name="calendar-outline"
                    size={15}
                  />
                ) : null}

                <Text
                  style={[
                    styles.reservationText,
                    isDesktopWeb &&
                      styles.reservationTextDesktop,
                  ]}
                >
                  예약 필요
                </Text>

                {showMaxParticipants && (
                  <Text
                    style={[
                      styles.maxParticipantsText,
                      isDesktopWeb &&
                        styles.maxParticipantsTextDesktop,
                    ]}
                  >
                    · 최대{' '}
                    {item.maxParticipants}명
                  </Text>
                )}
              </View>
            ) : (
              <View />
            )}

            <Pressable
              accessibilityRole="button"
              style={[
                styles.detailButton,
                isDesktopWeb &&
                  styles.detailButtonDesktop,
              ]}
              onPress={(event) => {
                event.stopPropagation();
                onPress(item);
              }}
            >
              <Text
                style={styles.detailButtonText}
              >
                상세 보기
                {isDesktopWeb ? '  →' : ''}
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  }
);

function formatOperatingTime(
  item: HomeItem
) {
  const start =
    item.operatingStartTime?.slice(
      0,
      5
    );

  const end =
    item.operatingEndTime?.slice(
      0,
      5
    );

  if (start && end) {
    return `${start} ~ ${end}`;
  }

  if (start) {
    return `${start}부터`;
  }

  if (end) {
    return `${end}까지`;
  }

  return '';
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E0D5',
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },

  cardPressed: {
    opacity: 0.96,
  },

  cardDesktop: {
    flexDirection: 'row',
    minHeight: 240,
  },

  cardImage: {
    width: '100%',
    height: 150,
  },

  cardImageDesktop: {
    height: 240,
    width: '38%',
  },

  imagePlaceholder: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDF3EA',
  },

  imagePlaceholderDesktop: {
    height: 240,
    width: '38%',
  },

  placeholderEmoji: {
    fontSize: 48,
  },

  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor:
      'rgba(255,255,255,0.94)',
  },

  heartButtonDesktop: {
    right: 16,
    top: 16,
  },

  heartIcon: {
    color: '#3F7045',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 26,
  },

  bookmarkedHeartIcon: {
    color: '#E64A67',
  },

  typeBadge: {
    position: 'absolute',
    top: 105,
    left: 14,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },

  typeBadgeDesktop: {
    left: 14,
    top: 14,
  },

  typeBadgeText: {
    color: '#3F7045',
    fontSize: 12,
    fontWeight: '900',
  },

  cardContent: {
    padding: 14,
  },

  cardContentDesktop: {
    flex: 1,
    paddingHorizontal: 22,
    paddingVertical: 20,
  },

  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 9,
  },

  tagListDesktop: {
    paddingRight: 46,
  },

  tag: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
  },

  regionTag: {
    backgroundColor: '#EDF3EA',
  },

  regionTagText: {
    color: '#3F7045',
    fontSize: 12,
    fontWeight: '900',
  },

  categoryTag: {
    backgroundColor: '#EEE8DC',
  },

  categoryTagText: {
    color: '#6B5730',
    fontSize: 12,
    fontWeight: '900',
  },

  weatherTag: {
    backgroundColor: '#EAF1FF',
  },

  weatherTagText: {
    color: '#446CA8',
    fontSize: 12,
    fontWeight: '800',
  },

  todayTag: {
    backgroundColor: '#FFF0D7',
  },

  todayTagText: {
    color: '#A66400',
    fontSize: 12,
    fontWeight: '900',
  },

  cardTitle: {
    color: '#262822',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
  },

  cardTitleDesktop: {
    fontSize: 20,
  },

  operatingTime: {
    marginTop: 7,
    color: '#6F6A60',
    fontSize: 13,
  },

  cardDescription: {
    marginTop: 9,
    color: '#6F7068',
    fontSize: 14,
    lineHeight: 20,
  },

  extraTagList: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  extraTagText: {
    color: '#6F7068',
    fontSize: 12,
  },

  cardFooter: {
    minHeight: 39,
    marginTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardFooterDesktop: {
    marginTop: 'auto',
    paddingTop: 14,
  },

  reservationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  reservationText: {
    color: '#8A7450',
    fontSize: 13,
    fontWeight: '700',
  },

  reservationTextDesktop: {
    fontWeight: '800',
  },

  maxParticipantsText: {
    color: '#8A7450',
    fontSize: 13,
    fontWeight: '700',
  },

  maxParticipantsTextDesktop: {
    color: '#9A9286',
    fontWeight: '600',
  },

  detailButton: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#C7DFBE',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  detailButtonDesktop: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingRight: 0,
  },

  detailButtonText: {
    color: '#3F7045',
    fontSize: 14,
    fontWeight: '900',
  },
});