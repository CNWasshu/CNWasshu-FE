import {
  clearTokens,
  getAccessToken,
} from '@/utils/auth';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  useRouter,
} from 'expo-router';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  HomeApiError,
  getHomeErrorMessage,
  homeApi,
} from '@/api/homeApi';

import {
  HomeContent,
} from '@/components/home/HomeContent';

import {
  useBookmarks,
} from '@/hooks/bookmark/use-bookmarks';

import {
  useUnreadNotificationCount,
} from '@/hooks/notification/use-unread-notification-count';

import type {
  ActivityHomeSort,
  HomeFilterOption,
  HomeItem,
  HomeItemType,
  RestaurantHomeSort,
} from '@/types/home';

const ITEMS_PER_PAGE = 8;
const SEARCH_DEBOUNCE_TIME =
  350;

type HomeSort =
  | ActivityHomeSort
  | RestaurantHomeSort;

export default function HomeScreen() {
  const router = useRouter();

  const {
    fetchBookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
  } = useBookmarks();

  const {
    fetchUnreadNotificationCount,
    unreadCount:
      unreadNotificationCount,
  } =
    useUnreadNotificationCount();

  const [items, setItems] =
    useState<HomeItem[]>([]);

  const [
    filterRegions,
    setFilterRegions,
  ] =
    useState<
      HomeFilterOption[]
    >([]);

  const [
    filterCategories,
    setFilterCategories,
  ] =
    useState<
      HomeFilterOption[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const [
    selectedType,
    setSelectedType,
  ] =
    useState<HomeItemType>(
      'ACTIVITY'
    );

  const [
    selectedRegionId,
    setSelectedRegionId,
  ] =
    useState<number | null>(
      null
    );

  const [
    selectedCategoryId,
    setSelectedCategoryId,
  ] =
    useState<number | null>(
      null
    );

  const [
    activitySort,
    setActivitySort,
  ] =
    useState<ActivityHomeSort>(
      'DEFAULT'
    );

  const [
    restaurantSort,
    setRestaurantSort,
  ] =
    useState<RestaurantHomeSort>(
      'NAME'
    );

  const [
    searchText,
    setSearchText,
  ] = useState('');

  const [
    debouncedKeyword,
    setDebouncedKeyword,
  ] = useState('');

  const [
    currentPage,
    setCurrentPage,
  ] = useState(0);

  const [
    hasNext,
    setHasNext,
  ] = useState(false);

  const [
    totalItemCount,
    setTotalItemCount,
  ] = useState(0);

  const selectedSort: HomeSort =
    selectedType === 'ACTIVITY'
      ? activitySort
      : restaurantSort;

  const handleUnauthorized =
    useCallback(async () => {
      await clearTokens();

      router.replace(
        '/auth/login'
      );
    }, [router]);

  const fetchFilterOptions =
    useCallback(
      async (
        type: HomeItemType
      ) => {
        try {
          const accessToken =
            await getAccessToken();

          if (!accessToken) {
            throw new Error(
              '로그인이 필요합니다.'
            );
          }

          const data =
            await homeApi.getFilterOptions(
              accessToken,
              type
            );

          setFilterRegions(
            data.regions
          );

          if (
            type === 'ACTIVITY'
          ) {
            setFilterCategories(
              data.categories
            );
          } else {
            setFilterCategories(
              []
            );
          }
        } catch (error) {
          if (
            error instanceof
              HomeApiError &&
            error.status === 401
          ) {
            await handleUnauthorized();
            return;
          }

          setErrorMessage(
            getHomeErrorMessage(
              error
            )
          );
        }
      },
      [handleUnauthorized]
    );

  const fetchHomeItems =
    useCallback(
      async (
        pageNumber = 0,
        append = false,
        showLoading = true
      ) => {
        try {
          if (
            showLoading &&
            !append
          ) {
            setLoading(true);
          }

          if (append) {
            setLoadingMore(true);
          }

          setErrorMessage('');

          const accessToken =
            await getAccessToken();

          if (!accessToken) {
            throw new Error(
              '로그인이 필요합니다.'
            );
          }

          const keyword =
            debouncedKeyword.trim();

          const data =
            selectedType ===
            'ACTIVITY'
              ? await homeApi.getActivities(
                  accessToken,
                  {
                    sort: activitySort,
                    regionId:
                      selectedRegionId,
                    categoryId:
                      selectedCategoryId,
                    keyword:
                      keyword ||
                      null,
                    page: pageNumber,
                    size: ITEMS_PER_PAGE,
                  }
                )
              : await homeApi.getRestaurants(
                  accessToken,
                  {
                    sort: restaurantSort,
                    regionId:
                      selectedRegionId,
                    keyword:
                      keyword ||
                      null,
                    page: pageNumber,
                    size: ITEMS_PER_PAGE,
                  }
                );

          if (append) {
            setItems(
              (
                previousItems
              ) => [
                ...previousItems,
                ...data.items,
              ]
            );
          } else {
            setItems(data.items);
          }

          setCurrentPage(
            data.page
          );

          setHasNext(
            data.hasNext
          );

          setTotalItemCount(
            data.totalElements
          );
        } catch (error) {
          if (
            error instanceof
              HomeApiError &&
            error.status === 401
          ) {
            await handleUnauthorized();
            return;
          }

          setErrorMessage(
            getHomeErrorMessage(
              error
            )
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
          setLoadingMore(false);
        }
      },
      [
        selectedType,
        selectedRegionId,
        selectedCategoryId,
        activitySort,
        restaurantSort,
        debouncedKeyword,
        handleUnauthorized,
      ]
    );

  useEffect(() => {
    const timeout =
      setTimeout(() => {
        setDebouncedKeyword(
          searchText
        );
        setCurrentPage(0);
        setHasNext(false);
      }, SEARCH_DEBOUNCE_TIME);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchText]);

  useEffect(() => {
    fetchFilterOptions(
      selectedType
    );
  }, [
    selectedType,
    fetchFilterOptions,
  ]);

  useEffect(() => {
    fetchHomeItems(
      0,
      false,
      false
    );
  }, [fetchHomeItems]);

  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();

      fetchUnreadNotificationCount();
    }, [
      fetchBookmarks,
      fetchUnreadNotificationCount,
    ])
  );

  const selectedRegion =
    useMemo(() => {
      if (
        selectedRegionId ===
        null
      ) {
        return '전체';
      }

      return (
        filterRegions.find(
          (region) =>
            region.id ===
            selectedRegionId
        )?.name ?? '전체'
      );
    }, [
      selectedRegionId,
      filterRegions,
    ]);

  const selectedCategory =
    useMemo(() => {
      if (
        selectedCategoryId ===
        null
      ) {
        return '전체';
      }

      return (
        filterCategories.find(
          (category) =>
            category.id ===
            selectedCategoryId
        )?.name ?? '전체'
      );
    }, [
      selectedCategoryId,
      filterCategories,
    ]);

  const regions =
    useMemo(
      () => [
        '전체',
        ...filterRegions.map(
          (region) =>
            region.name
        ),
      ],
      [filterRegions]
    );

  const categories =
  useMemo(() => {
    if (
      selectedType ===
      'RESTAURANT'
    ) {
      return ['전체'];
    }

    const priorityCategories = [
      '농작물경작체험',
      '만들기체험',
      '자연생태체험',
      '전통문화체험',
      '건강',
      '기타',
    ];

    const normalizeCategoryName = (
      name: string
    ) =>
      name.replace(/\s/g, '');

    const sortedCategories = [
      ...filterCategories,
    ].sort((a, b) => {
      const aName =
        normalizeCategoryName(
          a.name
        );

      const bName =
        normalizeCategoryName(
          b.name
        );

      const aIndex =
        priorityCategories.indexOf(
          aName
        );

      const bIndex =
        priorityCategories.indexOf(
          bName
        );

      if (
        aIndex === -1 &&
        bIndex === -1
      ) {
        return a.name.localeCompare(
          b.name,
          'ko'
        );
      }

      if (aIndex === -1) {
        return 1;
      }

      if (bIndex === -1) {
        return -1;
      }

      return aIndex - bIndex;
    });

    return [
      '전체',
      ...sortedCategories.map(
        (category) =>
          category.name
      ),
    ];
  }, [
    selectedType,
    filterCategories,
  ]);

  const handleSearchTextChange =
    useCallback(
      (value: string) => {
        setSearchText(value);
      },
      []
    );

  const handleClearSearch =
    useCallback(() => {
      setSearchText('');
      setDebouncedKeyword('');
      setCurrentPage(0);
      setHasNext(false);
    }, []);

  const handleSelectType = (
    type: HomeItemType
  ) => {
    if (
      type === selectedType
    ) {
      return;
    }

    setSelectedType(type);
    setSelectedRegionId(null);
    setSelectedCategoryId(null);
    setCurrentPage(0);
    setHasNext(false);
  };

  const handleSelectRegion = (
    regionName: string
  ) => {
    if (
      regionName === '전체'
    ) {
      setSelectedRegionId(
        null
      );
      return;
    }

    const region =
      filterRegions.find(
        (item) =>
          item.name ===
          regionName
      );

    if (!region) {
      return;
    }

    setSelectedRegionId(
      region.id
    );
  };

  const handleSelectCategory = (
    categoryName: string
  ) => {
    if (
      selectedType !==
      'ACTIVITY'
    ) {
      return;
    }

    if (
      categoryName ===
      '전체'
    ) {
      setSelectedCategoryId(
        null
      );
      return;
    }

    const category =
      filterCategories.find(
        (item) =>
          item.name ===
          categoryName
      );

    if (!category) {
      return;
    }

    setSelectedCategoryId(
      category.id
    );
  };

  const handleSelectSort = (
    sort: HomeSort
  ) => {
    if (
      selectedType ===
      'ACTIVITY'
    ) {
      setActivitySort(
        sort as ActivityHomeSort
      );
    } else {
      setRestaurantSort(
        sort as RestaurantHomeSort
      );
    }

    setCurrentPage(0);
    setHasNext(false);
  };

  const handleRefresh =
    async () => {
      setRefreshing(true);

      await Promise.all([
        fetchHomeItems(
          0,
          false,
          false
        ),
        fetchFilterOptions(
          selectedType
        ),
        fetchBookmarks(),
      ]);
    };

  const handleRetry = () => {
    fetchHomeItems(
      0,
      false,
      true
    );
  };

  const handleLoadMore =
    async () => {
      if (
        !hasNext ||
        loadingMore
      ) {
        return;
      }

      await fetchHomeItems(
        currentPage + 1,
        true,
        false
      );
    };

  const handleItemPress = (
    item: HomeItem
  ) => {
    if (
      item.type ===
      'ACTIVITY'
    ) {
      router.push({
        pathname:
          '/activity/[id]',
        params: {
          id: String(
            item.id
          ),
        },
      });

      return;
    }

    router.push({
      pathname:
        '/restaurant/[id]',
      params: {
        id: String(
          item.id
        ),
      },
    });
  };

  const handleIsBookmarked = (
    item: HomeItem
  ) =>
    isBookmarked(
      item.type,
      item.id
    );

  const handleItemBookmarkPress =
    async (
      item: HomeItem
    ) => {
      const bookmarked =
        isBookmarked(
          item.type,
          item.id
        );

      if (bookmarked) {
        await removeBookmark({
          type: item.type,
          targetId:
            item.id,
        });

        return;
      }

      const success =
        await addBookmark({
          type: item.type,
          targetId:
            item.id,
        });

      if (success) {
        await fetchBookmarks();
      }
    };

  const handleBookmarkPress =
    () => {
      router.push(
        '/bookmark'
      );
    };

  const handleMyPagePress =
    () => {
      router.push(
        '/auth/mypage'
      );
    };

  const handleNotificationPress =
    () => {
      router.push(
        '/notification'
      );
    };

  const handleAiRecommend =
    () => {
      router.push(
        '/course/ai'
      );
    };

  return (
    <HomeContent
      loading={loading}
      refreshing={
        refreshing
      }
      errorMessage={
        errorMessage
      }
      items={items}
      searchText={
        searchText
      }
      selectedType={
        selectedType
      }
      selectedRegion={
        selectedRegion
      }
      selectedCategory={
        selectedCategory
      }
      selectedSort={
        selectedSort
      }
      regions={regions}
      categories={
        categories
      }
      totalItemCount={
        totalItemCount
      }
      canLoadMore={
        hasNext &&
        !loadingMore
      }
      onChangeSearchText={
        handleSearchTextChange
      }
      onClearSearch={
        handleClearSearch
      }
      onSelectType={
        handleSelectType
      }
      onSelectRegion={
        handleSelectRegion
      }
      onSelectCategory={
        handleSelectCategory
      }
      onSelectSort={
        handleSelectSort
      }
      onRefresh={
        handleRefresh
      }
      onRetry={
        handleRetry
      }
      onLoadMore={
        handleLoadMore
      }
      onItemPress={
        handleItemPress
      }
      onItemBookmarkPress={
        handleItemBookmarkPress
      }
      isBookmarked={
        handleIsBookmarked
      }
      onAiRecommend={
        handleAiRecommend
      }
      onBookmarkPress={
        handleBookmarkPress
      }
      onMyPagePress={
        handleMyPagePress
      }
      onNotificationPress={
        handleNotificationPress
      }
      unreadNotificationCount={
        unreadNotificationCount
      }
    />
  );
}