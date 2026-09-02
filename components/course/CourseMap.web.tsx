import { CourseColors } from '@/constants/course-colors';
import type { CourseItem } from '@/types/course';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  const defaultDay = markers[0]?.dayNo ?? dayNumbers[0];
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const activeDay = dayNumbers.includes(selectedDay) ? selectedDay : dayNumbers[0];
  const selectedMarkers = useMemo(() => activeDay == null ? [] : dayGroups[activeDay] ?? [], [activeDay, dayGroups]);

  useEffect(() => {
    setSelectedDay(defaultDay);
  }, [defaultDay, items]);

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

      if (coordinates.length > 1) leaflet.polyline(coordinates, { color: CourseColors.primary, weight: 2, opacity: 0.72 }).addTo(map);
      selectedMarkers.forEach((marker) => {
        const icon = leaflet.divIcon({
          className: '',
          html: `<div style="box-sizing:border-box;width:30px;height:30px;border-radius:50%;background:${CourseColors.primary};border:2px solid white;color:white;font-size:13px;line-height:1;font-weight:900;display:flex;align-items:center;justify-content:center;overflow:visible;white-space:nowrap;box-shadow:0 2px 4px rgba(38,60,40,.16)">${marker.markerNumber}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
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
  return (
    <View style={styles.wrapper}>
      {dayNumbers.length > 1 ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.days}>{dayNumbers.map((dayNo) => <Pressable key={dayNo} accessibilityRole="tab" accessibilityState={{ selected: activeDay === dayNo }} onPress={() => setSelectedDay(dayNo)} style={[styles.dayChip, activeDay === dayNo && styles.dayChipSelected]}>{activeDay === dayNo ? <Ionicons color={CourseColors.white} name="checkmark" size={15} /> : null}<Text style={[styles.dayText, activeDay === dayNo && styles.dayTextSelected]}>Day {dayNo}</Text></Pressable>)}</ScrollView> : null}
      {selectedMarkers.length > 0 ? (
        <View style={styles.mapFrame}>{/* Web-only DOM node used as the Leaflet mount point. */}<div ref={containerRef} style={{ width: '100%', height: '100%' }} /></View>
      ) : <CourseMapPlaceholder dayNo={activeDay} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 9 }, days: { gap: 7, paddingRight: 12 }, dayChip: { alignItems: 'center', flexDirection: 'row', gap: 4, minHeight: 44, borderWidth: 1, borderColor: CourseColors.border, backgroundColor: CourseColors.background, borderRadius: 14, paddingHorizontal: 12 }, dayChipSelected: { borderColor: CourseColors.primary, backgroundColor: CourseColors.primary }, dayText: { color: CourseColors.muted, fontSize: 12, fontWeight: '800' }, dayTextSelected: { color: CourseColors.white },
  mapFrame: { height: 260, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#CAD8C8', backgroundColor: CourseColors.map },
});
