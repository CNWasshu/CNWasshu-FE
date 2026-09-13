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

  const hasOperatingTime =
    bookmark.operatingStartTime ||
    bookmark.operatingEndTime;

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
          <Text style={styles.placeholderText}>
            이미지 준비 중
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

        <Text
          style={[
            styles.operatingTime,
            !hasOperatingTime &&
              styles.operatingTimeEmpty,
          ]}
          numberOfLines={1}
        >
          {hasOperatingTime
            ? formatOperatingTime(bookmark)
            : '운영시간 정보 없음'}
        </Text>

        <View style={styles.footer}>
          {isActivity ? (
            <Text
              style={[
                styles.reservationText,
                bookmark.reservationRequired ===
                  false &&
                  styles.reservationNotRequiredText,
                bookmark.reservationRequired ===
                  null &&
                styles.reservationUnknownText,
              ]}
            >
              {getReservationText(
                bookmark.reservationRequired
              )}
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
    bookmark.operatingStartTime?.slice(
      0,
      5
    );

  const end =
    bookmark.operatingEndTime?.slice(
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

function getReservationText(
  reservationRequired: boolean | null
) {
  if (reservationRequired === true) {
    return '예약 필요';
  }

  if (reservationRequired === false) {
    return '예약 불필요';
  }

  return '예약 정보 없음';
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#efe3ce',
    borderRadius: 18,
    backgroundColor: '#ffffff',
  },

  image: {
    width: '100%',
    height: 110,
  },

  imagePlaceholder: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f5e4',
  },

  placeholderText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#527557',
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
    backgroundColor:
      'rgba(255,255,255,0.94)',
  },

  heartIcon: {
    fontSize: 19,
    lineHeight: 21,
    fontWeight: '700',
    color: '#e64a67',
  },

  typeBadge: {
    position: 'absolute',
    top: 79,
    left: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#ffffff',
  },

  typeBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#3F7045',
  },

  content: {
    padding: 11,
  },

  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },

  tag: {
    maxWidth: '100%',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 999,
  },

  regionTag: {
    backgroundColor: '#e7f4e2',
  },

  regionTagText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#3F7045',
  },

  categoryTag: {
    backgroundColor: '#f0e6d3',
  },

  categoryTagText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6b5730',
  },

  title: {
    minHeight: 24,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
    color: '#262822',
  },

  operatingTime: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
    color: '#766749',
  },

  operatingTimeEmpty: {
    color: '#b4aca0',
  },

  footer: {
    minHeight: 18,
    marginTop: 4,
    justifyContent: 'center',
  },

  reservationText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#a66400',
  },

  reservationNotRequiredText: {
    color: '#6f6a60',
  },

  reservationUnknownText: {
    color: '#b4aca0',
  },

  detailHint: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8a8378',
  },
});