import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeFilterSection } from '@/components/home/HomeFilterSection';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeItemCard } from '@/components/home/HomeItemCard';
import { HomeLoadMore } from '@/components/home/HomeLoadMore';
import { HomeSortDropdown } from '@/components/home/HomeSortDropdown';

import type {
  ActivityHomeSort,
  HomeItem,
  HomeItemType,
  RestaurantHomeSort,
} from '@/types/home';

type HomeSort =
  | ActivityHomeSort
  | RestaurantHomeSort;

type HomeContentProps = {
  loading: boolean;
  refreshing: boolean;
  errorMessage: string;

  items: HomeItem[];

  searchText: string;

  selectedType: HomeItemType;
  selectedRegion: string;
  selectedCategory: string;
  selectedSort: HomeSort;

  regions: string[];
  categories: string[];

  totalItemCount: number;
  canLoadMore: boolean;

  onChangeSearchText: (
    value: string
  ) => void;

  onClearSearch: () => void;

  onSelectType: (
    type: HomeItemType
  ) => void;

  onSelectRegion: (
    region: string
  ) => void;

  onSelectCategory: (
    category: string
  ) => void;

  onSelectSort: (
    sort: HomeSort
  ) => void;

  onRefresh: () => void;
  onRetry: () => void;
  onLoadMore: () => void;

  onItemPress: (
    item: HomeItem
  ) => void;

  onItemBookmarkPress: (
    item: HomeItem
  ) => void;

  isBookmarked: (
    item: HomeItem
  ) => boolean;

  onAiRecommend: () => void;
  onBookmarkPress: () => void;
  onMyPagePress: () => void;
  onNotificationPress: () => void;

  unreadNotificationCount: number;
};

export function HomeContent({
  loading,
  refreshing,
  errorMessage,
  items,
  searchText,
  selectedType,
  selectedRegion,
  selectedCategory,
  selectedSort,
  regions,
  categories,
  totalItemCount,
  canLoadMore,
  onChangeSearchText,
  onClearSearch,
  onSelectType,
  onSelectRegion,
  onSelectCategory,
  onSelectSort,
  onRefresh,
  onRetry,
  onLoadMore,
  onItemPress,
  onItemBookmarkPress,
  isBookmarked,
  onAiRecommend,
  onBookmarkPress,
  onMyPagePress,
  onNotificationPress,
  unreadNotificationCount,
}: HomeContentProps) {
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />

          <Text style={styles.loadingText}>
            충남의 즐길 거리를 불러오고 있어요.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>
            홈을 불러오지 못했어요.
          </Text>

          <Text style={styles.errorMessage}>
            {errorMessage}
          </Text>

          <Pressable
            accessibilityRole="button"
            style={styles.retryButton}
            onPress={onRetry}
          >
            <Text style={styles.retryButtonText}>
              다시 시도
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={styles.safeArea}
    >
      <FlatList
        data={items}
        keyExtractor={(item) =>
          `${item.type}-${item.id}`
        }
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <HomeItemCard
              item={item}
              isBookmarked={
                isBookmarked(item)
              }
              onPress={onItemPress}
              onBookmarkPress={
                onItemBookmarkPress
              }
            />
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.screen}>
            <HomeHero
              onAiRecommend={onAiRecommend}
              onBookmarkPress={
                onBookmarkPress
              }
              onMyPagePress={
                onMyPagePress
              }
              onNotificationPress={
                onNotificationPress
              }
              unreadNotificationCount={
                unreadNotificationCount
              }
            />

            <View style={styles.content}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  충남에서 뭐 할까?
                </Text>

                <Text
                  style={
                    styles.sectionDescription
                  }
                >
                  지역별 즐길 거리
                </Text>
              </View>

              <HomeFilterSection
                selectedType={selectedType}
                selectedRegion={
                  selectedRegion
                }
                selectedCategory={
                  selectedCategory
                }
                searchText={searchText}
                regions={regions}
                categories={categories}
                onChangeSearchText={
                  onChangeSearchText
                }
                onClearSearch={
                  onClearSearch
                }
                onSelectType={
                  onSelectType
                }
                onSelectRegion={
                  onSelectRegion
                }
                onSelectCategory={
                  onSelectCategory
                }
              />

              <View style={styles.resultHeader}>
                <Text style={styles.resultCount}>
                  총 {totalItemCount}개
                </Text>

                <HomeSortDropdown
                  selectedType={
                    selectedType
                  }
                  selectedSort={
                    selectedSort
                  }
                  onSelectSort={
                    onSelectSort
                  }
                />
              </View>
            </View>
          </View>
        }
        ListHeaderComponentStyle={
          styles.listHeader
        }
        ListEmptyComponent={
          <View style={styles.emptyWrapper}>
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>
                검색 결과가 없어요.
              </Text>

              <Text
                style={
                  styles.emptyDescription
                }
              >
                다른 검색어나 지역,
                카테고리를 선택해보세요.
              </Text>
            </View>
          </View>
        }
        ListFooterComponent={
          items.length > 0 ? (
            <View
              style={
                styles.footerWrapper
              }
            >
              {canLoadMore && (
                <HomeLoadMore
                  onPress={onLoadMore}
                />
              )}
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => (
          <View
            style={styles.itemSeparator}
          />
        )}
        style={styles.list}
        contentContainerStyle={
          styles.listContent
        }
        showsVerticalScrollIndicator={
          false
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={
          Platform.OS !== 'web'
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFAF1',
  },

  list: {
    flex: 1,
  },

  listContent: {
    flexGrow: 1,
    paddingBottom: 24,
    backgroundColor: '#FFFAF1',
  },

  listHeader: {
    position: 'relative',
    zIndex: 100,
    elevation: 100,
    overflow: 'visible',
  },

  screen: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    position: 'relative',
    zIndex: 100,
    overflow: 'visible',
    backgroundColor: '#FFFAF1',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 14,
    color: '#777777',
    fontSize: 14,
  },

  errorTitle: {
    color: '#29251E',
    fontSize: 18,
    fontWeight: '800',
  },

  errorMessage: {
    marginTop: 8,
    color: '#777777',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 13,
    backgroundColor: '#3F7D46',
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    position: 'relative',
    zIndex: 100,
    overflow: 'visible',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  sectionTitle: {
    color: '#29251E',
    fontSize: 19,
    fontWeight: '900',
  },

  sectionDescription: {
    color: '#777777',
    fontSize: 12,
  },

  resultHeader: {
    position: 'relative',
    zIndex: 200,
    elevation: 200,
    overflow: 'visible',
    marginTop: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  resultCount: {
    color: '#777777',
    fontSize: 11,
    fontWeight: '700',
  },

  itemWrapper: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    paddingHorizontal: 18,
    position: 'relative',
    zIndex: 1,
  },

  itemSeparator: {
    height: 13,
  },

  footerWrapper: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 13,
  },

  emptyWrapper: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    paddingHorizontal: 18,
  },

  emptyBox: {
    alignItems: 'center',
    paddingVertical: 42,
    borderWidth: 1,
    borderColor: '#EFE3CE',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  emptyTitle: {
    color: '#29251E',
    fontSize: 15,
    fontWeight: '800',
  },

  emptyDescription: {
    marginTop: 6,
    color: '#777777',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});