import { CourseColors } from '@/constants/course-colors';
import type { CourseItem } from '@/types/course';
import { getGoogleMapsDirectionsUrl, getGoogleMapsPlaceUrl, openExternalMap } from '@/utils/courseMaps';
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { buildCourseMarkers, groupMarkersByDay } from './courseMapData';
import { CourseMapPlaceholder } from './CourseMapPlaceholder';

export { buildCourseMarkers, groupMarkersByDay } from './courseMapData';

function displayTime(time: string) {
  return time.slice(0, 5);
}

export function CourseMap({ items }: { items: CourseItem[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markers = useMemo(() => buildCourseMarkers(items), [items]);
  const dayGroups = useMemo(() => groupMarkersByDay(markers), [markers]);
  const dayNumbers = useMemo(() => [...new Set(items.map((item) => item.dayNo))], [items]);
  const [selectedDay, setSelectedDay] = useState(dayNumbers[0]);
  const activeDay = dayNumbers.includes(selectedDay) ? selectedDay : dayNumbers[0];
  const selectedMarkers = useMemo(() => activeDay == null ? [] : dayGroups[activeDay] ?? [], [activeDay, dayGroups]);
  const dayItems = useMemo(() => items.filter((item) => item.dayNo === activeDay), [activeDay, items]);

  useEffect(() => {
    if (dayNumbers.length > 0 && !dayNumbers.includes(selectedDay)) setSelectedDay(dayNumbers[0]);
  }, [dayNumbers, selectedDay]);

  useEffect(() => {
    if (!containerRef.current || selectedMarkers.length === 0) return;
    let disposed = false;
    void import('leaflet').then((leaflet) => {
      if (disposed || !containerRef.current) return;
      mapRef.current?.remove();
      const map = leaflet.map(containerRef.current, { zoomControl: true });
      mapRef.current = map;
      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const coordinates = selectedMarkers.map((marker) => leaflet.latLng(marker.latitude, marker.longitude));
      if (coordinates.length === 1) map.setView(coordinates[0], 14);
      else map.fitBounds(leaflet.latLngBounds(coordinates), { padding: [42, 42] });

      if (coordinates.length > 1) leaflet.polyline(coordinates, { color: CourseColors.primary, weight: 4, opacity: 0.8 }).addTo(map);
      selectedMarkers.forEach((marker) => {
        const icon = leaflet.divIcon({
          className: '',
          html: `<div style="width:34px;height:34px;border-radius:17px;background:${CourseColors.primary};border:3px solid white;color:white;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 6px rgba(38,60,40,.28)">${marker.markerNumber}</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });
        const popup = document.createElement('div');
        const title = document.createElement('strong');
        title.textContent = `${marker.markerNumber}. ${marker.title}`;
        const time = document.createElement('div');
        time.textContent = `${displayTime(marker.startTime)} ~ ${displayTime(marker.endTime)}`;
        time.style.color = CourseColors.primary;
        popup.append(title, time);
        if (marker.address) {
          const address = document.createElement('div');
          address.textContent = marker.address;
          address.style.marginTop = '4px';
          popup.append(address);
        }
        leaflet.marker([marker.latitude, marker.longitude], { icon }).addTo(map).bindPopup(popup);
      });
      requestAnimationFrame(() => map.invalidateSize());
    });
    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [selectedMarkers]);

  if (markers.length === 0) return <CourseMapPlaceholder />;
  const externalUrl = getGoogleMapsDirectionsUrl(dayItems) ?? (dayItems[0] ? getGoogleMapsPlaceUrl(dayItems[0]) : null);

  return (
    <View style={styles.wrapper}>
      {dayNumbers.length > 1 ? <View style={styles.days}>{dayNumbers.map((dayNo) => <Pressable key={dayNo} onPress={() => setSelectedDay(dayNo)} style={[styles.dayChip, activeDay === dayNo && styles.dayChipSelected]}><Text style={[styles.dayText, activeDay === dayNo && styles.dayTextSelected]}>Day {dayNo}</Text></Pressable>)}</View> : null}
      {selectedMarkers.length > 0 ? (
        <View style={styles.mapFrame}>{/* Web-only DOM node used as the Leaflet mount point. */}<div ref={containerRef} style={{ width: '100%', height: '100%' }} /></View>
      ) : <CourseMapPlaceholder />}
      {externalUrl ? <Pressable style={styles.button} onPress={() => void openExternalMap(externalUrl)}><Text style={styles.buttonText}>Google 지도에서 전체 경로 보기 ↗</Text></Pressable> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 10 }, days: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, dayChip: { borderWidth: 1, borderColor: CourseColors.border, backgroundColor: CourseColors.white, borderRadius: 16, paddingHorizontal: 13, paddingVertical: 7 }, dayChipSelected: { borderColor: CourseColors.primary, backgroundColor: CourseColors.primary }, dayText: { color: CourseColors.muted, fontSize: 12, fontWeight: '800' }, dayTextSelected: { color: CourseColors.white },
  mapFrame: { height: 300, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: '#CAD8C8', backgroundColor: CourseColors.map }, button: { borderWidth: 1, borderColor: CourseColors.primary, backgroundColor: CourseColors.primarySoft, borderRadius: 14, padding: 12, alignItems: 'center' }, buttonText: { color: CourseColors.primaryDark, fontWeight: '900', fontSize: 13 },
});
