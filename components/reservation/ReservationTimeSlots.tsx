import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { ReservationTimeSlot } from '@/types/reservation';

interface ReservationTimeSlotsProps {
  availableTimes:
    ReservationTimeSlot[];

  selectedTime: string | null;

  onTimeSelect: (
    time: string
  ) => void;
}

export function ReservationTimeSlots({
  availableTimes,
  selectedTime,
  onTimeSelect,
}: ReservationTimeSlotsProps) {
  if (
    availableTimes.length === 0
  ) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          예약 가능한 시간이 없습니다.
        </Text>

        <Text style={styles.emptySub}>
          다른 날짜를 선택해 주세요.
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.grid}>
        {availableTimes.map(slot => {
          const selected =
            selectedTime === slot.time;

          return (
            <Pressable
              key={slot.time}
              disabled={!slot.available}
              onPress={() =>
                onTimeSelect(slot.time)
              }
              style={[
                styles.button,

                !slot.available &&
                  styles.disabled,

                selected &&
                  styles.selected,
              ]}
            >
              <Text
                style={[
                  styles.time,

                  !slot.available &&
                    styles.disabledText,

                  selected &&
                    styles.selectedText,
                ]}
              >
                {slot.time.slice(
                  0,
                  5
                )}
              </Text>

              {!slot.available && (
                <Text
                  style={
                    styles.unavailable
                  }
                >
                  예약 불가
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.notice}>
        예약 불가능한 시간은 회색으로
        표시됩니다.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  button: {
    width: '31%',
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E0D5',
    borderRadius: 14,
    backgroundColor: '#ffffff',
  },

  selected: {
    borderColor: '#3F7045',
    backgroundColor: '#3F7045',
  },

  disabled: {
    borderColor: '#e8e5df',
    backgroundColor: '#efefed',
  },

  time: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5d4a2a',
  },

  selectedText: {
    color: '#ffffff',
  },

  disabledText: {
    color: '#a9a59e',
  },

  unavailable: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: '#aaa7a0',
  },

  notice: {
    marginTop: 9,
    fontSize: 13,
    color: '#8a806f',
  },

  empty: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 18,
    backgroundColor: '#f1e6d3',
  },

  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b5730',
  },

  emptySub: {
    marginTop: 4,
    fontSize: 13,
    color: '#8a7d67',
  },
});