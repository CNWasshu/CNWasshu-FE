import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';
import { formatDate } from '@/utils/timetable/date';

type TimetableDateRangeProps = {
  endDate: Date;
  errorMessage: string | null;
  maximumEndDate: Date;
  minimumStartDate: Date;
  onChangeEndDate: (date: Date) => void;
  onChangeStartDate: (date: Date) => void;
  startDate: Date;
};

type ActiveDateField = 'endDate' | 'startDate';

type DateFieldProps = {
  label: string;
  onPress: () => void;
  value: Date;
};

function DateField({ label, onPress, value }: DateFieldProps) {
  return (
    <Pressable accessibilityLabel={`${label} 선택`} accessibilityRole="button" onPress={onPress} style={styles.dateField}>
      <View>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.dateValue}>{formatDate(value)}</Text>
      </View>
      <Ionicons color={TIMETABLE_COLORS.primary} name="calendar-outline" size={19} />
    </Pressable>
  );
}

export function TimetableDateRange({
  endDate,
  errorMessage,
  maximumEndDate,
  minimumStartDate,
  onChangeEndDate,
  onChangeStartDate,
  startDate,
}: TimetableDateRangeProps) {
  const [activeDateField, setActiveDateField] = useState<ActiveDateField | null>(null);
  const selectedDate = activeDateField === 'startDate' ? startDate : endDate;

  const handleChangeDate = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setActiveDateField(null);
    }

    if (event.type !== 'set' || !date || !activeDateField) {
      return;
    }

    if (activeDateField === 'startDate') {
      onChangeStartDate(date);
      return;
    }

    onChangeEndDate(date);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>여행 일정 선택</Text>
      <View style={styles.fields}>
        <DateField label="출발일" onPress={() => setActiveDateField('startDate')} value={startDate} />
        <DateField label="도착일" onPress={() => setActiveDateField('endDate')} value={endDate} />
      </View>

      {activeDateField ? (
        <DateTimePicker
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          maximumDate={activeDateField === 'endDate' ? maximumEndDate : undefined}
          minimumDate={activeDateField === 'endDate' ? startDate : minimumStartDate}
          mode="date"
          onChange={handleChangeDate}
          value={selectedDate}
        />
      ) : null}

      <Text style={[styles.helperText, errorMessage && styles.errorText]}>
        {errorMessage ?? '선택한 여행 기간에 따라 Day 탭이 자동으로 생성됩니다.'}
      </Text>
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
    fontSize: 14,
    fontWeight: '700',
    marginTop: 5,
  },
  errorText: {
    color: '#B44836',
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
