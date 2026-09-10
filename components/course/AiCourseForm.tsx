import { CourseDateField } from '@/components/course/CourseDateField';
import { CourseColors } from '@/constants/course-colors';
import { CHUNGNAM_REGIONS } from '@/constants/regions';
import type { AiRecommendationRequest, Transportation, TravelStyle } from '@/types/course';
import { formatDate } from '@/utils/timetable/date';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const TRANSPORTATION: { label: string; value: Transportation }[] = [
  { label: '자차', value: 'CAR' },
  { label: '대중교통', value: 'PUBLIC_TRANSIT' },
  { label: '도보 중심', value: 'WALKING' },
];

const STYLES: { label: string; value: TravelStyle }[] = [
  { label: '힐링', value: 'HEALING' },
  { label: '아이와 함께', value: 'WITH_CHILD' },
  { label: '먹거리 중심', value: 'FOOD' },
  { label: '사진 명소', value: 'PHOTO_SPOT' },
];

const TODAY = formatDate(new Date());

type ValidationErrors = {
  date?: string;
  region?: string;
  people?: string;
};

interface Props {
  loading: boolean;
  onSubmit: (request: AiRecommendationRequest) => void;
  onValidationError?: (offsetY: number) => void;
}

export function AiCourseForm({
  loading,
  onSubmit,
  onValidationError,
}: Props) {
  const [startDate, setStartDate] = useState(TODAY);
  const [endDate, setEndDate] = useState(TODAY);
  const [region, setRegion] = useState('');
  const [peopleCount, setPeopleCount] = useState(2);
  const [transportation, setTransportation] =
    useState<Transportation>('CAR');
  const [travelStyle, setTravelStyle] =
    useState<TravelStyle>('HEALING');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [fieldOffsets, setFieldOffsets] = useState({
    date: 0,
    region: 0,
    people: 0,
  });

  const changeStartDate = (value: string) => {
    setStartDate(value);

    if (endDate && value > endDate) {
      setEndDate(value);
    }

    setErrors((current) => ({
      ...current,
      date: undefined,
    }));
  };

  const changeEndDate = (value: string) => {
    setEndDate(value);

    setErrors((current) => ({
      ...current,
      date: undefined,
    }));
  };

  const changeRegion = (value: string) => {
    setRegion(value);

    setErrors((current) => ({
      ...current,
      region: undefined,
    }));
  };

  const changePeopleCount = (value: number) => {
    setPeopleCount(value);

    setErrors((current) => ({
      ...current,
      people: undefined,
    }));
  };

  const submit = () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const nextErrors: ValidationErrors = {};

    if (
      !datePattern.test(startDate) ||
      !datePattern.test(endDate)
    ) {
      nextErrors.date = '출발일과 도착일을 선택해 주세요.';
    } else if (startDate > endDate) {
      nextErrors.date = '도착일은 출발일보다 빠를 수 없습니다.';
    }

    if (!region) {
      nextErrors.region = '희망 지역을 선택해 주세요.';
    }

    if (
      !Number.isInteger(peopleCount) ||
      peopleCount < 1
    ) {
      nextErrors.people = '인원수는 1명 이상이어야 합니다.';
    }

    setErrors(nextErrors);

    const firstError = (
      ['date', 'region', 'people'] as const
    ).find((field) => nextErrors[field]);

    if (firstError) {
      onValidationError?.(fieldOffsets[firstError]);
      return;
    }

    onSubmit({
      startDate,
      endDate,
      region,
      peopleCount,
      transportation,
      travelStyle,
    });
  };

  return (
    <View style={styles.form}>
      <View style={styles.formHeading}>
        <View style={styles.formIcon}>
          <Ionicons
            color={CourseColors.primary}
            name="sparkles-outline"
            size={18}
          />
        </View>

        <Text style={styles.sectionTitle}>
          여행 정보
        </Text>
      </View>

      <View
        onLayout={({ nativeEvent }) =>
          setFieldOffsets((current) => ({
            ...current,
            date: nativeEvent.layout.y,
          }))
        }
        style={styles.field}
      >
        <View style={styles.fieldGrid}>
          <CourseDateField
            error={Boolean(errors.date)}
            label="출발일"
            value={startDate}
            onChange={changeStartDate}
            placeholder="날짜 선택"
          />

          <CourseDateField
            error={Boolean(errors.date)}
            label="도착일"
            minimumDate={startDate}
            value={endDate}
            onChange={changeEndDate}
            placeholder="날짜 선택"
          />
        </View>

        {errors.date ? (
          <FieldError message={errors.date} />
        ) : null}
      </View>

      <View
        onLayout={({ nativeEvent }) =>
          setFieldOffsets((current) => ({
            ...current,
            region: nativeEvent.layout.y,
          }))
        }
      >
        <RegionChoice
          error={errors.region}
          value={region}
          onChange={changeRegion}
        />
      </View>

      <View
        onLayout={({ nativeEvent }) =>
          setFieldOffsets((current) => ({
            ...current,
            people: nativeEvent.layout.y,
          }))
        }
      >
        <PeopleStepper
          error={errors.people}
          value={peopleCount}
          onChange={changePeopleCount}
        />
      </View>

      <Choice
        label="이동 방식"
        options={TRANSPORTATION}
        value={transportation}
        onChange={setTransportation}
      />

      <Choice
        label="여행 스타일"
        options={STYLES}
        value={travelStyle}
        onChange={setTravelStyle}
      />

      <Pressable
        accessibilityRole="button"
        disabled={loading}
        onPress={submit}
        style={({ pressed }) => [
          styles.button,
          loading && styles.loadingButton,
          pressed &&
            !loading &&
            styles.buttonPressed,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={CourseColors.white}
            size="small"
          />
        ) : null}

        <Text style={styles.buttonText}>
          {loading
            ? 'AI가 코스를 만들고 있어요'
            : '추천 코스 만들기'}
        </Text>

        {!loading ? (
          <Ionicons
            color={CourseColors.white}
            name="arrow-forward"
            size={18}
          />
        ) : null}
      </Pressable>
    </View>
  );
}

function FieldError({
  message,
}: {
  message: string;
}) {
  return (
    <View
      accessibilityLiveRegion="polite"
      style={styles.errorRow}
    >
      <Ionicons
        color={CourseColors.error}
        name="alert-circle-outline"
        size={16}
      />
      <Text style={styles.errorText}>
        {message}
      </Text>
    </View>
  );
}

function RegionChoice({
  error,
  value,
  onChange,
}: {
  error?: string;
  value: string;
  onChange: (region: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        희망 지역
      </Text>

      {!value && !error ? (
        <Text style={styles.regionGuide}>
          희망 지역을 선택해주세요
        </Text>
      ) : null}

      <View
        style={[
          styles.regionShell,
          error && styles.errorShell,
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.regionList}
          keyboardShouldPersistTaps="handled"
        >
          {CHUNGNAM_REGIONS.map(
            (regionName) => {
              const selected =
                value === regionName;

              return (
                <Pressable
                  key={regionName}
                  accessibilityRole="radio"
                  accessibilityState={{
                    checked: selected,
                  }}
                  hitSlop={3}
                  onPress={() =>
                    onChange(regionName)
                  }
                  style={[
                    styles.regionChip,
                    selected &&
                      styles.regionChipSelected,
                  ]}
                >
                  {selected ? (
                    <Ionicons
                      color={CourseColors.white}
                      name="checkmark"
                      size={15}
                    />
                  ) : null}

                  <Text
                    style={[
                      styles.regionChipText,
                      selected &&
                        styles.regionChipTextSelected,
                    ]}
                  >
                    {regionName}
                  </Text>
                </Pressable>
              );
            },
          )}
        </ScrollView>
      </View>

      {error ? (
        <FieldError message={error} />
      ) : null}
    </View>
  );
}

function PeopleStepper({
  error,
  value,
  onChange,
}: {
  error?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        인원수
      </Text>

      <View
        style={[
          styles.stepper,
          error && styles.errorShell,
        ]}
      >
        <Pressable
          accessibilityLabel="인원수 한 명 줄이기"
          accessibilityRole="button"
          accessibilityState={{
            disabled: value <= 1,
          }}
          disabled={value <= 1}
          onPress={() => onChange(value - 1)}
          style={[
            styles.stepperButton,
            value <= 1 &&
              styles.stepperDisabled,
          ]}
        >
          <Ionicons
            color={CourseColors.primaryDark}
            name="remove"
            size={22}
          />
        </Pressable>

        <Text
          accessibilityLiveRegion="polite"
          style={styles.peopleValue}
        >
          {value}명
        </Text>

        <Pressable
          accessibilityLabel="인원수 한 명 늘리기"
          accessibilityRole="button"
          onPress={() => onChange(value + 1)}
          style={styles.stepperButton}
        >
          <Ionicons
            color={CourseColors.primaryDark}
            name="add"
            size={22}
          />
        </Pressable>
      </View>

      {error ? (
        <FieldError message={error} />
      ) : null}
    </View>
  );
}

function Choice<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: {
    label: string;
    value: T;
  }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
      </Text>

      <View
        accessibilityRole="radiogroup"
        style={styles.choices}
      >
        {options.map((option) => (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{
              checked:
                value === option.value,
            }}
            hitSlop={2}
            onPress={() =>
              onChange(option.value)
            }
            style={[
              styles.choice,
              value === option.value &&
                styles.selected,
            ]}
          >
            {value === option.value ? (
              <Ionicons
                color={CourseColors.white}
                name="checkmark"
                size={16}
              />
            ) : null}

            <Text
              style={[
                styles.choiceText,
                value === option.value &&
                  styles.selectedText,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: CourseColors.white,
    borderRadius: 18,
    padding: 16,
    gap: 15,
    borderWidth: 1,
    borderColor: CourseColors.border,
  },

  formHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  formIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: CourseColors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: CourseColors.text,
  },

  fieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  field: {
    gap: 7,
  },

  label: {
    color: CourseColors.text,
    fontWeight: '800',
    fontSize: 14,
  },

  regionGuide: {
    color: CourseColors.muted,
    fontSize: 13,
  },

  regionShell: {
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: -3,
    paddingLeft: 3,
  },

  regionList: {
    gap: 6,
    paddingRight: 16,
  },

  regionChip: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
    minHeight: 38,
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: CourseColors.border,
    borderRadius: 999,
    backgroundColor: CourseColors.background,
  },

  regionChipSelected: {
    borderColor: CourseColors.primary,
    backgroundColor: CourseColors.primary,
  },

  regionChipText: {
    color: '#6B5730',
    fontSize: 13,
    fontWeight: '700',
  },

  regionChipTextSelected: {
    color: CourseColors.white,
    fontWeight: '800',
  },

  stepper: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: CourseColors.background,
    borderColor: CourseColors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 44,
  },

  stepperButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },

  stepperDisabled: {
    opacity: 0.35,
  },

  peopleValue: {
    color: CourseColors.text,
    fontSize: 15,
    fontWeight: '900',
    minWidth: 58,
    textAlign: 'center',
  },

  choices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  choice: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    minHeight: 40,
    borderWidth: 1,
    borderColor: CourseColors.border,
    backgroundColor: CourseColors.background,
    borderRadius: 999,
    paddingHorizontal: 13,
  },

  selected: {
    borderColor: CourseColors.primary,
    backgroundColor: CourseColors.primary,
  },

  choiceText: {
    color: '#6F6558',
    fontSize: 13,
    fontWeight: '700',
  },

  selectedText: {
    color: CourseColors.white,
    fontWeight: '800',
  },

  errorShell: {
    backgroundColor: '#FFF9F6',
    borderColor: '#E6BDB3',
  },

  errorRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },

  errorText: {
    color: CourseColors.error,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },

  button: {
    minHeight: 50,
    backgroundColor: CourseColors.primary,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  loadingButton: {
    backgroundColor: '#67976C',
  },

  buttonPressed: {
    backgroundColor: CourseColors.primaryDark,
  },

  buttonText: {
    color: CourseColors.white,
    fontSize: 15,
    fontWeight: '900',
  },
});
