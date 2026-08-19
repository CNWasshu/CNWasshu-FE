import type { CourseItem } from '@/types/course';
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
          <Text style={styles.dayTitle}>Day {dayNo}</Text>
          {dayItems.map((item) => (
            <View key={`${item.dayNo}-${item.sortOrder}-${item.title}`} style={styles.item}>
              <View style={styles.number}><Text style={styles.numberText}>{item.sortOrder}</Text></View>
              <View style={styles.content}>
                <Text style={styles.time}>{displayTime(item.startTime)}~{displayTime(item.endTime)}</Text>
                <Text style={styles.title}>{item.title}</Text>
                {item.address ? <Text style={styles.address}>{item.address}</Text> : null}
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
  container: { gap: 24 }, day: { gap: 12 }, dayTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937' },
  item: { flexDirection: 'row', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16 },
  number: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2F80ED' },
  numberText: { color: '#FFFFFF', fontWeight: '800' }, content: { flex: 1, gap: 4 },
  time: { color: '#2F80ED', fontWeight: '700' }, title: { color: '#111827', fontSize: 17, fontWeight: '700' },
  address: { color: '#6B7280', fontSize: 13 }, memo: { color: '#4B5563', lineHeight: 20 }, empty: { color: '#6B7280' },
});
