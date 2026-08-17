import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';

type TimetableTimeInputProps = {
  label: string;
  onChangeTime: (time: string) => void;
  value: string;
};

function timeToDate(time: string) {
  const [hour, minute] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

function formatTime(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function TimetableTimeInput({ label, onChangeTime, value }: TimetableTimeInputProps) {
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setIsPickerVisible(false);
    }

    if (event.type === 'set' && date) {
      onChangeTime(formatTime(date));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityLabel={`${label} 선택`}
        accessibilityRole="button"
        onPress={() => setIsPickerVisible(true)}
        style={styles.field}>
        <Text style={styles.value}>{value}</Text>
        <Ionicons color={TIMETABLE_COLORS.text} name="time-outline" size={17} />
      </Pressable>
      {isPickerVisible ? (
        <DateTimePicker
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour
          maximumDate={timeToDate('22:00')}
          minimumDate={timeToDate('09:00')}
          minuteInterval={5}
          mode="time"
          onChange={handleChange}
          value={timeToDate(value)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  field: {
    alignItems: 'center',
    backgroundColor: '#FFFCF6',
    borderColor: TIMETABLE_COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 46,
    justifyContent: 'space-between',
    marginTop: 7,
    paddingHorizontal: 12,
  },
  label: { color: TIMETABLE_COLORS.text, fontSize: 12, fontWeight: '700' },
  value: { color: TIMETABLE_COLORS.text, fontSize: 14 },
});
