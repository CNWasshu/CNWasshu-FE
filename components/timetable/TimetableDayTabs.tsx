import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';
import type { TimetableDay } from '@/types/timetable';

type TimetableDayTabsProps = {
  days: TimetableDay[];
  onSelectDay: (dayId: string) => void;
  selectedDayId: string;
};

const TAB_SCROLL_STEP = 112;

export function TimetableDayTabs({
  days,
  onSelectDay,
  selectedDayId,
}: TimetableDayTabsProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const maximumScrollOffset = Math.max(0, contentWidth - viewportWidth);
  const canScrollLeft = scrollOffset > 1;
  const canScrollRight = scrollOffset < maximumScrollOffset - 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollOffset(event.nativeEvent.contentOffset.x);
  };

  const scrollBy = (distance: number) => {
    const nextOffset = Math.min(
      maximumScrollOffset,
      Math.max(0, scrollOffset + distance)
    );
    scrollViewRef.current?.scrollTo({ animated: true, x: nextOffset });
  };

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="이전 날짜 보기"
        accessibilityRole="button"
        disabled={!canScrollLeft}
        onPress={() => scrollBy(-TAB_SCROLL_STEP)}
        style={[styles.arrowButton, !canScrollLeft && styles.disabledArrow]}>
        <Ionicons color={TIMETABLE_COLORS.primary} name="chevron-back" size={18} />
      </Pressable>

      <ScrollView
        contentContainerStyle={styles.content}
        decelerationRate="fast"
        horizontal
        onContentSizeChange={(width) => setContentWidth(width)}
        onLayout={(event) => setViewportWidth(event.nativeEvent.layout.width)}
        onScroll={handleScroll}
        ref={scrollViewRef}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}>
        {days.map((day) => {
          const isSelected = day.id === selectedDayId;

          return (
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              key={day.id}
              onPress={() => onSelectDay(day.id)}
              style={[styles.tab, isSelected && styles.selectedTab]}>
              <Text style={[styles.dayLabel, isSelected && styles.selectedText]}>
                {day.dayLabel} ({day.date})
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable
        accessibilityLabel="다음 날짜 보기"
        accessibilityRole="button"
        disabled={!canScrollRight}
        onPress={() => scrollBy(TAB_SCROLL_STEP)}
        style={[styles.arrowButton, !canScrollRight && styles.disabledArrow]}>
        <Ionicons color={TIMETABLE_COLORS.primary} name="chevron-forward" size={18} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  arrowButton: {
    alignItems: 'center',
    backgroundColor: TIMETABLE_COLORS.primaryLight,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
  },
  content: {
    gap: 8,
    paddingHorizontal: 2,
  },
  disabledArrow: {
    opacity: 0.3,
  },
  dayLabel: {
    color: TIMETABLE_COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },
  selectedTab: {
    backgroundColor: TIMETABLE_COLORS.primary,
    borderColor: TIMETABLE_COLORS.primary,
  },
  selectedText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  tab: {
    alignItems: 'center',
    backgroundColor: TIMETABLE_COLORS.card,
    borderColor: TIMETABLE_COLORS.border,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 104,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
});
