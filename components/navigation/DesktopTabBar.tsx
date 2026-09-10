import Ionicons from '@expo/vector-icons/Ionicons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CourseColors } from '@/constants/course-colors';
import { PAGE_LAYOUT } from '@/constants/layout';
import { APP_NAVIGATION_FONT } from '@/constants/typography';
import { useUnreadNotificationCount } from '@/hooks/notification/use-unread-notification-count';

const TAB_LABELS: Record<string, string> = {
  index: '홈',
  timetable: '일정',
  course: '코스',
  stamp: '스탬프',
  mypage: '내 정보',
};

export function DesktopTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const { fetchUnreadNotificationCount, unreadCount } = useUnreadNotificationCount();

  useEffect(() => {
    void fetchUnreadNotificationCount();
  }, [fetchUnreadNotificationCount, state.index]);

  return (
    <View style={styles.bar}>
      <View style={styles.inner}>
        <Pressable
          accessibilityRole="link"
          onPress={() => navigation.navigate('index')}
          style={styles.brand}>
          <Text style={styles.brandTitle}>충남왔슈</Text>
        </Pressable>

        <View accessibilityRole="tablist" style={styles.navigation}>
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const options = descriptors[route.key].options;
            const color = focused ? CourseColors.primary : CourseColors.muted;

            const handlePress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                onPress={handlePress}
                style={({ pressed }) => [
                  styles.tab,
                  focused && styles.activeTab,
                  pressed && styles.pressedTab,
                ]}>
                {options.tabBarIcon?.({ color, focused, size: 19 })}
                <Text style={[styles.label, focused && styles.activeLabel]}>
                  {TAB_LABELS[route.name] ?? options.title ?? route.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          accessibilityLabel="알림함"
          accessibilityRole="button"
          onPress={() => router.push('/notification')}
          style={({ pressed }) => [styles.notificationButton, pressed && styles.pressedTab]}>
          <Ionicons color={CourseColors.primaryDark} name="notifications-outline" size={20} />
          {unreadCount > 0 ? (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: CourseColors.background,
    borderBottomColor: CourseColors.border,
    borderBottomWidth: 1,
    height: PAGE_LAYOUT.desktopNavigationHeight,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1000,
  },
  inner: {
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: PAGE_LAYOUT.desktopMaxWidth,
    paddingHorizontal: PAGE_LAYOUT.horizontalPadding,
    width: '100%',
  },
  brand: {
    justifyContent: 'center',
    minHeight: 44,
  },
  brandTitle: {
    color: CourseColors.primaryDark,
    fontFamily: APP_NAVIGATION_FONT,
    fontSize: 30,
    fontWeight: '900',
  },
  navigation: {
    alignItems: 'stretch',
    alignSelf: 'stretch',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  tab: {
    alignItems: 'center',
    borderBottomColor: 'transparent',
    borderBottomWidth: 2,
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    minWidth: 88,
    paddingHorizontal: 10,
    paddingTop: 2,
  },
  activeTab: {
    borderBottomColor: CourseColors.primary,
  },
  pressedTab: {
    opacity: 0.68,
  },
  label: {
    color: CourseColors.muted,
    fontFamily: APP_NAVIGATION_FONT,
    fontSize: 18,
    fontWeight: '700',
  },
  activeLabel: {
    color: CourseColors.primaryDark,
    fontWeight: '900',
  },
  notificationButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    marginLeft: 10,
    position: 'relative',
    width: 40,
  },
  notificationBadge: {
    alignItems: 'center',
    backgroundColor: CourseColors.error,
    borderColor: CourseColors.background,
    borderRadius: 8,
    borderWidth: 1,
    height: 16,
    justifyContent: 'center',
    minWidth: 16,
    paddingHorizontal: 3,
    position: 'absolute',
    right: 0,
    top: 1,
  },
  notificationBadgeText: {
    color: CourseColors.white,
    fontSize: 9,
    fontWeight: '900',
  },
});
