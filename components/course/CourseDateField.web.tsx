import { CourseColors } from '@/constants/course-colors';

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
  return (
    <label
      style={{
        ...styles.field,
        ...(error ? styles.fieldError : {}),
      }}
    >
      <span style={styles.label}>{label}</span>

      <input
        aria-label={`${label} 선택`}
        min={minimumDate || undefined}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={placeholder}
        style={styles.input}
        type="date"
        value={value}
      />
    </label>
  );
}

const styles = {
  field: {
    backgroundColor: CourseColors.background,
    border: `1px solid ${CourseColors.border}`,
    borderRadius: 15,
    boxSizing: 'border-box' as const,
    cursor: 'pointer',
    display: 'flex',
    flexBasis: '46%',
    flexDirection: 'column' as const,
    flexGrow: 1,
    gap: 2,
    justifyContent: 'center',
    minHeight: 58,
    minWidth: 0,
    padding: '7px 13px',
  },

  fieldError: {
    backgroundColor: '#FFF9F6',
    borderColor: '#E6BDB3',
  },

  label: {
    color: CourseColors.muted,
    fontSize: 11,
    fontWeight: 800,
  },

  input: {
    backgroundColor: 'transparent',
    border: 0,
    color: CourseColors.text,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 14,
    fontWeight: 800,
    minWidth: 0,
    outline: 'none',
    padding: 0,
    width: '100%',
  },
};