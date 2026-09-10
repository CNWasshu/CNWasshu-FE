import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import { BookmarkCard } from '@/components/bookmark/BookmarkCard';
import { BookmarkEmpty } from '@/components/bookmark/BookmarkEmpty';
import { BookmarkError } from '@/components/bookmark/BookmarkError';
import { BookmarkLoading } from '@/components/bookmark/BookmarkLoading';
import { PageHero } from '@/components/layout';
import { PAGE_LAYOUT } from '@/constants/layout';

import type {
  BookmarkResponse,
} from '@/types/bookmark';

interface BookmarkContentProps {
  bookmarks: BookmarkResponse[];
  totalBookmarkCount: number;

  regions: string[];
  selectedRegion: string;

  loading: boolean;
  errorMessage: string;

  onSelectRegion: (
    region: string
  ) => void;

  onPress: (
    bookmark: BookmarkResponse
  ) => void;

  onRemove: (
    bookmark: BookmarkResponse
  ) => void;

  onRetry: () => void;
}

export function BookmarkContent({
  bookmarks,
  totalBookmarkCount,
  regions,
  selectedRegion,
  loading,
  errorMessage,
  onSelectRegion,
  onPress,
  onRemove,
  onRetry,
}: BookmarkContentProps) {
  return (
    <SafeAreaView
      edges={['top']}
      style={styles.safeArea}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <PageHero
          description="관심 있는 체험과 맛집을 모아서 확인해보세요."
          showBack
          title="담은 장소"
        />

        <View style={styles.screen}>
          <Text style={styles.countSummary}>담은 장소 {totalBookmarkCount}개</Text>

          {!loading &&
            !errorMessage &&
            totalBookmarkCount > 0 && (
              <View
                style={
                  styles.filterSection
                }
              >
                <View
                  style={
                    styles.regionList
                  }
                >
                  {regions.map(
                    (region) => {
                      const selected =
                        region ===
                        selectedRegion;

                      return (
                        <Pressable
                          key={region}
                          accessibilityRole="button"
                          onPress={() =>
                            onSelectRegion(
                              region
                            )
                          }
                          style={[
                            styles.regionChip,
                            selected &&
                              styles.regionChipSelected,
                          ]}
                        >
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.regionChipText,
                              selected &&
                                styles.regionChipTextSelected,
                            ]}
                          >
                            {region}
                          </Text>
                        </Pressable>
                      );
                    }
                  )}
                </View>
              </View>
            )}

          {loading ? (
            <BookmarkLoading />
          ) : errorMessage ? (
            <BookmarkError
              message={errorMessage}
              onRetry={onRetry}
            />
          ) : totalBookmarkCount ===
            0 ? (
            <BookmarkEmpty />
          ) : bookmarks.length ===
            0 ? (
            <View
              style={
                styles.regionEmpty
              }
            >
              <Text
                style={
                  styles.regionEmptyTitle
                }
              >
                이 지역에 저장한
                장소가 없어요.
              </Text>

              <Text
                style={
                  styles.regionEmptyDescription
                }
              >
                다른 지역을
                선택해보세요.
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {bookmarks.map(
                (bookmark) => (
                  <View
                    key={
                      bookmark.bookmarkId
                    }
                    style={
                      styles.cardWrapper
                    }
                  >
                    <BookmarkCard
                      bookmark={
                        bookmark
                      }
                      onPress={() =>
                        onPress(
                          bookmark
                        )
                      }
                      onRemove={() =>
                        onRemove(
                          bookmark
                        )
                      }
                    />
                  </View>
                )
              )}
            </View>
          )}
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
    backgroundColor: '#FFFAF1',
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#FFFAF1',
  },

  screen: {
    flex: 1,
    width: '100%',
    maxWidth: PAGE_LAYOUT.desktopMaxWidth,
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 30,
    backgroundColor: '#FFFAF1',
  },

  countSummary: {
    color: '#5F5139',
    fontSize: 13,
    fontWeight: '800',
  },

  filterSection: {
    width: '100%',
    marginTop: 14,
    marginBottom: 18,
  },

  regionList: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 8,
    rowGap: 8,
  },

  regionChip: {
    width: '18.3%',
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#E8DCC8',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  regionChipSelected: {
    borderColor: '#3F7D46',
    backgroundColor: '#3F7D46',
  },

  regionChipText: {
    color: '#6F675C',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  regionChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },

  cardWrapper: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },

  regionEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 54,
  },

  regionEmptyTitle: {
    color: '#29251E',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },

  regionEmptyDescription: {
    marginTop: 7,
    color: '#888178',
    fontSize: 12,
    textAlign: 'center',
  },
});
