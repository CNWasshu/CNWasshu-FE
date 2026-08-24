import { Image } from 'expo-image';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { HomeItem } from '@/types/home';

type HomeItemCardProps = {
  item: HomeItem;
  isBookmarked: boolean;
  onPress: () => void;
  onBookmarkPress: () => void;
};

export function HomeItemCard({
  item,
  isBookmarked,
  onPress,
  onBookmarkPress,
}: HomeItemCardProps) {
  const isActivity = item.type === 'ACTIVITY';

  return (
    <View style={styles.card}>
      {item.thumbnail ? (
        <Image
          source={{
            uri: item.thumbnail,
          }}
          style={styles.cardImage}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderEmoji}>
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
        style={styles.heartButton}
        onPress={(event) => {
          event.stopPropagation();
          onBookmarkPress();
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

      <View style={styles.typeBadge}>
        <Text style={styles.typeBadgeText}>
          {isActivity ? '체험' : '맛집'}
        </Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.tagList}>
          <View
            style={[
              styles.tag,
              styles.regionTag,
            ]}
          >
            <Text style={styles.regionTagText}>
              {item.regionName}
            </Text>
          </View>

          <View
            style={[
              styles.tag,
              styles.categoryTag,
            ]}
          >
            <Text style={styles.categoryTagText}>
              {item.categoryName}
            </Text>
          </View>

          {item.todayAvailable === true && (
            <View
              style={[
                styles.tag,
                styles.todayTag,
              ]}
            >
              <Text style={styles.todayTagText}>
                당일 참여 O
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.cardTitle}>
          {item.title}
        </Text>

        {(item.operatingStartTime ||
          item.operatingEndTime) && (
          <Text style={styles.operatingTime}>
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

        {item.weatherTags.length > 0 && (
          <View style={styles.weatherTagList}>
            {item.weatherTags
              .slice(0, 3)
              .map((tag) => (
                <View
                  key={tag}
                  style={[
                    styles.tag,
                    styles.weatherTag,
                  ]}
                >
                  <Text style={styles.weatherTagText}>
                    {tag}
                  </Text>
                </View>
              ))}
          </View>
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

        <View style={styles.cardFooter}>
          {item.reservationRequired === true ? (
            <Text style={styles.reservationText}>
              예약 필요
            </Text>
          ) : (
            <View />
          )}

          <Pressable
            accessibilityRole="button"
            style={styles.detailButton}
            onPress={onPress}
          >
            <Text style={styles.detailButtonText}>
              상세 보기
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function formatOperatingTime(
  item: HomeItem
) {
  const start =
    item.operatingStartTime?.slice(0, 5);

  const end =
    item.operatingEndTime?.slice(0, 5);

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
    borderColor: '#EFE3CE',
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },

  cardImage: {
    width: '100%',
    height: 150,
  },

  imagePlaceholder: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E4',
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

  heartIcon: {
    color: '#3F7D46',
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

  typeBadgeText: {
    color: '#3F7D46',
    fontSize: 11,
    fontWeight: '900',
  },

  cardContent: {
    padding: 14,
  },

  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 9,
  },

  tag: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
  },

  regionTag: {
    backgroundColor: '#E7F4E2',
  },

  regionTagText: {
    color: '#3F7D46',
    fontSize: 10,
    fontWeight: '900',
  },

  categoryTag: {
    backgroundColor: '#F0E6D3',
  },

  categoryTagText: {
    color: '#6B5730',
    fontSize: 10,
    fontWeight: '900',
  },

  todayTag: {
    backgroundColor: '#FFF0D7',
  },

  todayTagText: {
    color: '#A66400',
    fontSize: 10,
    fontWeight: '900',
  },

  cardTitle: {
    color: '#29251E',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
  },

  operatingTime: {
    marginTop: 7,
    color: '#6F6A60',
    fontSize: 12,
  },

  cardDescription: {
    marginTop: 9,
    color: '#777777',
    fontSize: 12,
    lineHeight: 18,
  },

  weatherTagList: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },

  weatherTag: {
    backgroundColor: '#EAF1FF',
  },

  weatherTagText: {
    color: '#446CA8',
    fontSize: 10,
    fontWeight: '800',
  },

  extraTagList: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  extraTagText: {
    color: '#777777',
    fontSize: 11,
  },

  cardFooter: {
    minHeight: 39,
    marginTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  reservationText: {
    color: '#A66400',
    fontSize: 11,
    fontWeight: '800',
  },

  detailButton: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#C7DFBE',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  detailButtonText: {
    color: '#3F7D46',
    fontSize: 12,
    fontWeight: '900',
  },
});