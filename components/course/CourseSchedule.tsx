import type { CourseItem } from '@/types/course';
import { CourseColors } from '@/constants/course-colors';
import { StyleSheet, Text, View } from 'react-native';

function displayTime(time: string) {
  return time.slice(0, 5);
}

export function CourseSchedule({ items }: { items: CourseItem[] }) {
  const groups = items.reduce<Map<number, CourseItem[]>>((map, item) => {
    const dayItems = map.get(item.dayNo) ?? [];
    dayItems.push(item);
    map.set(item.dayNo, dayItems);
    return map;
  }, new Map());

  if (items.length === 0) return <Text style={styles.empty}>등록된 일정이 없습니다.</Text>;

  return (
    <View style={styles.container}>
      {[...groups.entries()].map(([dayNo, dayItems]) => (
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
                <Text style={styles.time}>{displayTime(item.startTime)}~{displayTime(item.endTime)}{item.address ? ` · ${item.address}` : ''}</Text>
                {item.memo ? <Text style={styles.memo}>{item.memo}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 30 }, day: { gap: 12 }, dayHeading: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 2 }, dayTitle: { fontSize: 20, fontWeight: '900', color: CourseColors.text }, dayLine: { flex: 1, height: 1, backgroundColor: CourseColors.border },
  routeRow: { flexDirection: 'row', gap: 12, alignItems: 'stretch' }, rail: { width: 32, alignItems: 'center' }, connector: { width: 2, flex: 1, minHeight: 18, backgroundColor: '#B9D1B5', marginTop: 5, marginBottom: -17 },
  item: { flex: 1, backgroundColor: CourseColors.white, borderRadius: 18, borderWidth: 1, borderColor: CourseColors.border, padding: 16, gap: 6, shadowColor: '#5A4932', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 },
  number: { width: 31, height: 31, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: CourseColors.primary },
  numberText: { color: CourseColors.white, fontWeight: '900' }, time: { color: CourseColors.primary, fontWeight: '800', fontSize: 13 }, title: { color: CourseColors.text, fontSize: 17, fontWeight: '800', lineHeight: 23 },
  memo: { color: CourseColors.muted, lineHeight: 20, fontSize: 14 }, empty: { color: CourseColors.muted, textAlign: 'center', paddingVertical: 24 },
});
