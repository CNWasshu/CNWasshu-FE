import { CourseColors } from '@/constants/course-colors';
import type { CourseItem } from '@/types/course';
import { createKakaoMapWebViewHtml } from '@/utils/kakaoMapWebView';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { buildCourseMarkers, groupMarkersByDay } from './courseMapData';
import { CourseMapPlaceholder } from './CourseMapPlaceholder';

export { buildCourseMarkers, groupMarkersByDay } from './courseMapData';

const KAKAO_MAP_KEY = process.env.EXPO_PUBLIC_KAKAO_MAP_JS_KEY?.trim() ?? '';
const KAKAO_MAP_WEBVIEW_BASE_URL = process.env.EXPO_PUBLIC_KAKAO_MAP_WEBVIEW_BASE_URL?.trim() || 'https://localhost';

export function CourseMap({ items }: { items: CourseItem[] }) {
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const markers = useMemo(() => buildCourseMarkers(items), [items]);
  const dayGroups = useMemo(() => groupMarkersByDay(markers), [markers]);
  const dayNumbers = useMemo(() => [...new Set(items.map((item) => item.dayNo))], [items]);
  const defaultDay = markers[0]?.dayNo ?? dayNumbers[0];
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const activeDay = selectedDay != null && dayNumbers.includes(selectedDay) ? selectedDay : dayNumbers[0];
  const selectedMarkers = useMemo(() => activeDay == null ? [] : dayGroups[activeDay] ?? [], [activeDay, dayGroups]);
  const html = useMemo(() => createKakaoMapWebViewHtml(selectedMarkers, KAKAO_MAP_KEY), [selectedMarkers]);

  useEffect(() => { setSelectedDay(defaultDay); }, [defaultDay, items]);
  useEffect(() => {
    setLoadError(false);
    setLoading(selectedMarkers.length > 0 && Boolean(KAKAO_MAP_KEY));
  }, [selectedMarkers]);

  if (markers.length === 0) return <CourseMapPlaceholder />;

  const mapContent = !KAKAO_MAP_KEY || loadError
    ? <CourseMapPlaceholder accessibilityLabel="카카오 지도를 불러오지 못함" description="지도 설정이나 네트워크를 확인해 주세요. 일정 정보는 아래에서 확인할 수 있습니다." title={!KAKAO_MAP_KEY ? '카카오 지도 키가 설정되지 않았어요' : '카카오 지도를 불러오지 못했어요'} />
    : selectedMarkers.length > 0
      ? (
          <View style={styles.mapFrame}>
            <WebView
              javaScriptEnabled
              originWhitelist={['*']}
              onError={() => setLoadError(true)}
              onHttpError={() => setLoadError(true)}
              onMessage={({ nativeEvent }) => {
                if (nativeEvent.data === 'READY') setLoading(false);
                if (nativeEvent.data === 'ERROR') setLoadError(true);
              }}
              source={{ baseUrl: KAKAO_MAP_WEBVIEW_BASE_URL, html }}
              style={styles.webView}
            />
            {loading ? <View pointerEvents="none" style={styles.loading}><ActivityIndicator color={CourseColors.primary} /></View> : null}
          </View>
        )
      : <CourseMapPlaceholder dayNo={activeDay} />;

  return (
    <View style={styles.wrapper}>
      {dayNumbers.length > 1 ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.days}>{dayNumbers.map((dayNo) => <Pressable key={dayNo} accessibilityRole="tab" accessibilityState={{ selected: activeDay === dayNo }} onPress={() => setSelectedDay(dayNo)} style={[styles.dayChip, activeDay === dayNo && styles.dayChipSelected]}>{activeDay === dayNo ? <Ionicons color={CourseColors.white} name="checkmark" size={15} /> : null}<Text style={[styles.dayText, activeDay === dayNo && styles.dayTextSelected]}>Day {dayNo}</Text></Pressable>)}</ScrollView> : null}
      {mapContent}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 9 }, days: { gap: 7, paddingRight: 12 }, dayChip: { alignItems: 'center', flexDirection: 'row', gap: 4, minHeight: 44, borderWidth: 1, borderColor: CourseColors.border, backgroundColor: CourseColors.background, borderRadius: 14, paddingHorizontal: 12 }, dayChipSelected: { borderColor: CourseColors.primary, backgroundColor: CourseColors.primary }, dayText: { color: CourseColors.muted, fontSize: 12, fontWeight: '800' }, dayTextSelected: { color: CourseColors.white },
  mapFrame: { height: 235, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#CAD8C8', backgroundColor: CourseColors.map }, webView: { flex: 1, backgroundColor: CourseColors.map }, loading: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: CourseColors.map },
});
