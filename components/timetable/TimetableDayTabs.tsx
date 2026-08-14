import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';
import type { TimetableDay } from '@/types/timetable';

type TimetableDayTabsProps = {
  days: TimetableDay[];
  onSelectDay: (dayId: string) => void;
  selectedDayId: string;
};

export function TimetableDayTabs({
  days,
  onSelectDay,
  selectedDayId,
}: TimetableDayTabsProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}>
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
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 8,
    paddingHorizontal: 18,
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
