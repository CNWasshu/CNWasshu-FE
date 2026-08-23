import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { HomeItemType } from '@/types/home';

type HomeFilterSectionProps = {
  selectedType: HomeItemType;
  selectedRegion: string;
  selectedCategory: string;

  regions: string[];
  categories: string[];

  onSelectType: (type: HomeItemType) => void;
  onSelectRegion: (region: string) => void;
  onSelectCategory: (category: string) => void;
};

const TYPE_FILTERS: {
  label: string;
  value: HomeItemType;
  icon: string;
}[] = [
  {
    label: '체험',
    value: 'ACTIVITY',
    icon: '🧑‍🌾',
  },
  {
    label: '맛집',
    value: 'RESTAURANT',
    icon: '🍲',
  },
];

export function HomeFilterSection({
  selectedType,
  selectedRegion,
  selectedCategory,
  regions,
  categories,
  onSelectType,
  onSelectRegion,
  onSelectCategory,
}: HomeFilterSectionProps) {
  return (
    <>
      <View style={styles.typeFilter}>
        {TYPE_FILTERS.map((filter) => {
          const active =
            selectedType === filter.value;

          return (
            <Pressable
              key={filter.value}
              style={[
                styles.typeButton,
                active && styles.typeButtonActive,
              ]}
              onPress={() =>
                onSelectType(filter.value)
              }
            >
              <Text style={styles.typeIcon}>
                {filter.icon}
              </Text>

              <Text
                style={[
                  styles.typeButtonText,
                  active &&
                    styles.typeButtonTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.filterLabel}>
        지역
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.regionList}
      >
        {regions.map((region) => {
          const active =
            selectedRegion === region;

          return (
            <Pressable
              key={region}
              style={[
                styles.regionChip,
                active &&
                  styles.regionChipActive,
              ]}
              onPress={() =>
                onSelectRegion(region)
              }
            >
              <Text
                style={[
                  styles.regionChipText,
                  active &&
                    styles.regionChipTextActive,
                ]}
              >
                {region}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.filterLabel}>
        카테고리
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      >
        {categories.map((category) => {
          const active =
            selectedCategory === category;

          return (
            <Pressable
              key={category}
              style={styles.categoryButton}
              onPress={() =>
                onSelectCategory(category)
              }
            >
              <View
                style={[
                  styles.categoryIcon,
                  active &&
                    styles.categoryIconActive,
                ]}
              >
                <Text
                  style={styles.categoryEmoji}
                >
                  {getCategoryIcon(
                    category,
                    selectedType
                  )}
                </Text>
              </View>

              <Text
                style={[
                  styles.categoryText,
                  active &&
                    styles.categoryTextActive,
                ]}
                numberOfLines={1}
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </>
  );
}

function getCategoryIcon(
  categoryName: string,
  type: HomeItemType
) {
  if (categoryName === '전체') {
    return type === 'RESTAURANT'
      ? '🍽️'
      : '🌾';
  }

  if (
    categoryName.includes('한식') ||
    categoryName.includes('음식') ||
    categoryName.includes('맛집')
  ) {
    return '🍲';
  }

  if (
    categoryName.includes('카페') ||
    categoryName.includes('디저트')
  ) {
    return '☕';
  }

  if (
    categoryName.includes('농촌') ||
    categoryName.includes('체험')
  ) {
    return '🧑‍🌾';
  }

  if (
    categoryName.includes('축제') ||
    categoryName.includes('행사')
  ) {
    return '🌸';
  }

  if (
    categoryName.includes('치유') ||
    categoryName.includes('힐링')
  ) {
    return '🌿';
  }

  return '📍';
}

const styles = StyleSheet.create({
  typeFilter: {
    flexDirection: 'row',
    gap: 8,
    padding: 5,
    borderRadius: 16,
    backgroundColor: '#F0E6D3',
  },

  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 12,
  },

  typeButtonActive: {
    backgroundColor: '#FFFFFF',
  },

  typeIcon: {
    fontSize: 15,
  },

  typeButtonText: {
    color: '#6C5A37',
    fontSize: 12,
    fontWeight: '800',
  },

  typeButtonTextActive: {
    color: '#3F7D46',
  },

  filterLabel: {
    marginTop: 18,
    marginBottom: 8,
    color: '#5F5139',
    fontSize: 12,
    fontWeight: '800',
  },

  regionList: {
    gap: 7,
    paddingRight: 18,
  },

  regionChip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EADCC4',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },

  regionChipActive: {
    borderColor: '#3F7D46',
    backgroundColor: '#3F7D46',
  },

  regionChipText: {
    color: '#6B5730',
    fontSize: 12,
    fontWeight: '800',
  },

  regionChipTextActive: {
    color: '#FFFFFF',
  },

  categoryList: {
    gap: 10,
    paddingRight: 18,
  },

  categoryButton: {
    width: 67,
    alignItems: 'center',
  },

  categoryIcon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EADCC4',
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
  },

  categoryIconActive: {
    borderColor: '#ABD19C',
    backgroundColor: '#E8F5E4',
  },

  categoryEmoji: {
    fontSize: 22,
  },

  categoryText: {
    width: 67,
    marginTop: 6,
    color: '#72664E',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },

  categoryTextActive: {
    color: '#3F7D46',
  },
});