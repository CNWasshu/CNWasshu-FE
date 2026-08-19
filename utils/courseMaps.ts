import type { CourseItem } from '@/types/course';
import { Linking } from 'react-native';

function locationValue(item: CourseItem) {
  if (item.latitude != null && item.longitude != null) {
    return `${item.latitude},${item.longitude}`;
  }
  return item.address?.trim() || item.title;
}

export function getGoogleMapsPlaceUrl(item: CourseItem) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationValue(item))}`;
}

export function getGoogleMapsDirectionsUrl(items: CourseItem[]) {
  if (items.length < 2) return null;
  const locations = items.map(locationValue);
  const params = [
    'api=1',
    `origin=${encodeURIComponent(locations[0])}`,
    `destination=${encodeURIComponent(locations[locations.length - 1])}`,
  ];
  const waypoints = locations.slice(1, -1);
  if (waypoints.length > 0) params.push(`waypoints=${waypoints.map(encodeURIComponent).join('%7C')}`);
  return `https://www.google.com/maps/dir/?${params.join('&')}`;
}

export async function openExternalMap(url: string) {
  await Linking.openURL(url);
}
