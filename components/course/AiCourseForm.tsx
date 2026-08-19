import type { AiRecommendationRequest, Transportation, TravelStyle } from '@/types/course';
import { useState } from 'react';
import { KeyboardTypeOptions, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const TRANSPORTATION: { label: string; value: Transportation }[] = [{ label: '자차', value: 'CAR' }, { label: '대중교통', value: 'PUBLIC_TRANSIT' }, { label: '도보 중심', value: 'WALKING' }];
const STYLES: { label: string; value: TravelStyle }[] = [{ label: '힐링', value: 'HEALING' }, { label: '아이와 함께', value: 'WITH_CHILD' }, { label: '먹거리 중심', value: 'FOOD' }, { label: '사진 명소', value: 'PHOTO_SPOT' }];

interface Props { loading: boolean; onSubmit: (request: AiRecommendationRequest) => void; }

export function AiCourseForm({ loading, onSubmit }: Props) {
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
    <Text style={styles.sectionTitle}>여행 조건 입력</Text>
    <View style={styles.dateRow}><Field label="여행 시작일" value={startDate} onChangeText={setStartDate} placeholder="2026-09-10" /><Field label="여행 종료일" value={endDate} onChangeText={setEndDate} placeholder="2026-09-12" /></View>
    <Field label="희망 지역" value={region} onChangeText={setRegion} placeholder="예: 공주시" />
    <Field label="인원수" value={peopleCount} onChangeText={setPeopleCount} placeholder="예: 4" keyboardType="number-pad" />
    <Choice label="이동 방식" options={TRANSPORTATION} value={transportation} onChange={setTransportation} />
    <Choice label="여행 스타일" options={STYLES} value={travelStyle} onChange={setTravelStyle} />
    {validation ? <Text style={styles.error}>{validation}</Text> : null}
    <Pressable disabled={loading} onPress={submit} style={[styles.button, loading && styles.disabled]}><Text style={styles.buttonText}>{loading ? '추천을 만들고 있어요...' : 'AI 코스 추천'}</Text></Pressable>
  </View>;
}

function Field({ label, ...props }: { label: string; value: string; onChangeText: (text: string) => void; placeholder: string; keyboardType?: KeyboardTypeOptions }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput {...props} editable style={styles.input} placeholderTextColor="#9CA3AF" /></View>;
}
function Choice<T extends string>({ label, options, value, onChange }: { label: string; options: { label: string; value: T }[]; value: T; onChange: (value: T) => void }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><View style={styles.choices}>{options.map((option) => <Pressable key={option.value} onPress={() => onChange(option.value)} style={[styles.choice, value === option.value && styles.selected]}><Text style={[styles.choiceText, value === option.value && styles.selectedText]}>{option.label}</Text></Pressable>)}</View></View>;
}
const styles = StyleSheet.create({
  form: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18, gap: 17 }, sectionTitle: { fontSize: 21, fontWeight: '900', color: '#111827' },
  dateRow: { flexDirection: 'row', gap: 10 }, field: { flex: 1, gap: 7 }, label: { color: '#374151', fontWeight: '700' }, input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 11, paddingHorizontal: 12, paddingVertical: 12, color: '#111827' },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, choice: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 20, paddingHorizontal: 13, paddingVertical: 9 }, selected: { borderColor: '#2F80ED', backgroundColor: '#EAF3FF' }, choiceText: { color: '#4B5563' }, selectedText: { color: '#2467BD', fontWeight: '800' },
  error: { color: '#B42318' }, button: { backgroundColor: '#2F80ED', borderRadius: 13, padding: 15, alignItems: 'center' }, disabled: { opacity: 0.55 }, buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
