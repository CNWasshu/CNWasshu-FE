import type { CourseItem } from '@/types/course';
import { Linking, Platform } from 'react-native';

function searchQuery(item: CourseItem) {
  return [item.title, item.address?.trim()].filter(Boolean).join(' ');
}

export function getKakaoMapWebUrl(item: CourseItem) {
  if (item.latitude != null && item.longitude != null) {
    return `https://map.kakao.com/link/map/${encodeURIComponent(item.title)},${item.latitude},${item.longitude}`;
  }
  return `https://map.kakao.com/link/search/${encodeURIComponent(searchQuery(item))}`;
}

function getKakaoMapAppUrl(item: CourseItem) {
  if (item.latitude != null && item.longitude != null) {
    return `kakaomap://look?p=${item.latitude},${item.longitude}`;
  }
  return `kakaomap://search?q=${encodeURIComponent(searchQuery(item))}`;
}

export async function openKakaoMap(item: CourseItem) {
  const webUrl = getKakaoMapWebUrl(item);
  if (Platform.OS === 'web') {
    await Linking.openURL(webUrl);
    return;
  }

  try {
    await Linking.openURL(getKakaoMapAppUrl(item));
  } catch {
    await Linking.openURL(webUrl);
  }
}
