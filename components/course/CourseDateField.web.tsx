import { CourseColors } from '@/constants/course-colors';

type CourseDateFieldProps = {
  error?: boolean;
  label: string;
  minimumDate?: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

export function CourseDateField({ error, label, minimumDate, onChange, placeholder, value }: CourseDateFieldProps) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      <span style={{ ...styles.inputShell, ...(error ? styles.inputError : {}) }}>
        <span aria-hidden style={styles.icon}>◷</span>
        <input
          aria-label={`${label} 선택`}
          min={minimumDate || undefined}
          onChange={(event) => onChange(event.currentTarget.value)}
          placeholder={placeholder}
          style={styles.input}
          type="date"
          value={value}
        />
      </span>
    </label>
  );
}

const styles = {
  field: {
    display: 'flex',
    flexBasis: '46%',
    flexDirection: 'column' as const,
    flexGrow: 1,
    gap: 8,
    minWidth: 0,
  },
  icon: {
    color: CourseColors.primary,
    fontWeight: 900,
    marginRight: 8,
  },
  input: {
    backgroundColor: 'transparent',
    border: 0,
    color: CourseColors.text,
    flex: 1,
    fontFamily: 'inherit',
    fontSize: 14,
    minWidth: 0,
    outline: 'none',
    padding: '13px 0',
  },
  inputShell: {
    alignItems: 'center',
    backgroundColor: CourseColors.background,
    border: `1px solid ${CourseColors.border}`,
    borderRadius: 15,
    display: 'flex',
    padding: '0 13px',
  },
  inputError: {
    backgroundColor: '#FFF9F6',
    borderColor: '#E6BDB3',
  },
  label: {
    color: CourseColors.text,
    fontSize: 14,
    fontWeight: 800,
  },
};
