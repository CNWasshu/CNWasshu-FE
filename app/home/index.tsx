import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import { getHomeErrorMessage, homeApi } from '@/api/homeApi';
import { HomeContent } from '@/components/home/HomeContent';
import type { HomeItem, HomeItemType } from '@/types/home';

const ITEMS_PER_PAGE = 8;

export default function HomeScreen() {
  const router = useRouter();

  const [items, setItems] = useState<HomeItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 홈 기본 화면은 체험
  const [selectedType, setSelectedType] =
    useState<HomeItemType>('ACTIVITY');

  const [selectedRegion, setSelectedRegion] =
    useState('전체');

  const [selectedCategory, setSelectedCategory] =
    useState('전체');

  // 처음에는 8개만 노출
  const [visibleCount, setVisibleCount] =
    useState(ITEMS_PER_PAGE);

  /**
   * 홈 API 조회
   */
  const fetchHomeItems = async () => {
    try {
      setErrorMessage('');

      const data = await homeApi.getHomeItems();

      setItems(data);
    } catch (error) {
      setErrorMessage(getHomeErrorMessage(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * 홈 최초 진입 시 API 호출
   */
  useEffect(() => {
    fetchHomeItems();
  }, []);

  /**
   * 필터가 변경되면 다시 8개부터 표시
   */
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [
    selectedType,
    selectedRegion,
    selectedCategory,
  ]);

  /**
   * 현재 선택된 체험/맛집에 존재하는 지역 목록 생성
   */
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

  /**
   * 현재 선택된 체험/맛집에 존재하는 카테고리 목록 생성
   */
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

  /**
   * 타입 + 지역 + 카테고리 필터 적용
   *
   * 마지막에 id 오름차순 정렬
   */
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

  /**
   * 실제 화면에 보여줄 데이터
   *
   * 8 → 16 → 24 → ...
   */
  const visibleItems = useMemo(() => {
    return filteredItems.slice(
      0,
      visibleCount
    );
  }, [
    filteredItems,
    visibleCount,
  ]);

  /**
   * 체험 / 맛집 변경
   */
  const handleSelectType = (
    type: HomeItemType
  ) => {
    setSelectedType(type);

    // 타입이 바뀌면 기존 지역/카테고리 선택 초기화
    setSelectedRegion('전체');
    setSelectedCategory('전체');
  };

  /**
   * 새로고침
   */
  const handleRefresh = () => {
    setRefreshing(true);
    fetchHomeItems();
  };

  /**
   * 다시 시도
   */
  const handleRetry = () => {
    setLoading(true);
    fetchHomeItems();
  };

  /**
   * 더 보기
   *
   * 한 번 누를 때마다 8개 추가
   */
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
    }

    // RESTAURANT 상세 화면은
    // 추후 맛집 상세 기능 구현 시 추가
  };

  /**
   * AI 추천 페이지 이동
   */
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
      onAiRecommend={handleAiRecommend}
    />
  );
}