import type { AiRecommendationRequest, Transportation, TravelStyle } from '@/types/course';
import { CourseColors } from '@/constants/course-colors';
import { CourseDateField } from '@/components/course/CourseDateField';
import { CHUNGNAM_REGIONS } from '@/constants/regions';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const TRANSPORTATION: { label: string; value: Transportation }[] = [{ label: '자차', value: 'CAR' }, { label: '대중교통', value: 'PUBLIC_TRANSIT' }, { label: '도보 중심', value: 'WALKING' }];
const STYLES: { label: string; value: TravelStyle }[] = [{ label: '힐링', value: 'HEALING' }, { label: '아이와 함께', value: 'WITH_CHILD' }, { label: '먹거리 중심', value: 'FOOD' }, { label: '사진 명소', value: 'PHOTO_SPOT' }];

type ValidationErrors = { date?: string; region?: string; people?: string };

interface Props { loading: boolean; onSubmit: (request: AiRecommendationRequest) => void; onValidationError?: (offsetY: number) => void; }

export function AiCourseForm({ loading, onSubmit, onValidationError }: Props) {
  const { width } = useWindowDimensions();
  const twoColumns = width >= 520;
  const [startDate, setStartDate] = useState(''); const [endDate, setEndDate] = useState('');
  const [region, setRegion] = useState(''); const [peopleCount, setPeopleCount] = useState(2);
  const [transportation, setTransportation] = useState<Transportation>('CAR');
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('HEALING'); const [errors, setErrors] = useState<ValidationErrors>({});
  const [fieldOffsets, setFieldOffsets] = useState({ date: 0, region: 0, people: 0 });

  const changeStartDate = (value: string) => {
    setStartDate(value);
    if (endDate && value > endDate) setEndDate(value);
    setErrors((current) => ({ ...current, date: undefined }));
  };

  const changeEndDate = (value: string) => {
    setEndDate(value);
    setErrors((current) => ({ ...current, date: undefined }));
  };

  const changeRegion = (value: string) => {
    setRegion(value);
    setErrors((current) => ({ ...current, region: undefined }));
  };

  const changePeopleCount = (value: number) => {
    setPeopleCount(value);
    setErrors((current) => ({ ...current, people: undefined }));
  };

  const submit = () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const nextErrors: ValidationErrors = {};
    if (!datePattern.test(startDate) || !datePattern.test(endDate)) nextErrors.date = '여행 시작일과 종료일을 선택해 주세요.';
    else if (startDate > endDate) nextErrors.date = '종료일은 시작일보다 빠를 수 없습니다.';
    if (!region) nextErrors.region = '희망 지역을 선택해 주세요.';
    if (!Number.isInteger(peopleCount) || peopleCount < 1) nextErrors.people = '인원수는 1명 이상이어야 합니다.';
    setErrors(nextErrors);
    const firstError = (['date', 'region', 'people'] as const).find((field) => nextErrors[field]);
    if (firstError) {
      onValidationError?.(fieldOffsets[firstError]);
      return;
    }
    onSubmit({ startDate, endDate, region, peopleCount, transportation, travelStyle });
  };

  return <View style={styles.form}>
    <View style={styles.formHeading}><View style={styles.formIcon}><Text style={styles.formIconText}>✦</Text></View><View><Text style={styles.sectionTitle}>기본 조건</Text><Text style={styles.sectionDescription}>원하는 여행의 기본 정보를 알려주세요.</Text></View></View>
    <View onLayout={({ nativeEvent }) => setFieldOffsets((current) => ({ ...current, date: nativeEvent.layout.y }))} style={styles.field}>
      <View style={[styles.fieldGrid, !twoColumns && styles.oneColumn]}>
        <CourseDateField error={Boolean(errors.date)} label="여행 시작일" value={startDate} onChange={changeStartDate} placeholder="날짜 선택" />
        <CourseDateField error={Boolean(errors.date)} label="여행 종료일" minimumDate={startDate} value={endDate} onChange={changeEndDate} placeholder="날짜 선택" />
      </View>
      {errors.date ? <FieldError message={errors.date} /> : null}
    </View>
    <View onLayout={({ nativeEvent }) => setFieldOffsets((current) => ({ ...current, region: nativeEvent.layout.y }))}><RegionChoice error={errors.region} value={region} onChange={changeRegion} /></View>
    <View onLayout={({ nativeEvent }) => setFieldOffsets((current) => ({ ...current, people: nativeEvent.layout.y }))}><PeopleStepper error={errors.people} value={peopleCount} onChange={changePeopleCount} /></View>
    <Choice label="이동 방식" options={TRANSPORTATION} value={transportation} onChange={setTransportation} />
    <Choice label="여행 스타일" options={STYLES} value={travelStyle} onChange={setTravelStyle} />
    <Pressable accessibilityRole="button" disabled={loading} onPress={submit} style={({ pressed }) => [styles.button, loading && styles.disabled, pressed && !loading && styles.buttonPressed]}><Text style={styles.buttonText}>{loading ? '추천을 만들고 있어요...' : '추천 코스 만들기'}</Text><Text style={styles.buttonArrow}>→</Text></Pressable>
  </View>;
}

function FieldError({ message }: { message: string }) {
  return <View accessibilityLiveRegion="polite" style={styles.errorRow}><Ionicons color={CourseColors.error} name="alert-circle-outline" size={16} /><Text style={styles.errorText}>{message}</Text></View>;
}
function RegionChoice({ error, value, onChange }: { error?: string; value: string; onChange: (region: string) => void }) {
  return <View style={styles.field}>
    <Text style={styles.label}>희망 지역</Text>
    {!value && !error ? <Text style={styles.regionGuide}>희망 지역을 선택해주세요</Text> : null}
    <View style={[styles.regionShell, error && styles.errorShell]}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.regionList} keyboardShouldPersistTaps="handled">
      {CHUNGNAM_REGIONS.map((region) => {
        const selected = value === region;
        return <Pressable key={region} accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={() => onChange(region)} style={[styles.regionChip, selected && styles.regionChipSelected]}>
          {selected ? <Ionicons color={CourseColors.white} name="checkmark" size={15} /> : null}<Text style={[styles.regionChipText, selected && styles.regionChipTextSelected]}>{region}</Text>
        </Pressable>;
      })}
    </ScrollView></View>
    {error ? <FieldError message={error} /> : null}
  </View>;
}
function PeopleStepper({ error, value, onChange }: { error?: string; value: number; onChange: (value: number) => void }) {
  return <View style={styles.field}><Text style={styles.label}>인원수</Text><View style={[styles.stepper, error && styles.errorShell]}>
    <Pressable accessibilityLabel="인원수 한 명 줄이기" accessibilityRole="button" accessibilityState={{ disabled: value <= 1 }} disabled={value <= 1} onPress={() => onChange(value - 1)} style={[styles.stepperButton, value <= 1 && styles.stepperDisabled]}><Ionicons color={CourseColors.primaryDark} name="remove" size={22} /></Pressable>
    <Text accessibilityLiveRegion="polite" style={styles.peopleValue}>{value}명</Text>
    <Pressable accessibilityLabel="인원수 한 명 늘리기" accessibilityRole="button" onPress={() => onChange(value + 1)} style={styles.stepperButton}><Ionicons color={CourseColors.primaryDark} name="add" size={22} /></Pressable>
  </View>{error ? <FieldError message={error} /> : null}</View>;
}
function Choice<T extends string>({ label, options, value, onChange }: { label: string; options: { label: string; value: T }[]; value: T; onChange: (value: T) => void }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><View accessibilityRole="radiogroup" style={styles.choices}>{options.map((option) => <Pressable key={option.value} accessibilityRole="radio" accessibilityState={{ checked: value === option.value }} onPress={() => onChange(option.value)} style={[styles.choice, value === option.value && styles.selected]}>{value === option.value ? <Ionicons color={CourseColors.white} name="checkmark" size={16} /> : null}<Text style={[styles.choiceText, value === option.value && styles.selectedText]}>{option.label}</Text></Pressable>)}</View></View>;
}
const styles = StyleSheet.create({
  form: { backgroundColor: CourseColors.white, borderRadius: 24, padding: 20, gap: 21, borderWidth: 1, borderColor: CourseColors.border, shadowColor: '#5A4932', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
  formHeading: { flexDirection: 'row', alignItems: 'center', gap: 12 }, formIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: CourseColors.primarySoft, alignItems: 'center', justifyContent: 'center' }, formIconText: { color: CourseColors.primary, fontWeight: '900', fontSize: 18 }, sectionTitle: { fontSize: 20, fontWeight: '900', color: CourseColors.text }, sectionDescription: { color: CourseColors.muted, fontSize: 12, marginTop: 2 },
  fieldGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, oneColumn: { flexDirection: 'column' }, field: { gap: 9 }, label: { color: CourseColors.text, fontWeight: '800', fontSize: 14 },
  regionGuide: { color: CourseColors.muted, fontSize: 12 }, regionShell: { borderColor: 'transparent', borderRadius: 12, borderWidth: 1, marginHorizontal: -4, paddingLeft: 4 }, regionList: { gap: 7, paddingRight: 18 }, regionChip: { alignItems: 'center', flexDirection: 'row', gap: 4, minHeight: 44, paddingHorizontal: 13, borderWidth: 1, borderColor: CourseColors.border, borderRadius: 999, backgroundColor: CourseColors.white }, regionChipSelected: { borderColor: CourseColors.primary, backgroundColor: CourseColors.primary }, regionChipText: { color: '#6B5730', fontSize: 12, fontWeight: '800' }, regionChipTextSelected: { color: CourseColors.white },
  stepper: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: CourseColors.background, borderColor: CourseColors.border, borderRadius: 14, borderWidth: 1, flexDirection: 'row', minHeight: 48 }, stepperButton: { alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: 48 }, stepperDisabled: { opacity: 0.35 }, peopleValue: { color: CourseColors.text, fontSize: 16, fontWeight: '900', minWidth: 64, textAlign: 'center' },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, choice: { alignItems: 'center', flexDirection: 'row', gap: 5, minHeight: 44, borderWidth: 1, borderColor: CourseColors.border, backgroundColor: CourseColors.white, borderRadius: 22, paddingHorizontal: 16 }, selected: { borderColor: CourseColors.primary, backgroundColor: CourseColors.primary }, choiceText: { color: '#6F6558', fontWeight: '600' }, selectedText: { color: CourseColors.white, fontWeight: '900' },
  errorShell: { backgroundColor: '#FFF9F6', borderColor: '#E6BDB3' }, errorRow: { alignItems: 'center', flexDirection: 'row', gap: 6 }, errorText: { color: CourseColors.error, flex: 1, fontSize: 12, lineHeight: 18 }, button: { minHeight: 54, backgroundColor: CourseColors.primary, borderRadius: 17, paddingHorizontal: 20, paddingVertical: 15, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9, shadowColor: CourseColors.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 7, elevation: 3 }, buttonPressed: { backgroundColor: CourseColors.primaryDark }, disabled: { opacity: 0.52 }, buttonText: { color: CourseColors.white, fontSize: 16, fontWeight: '900' }, buttonArrow: { color: CourseColors.white, fontSize: 18, fontWeight: '900' },
});
