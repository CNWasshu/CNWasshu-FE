import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';

type TimetableDateRangeProps = {
  endDate: string;
  startDate: string;
};

type DateFieldProps = {
  label: string;
  value: string;
};

function DateField({ label, value }: DateFieldProps) {
  return (
    <Pressable accessibilityRole="button" style={styles.dateField}>
      <View>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.dateValue}>{value}</Text>
      </View>
      <Ionicons color={TIMETABLE_COLORS.primary} name="calendar-outline" size={20} />
    </Pressable>
  );
}

export function TimetableDateRange({ endDate, startDate }: TimetableDateRangeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>여행 기본 조건</Text>
      <View style={styles.fields}>
        <DateField label="출발일" value={startDate} />
        <DateField label="도착일" value={endDate} />
      </View>
      <Text style={styles.helperText}>선택한 여행 기간에 따라 Day 탭이 자동으로 생성됩니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: TIMETABLE_COLORS.card,
    borderColor: TIMETABLE_COLORS.border,
    borderRadius: 22,
    borderWidth: 1,
    marginHorizontal: 18,
    marginTop: 18,
    padding: 14,
  },
  dateField: {
    alignItems: 'center',
    backgroundColor: TIMETABLE_COLORS.card,
    borderColor: TIMETABLE_COLORS.border,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 58,
    paddingHorizontal: 12,
  },
  dateValue: {
    color: TIMETABLE_COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 5,
  },
  fieldLabel: {
    color: TIMETABLE_COLORS.secondaryText,
    fontSize: 11,
    fontWeight: '600',
  },
  fields: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  helperText: {
    color: TIMETABLE_COLORS.secondaryText,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
  title: {
    color: TIMETABLE_COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },
});
