import type { CourseItem } from '@/types/course';
import { CourseColors } from '@/constants/course-colors';
import { getGoogleMapsDirectionsUrl, getGoogleMapsPlaceUrl, openExternalMap } from '@/utils/courseMaps';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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
                <View style={styles.number}><Text style={styles.numberText}>{item.sortOrder}</Text></View>
                {index < dayItems.length - 1 ? <View style={styles.connector} /> : null}
              </View>
              <View style={styles.item}>
                <Text style={styles.title}>{item.title}</Text>
                {item.address?.trim() ? <Text style={styles.address}>{item.address}</Text> : null}
                <View style={styles.timeRow}><Ionicons color={CourseColors.primary} name="time-outline" size={15} /><Text style={styles.time}>{displayTime(item.startTime)} ~ {displayTime(item.endTime)}</Text></View>
                {item.memo ? <Text style={styles.memo}>{item.memo}</Text> : null}
                <Pressable accessibilityLabel={`${item.title} Google 지도에서 보기`} accessibilityRole="link" onPress={() => openMap(getGoogleMapsPlaceUrl(item))} style={styles.mapButton}><Ionicons color={CourseColors.primary} name="map-outline" size={16} /><Text style={styles.mapButtonText}>Google 지도에서 보기</Text><Ionicons color={CourseColors.primary} name="open-outline" size={14} /></Pressable>
              </View>
            </View>
          ))}
          {dayItems.length > 1 ? <Pressable accessibilityLabel={`Day ${dayNo} 전체 코스 Google 지도에서 보기`} accessibilityRole="link" onPress={() => {
            const url = getGoogleMapsDirectionsUrl(dayItems);
            if (url) openMap(url);
          }} style={styles.routeButton}><Text style={styles.routeButtonText}>Day {dayNo} 전체 코스 Google 지도에서 보기</Text><Text style={styles.routeArrow}>→</Text></Pressable> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 }, day: { gap: 9 }, dayHeading: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 1 }, dayTitle: { fontSize: 18, fontWeight: '900', color: CourseColors.text }, dayLine: { flex: 1, height: 1, backgroundColor: CourseColors.border },
  dayNavigation: { gap: 7, paddingRight: 16 }, dayChip: { alignItems: 'center', backgroundColor: CourseColors.white, borderColor: CourseColors.border, borderRadius: 14, borderWidth: 1, flexDirection: 'row', gap: 4, minHeight: 44, paddingHorizontal: 13 }, dayChipSelected: { backgroundColor: CourseColors.primary, borderColor: CourseColors.primary }, dayChipText: { color: CourseColors.primaryDark, fontSize: 12, fontWeight: '800' }, dayChipTextSelected: { color: CourseColors.white },
  routeRow: { flexDirection: 'row', gap: 10, alignItems: 'stretch' }, rail: { width: 28, alignItems: 'center' }, connector: { width: 2, flex: 1, minHeight: 14, backgroundColor: '#B9D1B5', marginTop: 4, marginBottom: -14 },
  item: { flex: 1, backgroundColor: CourseColors.white, borderRadius: 16, borderWidth: 1, borderColor: CourseColors.border, padding: 13, gap: 5 },
  number: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: CourseColors.primary },
  numberText: { color: CourseColors.white, fontSize: 12, fontWeight: '900' }, timeRow: { alignItems: 'center', flexDirection: 'row', gap: 5 }, time: { color: CourseColors.primary, fontWeight: '800', fontSize: 12 }, title: { color: CourseColors.text, fontSize: 16, fontWeight: '800', lineHeight: 22 }, address: { color: '#766B5D', fontSize: 12, lineHeight: 18 },
  memo: { color: CourseColors.muted, lineHeight: 19, fontSize: 13 }, mapButton: { alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', gap: 5, minHeight: 44, marginTop: 1, paddingRight: 8 }, mapButtonText: { color: CourseColors.primary, fontSize: 12, fontWeight: '800' }, routeButton: { marginLeft: 38, minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: '#B8D0B4', backgroundColor: CourseColors.primarySoft, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }, routeButtonText: { color: CourseColors.primaryDark, fontSize: 12, fontWeight: '800', textAlign: 'center' }, routeArrow: { color: CourseColors.primary, fontSize: 16, fontWeight: '900' }, empty: { alignItems: 'center', gap: 7, paddingVertical: 28 }, emptyTitle: { color: CourseColors.text, fontSize: 15, fontWeight: '900' }, emptyDescription: { color: CourseColors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
