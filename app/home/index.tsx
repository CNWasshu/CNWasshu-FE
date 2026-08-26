import { getAccessToken } from '@/utils/auth';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getHomeErrorMessage, homeApi } from '@/api/homeApi';
import { HomeContent } from '@/components/home/HomeContent';
import { useBookmarks } from '@/hooks/bookmark/use-bookmarks';
import type { HomeItem, HomeItemType } from '@/types/home';

const ITEMS_PER_PAGE = 8;

export default function HomeScreen() {
  const router = useRouter();

  const {
    fetchBookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
  } = useBookmarks();

  const [items, setItems] = useState<HomeItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedType, setSelectedType] =
    useState<HomeItemType>('ACTIVITY');

  const [selectedRegion, setSelectedRegion] =
    useState('전체');

  const [selectedCategory, setSelectedCategory] =
    useState('전체');

  const [visibleCount, setVisibleCount] =
    useState(ITEMS_PER_PAGE);

  const fetchHomeItems = async () => {
  try {
    setErrorMessage('');

    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error('로그인이 필요합니다.');
    }

    const data =
      await homeApi.getHomeItems(accessToken);

    setItems(data);
  } catch (error) {
    setErrorMessage(getHomeErrorMessage(error));
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    fetchHomeItems();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
    }, [fetchBookmarks])
  );


  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [
    selectedType,
    selectedRegion,
    selectedCategory,
  ]);

  const regions = useMemo(() => {
    const regionNames = Array.from(
      new Set(
        items
          .filter(
            (item) => item.type === selectedType
          )
          .map((item) => item.regionName)
          .filter(Boolean)
      )
    );

    return ['전체', ...regionNames];
  }, [items, selectedType]);

  const categories = useMemo(() => {
    const categoryNames = Array.from(
      new Set(
        items
          .filter(
            (item) => item.type === selectedType
          )
          .map((item) => item.categoryName)
          .filter(Boolean)
      )
    );

    return ['전체', ...categoryNames];
  }, [items, selectedType]);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const typeMatched =
          item.type === selectedType;

        const regionMatched =
          selectedRegion === '전체' ||
          item.regionName === selectedRegion;

        const categoryMatched =
          selectedCategory === '전체' ||
          item.categoryName === selectedCategory;

        return (
          typeMatched &&
          regionMatched &&
          categoryMatched
        );
      })
      .sort((a, b) => a.id - b.id);
  }, [
    items,
    selectedType,
    selectedRegion,
    selectedCategory,
  ]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(
      0,
      visibleCount
    );
  }, [
    filteredItems,
    visibleCount,
  ]);

  const handleSelectType = (
    type: HomeItemType
  ) => {
    setSelectedType(type);

    setSelectedRegion('전체');
    setSelectedCategory('전체');
  };

  const handleRefresh = async () => {
    setRefreshing(true);

    await Promise.all([
      fetchHomeItems(),
      fetchBookmarks(),
    ]);
  };

  const handleRetry = () => {
    setLoading(true);
    fetchHomeItems();
  };

  const handleLoadMore = () => {
    setVisibleCount((previousCount) =>
      Math.min(
        previousCount + ITEMS_PER_PAGE,
        filteredItems.length
      )
    );
  };

  /**
   * 홈 카드 클릭
   */
  const handleItemPress = (
    item: HomeItem
  ) => {
    if (item.type === 'ACTIVITY') {
      router.push({
        pathname: '/activity/[id]',
        params: {
          id: String(item.id),
        },
      });
      return;
    }
    if (item.type === 'RESTAURANT') {
      router.push({
        pathname: '/restaurant/[id]',
        params: {
          id: String(item.id),
        },
      });
    }
    
  };

  const handleIsBookmarked = (
    item: HomeItem
  ) => {
    return isBookmarked(
      item.type,
      item.id
    );
  };

  const handleItemBookmarkPress = async (
    item: HomeItem
  ) => {
    const bookmarked = isBookmarked(
      item.type,
      item.id
    );

    if (bookmarked) {
      await removeBookmark({
        type: item.type,
        targetId: item.id,
      });

      return;
    }

    const success = await addBookmark({
      type: item.type,
      targetId: item.id,
    });

    if (success) {
      await fetchBookmarks();
    }
  };

  const handleBookmarkPress = () => {
    router.push('/bookmark');
  };

  const handleMyPagePress = () => {
    router.push('/auth/mypage');
  };

  const handleAiRecommend = () => {
    router.push('/course/ai');
  };

  return (
    <HomeContent
      loading={loading}
      refreshing={refreshing}
      errorMessage={errorMessage}

      items={visibleItems}

      selectedType={selectedType}
      selectedRegion={selectedRegion}
      selectedCategory={selectedCategory}

      regions={regions}
      categories={categories}

      totalItemCount={filteredItems.length}

      canLoadMore={
        visibleCount < filteredItems.length
      }

      onSelectType={handleSelectType}
      onSelectRegion={setSelectedRegion}
      onSelectCategory={setSelectedCategory}

      onRefresh={handleRefresh}
      onRetry={handleRetry}
      onLoadMore={handleLoadMore}

      onItemPress={handleItemPress}
      onItemBookmarkPress={handleItemBookmarkPress}
      isBookmarked={handleIsBookmarked}

      onAiRecommend={handleAiRecommend}
      onBookmarkPress={handleBookmarkPress}
      onMyPagePress={handleMyPagePress}
    />
  );
}