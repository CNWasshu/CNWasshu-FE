import type { CourseItem } from '@/types/course';
import { CourseColors } from '@/constants/course-colors';
import { getGoogleMapsPlaceUrl, openExternalMap } from '@/utils/courseMaps';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { buildCourseDisplayNumbers } from './courseMapData';

function displayTime(time: string) {
  return time.slice(0, 5);
}

function openMap(url: string) {
  void openExternalMap(url).catch(() => Alert.alert('지도를 열 수 없습니다', '잠시 후 다시 시도해 주세요.'));
}

export function CourseSchedule({ enableDayNavigation = false, items }: { enableDayNavigation?: boolean; items: CourseItem[] }) {
  const groups = useMemo(() => items.reduce<Map<number, CourseItem[]>>((map, item) => {
    const dayItems = map.get(item.dayNo) ?? [];
    dayItems.push(item);
    map.set(item.dayNo, dayItems);
    return map;
  }, new Map()), [items]);
  const dayNumbers = useMemo(() => [...groups.keys()], [groups]);
  const displayNumbers = useMemo(() => buildCourseDisplayNumbers(items), [items]);
  const [selectedDay, setSelectedDay] = useState(dayNumbers[0]);

  useEffect(() => {
    if (dayNumbers.length > 0 && !dayNumbers.includes(selectedDay)) setSelectedDay(dayNumbers[0]);
  }, [dayNumbers, selectedDay]);

  if (items.length === 0) return <View style={styles.empty}><Ionicons color={CourseColors.primary} name="calendar-outline" size={28} /><Text style={styles.emptyTitle}>등록된 일정이 없어요</Text><Text style={styles.emptyDescription}>코스에 일정이 추가되면 Day별로 확인할 수 있습니다.</Text></View>;

  const visibleGroups = enableDayNavigation && dayNumbers.length > 1
    ? [...groups.entries()].filter(([dayNo]) => dayNo === selectedDay)
    : [...groups.entries()];

  return (
    <View style={styles.container}>
      {enableDayNavigation && dayNumbers.length > 1 ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayNavigation}>
        {dayNumbers.map((dayNo) => {
          const selected = dayNo === selectedDay;
          return <Pressable key={dayNo} accessibilityRole="tab" accessibilityState={{ selected }} onPress={() => setSelectedDay(dayNo)} style={[styles.dayChip, selected && styles.dayChipSelected]}>{selected ? <Ionicons color={CourseColors.white} name="checkmark" size={15} /> : null}<Text style={[styles.dayChipText, selected && styles.dayChipTextSelected]}>Day {dayNo}</Text></Pressable>;
        })}
      </ScrollView> : null}
      {visibleGroups.map(([dayNo, dayItems]) => (
        <View key={dayNo} style={styles.day}>
          <View style={styles.dayHeading}><Text style={styles.dayTitle}>Day {dayNo}</Text><View style={styles.dayLine} /></View>
          {dayItems.map((item, index) => (
            <View key={`${item.dayNo}-${item.sortOrder}-${item.title}`} style={styles.routeRow}>
              <View style={styles.rail}>
                <View style={styles.number}><Text numberOfLines={1} style={styles.numberText}>{displayNumbers.get(item) ?? item.sortOrder}</Text></View>
                {index < dayItems.length - 1 ? <View style={styles.connector} /> : null}
              </View>
              <View style={styles.item}>
                <Text style={styles.title}>{item.title}</Text>
                {item.address?.trim() ? <Text style={styles.address}>{item.address}</Text> : null}
                <View style={styles.timeRow}><Ionicons color={CourseColors.primary} name="time-outline" size={15} /><Text style={styles.time}>{displayTime(item.startTime)} ~ {displayTime(item.endTime)}</Text></View>
                {item.memo ? <Text style={styles.memo}>{item.memo}</Text> : null}
                <Pressable accessibilityLabel={`${item.title} Google 지도에서 보기`} accessibilityRole="link" hitSlop={2} onPress={() => openMap(getGoogleMapsPlaceUrl(item))} style={styles.mapButton}><Ionicons color={CourseColors.primary} name="map-outline" size={16} /><Text style={styles.mapButtonText}>Google 지도에서 보기</Text><Ionicons color={CourseColors.primary} name="open-outline" size={14} /></Pressable>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 22 }, day: { gap: 8 }, dayHeading: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 2 }, dayTitle: { fontSize: 17, fontWeight: '900', color: CourseColors.text }, dayLine: { flex: 1, height: 1, backgroundColor: '#E9DFCF' },
  dayNavigation: { gap: 7, paddingRight: 16 }, dayChip: { alignItems: 'center', backgroundColor: CourseColors.white, borderColor: CourseColors.border, borderRadius: 14, borderWidth: 1, flexDirection: 'row', gap: 4, minHeight: 44, paddingHorizontal: 13 }, dayChipSelected: { backgroundColor: CourseColors.primary, borderColor: CourseColors.primary }, dayChipText: { color: CourseColors.primaryDark, fontSize: 12, fontWeight: '800' }, dayChipTextSelected: { color: CourseColors.white },
  routeRow: { flexDirection: 'row', gap: 9, alignItems: 'stretch' }, rail: { width: 26, alignItems: 'center' }, connector: { width: 1, flex: 1, minHeight: 12, backgroundColor: '#C9DBC6', marginTop: 4, marginBottom: -12 },
  item: { flex: 1, backgroundColor: '#FFFEFB', borderRadius: 16, borderWidth: 1, borderColor: '#EEE4D4', paddingHorizontal: 12, paddingVertical: 10, gap: 4 },
  number: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: CourseColors.primary },
  numberText: { color: CourseColors.white, fontSize: 12, lineHeight: 14, fontWeight: '900', textAlign: 'center' }, timeRow: { alignItems: 'center', flexDirection: 'row', gap: 5 }, time: { color: CourseColors.primary, fontWeight: '800', fontSize: 12 }, title: { color: CourseColors.text, fontSize: 15, fontWeight: '900', lineHeight: 21 }, address: { color: CourseColors.muted, fontSize: 12, lineHeight: 17 },
  memo: { color: CourseColors.muted, lineHeight: 18, fontSize: 12 }, mapButton: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: CourseColors.primarySoft, borderColor: '#D2E3CE', borderRadius: 999, borderWidth: 1, flexDirection: 'row', gap: 4, minHeight: 40, marginTop: 2, paddingHorizontal: 10 }, mapButtonText: { color: CourseColors.primaryDark, fontSize: 12, fontWeight: '800' }, empty: { alignItems: 'center', gap: 7, paddingVertical: 28 }, emptyTitle: { color: CourseColors.text, fontSize: 15, fontWeight: '900' }, emptyDescription: { color: CourseColors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
