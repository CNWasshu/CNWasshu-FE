import { Image } from 'expo-image';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { ActivityDetailResponse } from '@/types/activity';

type ActivityDetailHeroProps = {
  activity: ActivityDetailResponse;
};

export function ActivityDetailHero({
  activity,
}: ActivityDetailHeroProps) {
  return (
    <View>
      {activity.thumbnail ? (
        <Image
          source={{
            uri: activity.thumbnail,
          }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderEmoji}>
            🌿
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.tags}>
          <View style={styles.regionTag}>
            <Text style={styles.regionText}>
              {activity.regionName}
            </Text>
          </View>

          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>
              {activity.categoryName}
            </Text>
          </View>

          {activity.todayAvailable === true && (
            <View style={styles.todayTag}>
              <Text style={styles.todayText}>
                당일 참여 가능
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>
          {activity.title}
        </Text>

        {activity.shortDescription && (
          <Text style={styles.description}>
            {activity.shortDescription}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 190,
    borderRadius: 22,
  },

  placeholder: {
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#E8F5E4',
  },

  placeholderEmoji: {
    fontSize: 50,
  },

  content: {
    paddingTop: 14,
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  regionTag: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#E7F4E2',
  },

  regionText: {
    color: '#3F7D46',
    fontSize: 10,
    fontWeight: '900',
  },

  categoryTag: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F0E6D3',
  },

  categoryText: {
    color: '#6B5730',
    fontSize: 10,
    fontWeight: '900',
  },

  todayTag: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#FFF0D7',
  },

  todayText: {
    color: '#A66400',
    fontSize: 10,
    fontWeight: '900',
  },

  title: {
    marginTop: 11,
    color: '#29251E',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.4,
  },

  description: {
    marginTop: 6,
    color: '#766F63',
    fontSize: 12,
    lineHeight: 19,
  },
});