import type { AiRecommendationRequest, Transportation, TravelStyle } from '@/types/course';
import { CourseColors } from '@/constants/course-colors';
import { useState } from 'react';
import { KeyboardTypeOptions, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

const TRANSPORTATION: { label: string; value: Transportation }[] = [{ label: '자차', value: 'CAR' }, { label: '대중교통', value: 'PUBLIC_TRANSIT' }, { label: '도보 중심', value: 'WALKING' }];
const STYLES: { label: string; value: TravelStyle }[] = [{ label: '힐링', value: 'HEALING' }, { label: '아이와 함께', value: 'WITH_CHILD' }, { label: '먹거리 중심', value: 'FOOD' }, { label: '사진 명소', value: 'PHOTO_SPOT' }];

interface Props { loading: boolean; onSubmit: (request: AiRecommendationRequest) => void; }

export function AiCourseForm({ loading, onSubmit }: Props) {
  const { width } = useWindowDimensions();
  const twoColumns = width >= 520;
  const [startDate, setStartDate] = useState(''); const [endDate, setEndDate] = useState('');
  const [region, setRegion] = useState(''); const [peopleCount, setPeopleCount] = useState('');
  const [transportation, setTransportation] = useState<Transportation>('CAR');
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('HEALING'); const [validation, setValidation] = useState<string | null>(null);

  const submit = () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; const count = Number(peopleCount);
    if (!datePattern.test(startDate) || !datePattern.test(endDate)) return setValidation('날짜를 YYYY-MM-DD 형식으로 입력해 주세요.');
    if (startDate > endDate) return setValidation('종료일은 시작일보다 빠를 수 없습니다.');
    if (!region.trim()) return setValidation('희망 지역을 입력해 주세요.');
    if (!Number.isInteger(count) || count < 1) return setValidation('인원수는 1 이상의 숫자로 입력해 주세요.');
    setValidation(null); onSubmit({ startDate, endDate, region: region.trim(), peopleCount: count, transportation, travelStyle });
  };

  return <View style={styles.form}>
    <View style={styles.formHeading}><View style={styles.formIcon}><Text style={styles.formIconText}>✦</Text></View><View><Text style={styles.sectionTitle}>기본 조건</Text><Text style={styles.sectionDescription}>원하는 여행의 기본 정보를 알려주세요.</Text></View></View>
    <View style={[styles.fieldGrid, !twoColumns && styles.oneColumn]}>
      <Field label="여행 시작일" icon="◷" value={startDate} onChangeText={setStartDate} placeholder="2026-09-10" />
      <Field label="여행 종료일" icon="◷" value={endDate} onChangeText={setEndDate} placeholder="2026-09-12" />
      <Field label="희망 지역" icon="⌖" value={region} onChangeText={setRegion} placeholder="예: 공주시" />
      <Field label="인원수" icon="♙" value={peopleCount} onChangeText={setPeopleCount} placeholder="예: 4" keyboardType="number-pad" />
    </View>
    <Choice label="이동 방식" options={TRANSPORTATION} value={transportation} onChange={setTransportation} />
    <Choice label="여행 스타일" options={STYLES} value={travelStyle} onChange={setTravelStyle} />
    {validation ? <Text style={styles.error}>{validation}</Text> : null}
    <Pressable disabled={loading} onPress={submit} style={({ pressed }) => [styles.button, loading && styles.disabled, pressed && !loading && styles.buttonPressed]}><Text style={styles.buttonText}>{loading ? '추천을 만들고 있어요...' : '추천 코스 만들기'}</Text><Text style={styles.buttonArrow}>→</Text></Pressable>
  </View>;
}

function Field({ label, icon, ...props }: { label: string; icon: string; value: string; onChangeText: (text: string) => void; placeholder: string; keyboardType?: KeyboardTypeOptions }) {
  return <View style={styles.gridField}><Text style={styles.label}>{label}</Text><View style={styles.inputShell}><Text style={styles.inputIcon}>{icon}</Text><TextInput {...props} editable style={styles.input} placeholderTextColor="#A49A8A" /></View></View>;
}
function Choice<T extends string>({ label, options, value, onChange }: { label: string; options: { label: string; value: T }[]; value: T; onChange: (value: T) => void }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><View style={styles.choices}>{options.map((option) => <Pressable key={option.value} onPress={() => onChange(option.value)} style={[styles.choice, value === option.value && styles.selected]}><Text style={[styles.choiceText, value === option.value && styles.selectedText]}>{option.label}</Text></Pressable>)}</View></View>;
}
const styles = StyleSheet.create({
  form: { backgroundColor: CourseColors.white, borderRadius: 24, padding: 20, gap: 21, borderWidth: 1, borderColor: CourseColors.border, shadowColor: '#5A4932', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
  formHeading: { flexDirection: 'row', alignItems: 'center', gap: 12 }, formIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: CourseColors.primarySoft, alignItems: 'center', justifyContent: 'center' }, formIconText: { color: CourseColors.primary, fontWeight: '900', fontSize: 18 }, sectionTitle: { fontSize: 20, fontWeight: '900', color: CourseColors.text }, sectionDescription: { color: CourseColors.muted, fontSize: 12, marginTop: 2 },
  fieldGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, oneColumn: { flexDirection: 'column' }, gridField: { flexGrow: 1, flexBasis: '46%', gap: 8 }, field: { gap: 9 }, label: { color: CourseColors.text, fontWeight: '800', fontSize: 14 }, inputShell: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: CourseColors.border, backgroundColor: CourseColors.background, borderRadius: 15, paddingHorizontal: 13 }, inputIcon: { color: CourseColors.primary, fontWeight: '900', marginRight: 8 }, input: { flex: 1, paddingVertical: 13, color: CourseColors.text, minWidth: 0 },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, choice: { borderWidth: 1, borderColor: CourseColors.border, backgroundColor: CourseColors.white, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10 }, selected: { borderColor: CourseColors.primary, backgroundColor: CourseColors.primary }, choiceText: { color: '#6F6558', fontWeight: '600' }, selectedText: { color: CourseColors.white, fontWeight: '900' },
  error: { color: CourseColors.error, backgroundColor: '#FFF1ED', borderRadius: 11, padding: 11 }, button: { minHeight: 54, backgroundColor: CourseColors.primary, borderRadius: 17, paddingHorizontal: 20, paddingVertical: 15, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9, shadowColor: CourseColors.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 7, elevation: 3 }, buttonPressed: { backgroundColor: CourseColors.primaryDark }, disabled: { opacity: 0.52 }, buttonText: { color: CourseColors.white, fontSize: 16, fontWeight: '900' }, buttonArrow: { color: CourseColors.white, fontSize: 18, fontWeight: '900' },
});
