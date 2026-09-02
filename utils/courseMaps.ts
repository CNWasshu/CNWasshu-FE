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

export async function openExternalMap(url: string) {
  await Linking.openURL(url);
}
