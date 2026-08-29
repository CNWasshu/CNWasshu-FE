import { Image } from 'expo-image';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { BookmarkResponse } from '@/types/bookmark';

interface BookmarkCardProps {
  bookmark: BookmarkResponse;
  onPress: () => void;
  onRemove: () => void;
}

export function BookmarkCard({
  bookmark,
  onPress,
  onRemove,
}: BookmarkCardProps) {
  const isActivity =
    bookmark.type === 'ACTIVITY';

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      {bookmark.thumbnail ? (
        <Image
          source={{
            uri: bookmark.thumbnail,
          }}
          style={styles.image}
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
        accessibilityLabel="장바구니에서 삭제"
        style={styles.heartButton}
        onPress={(event) => {
          event.stopPropagation();
          onRemove();
        }}
      >
        <Text style={styles.heartIcon}>
          ♥
        </Text>
      </Pressable>

      <View style={styles.typeBadge}>
        <Text style={styles.typeBadgeText}>
          {isActivity ? '체험' : '맛집'}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.tagList}>
          <View
            style={[
              styles.tag,
              styles.regionTag,
            ]}
          >
            <Text
              style={styles.regionTagText}
              numberOfLines={1}
            >
              {bookmark.regionName}
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
              numberOfLines={1}
            >
              {bookmark.categoryName}
            </Text>
          </View>
        </View>

        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {bookmark.title}
        </Text>

        {(bookmark.operatingStartTime ||
          bookmark.operatingEndTime) && (
          <Text
            style={styles.operatingTime}
            numberOfLines={1}
          >
            🕒 {formatOperatingTime(bookmark)}
          </Text>
        )}

        <View style={styles.footer}>
          {isActivity &&
          bookmark.reservationRequired === true ? (
            <Text style={styles.reservationText}>
              예약 필요
            </Text>
          ) : (
            <Text style={styles.detailHint}>
              눌러서 상세보기
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

function formatOperatingTime(
  bookmark: BookmarkResponse
) {
  const start =
    bookmark.operatingStartTime?.slice(0, 5);

  const end =
    bookmark.operatingEndTime?.slice(0, 5);

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
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  image: {
    width: '100%',
    height: 110,
  },

  imagePlaceholder: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E4',
  },

  placeholderEmoji: {
    fontSize: 38,
  },

  heartButton: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },

  heartIcon: {
    color: '#E64A67',
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 21,
  },

  typeBadge: {
    position: 'absolute',
    top: 79,
    left: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },

  typeBadgeText: {
    color: '#3F7D46',
    fontSize: 9,
    fontWeight: '900',
  },

  content: {
    padding: 11,
  },

  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },

  tag: {
    maxWidth: '100%',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 999,
  },

  regionTag: {
    backgroundColor: '#E7F4E2',
  },

  regionTagText: {
    color: '#3F7D46',
    fontSize: 9,
    fontWeight: '900',
  },

  categoryTag: {
    backgroundColor: '#F0E6D3',
  },

  categoryTagText: {
    color: '#6B5730',
    fontSize: 9,
    fontWeight: '900',
  },

  title: {
    minHeight: 38,
    color: '#29251E',
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 19,
    letterSpacing: -0.3,
  },

  operatingTime: {
    marginTop: 6,
    color: '#6F6A60',
    fontSize: 10,
  },

  footer: {
    minHeight: 18,
    marginTop: 9,
    justifyContent: 'center',
  },

  reservationText: {
    color: '#A66400',
    fontSize: 10,
    fontWeight: '800',
  },

  detailHint: {
    color: '#8A8378',
    fontSize: 9,
  },
});