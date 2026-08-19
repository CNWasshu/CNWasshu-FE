import type { CourseItem } from '@/types/course';

export interface CourseMarker {
  dayNo: number;
  markerNumber: number;
  title: string;
  address: string | null;
  startTime: string;
  endTime: string;
  latitude: number;
  longitude: number;
}

export function buildCourseMarkers(items: CourseItem[]): CourseMarker[] {
  return items.flatMap((item) =>
    item.latitude != null && item.longitude != null
      ? [{
          dayNo: item.dayNo,
          markerNumber: item.sortOrder,
          title: item.title,
          address: item.address,
          startTime: item.startTime,
          endTime: item.endTime,
          latitude: item.latitude,
          longitude: item.longitude,
        }]
      : [],
  );
}

export function groupMarkersByDay(markers: CourseMarker[]) {
  return markers.reduce<Record<number, CourseMarker[]>>((groups, marker) => {
    (groups[marker.dayNo] ??= []).push(marker);
    return groups;
  }, {});
}
