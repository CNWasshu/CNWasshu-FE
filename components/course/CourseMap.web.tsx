import { CourseColors } from '@/constants/course-colors';
import type { CourseItem } from '@/types/course';
import { loadKakaoMapsSdk } from '@/utils/kakaoMapSdk.web';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  buildCourseMarkers,
  groupMarkersByDay,
} from './courseMapData';
import { CourseMapPlaceholder } from './CourseMapPlaceholder';

export {
  buildCourseMarkers,
  groupMarkersByDay
} from './courseMapData';

const KAKAO_MAP_KEY =
  process.env.EXPO_PUBLIC_KAKAO_MAP_JS_KEY?.trim() ?? '';

function displayTime(time: string) {
  return time.slice(0, 5);
}

function createTextElement(className: string, text: string) {
  console.log('[CourseMap:web] createTextElement', {
    className,
    text,
  });

  const element = document.createElement('div');
  element.className = className;
  element.textContent = text;

  return element;
}

export function CourseMap({
  items,
}: {
  items: CourseItem[];
}) {
  console.log('[CourseMap:web] component render', {
    itemCount: items.length,
    hasKey: !!KAKAO_MAP_KEY,
    keyLength: KAKAO_MAP_KEY.length,
    windowExists: typeof window !== 'undefined',
    documentExists: typeof document !== 'undefined',
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [loadError, setLoadError] = useState(false);

  const markers = useMemo(() => {
    console.log('[CourseMap:web] buildCourseMarkers input', items);

    const result = buildCourseMarkers(items);

    console.log('[CourseMap:web] buildCourseMarkers result', {
      markerCount: result.length,
      markers: result,
    });

    return result;
  }, [items]);

  const dayGroups = useMemo(() => {
    const result = groupMarkersByDay(markers);

    console.log('[CourseMap:web] groupMarkersByDay result', result);

    return result;
  }, [markers]);

  const dayNumbers = useMemo(() => {
    const result = [
      ...new Set(items.map((item) => item.dayNo)),
    ];

    console.log('[CourseMap:web] dayNumbers', result);

    return result;
  }, [items]);

  const defaultDay =
    markers[0]?.dayNo ?? dayNumbers[0];

  const [selectedDay, setSelectedDay] =
    useState(defaultDay);

  const activeDay =
    selectedDay != null &&
    dayNumbers.includes(selectedDay)
      ? selectedDay
      : dayNumbers[0];

  const selectedMarkers = useMemo(() => {
    const result =
      activeDay == null
        ? []
        : dayGroups[activeDay] ?? [];

    console.log('[CourseMap:web] selectedMarkers', {
      activeDay,
      selectedDay,
      markerCount: result.length,
      markers: result,
    });

    return result;
  }, [activeDay, dayGroups, selectedDay]);

  useEffect(() => {
    console.log(
      '[CourseMap:web] defaultDay effect',
      {
        defaultDay,
        itemCount: items.length,
      },
    );

    setSelectedDay(defaultDay);
  }, [defaultDay, items]);

  useEffect(() => {
    console.group(
      '[CourseMap:web] map effect start',
    );

    console.log('state', {
      selectedDay,
      activeDay,
      loadError,
      markerCount: markers.length,
      selectedMarkerCount:
        selectedMarkers.length,
    });

    console.log('environment', {
      hasKey: !!KAKAO_MAP_KEY,
      keyLength: KAKAO_MAP_KEY.length,
      keyPrefix: KAKAO_MAP_KEY
        ? `${KAKAO_MAP_KEY.slice(0, 4)}...`
        : null,
      href:
        typeof window !== 'undefined'
          ? window.location.href
          : null,
      origin:
        typeof window !== 'undefined'
          ? window.location.origin
          : null,
    });

    const container = containerRef.current;

    console.log('container', {
      exists: !!container,
      current: container,
      width: container?.clientWidth,
      height: container?.clientHeight,
    });

    if (!container) {
      console.warn(
        '[CourseMap:web] effect aborted: containerRef.current is null',
      );

      console.groupEnd();
      return;
    }

    if (selectedMarkers.length === 0) {
      console.warn(
        '[CourseMap:web] effect aborted: selectedMarkers is empty',
      );

      console.groupEnd();
      return;
    }

    if (!KAKAO_MAP_KEY) {
      console.warn(
        '[CourseMap:web] effect aborted: Kakao map key is missing',
      );

      console.groupEnd();
      return;
    }

    let disposed = false;

    console.log(
      '[CourseMap:web] resetting loadError=false',
    );

    setLoadError(false);

    console.log(
      '[CourseMap:web] calling loadKakaoMapsSdk',
    );

    void loadKakaoMapsSdk(KAKAO_MAP_KEY)
      .then((maps) => {
        console.group(
          '[CourseMap:web] SDK promise resolved',
        );

        console.log('maps object', maps);

        console.log('window.kakao', {
          exists:
            typeof window !== 'undefined' &&
            !!window.kakao,
          kakao:
            typeof window !== 'undefined'
              ? window.kakao
              : undefined,
        });

        console.log('disposed', disposed);

        if (disposed) {
          console.warn(
            '[CourseMap:web] SDK resolved but effect already disposed',
          );

          console.groupEnd();
          return;
        }

        try {
          console.log(
            '[CourseMap:web] clearing map container',
          );

          container.replaceChildren();

          const first = selectedMarkers[0];

          console.log(
            '[CourseMap:web] first marker',
            first,
          );

          console.log(
            '[CourseMap:web] creating first LatLng',
            {
              latitude: first.latitude,
              longitude: first.longitude,
              latitudeType:
                typeof first.latitude,
              longitudeType:
                typeof first.longitude,
            },
          );

          const firstPosition =
            new maps.LatLng(
              first.latitude,
              first.longitude,
            );

          console.log(
            '[CourseMap:web] first LatLng created',
            firstPosition,
          );

          console.log(
            '[CourseMap:web] creating Kakao Map',
            {
              containerWidth:
                container.clientWidth,
              containerHeight:
                container.clientHeight,
            },
          );

          const map = new maps.Map(container, {
            center: firstPosition,
            level: 6,
          });

          console.log(
            '[CourseMap:web] Kakao Map created',
            map,
          );

          console.log(
            '[CourseMap:web] creating LatLngBounds',
          );

          const bounds =
            new maps.LatLngBounds();

          console.log(
            '[CourseMap:web] LatLngBounds created',
            bounds,
          );

          let openedInfo:
            | kakao.maps.CustomOverlay
            | null = null;

          selectedMarkers.forEach(
            (marker, index) => {
              console.group(
                `[CourseMap:web] marker ${index + 1}`,
              );

              try {
                console.log(
                  'marker data',
                  marker,
                );

                console.log(
                  'creating LatLng',
                  {
                    latitude:
                      marker.latitude,
                    longitude:
                      marker.longitude,
                  },
                );

                const position =
                  new maps.LatLng(
                    marker.latitude,
                    marker.longitude,
                  );

                console.log(
                  'LatLng created',
                  position,
                );

                console.log(
                  'extending bounds',
                );

                bounds.extend(position);

                console.log(
                  'creating marker element',
                );

                const markerElement =
                  createTextElement(
                    'course-kakao-marker',
                    String(
                      marker.markerNumber,
                    ),
                  );

                console.log(
                  'creating CustomOverlay',
                );

                const markerOverlay =
                  new maps.CustomOverlay({
                    clickable: true,
                    content:
                      markerElement,
                    map,
                    position,
                    xAnchor: 0.5,
                    yAnchor: 0.5,
                    zIndex: 2,
                  });

                console.log(
                  'CustomOverlay created',
                  markerOverlay,
                );

                markerElement.addEventListener(
                  'click',
                  () => {
                    console.log(
                      '[CourseMap:web] marker clicked',
                      marker,
                    );

                    openedInfo?.setMap(
                      null,
                    );

                    const info =
                      document.createElement(
                        'div',
                      );

                    info.className =
                      'course-kakao-info';

                    info.append(
                      createTextElement(
                        'course-kakao-info-title',
                        `${marker.markerNumber}. ${marker.title}`,
                      ),
                    );

                    info.append(
                      createTextElement(
                        'course-kakao-info-time',
                        `${displayTime(marker.startTime)} ~ ${displayTime(marker.endTime)}`,
                      ),
                    );

                    if (
                      marker.address
                    ) {
                      info.append(
                        createTextElement(
                          'course-kakao-info-address',
                          marker.address,
                        ),
                      );
                    }

                    console.log(
                      '[CourseMap:web] creating info CustomOverlay',
                    );

                    openedInfo =
                      new maps.CustomOverlay({
                        content: info,
                        map,
                        position,
                        xAnchor: 0.5,
                        yAnchor: 1.25,
                        zIndex: 3,
                      });

                    console.log(
                      '[CourseMap:web] info overlay created',
                      openedInfo,
                    );
                  },
                );

                console.log(
                  'marker setup complete',
                );
              } catch (error) {
                console.error(
                  `[CourseMap:web] marker ${index + 1} failed`,
                  error,
                  marker,
                );

                throw error;
              } finally {
                console.groupEnd();
              }
            },
          );

          if (
            selectedMarkers.length === 1
          ) {
            console.log(
              '[CourseMap:web] single marker: setCenter / setLevel',
            );

            map.setCenter(firstPosition);
            map.setLevel(5);
          } else {
            console.log(
              '[CourseMap:web] multiple markers: setBounds',
              {
                markerCount:
                  selectedMarkers.length,
              },
            );

            map.setBounds(
              bounds,
              52,
              42,
              42,
              42,
            );

            console.log(
              '[CourseMap:web] setBounds complete',
            );
          }

          console.log(
            '[CourseMap:web] registering map click listener',
          );

          maps.event.addListener(
            map,
            'click',
            () => {
              console.log(
                '[CourseMap:web] map clicked',
              );

              openedInfo?.setMap(null);
              openedInfo = null;
            },
          );

          console.log(
            '[CourseMap:web] scheduling relayout',
          );

          requestAnimationFrame(() => {
            try {
              console.log(
                '[CourseMap:web] relayout start',
                {
                  width:
                    container.clientWidth,
                  height:
                    container.clientHeight,
                },
              );

              map.relayout();

              console.log(
                '[CourseMap:web] relayout complete',
              );
            } catch (error) {
              console.error(
                '[CourseMap:web] relayout failed',
                error,
              );
            }
          });

          console.log(
            '[CourseMap:web] map initialization complete',
          );
        } catch (error) {
          console.error(
            '[CourseMap:web] map initialization threw inside then()',
            error,
          );

          throw error;
        } finally {
          console.groupEnd();
        }
      })
      .catch((error) => {
        console.error(
          '[CourseMap:web] Kakao Map initialization failed',
          {
            error,
            message:
              error instanceof Error
                ? error.message
                : String(error),
            stack:
              error instanceof Error
                ? error.stack
                : undefined,
            selectedMarkers,
            hasKey:
              !!KAKAO_MAP_KEY,
            href:
              typeof window !==
              'undefined'
                ? window.location.href
                : null,
          },
        );

        if (!disposed) {
          console.log(
            '[CourseMap:web] setting loadError=true',
          );

          setLoadError(true);
        } else {
          console.warn(
            '[CourseMap:web] error occurred after disposal, loadError not changed',
          );
        }
      });

    console.groupEnd();

    return () => {
      console.log(
        '[CourseMap:web] effect cleanup',
        {
          disposedBefore: disposed,
          containerExists:
            !!container,
        },
      );

      disposed = true;

      try {
        container.replaceChildren();

        console.log(
          '[CourseMap:web] container cleared during cleanup',
        );
      } catch (error) {
        console.error(
          '[CourseMap:web] cleanup failed',
          error,
        );
      }
    };
  }, [
    activeDay,
    loadError,
    markers.length,
    selectedDay,
    selectedMarkers,
  ]);

  console.log(
    '[CourseMap:web] render decision',
    {
      markerCount: markers.length,
      selectedMarkerCount:
        selectedMarkers.length,
      hasKey: !!KAKAO_MAP_KEY,
      loadError,
      activeDay,
    },
  );

  if (markers.length === 0) {
    console.warn(
      '[CourseMap:web] rendering placeholder because markers.length === 0',
    );

    return <CourseMapPlaceholder />;
  }

  const mapContent =
    !KAKAO_MAP_KEY || loadError ? (
      <CourseMapPlaceholder
        accessibilityLabel="카카오 지도를 불러오지 못함"
        description="지도 설정을 확인한 뒤 다시 시도해 주세요. 일정 정보는 아래에서 확인할 수 있습니다."
        title={
          !KAKAO_MAP_KEY
            ? '카카오 지도 키가 설정되지 않았어요'
            : '카카오 지도를 불러오지 못했어요'
        }
      />
    ) : selectedMarkers.length > 0 ? (
      <View style={styles.mapFrame}>
        <div
          className="course-kakao-map"
          ref={(element) => {
            console.log(
              '[CourseMap:web] container ref callback',
              {
                exists: !!element,
                element,
              },
            );

            containerRef.current =
              element;
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </View>
    ) : (
      <CourseMapPlaceholder
        dayNo={activeDay}
      />
    );

  return (
    <View style={styles.wrapper}>
      {dayNumbers.length > 1 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.days
          }
        >
          {dayNumbers.map((dayNo) => (
            <Pressable
              key={dayNo}
              accessibilityRole="tab"
              accessibilityState={{
                selected:
                  activeDay ===
                  dayNo,
              }}
              onPress={() => {
                console.log(
                  '[CourseMap:web] day selected',
                  {
                    from:
                      selectedDay,
                    to: dayNo,
                  },
                );

                setSelectedDay(
                  dayNo,
                );
              }}
              style={[
                styles.dayChip,
                activeDay ===
                  dayNo &&
                  styles.dayChipSelected,
              ]}
            >
              {activeDay ===
              dayNo ? (
                <Ionicons
                  color={
                    CourseColors.white
                  }
                  name="checkmark"
                  size={15}
                />
              ) : null}

              <Text
                style={[
                  styles.dayText,
                  activeDay ===
                    dayNo &&
                    styles.dayTextSelected,
                ]}
              >
                Day {dayNo}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      {mapContent}

      <style>{`
        .course-kakao-marker {
          box-sizing: border-box;
          width: 32px;
          height: 32px;
          border: 2px solid #fff;
          border-radius: 50%;
          background: ${CourseColors.primary};
          box-shadow: 0 2px 5px rgba(38, 60, 40, .24);
          color: #fff;
          font: 900 13px/28px -apple-system, BlinkMacSystemFont, sans-serif;
          text-align: center;
          cursor: pointer;
        }

        .course-kakao-info {
          box-sizing: border-box;
          width: 220px;
          padding: 12px;
          border: 1px solid ${CourseColors.border};
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 3px 10px rgba(38, 60, 40, .18);
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .course-kakao-info-title {
          color: ${CourseColors.text};
          font-size: 15px;
          font-weight: 800;
          line-height: 20px;
        }

        .course-kakao-info-time {
          margin-top: 4px;
          color: ${CourseColors.primary};
          font-size: 12px;
          font-weight: 700;
        }

        .course-kakao-info-address {
          margin-top: 5px;
          color: ${CourseColors.muted};
          font-size: 12px;
          line-height: 17px;
        }
      `}</style>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 9,
  },

  days: {
    gap: 7,
    paddingRight: 12,
  },

  dayChip: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    minHeight: 44,
    borderWidth: 1,
    borderColor:
      CourseColors.border,
    backgroundColor:
      CourseColors.background,
    borderRadius: 14,
    paddingHorizontal: 12,
  },

  dayChipSelected: {
    borderColor:
      CourseColors.primary,
    backgroundColor:
      CourseColors.primary,
  },

  dayText: {
    color:
      CourseColors.muted,
    fontSize: 13,
    fontWeight: '800',
  },

  dayTextSelected: {
    color:
      CourseColors.white,
  },

  mapFrame: {
    height: 260,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CAD8C8',
    backgroundColor:
      CourseColors.map,
  },
});