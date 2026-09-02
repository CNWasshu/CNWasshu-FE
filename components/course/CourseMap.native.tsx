import { CourseColors } from '@/constants/course-colors';
import type { CourseItem } from '@/types/course';
import { getGoogleMapsDirectionsUrl, getGoogleMapsPlaceUrl, openExternalMap } from '@/utils/courseMaps';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import { buildCourseMarkers, groupMarkersByDay } from './courseMapData';
import { CourseMapPlaceholder } from './CourseMapPlaceholder';

export { buildCourseMarkers, groupMarkersByDay } from './courseMapData';

function displayTime(time: string) {
  return time.slice(0, 5);
}

export function CourseMap({ items }: { items: CourseItem[] }) {
  const mapRef = useRef<MapView>(null);
  const markers = useMemo(() => buildCourseMarkers(items), [items]);
  const dayGroups = useMemo(() => groupMarkersByDay(markers), [markers]);
  const dayNumbers = useMemo(() => [...new Set(items.map((item) => item.dayNo))], [items]);
  const [selectedDay, setSelectedDay] = useState(dayNumbers[0]);
  const activeDay = selectedDay != null && dayGroups[selectedDay] ? selectedDay : dayNumbers[0];
  const selectedMarkers = useMemo(() => activeDay == null ? [] : dayGroups[activeDay] ?? [], [activeDay, dayGroups]);
  const dayItems = useMemo(() => items.filter((item) => item.dayNo === activeDay), [activeDay, items]);

  useEffect(() => {
    if (dayNumbers.length > 0 && !dayNumbers.includes(selectedDay)) setSelectedDay(dayNumbers[0]);
  }, [dayNumbers, selectedDay]);

  useEffect(() => {
    if (selectedMarkers.length === 0) return;
    const timer = setTimeout(() => {
      if (selectedMarkers.length === 1) {
        mapRef.current?.animateToRegion({
          latitude: selectedMarkers[0].latitude,
          longitude: selectedMarkers[0].longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }, 300);
      } else {
        mapRef.current?.fitToCoordinates(
          selectedMarkers.map(({ latitude, longitude }) => ({ latitude, longitude })),
          { edgePadding: { top: 55, right: 45, bottom: 45, left: 45 }, animated: true },
        );
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedMarkers]);

  if (markers.length === 0) return <CourseMapPlaceholder />;

  const first = selectedMarkers[0];
  const externalUrl = getGoogleMapsDirectionsUrl(dayItems) ?? (dayItems[0] ? getGoogleMapsPlaceUrl(dayItems[0]) : null);
  return (
    <View style={styles.wrapper}>
      {dayNumbers.length > 1 ? (
        <View style={styles.days}>
          {dayNumbers.map((dayNo) => (
            <Pressable key={dayNo} onPress={() => setSelectedDay(dayNo)} style={[styles.dayChip, activeDay === dayNo && styles.dayChipSelected]}>
              <Text style={[styles.dayText, activeDay === dayNo && styles.dayTextSelected]}>Day {dayNo}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      {first ? <View style={styles.mapFrame}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{ latitude: first.latitude, longitude: first.longitude, latitudeDelta: 0.025, longitudeDelta: 0.025 }}
        >
          {selectedMarkers.length > 1 ? (
            <Polyline coordinates={selectedMarkers.map(({ latitude, longitude }) => ({ latitude, longitude }))} strokeColor="rgba(63, 125, 70, 0.72)" strokeWidth={2} />
          ) : null}
          {selectedMarkers.map((marker) => (
            <Marker key={`${marker.dayNo}-${marker.markerNumber}-${marker.title}`} coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}>
              <View style={styles.marker}><Text style={styles.markerText}>{marker.markerNumber}</Text></View>
              <Callout tooltip>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{marker.markerNumber}. {marker.title}</Text>
                  <Text style={styles.calloutTime}>{displayTime(marker.startTime)} ~ {displayTime(marker.endTime)}</Text>
                  {marker.address ? <Text style={styles.calloutAddress}>{marker.address}</Text> : null}
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View> : <CourseMapPlaceholder />}
      {externalUrl ? <Pressable style={styles.externalButton} onPress={() => void openExternalMap(externalUrl)}><Text style={styles.externalButtonText}>Google 지도에서 전체 경로 보기 ↗</Text></Pressable> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 9 }, days: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, dayChip: { borderWidth: 1, borderColor: '#D7E2D4', backgroundColor: CourseColors.background, borderRadius: 14, paddingHorizontal: 11, paddingVertical: 6 }, dayChipSelected: { borderColor: CourseColors.primary, backgroundColor: CourseColors.primary }, dayText: { color: CourseColors.muted, fontSize: 12, fontWeight: '700' }, dayTextSelected: { color: CourseColors.white, fontWeight: '900' },
  mapFrame: { height: 240, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#CAD8C8' }, map: { flex: 1 },
  marker: { width: 30, height: 30, borderRadius: 15, backgroundColor: CourseColors.primary, borderWidth: 2, borderColor: CourseColors.white, alignItems: 'center', justifyContent: 'center', shadowColor: '#263C28', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.14, shadowRadius: 3, elevation: 2 }, markerText: { color: CourseColors.white, fontSize: 13, lineHeight: 15, fontWeight: '900' },
  callout: { width: 210, backgroundColor: CourseColors.white, borderRadius: 14, padding: 13, gap: 4, borderWidth: 1, borderColor: CourseColors.border }, calloutTitle: { color: CourseColors.text, fontWeight: '900', fontSize: 15 }, calloutTime: { color: CourseColors.primary, fontWeight: '800', fontSize: 12 }, calloutAddress: { color: CourseColors.muted, fontSize: 12, lineHeight: 17 }, externalButton: { alignSelf: 'flex-start', borderWidth: 1, borderColor: '#D7E2D4', backgroundColor: CourseColors.background, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9 }, externalButtonText: { color: CourseColors.primaryDark, fontWeight: '800', fontSize: 12 },
});
