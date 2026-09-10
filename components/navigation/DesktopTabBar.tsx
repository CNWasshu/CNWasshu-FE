import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CourseColors } from '@/constants/course-colors';

const TAB_LABELS: Record<string, string> = {
  index: '홈',
  timetable: '타임테이블',
  course: '코스',
  stamp: '스탬프',
  mypage: '마이페이지',
};

export function DesktopTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.bar}>
      <View style={styles.inner}>
        <Pressable
          accessibilityRole="link"
          onPress={() => navigation.navigate('index')}
          style={styles.brand}>
          <Text style={styles.brandTitle}>충남왔슈</Text>
          <Text style={styles.brandDescription}>충남 여행을 한곳에서</Text>
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
                {options.tabBarIcon?.({ color, focused, size: 21 })}
                <Text style={[styles.label, focused && styles.activeLabel]}>
                  {TAB_LABELS[route.name] ?? options.title ?? route.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: CourseColors.white,
    borderBottomColor: CourseColors.border,
    borderBottomWidth: 1,
    height: 68,
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
    maxWidth: 1200,
    paddingHorizontal: 24,
    width: '100%',
  },
  brand: {
    justifyContent: 'center',
    minHeight: 48,
  },
  brandTitle: {
    color: CourseColors.primaryDark,
    fontSize: 18,
    fontWeight: '900',
  },
  brandDescription: {
    color: CourseColors.muted,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  navigation: {
    alignItems: 'stretch',
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    alignItems: 'center',
    borderBottomColor: 'transparent',
    borderBottomWidth: 3,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minWidth: 104,
    paddingHorizontal: 12,
    paddingTop: 3,
  },
  activeTab: {
    backgroundColor: CourseColors.primarySoft,
    borderBottomColor: CourseColors.primary,
  },
  pressedTab: {
    opacity: 0.68,
  },
  label: {
    color: CourseColors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  activeLabel: {
    color: CourseColors.primaryDark,
    fontWeight: '900',
  },
});
