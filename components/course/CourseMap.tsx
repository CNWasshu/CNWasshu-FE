import type { CourseItem } from '@/types/course';
import { CourseColors } from '@/constants/course-colors';
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
  const previewNumbers = markers.length > 0 ? markers.slice(0, 3).map((marker) => marker.markerNumber) : [1, 2, 3];
  return (
    <View style={styles.wrapper}>
      <View style={styles.map} accessibilityLabel="코스 지도 영역">
        <View style={[styles.road, styles.roadOne]} />
        <View style={[styles.road, styles.roadTwo]} />
        <View style={[styles.road, styles.roadThree]} />
        <View style={styles.water} />
        <View style={[styles.park, styles.parkOne]} />
        <View style={[styles.park, styles.parkTwo]} />
        <View style={[styles.pin, styles.pinOne]}><Text style={styles.pinText}>{previewNumbers[0] ?? 1}</Text></View>
        <View style={[styles.pin, styles.pinTwo]}><Text style={styles.pinText}>{previewNumbers[1] ?? 2}</Text></View>
        <View style={[styles.pin, styles.pinThree]}><Text style={styles.pinText}>{previewNumbers[2] ?? 3}</Text></View>
        <View style={styles.previewBadge}><Text style={styles.previewText}>{markers.length === 0 ? '장식용 코스 미리보기' : '위치 데이터 미리보기'}</Text></View>
        {markers.length > 0 ? (
          <View style={styles.markerList}>
            {Object.entries(dayGroups).map(([dayNo, dayMarkers]) => (
              <Text key={dayNo} numberOfLines={1} style={styles.markerText}>Day {dayNo} · {dayMarkers.map((marker) => `${marker.markerNumber} ${marker.title}`).join(' → ')}</Text>
            ))}
          </View>
        ) : null}
      </View>
      <View style={styles.guideRow}>
        <Text style={styles.info}>i</Text>
        <Text style={styles.guide}>체험 위치 정보가 연결되면 실제 지도에 코스가 표시됩니다.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 9 }, map: { height: 230, borderRadius: 22, backgroundColor: CourseColors.map, overflow: 'hidden', borderWidth: 1, borderColor: '#CAD8C8', position: 'relative' },
  road: { position: 'absolute', height: 24, backgroundColor: CourseColors.beige, borderWidth: 1, borderColor: '#E3D5BD', borderRadius: 13 },
  roadOne: { width: '125%', left: '-12%', top: 55, transform: [{ rotate: '-11deg' }] }, roadTwo: { width: '105%', left: '12%', top: 143, transform: [{ rotate: '18deg' }] }, roadThree: { width: 190, left: 76, top: 95, transform: [{ rotate: '70deg' }] },
  water: { position: 'absolute', width: 76, height: 180, right: -30, top: 22, borderRadius: 45, backgroundColor: '#C7DEDC', transform: [{ rotate: '9deg' }] }, park: { position: 'absolute', backgroundColor: '#C5DBC1', borderRadius: 30 }, parkOne: { width: 92, height: 60, left: 18, bottom: 17 }, parkTwo: { width: 74, height: 50, right: 28, top: 18 },
  pin: { position: 'absolute', width: 34, height: 34, borderRadius: 17, backgroundColor: CourseColors.primary, borderWidth: 3, borderColor: CourseColors.white, alignItems: 'center', justifyContent: 'center', shadowColor: '#263C28', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 4 },
  pinOne: { left: '17%', top: 43 }, pinTwo: { left: '48%', top: 105 }, pinThree: { right: '14%', top: 62 }, pinText: { color: CourseColors.white, fontWeight: '900' },
  previewBadge: { position: 'absolute', left: 12, bottom: 11, backgroundColor: 'rgba(255,250,241,0.92)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 }, previewText: { color: CourseColors.muted, fontSize: 11, fontWeight: '700' },
  markerList: { position: 'absolute', left: 12, right: 12, top: 11, backgroundColor: 'rgba(255,255,255,0.88)', borderRadius: 10, padding: 8, gap: 3 }, markerText: { color: CourseColors.primaryDark, fontSize: 11, fontWeight: '700' },
  guideRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, paddingHorizontal: 4 }, info: { width: 17, height: 17, borderRadius: 9, textAlign: 'center', backgroundColor: CourseColors.beige, color: CourseColors.muted, fontSize: 11, fontWeight: '900', overflow: 'hidden' }, guide: { flex: 1, color: CourseColors.muted, fontSize: 12, lineHeight: 18 },
});
