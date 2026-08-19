import type { CourseItem } from '@/types/course';
import { StyleSheet, Text, View } from 'react-native';

export interface CourseMarker {
  dayNo: number;
  markerNumber: number;
  title: string;
  latitude: number;
  longitude: number;
}

export function buildCourseMarkers(items: CourseItem[]): CourseMarker[] {
  return items.flatMap((item) =>
    item.latitude != null && item.longitude != null
      ? [{ dayNo: item.dayNo, markerNumber: item.sortOrder, title: item.title, latitude: item.latitude, longitude: item.longitude }]
      : [],
  );
}

export function groupMarkersByDay(markers: CourseMarker[]) {
  return markers.reduce<Record<number, CourseMarker[]>>((groups, marker) => {
    (groups[marker.dayNo] ??= []).push(marker);
    return groups;
  }, {});
}

export function CourseMap({ items }: { items: CourseItem[] }) {
  const markers = buildCourseMarkers(items);
  const dayGroups = groupMarkersByDay(markers);
  return (
    <View style={styles.map} accessibilityLabel="코스 지도 영역">
      <Text style={styles.icon}>⌖</Text>
      {markers.length === 0 ? (
        <Text style={styles.guide}>체험 위치 정보가 연결되면 지도에 코스가 표시됩니다.</Text>
      ) : (
        <View style={styles.markerList}>
          <Text style={styles.guide}>지도 라이브러리 연결 전 위치 미리보기</Text>
          {Object.entries(dayGroups).map(([dayNo, dayMarkers]) => (
            <Text key={dayNo} style={styles.markerText}>Day {dayNo}: {dayMarkers.map((marker) => `${marker.markerNumber}. ${marker.title}`).join(' → ')}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: { minHeight: 190, borderRadius: 18, backgroundColor: '#E8F1FB', alignItems: 'center', justifyContent: 'center', padding: 24 },
  icon: { fontSize: 34, color: '#2F80ED', marginBottom: 10 }, guide: { color: '#4B647A', textAlign: 'center', lineHeight: 21 },
  markerList: { gap: 7, alignSelf: 'stretch' }, markerText: { color: '#24445F', fontWeight: '600' },
});
