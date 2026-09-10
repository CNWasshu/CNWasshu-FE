import {
  useEffect,
  useRef,
} from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { HomeSearchBar } from '@/components/home/HomeSearchBar';

import type { HomeItemType } from '@/types/home';

type HomeFilterSectionProps = {
  selectedType: HomeItemType;
  selectedRegion: string;
  selectedCategory: string;

  searchText: string;

  regions: string[];
  categories: string[];

  onSelectType: (type: HomeItemType) => void;
  onSelectRegion: (region: string) => void;
  onSelectCategory: (category: string) => void;

  onChangeSearchText: (value: string) => void;
  onClearSearch: () => void;
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

type HorizontalScrollProps = {
  children: React.ReactNode;
  contentContainerStyle: any;
  scrollToX?: number | null;
  wrap?: boolean;
};

function HorizontalScroll({
  children,
  contentContainerStyle,
  scrollToX = null,
  wrap = false,
}: HorizontalScrollProps) {
  const scrollRef =
    useRef<ScrollView>(null);

  useEffect(() => {
    if (
      scrollToX === null
    ) {
      return;
    }

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        x: Math.max(
          0,
          scrollToX
        ),
        animated: true,
      });
    });
  }, [scrollToX]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const node =
      scrollRef.current as any;

    if (!node) {
      return;
    }

    const element =
      node.getScrollableNode?.() ??
      node.getInnerViewNode?.() ??
      node;

    if (
      !element ||
      !element.addEventListener
    ) {
      return;
    }

    let dragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let moved = false;

    const handleWheel = (
      event: WheelEvent
    ) => {
      const delta =
        Math.abs(event.deltaY) >
        Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;

      if (!delta) {
        return;
      }

      event.preventDefault();

      element.scrollLeft += delta;
    };

    const handleMouseDown = (
      event: MouseEvent
    ) => {
      dragging = true;
      moved = false;

      startX = event.pageX;

      startScrollLeft =
        element.scrollLeft;

      element.style.cursor =
        'grabbing';

      element.style.userSelect =
        'none';
    };

    const handleMouseMove = (
      event: MouseEvent
    ) => {
      if (!dragging) {
        return;
      }

      const distance =
        event.pageX -
        startX;

      if (
        Math.abs(distance) > 3
      ) {
        moved = true;
      }

      element.scrollLeft =
        startScrollLeft -
        distance;
    };

    const stopDragging = () => {
      dragging = false;

      element.style.cursor =
        'grab';

      element.style.userSelect =
        '';
    };

    const handleClick = (
      event: MouseEvent
    ) => {
      if (!moved) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      moved = false;
    };

    element.style.cursor =
      'grab';

    element.addEventListener(
      'wheel',
      handleWheel,
      {
        passive: false,
      }
    );

    element.addEventListener(
      'mousedown',
      handleMouseDown
    );

    window.addEventListener(
      'mousemove',
      handleMouseMove
    );

    window.addEventListener(
      'mouseup',
      stopDragging
    );

    element.addEventListener(
      'mouseleave',
      stopDragging
    );

    element.addEventListener(
      'click',
      handleClick,
      true
    );

    return () => {
      element.removeEventListener(
        'wheel',
        handleWheel
      );

      element.removeEventListener(
        'mousedown',
        handleMouseDown
      );

      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      window.removeEventListener(
        'mouseup',
        stopDragging
      );

      element.removeEventListener(
        'mouseleave',
        stopDragging
      );

      element.removeEventListener(
        'click',
        handleClick,
        true
      );
    };
  }, []);

  if (wrap) {
    return <View style={contentContainerStyle}>{children}</View>;
  }

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={
        contentContainerStyle
      }
    >
      {children}
    </ScrollView>
  );
}

export function HomeFilterSection({
  selectedType,
  selectedRegion,
  selectedCategory,
  searchText,
  regions,
  categories,
  onSelectType,
  onSelectRegion,
  onSelectCategory,
  onChangeSearchText,
  onClearSearch,
}: HomeFilterSectionProps) {
  const { width } = useWindowDimensions();
  const useWrappedFilters = Platform.OS === 'web' && width >= 1024;
  const regionPositionsRef =
    useRef<
      Record<
        string,
        {
          x: number;
          width: number;
        }
      >
    >({});

  const selectedRegionPosition =
    regionPositionsRef.current[
      selectedRegion
    ];

  const regionScrollX =
    selectedRegionPosition
      ? Math.max(
          0,
          selectedRegionPosition.x -
            120
        )
      : null;

  return (
    <>
      <View style={styles.typeFilter}>
        {TYPE_FILTERS.map((filter) => {
          const active =
            selectedType ===
            filter.value;

          return (
            <Pressable
              key={filter.value}
              style={[
                styles.typeButton,
                active &&
                  styles.typeButtonActive,
              ]}
              onPress={() =>
                onSelectType(
                  filter.value
                )
              }
            >
              <Text
                style={styles.typeIcon}
              >
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

      <View style={styles.searchWrapper}>
        <HomeSearchBar
          value={searchText}
          selectedType={
            selectedType
          }
          onChangeText={
            onChangeSearchText
          }
          onClear={
            onClearSearch
          }
        />
      </View>

      <Text style={styles.filterLabel}>
        지역
      </Text>

      <HorizontalScroll
        contentContainerStyle={
          [styles.regionList, useWrappedFilters && styles.regionListDesktop]
        }
        scrollToX={
          regionScrollX
        }
        wrap={useWrappedFilters}
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
              onLayout={(event) => {
                regionPositionsRef.current[
                  region
                ] = {
                  x: event.nativeEvent
                    .layout.x,
                  width:
                    event.nativeEvent
                      .layout.width,
                };
              }}
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
      </HorizontalScroll>

      {selectedType ===
        'ACTIVITY' && (
        <>
          <Text
            style={styles.filterLabel}
          >
            카테고리
          </Text>

          <HorizontalScroll
            contentContainerStyle={
              styles.categoryList
            }
          >
            {categories.map(
              (category) => {
                const active =
                  selectedCategory ===
                  category;

                return (
                  <Pressable
                    key={category}
                    style={
                      styles.categoryButton
                    }
                    onPress={() =>
                      onSelectCategory(
                        category
                      )
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
                        style={
                          styles.categoryEmoji
                        }
                      >
                        {getCategoryIcon(
                          category
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
              }
            )}
          </HorizontalScroll>
        </>
      )}
    </>
  );
}

function getCategoryIcon(
  categoryName: string
) {
  if (
    categoryName === '전체'
  ) {
    return '🌾';
  }

  if (
    categoryName.includes(
      '농촌'
    ) ||
    categoryName.includes(
      '체험'
    )
  ) {
    return '🧑‍🌾';
  }

  if (
    categoryName.includes(
      '축제'
    ) ||
    categoryName.includes(
      '행사'
    )
  ) {
    return '🌸';
  }

  if (
    categoryName.includes(
      '치유'
    ) ||
    categoryName.includes(
      '힐링'
    ) ||
    categoryName.includes(
      '건강'
    )
  ) {
    return '🌿';
  }

  if (
    categoryName.includes(
      '만들기'
    )
  ) {
    return '🧶';
  }

  if (
    categoryName.includes(
      '전통'
    )
  ) {
    return '🏺';
  }

  if (
    categoryName.includes(
      '자연'
    ) ||
    categoryName.includes(
      '생태'
    )
  ) {
    return '🌱';
  }

  return '📍';
}

const styles =
  StyleSheet.create({
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
      fontSize: 18,
    },

    typeButtonText: {
      color: '#6C5A37',
      fontSize: 14,
      fontWeight: '800',
    },

    typeButtonTextActive: {
      color: '#3F7D46',
    },

    searchWrapper: {
      marginTop: 12,
    },

    filterLabel: {
      marginTop: 18,
      marginBottom: 8,
      color: '#5F5139',
      fontSize: 13,
      fontWeight: '800',
    },

    regionList: {
      gap: 7,
      paddingRight: 18,
    },

    regionListDesktop: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      rowGap: 8,
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
      fontSize: 13,
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
      fontSize: 25,
    },

    categoryText: {
      width: 67,
      marginTop: 6,
      color: '#72664E',
      fontSize: 12,
      fontWeight: '800',
      textAlign: 'center',
    },

    categoryTextActive: {
      color: '#3F7D46',
    },
  });
