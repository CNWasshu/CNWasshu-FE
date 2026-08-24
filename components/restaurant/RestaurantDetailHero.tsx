import { Image } from 'expo-image';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { RestaurantDetailResponse } from '@/types/restaurant';

type RestaurantDetailHeroProps = {
  restaurant: RestaurantDetailResponse;
};

export function RestaurantDetailHero({
  restaurant,
}: RestaurantDetailHeroProps) {
  return (
    <View>
      {restaurant.thumbnail ? (
        <Image
          source={{
            uri: restaurant.thumbnail,
          }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderEmoji}>
            🍽️
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.tags}>
          <View style={styles.regionTag}>
            <Text style={styles.regionText}>
              {restaurant.regionName}
            </Text>
          </View>

          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>
              {restaurant.categoryName}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>
          {restaurant.name}
        </Text>

        {restaurant.shortDescription && (
          <Text style={styles.description}>
            {restaurant.shortDescription}
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
    backgroundColor: '#FFF0D7',
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