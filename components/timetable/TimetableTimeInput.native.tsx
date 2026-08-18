import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';

type TimetableTimeInputProps = {
  disabled?: boolean;
  label: string;
  maximumTime?: string;
  minimumTime?: string;
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

function isTimeWithinRange(time: string, minimumTime: string, maximumTime: string) {
  return time >= minimumTime && time <= maximumTime;
}

function timeToMinutes(time: string) {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

function minutesToTime(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

function createTimeOptions(minimumTime: string, maximumTime: string) {
  const minimumMinutes = timeToMinutes(minimumTime);
  const maximumMinutes = timeToMinutes(maximumTime);

  if (maximumMinutes < minimumMinutes) {
    return [];
  }

  return Array.from(
    { length: Math.floor((maximumMinutes - minimumMinutes) / 5) + 1 },
    (_, index) => minutesToTime(minimumMinutes + index * 5)
  );
}

export function TimetableTimeInput({
  disabled,
  label,
  maximumTime = '22:00',
  minimumTime = '09:00',
  onChangeTime,
  value,
}: TimetableTimeInputProps) {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const timeOptions = createTimeOptions(minimumTime, maximumTime);

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'set' && date) {
      const nextTime = formatTime(date);

      if (isTimeWithinRange(nextTime, minimumTime, maximumTime)) {
        onChangeTime(nextTime);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityLabel={`${label} 선택`}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => setIsPickerVisible(true)}
        style={[styles.field, disabled && styles.disabledField]}>
        <Text style={styles.value}>{value}</Text>
        <Ionicons color={TIMETABLE_COLORS.text} name="time-outline" size={17} />
      </Pressable>
      {isPickerVisible ? (
        Platform.OS === 'android' ? (
          <Modal animationType="fade" onRequestClose={() => setIsPickerVisible(false)} transparent>
            <View style={styles.optionOverlay}>
              <View accessibilityViewIsModal style={styles.optionSheet}>
                <View style={styles.optionHeading}>
                  <Text style={styles.optionTitle}>{label} 선택</Text>
                  <Pressable
                    accessibilityLabel="시간 선택 닫기"
                    accessibilityRole="button"
                    onPress={() => setIsPickerVisible(false)}
                    style={styles.closeButton}>
                    <Ionicons color={TIMETABLE_COLORS.secondaryText} name="close" size={18} />
                  </Pressable>
                </View>
                <Text style={styles.optionDescription}>
                  {minimumTime}부터 {maximumTime}까지 선택할 수 있습니다.
                </Text>
                <ScrollView contentContainerStyle={styles.optionList}>
                  {timeOptions.map((time) => (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected: time === value }}
                      key={time}
                      onPress={() => {
                        onChangeTime(time);
                        setIsPickerVisible(false);
                      }}
                      style={[styles.option, time === value && styles.selectedOption]}>
                      <Text style={[styles.optionText, time === value && styles.selectedOptionText]}>
                        {time}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            display="spinner"
            is24Hour
            maximumDate={timeToDate(maximumTime)}
            minimumDate={timeToDate(minimumTime)}
            minuteInterval={5}
            mode="time"
            onChange={handleChange}
            value={timeToDate(value)}
          />
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  closeButton: { alignItems: 'center', backgroundColor: '#F2EADB', borderRadius: 18, height: 36, justifyContent: 'center', width: 36 },
  disabledField: { backgroundColor: '#F3EFE7', opacity: 0.8 },
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
  option: { alignItems: 'center', borderRadius: 10, paddingVertical: 11 },
  optionDescription: { color: TIMETABLE_COLORS.secondaryText, fontSize: 12, marginTop: 5 },
  optionHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  optionList: { paddingVertical: 10 },
  optionOverlay: { alignItems: 'center', backgroundColor: 'rgba(31, 27, 21, 0.48)', flex: 1, justifyContent: 'center', padding: 20 },
  optionSheet: { backgroundColor: TIMETABLE_COLORS.background, borderRadius: 20, maxHeight: '72%', maxWidth: 340, padding: 16, width: '100%' },
  optionText: { color: TIMETABLE_COLORS.text, fontSize: 15, fontWeight: '700' },
  optionTitle: { color: TIMETABLE_COLORS.text, fontSize: 18, fontWeight: '800' },
  selectedOption: { backgroundColor: TIMETABLE_COLORS.primary },
  selectedOptionText: { color: '#FFFFFF' },
  value: { color: TIMETABLE_COLORS.text, fontSize: 14 },
});
