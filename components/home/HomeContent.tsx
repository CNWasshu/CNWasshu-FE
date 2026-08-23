import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeFilterSection } from '@/components/home/HomeFilterSection';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeItemCard } from '@/components/home/HomeItemCard';
import { HomeLoadMore } from '@/components/home/HomeLoadMore';
import type { HomeItem, HomeItemType } from '@/types/home';

type HomeContentProps = {
  loading: boolean;
  refreshing: boolean;
  errorMessage: string;

  items: HomeItem[];

  selectedType: HomeItemType;
  selectedRegion: string;
  selectedCategory: string;

  regions: string[];
  categories: string[];

  totalItemCount: number;
  canLoadMore: boolean;

  onSelectType: (type: HomeItemType) => void;
  onSelectRegion: (region: string) => void;
  onSelectCategory: (category: string) => void;

  onRefresh: () => void;
  onRetry: () => void;
  onLoadMore: () => void;

  onItemPress: (item: HomeItem) => void;
  onAiRecommend: () => void;
};

export function HomeContent({
  loading,
  refreshing,
  errorMessage,

  items,

  selectedType,
  selectedRegion,
  selectedCategory,

  regions,
  categories,

  totalItemCount,
  canLoadMore,

  onSelectType,
  onSelectRegion,
  onSelectCategory,

  onRefresh,
  onRetry,
  onLoadMore,

  onItemPress,
  onAiRecommend,
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={styles.screen}>
          <HomeHero
            onAiRecommend={onAiRecommend}
          />

          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                충남에서 뭐 할까?
              </Text>

              <Text style={styles.sectionDescription}>
                지역별 즐길 거리
              </Text>
            </View>

            <HomeFilterSection
              selectedType={selectedType}
              selectedRegion={selectedRegion}
              selectedCategory={selectedCategory}
              regions={regions}
              categories={categories}
              onSelectType={onSelectType}
              onSelectRegion={onSelectRegion}
              onSelectCategory={onSelectCategory}
            />

            <View style={styles.resultHeader}>
              <Text style={styles.resultNote}>
                {selectedRegion === '전체'
                  ? selectedType === 'ACTIVITY'
                    ? '충남 전체의 체험을 둘러보세요.'
                    : '충남 전체의 맛집을 둘러보세요.'
                  : selectedType === 'ACTIVITY'
                    ? `${selectedRegion}의 체험을 모아보고 있어요.`
                    : `${selectedRegion}의 맛집을 모아보고 있어요.`}
              </Text>

              <Text style={styles.resultCount}>
                총 {totalItemCount}개
              </Text>
            </View>

            <View style={styles.itemList}>
              {items.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyTitle}>
                    조건에 맞는 장소가 없어요.
                  </Text>

                  <Text style={styles.emptyDescription}>
                    다른 지역이나 카테고리를 선택해보세요.
                  </Text>
                </View>
              ) : (
                <>
                  {items.map((item) => (
                    <HomeItemCard
                      key={`${item.type}-${item.id}`}
                      item={item}
                      onPress={() =>
                        onItemPress(item)
                      }
                    />
                  ))}

                  {canLoadMore && (
                    <HomeLoadMore
                      onPress={onLoadMore}
                    />
                  )}
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFAF1',
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    backgroundColor: '#FFFAF1',
  },

  screen: {
    width: '100%',
    maxWidth: 430,
    flex: 1,
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
    padding: 18,
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
    marginTop: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  resultNote: {
    flex: 1,
    color: '#766749',
    fontSize: 12,
  },

  resultCount: {
    color: '#777777',
    fontSize: 11,
    fontWeight: '700',
  },

  itemList: {
    gap: 13,
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
  },
});