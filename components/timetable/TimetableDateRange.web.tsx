import { StyleSheet, Text, View } from 'react-native';

import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';
import { formatDate, parseDate } from '@/utils/timetable/date';

type TimetableDateRangeProps = {
  endDate: Date;
  errorMessage: string | null;
  maximumEndDate: Date;
  minimumStartDate: Date;
  onChangeEndDate: (date: Date) => void;
  onChangeStartDate: (date: Date) => void;
  startDate: Date;
};

type DateFieldProps = {
  label: string;
  maximumDate?: Date;
  minimumDate: Date;
  onChangeDate: (date: Date) => void;
  value: Date;
};

function DateField({ label, maximumDate, minimumDate, onChangeDate, value }: DateFieldProps) {
  return (
    <label style={webStyles.field}>
      <span style={webStyles.label}>{label}</span>
      <input
        aria-label={`${label} 선택`}
        max={maximumDate ? formatDate(maximumDate) : undefined}
        min={formatDate(minimumDate)}
        onChange={(event) => onChangeDate(parseDate(event.currentTarget.value))}
        style={webStyles.input}
        type="date"
        value={formatDate(value)}
      />
    </label>
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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>여행 기본 조건</Text>
      <View style={styles.fields}>
        <DateField
          label="출발일"
          minimumDate={minimumStartDate}
          onChangeDate={onChangeStartDate}
          value={startDate}
        />
        <DateField
          label="도착일"
          maximumDate={maximumEndDate}
          minimumDate={startDate}
          onChangeDate={onChangeEndDate}
          value={endDate}
        />
      </View>
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
  errorText: {
    color: '#B44836',
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

const webStyles = {
  field: {
    backgroundColor: TIMETABLE_COLORS.card,
    border: `1px solid ${TIMETABLE_COLORS.border}`,
    borderRadius: 16,
    display: 'flex',
    flex: 1,
    flexDirection: 'column' as const,
    minWidth: 0,
    padding: '9px 12px',
  },
  input: {
    backgroundColor: 'transparent',
    border: 0,
    color: TIMETABLE_COLORS.text,
    fontFamily: 'inherit',
    fontSize: 14,
    fontWeight: 700,
    marginTop: 4,
    minWidth: 0,
    outline: 'none',
    padding: 0,
    width: '100%',
  },
  label: {
    color: TIMETABLE_COLORS.secondaryText,
    fontSize: 11,
    fontWeight: 600,
  },
};
