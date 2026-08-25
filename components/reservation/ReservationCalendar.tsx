import {
    useMemo,
    useState,
} from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface ReservationCalendarProps {
  selectedDate: string | null;
  startDate: string | null;
  endDate: string | null;
  todayAvailable: boolean | null;

  onDateSelect: (
    date: string
  ) => void;
}

const DAY_LABELS = [
  '일',
  '월',
  '화',
  '수',
  '목',
  '금',
  '토',
];

function toDateString(
  year: number,
  month: number,
  day: number
) {
  return `${year}-${String(
    month + 1
  ).padStart(2, '0')}-${String(
    day
  ).padStart(2, '0')}`;
}

function getTodayString() {
  const today = new Date();

  return toDateString(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
}

export function ReservationCalendar({
  selectedDate,
  startDate,
  endDate,
  todayAvailable,
  onDateSelect,
}: ReservationCalendarProps) {
  const today = new Date();

  const [currentYear, setCurrentYear] =
    useState(today.getFullYear());

  const [
    currentMonth,
    setCurrentMonth,
  ] = useState(today.getMonth());

  const todayString =
    getTodayString();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(
      currentYear,
      currentMonth,
      1
    ).getDay();

    const lastDate = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();

    const result: (
      | number
      | null
    )[] = [];

    for (
      let index = 0;
      index < firstDay;
      index += 1
    ) {
      result.push(null);
    }

    for (
      let day = 1;
      day <= lastDate;
      day += 1
    ) {
      result.push(day);
    }

    while (
      result.length % 7 !== 0
    ) {
      result.push(null);
    }

    return result;
  }, [
    currentYear,
    currentMonth,
  ]);

  const isDisabled = (
    date: string
  ) => {
    if (date < todayString) {
      return true;
    }

    if (
      startDate &&
      date < startDate
    ) {
      return true;
    }

    if (
      endDate &&
      date > endDate
    ) {
      return true;
    }

    if (
      date === todayString &&
      todayAvailable === false
    ) {
      return true;
    }

    return false;
  };

  const previousDisabled =
    currentYear ===
      today.getFullYear() &&
    currentMonth ===
      today.getMonth();

  const previousMonth = () => {
    if (previousDisabled) {
      return;
    }

    if (currentMonth === 0) {
      setCurrentYear(
        current => current - 1
      );
      setCurrentMonth(11);
      return;
    }

    setCurrentMonth(
      current => current - 1
    );
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(
        current => current + 1
      );
      setCurrentMonth(0);
      return;
    }

    setCurrentMonth(
      current => current + 1
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Pressable
          disabled={previousDisabled}
          onPress={previousMonth}
          style={styles.arrowButton}
        >
          <Text
            style={[
              styles.arrow,
              previousDisabled &&
                styles.arrowDisabled,
            ]}
          >
            ‹
          </Text>
        </Pressable>

        <Text style={styles.month}>
          {currentYear}년{' '}
          {currentMonth + 1}월
        </Text>

        <Pressable
          onPress={nextMonth}
          style={styles.arrowButton}
        >
          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {DAY_LABELS.map(
          (label, index) => (
            <View
              key={label}
              style={styles.cell}
            >
              <Text
                style={[
                  styles.weekText,
                  index === 0 &&
                    styles.sunday,
                  index === 6 &&
                    styles.saturday,
                ]}
              >
                {label}
              </Text>
            </View>
          )
        )}
      </View>

      <View style={styles.dayGrid}>
        {calendarDays.map(
          (day, index) => {
            if (day === null) {
              return (
                <View
                  key={`empty-${index}`}
                  style={styles.cell}
                />
              );
            }

            const date =
              toDateString(
                currentYear,
                currentMonth,
                day
              );

            const disabled =
              isDisabled(date);

            const selected =
              selectedDate === date;

            const isToday =
              date === todayString;

            return (
              <View
                key={date}
                style={styles.cell}
              >
                <Pressable
                  disabled={disabled}
                  onPress={() =>
                    onDateSelect(date)
                  }
                  style={[
                    styles.dateButton,

                    isToday &&
                      !selected &&
                      !disabled &&
                      styles.today,

                    selected &&
                      styles.selected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateText,

                      disabled &&
                        styles.disabledText,

                      selected &&
                        styles.selectedText,
                    ]}
                  >
                    {day}
                  </Text>
                </Pressable>
              </View>
            );
          }
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#efe3ce',
    borderRadius: 22,
    backgroundColor: '#ffffff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginBottom: 14,
  },

  month: {
    fontSize: 17,
    fontWeight: '800',
    color: '#29251e',
  },

  arrowButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: '#f8f0e2',
  },

  arrow: {
    marginTop: -3,
    fontSize: 28,
    color: '#5f5139',
  },

  arrowDisabled: {
    color: '#cfc5b5',
  },

  weekRow: {
    flexDirection: 'row',
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#f3eadb',
  },

  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },

  cell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    paddingVertical: 4,
  },

  weekText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#817664',
  },

  sunday: {
    color: '#c56a5d',
  },

  saturday: {
    color: '#6580a6',
  },

  dateButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
  },

  today: {
    borderWidth: 1,
    borderColor: '#79ad69',
    backgroundColor: '#f5fbf2',
  },

  selected: {
    backgroundColor: '#3f7d46',
  },

  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4c4438',
  },

  disabledText: {
    color: '#cdc7bd',
  },

  selectedText: {
    fontWeight: '800',
    color: '#ffffff',
  },
});