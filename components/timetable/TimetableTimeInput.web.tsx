import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';
import { DAY_END_TIME, DAY_START_TIME } from '@/utils/timetable/time';

type TimetableTimeInputProps = {
  disabled?: boolean;
  label: string;
  maximumTime?: string;
  minimumTime?: string;
  onChangeTime: (time: string) => void;
  value: string;
};

export function TimetableTimeInput({
  disabled,
  label,
  maximumTime = DAY_END_TIME,
  minimumTime = DAY_START_TIME,
  onChangeTime,
  value,
}: TimetableTimeInputProps) {
  const handleChangeTime = (time: string) => {
    if (time >= minimumTime && time <= maximumTime) {
      onChangeTime(time);
    }
  };

  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      <input
        aria-label={label}
        disabled={disabled}
        max={maximumTime}
        min={minimumTime}
        onChange={(event) => handleChangeTime(event.currentTarget.value)}
        step={300}
        style={styles.input}
        type="time"
        value={value}
      />
    </label>
  );
}

const styles = {
  field: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column' as const,
    minWidth: 0,
  },
  input: {
    backgroundColor: '#FFFCF6',
    border: `1px solid ${TIMETABLE_COLORS.border}`,
    borderRadius: 12,
    boxSizing: 'border-box' as const,
    color: TIMETABLE_COLORS.text,
    fontFamily: 'inherit',
    fontSize: 14,
    height: 46,
    marginTop: 7,
    outlineColor: TIMETABLE_COLORS.primary,
    padding: '0 12px',
    width: '100%',
  },
  label: {
    color: TIMETABLE_COLORS.text,
    fontSize: 12,
    fontWeight: 700,
  },
};
