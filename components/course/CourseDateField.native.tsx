import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CourseColors } from '@/constants/course-colors';
import {
  formatDate,
  parseDate,
} from '@/utils/timetable/date';

type CourseDateFieldProps = {
  error?: boolean;
  label: string;
  minimumDate?: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

export function CourseDateField({
  error,
  label,
  minimumDate,
  onChange,
  placeholder,
  value,
}: CourseDateFieldProps) {
  const [isPickerOpen, setIsPickerOpen] =
    useState(false);

  const selectedDate = value
    ? parseDate(value)
    : new Date();

  const handleChange = (
    event: DateTimePickerEvent,
    date?: Date,
  ) => {
    if (Platform.OS === 'android') {
      setIsPickerOpen(false);
    }

    if (event.type === 'set' && date) {
      onChange(formatDate(date));
    }
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityLabel={`${label} 선택`}
        accessibilityRole="button"
        onPress={() =>
          setIsPickerOpen((open) => !open)
        }
        style={[
          styles.field,
          error && styles.fieldError,
        ]}
      >
        <View style={styles.textArea}>
          <Text style={styles.label}>
            {label}
          </Text>

          <Text
            style={[
              styles.value,
              !value && styles.placeholder,
            ]}
          >
            {value || placeholder}
          </Text>
        </View>

        <Ionicons
          color={CourseColors.text}
          name="calendar-outline"
          size={20}
        />
      </Pressable>

      {isPickerOpen ? (
        <DateTimePicker
          display={
            Platform.OS === 'ios'
              ? 'inline'
              : 'default'
          }
          minimumDate={
            minimumDate
              ? parseDate(minimumDate)
              : undefined
          }
          mode="date"
          onChange={handleChange}
          value={selectedDate}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexBasis: '46%',
    flexGrow: 1,
  },

  field: {
    alignItems: 'center',
    backgroundColor: CourseColors.background,
    borderColor: CourseColors.border,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 58,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },

  fieldError: {
    backgroundColor: '#FFF9F6',
    borderColor: '#E6BDB3',
  },

  textArea: {
    flex: 1,
    gap: 2,
  },

  label: {
    color: CourseColors.muted,
    fontSize: 11,
    fontWeight: '800',
  },

  value: {
    color: CourseColors.text,
    fontSize: 14,
    fontWeight: '800',
  },

  placeholder: {
    color: '#A49A8A',
    fontWeight: '600',
  },
});