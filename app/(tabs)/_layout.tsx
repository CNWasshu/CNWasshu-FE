import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { DesktopTabBar } from '@/components/navigation/DesktopTabBar';
import { CourseColors } from '@/constants/course-colors';
import { PAGE_LAYOUT } from '@/constants/layout';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isDesktopWeb =
    Platform.OS === 'web' && width >= PAGE_LAYOUT.desktopNavigationBreakpoint;

  return (
    <Tabs
      tabBar={isDesktopWeb ? (props) => <DesktopTabBar {...props} /> : undefined}
      screenOptions={{
        tabBarActiveTintColor: CourseColors.primary,
        tabBarInactiveTintColor: CourseColors.muted,
        headerShown: false,
        sceneStyle: isDesktopWeb ? { paddingTop: PAGE_LAYOUT.desktopNavigationHeight } : undefined,
        tabBarButton: isDesktopWeb ? undefined : HapticTab,
        tabBarIconStyle: isDesktopWeb ? undefined : { marginTop: -2 },
        tabBarLabelStyle: isDesktopWeb ? undefined : { fontSize: 12, lineHeight: 16, marginBottom: 2 },
        tabBarStyle: isDesktopWeb
          ? undefined
          : {
              height: Platform.OS === 'ios' ? 84 : 68,
              paddingBottom: Platform.OS === 'ios' ? 12 : 8,
              paddingTop: 4,
            },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, focused, size }) => <Ionicons color={color} name={focused ? 'home' : 'home-outline'} size={size} />,
        }}
      />
      <Tabs.Screen
        name="timetable"
        options={{
          title: '일정',
          tabBarIcon: ({ color, focused, size }) => <Ionicons color={color} name={focused ? 'calendar' : 'calendar-outline'} size={size} />,
        }}
      />
      <Tabs.Screen
        name="course"
        options={{
          title: '코스',
          tabBarIcon: ({ color, focused, size }) => <Ionicons color={color} name={focused ? 'map' : 'map-outline'} size={size} />,
        }}
      />
      <Tabs.Screen
        name="stamp"
        options={{
          title: '스탬프',
          tabBarIcon: ({ color, focused, size }) => <Ionicons color={color} name={focused ? 'ribbon' : 'ribbon-outline'} size={size} />,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: '내 정보',
          tabBarIcon: ({ color, focused, size }) => <Ionicons color={color} name={focused ? 'person' : 'person-outline'} size={size} />,
        }}
      />
    </Tabs>
  );
}
