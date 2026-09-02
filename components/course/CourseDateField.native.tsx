import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { CourseColors } from '@/constants/course-colors';
import { formatDate, parseDate } from '@/utils/timetable/date';

type CourseDateFieldProps = {
  error?: boolean;
  label: string;
  minimumDate?: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

export function CourseDateField({ error, label, minimumDate, onChange, placeholder, value }: CourseDateFieldProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const selectedDate = value ? parseDate(value) : new Date();

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setIsPickerOpen(false);
    }
    if (event.type === 'set' && date) {
      onChange(formatDate(date));
    }
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityLabel={`${label} 선택`}
        accessibilityRole="button"
        onPress={() => setIsPickerOpen((open) => !open)}
        style={[styles.inputShell, error && styles.inputError]}
      >
        <Ionicons color={CourseColors.primary} name="calendar-outline" size={18} />
        <Text style={[styles.value, !value && styles.placeholder]}>{value || placeholder}</Text>
      </Pressable>
      {isPickerOpen ? (
        <DateTimePicker
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          minimumDate={minimumDate ? parseDate(minimumDate) : undefined}
          mode="date"
          onChange={handleChange}
          value={selectedDate}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { flexBasis: '46%', flexGrow: 1, gap: 8 },
  inputShell: {
    alignItems: 'center',
    backgroundColor: CourseColors.background,
    borderColor: CourseColors.border,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 13,
  },
  inputError: { backgroundColor: '#FFF9F6', borderColor: '#E6BDB3' },
  label: { color: CourseColors.text, fontSize: 14, fontWeight: '800' },
  placeholder: { color: '#A49A8A' },
  value: { color: CourseColors.text, flex: 1, fontSize: 14 },
});
