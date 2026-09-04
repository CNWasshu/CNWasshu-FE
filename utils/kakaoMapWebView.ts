import type { CourseMarker } from '@/components/course/courseMapData';

function serializeForHtml(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function createKakaoMapWebViewHtml(markers: CourseMarker[], appKey: string) {
  const serializedMarkers = serializeForHtml(markers);
  const sdkUrl = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey.trim())}&autoload=false`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <style>
    html, body, #map { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; }
    .course-marker { width: 32px; height: 32px; border: 2px solid #fff; border-radius: 50%; background: #3f7d46; box-shadow: 0 2px 5px rgba(38,60,40,.24); color: #fff; font: 900 13px/28px -apple-system, BlinkMacSystemFont, sans-serif; text-align: center; }
    .course-info { box-sizing: border-box; width: 220px; padding: 12px; border: 1px solid #d8e5d5; border-radius: 14px; background: #fff; box-shadow: 0 3px 10px rgba(38,60,40,.18); font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
    .course-info-title { color: #29382b; font-size: 15px; font-weight: 800; line-height: 20px; }
    .course-info-time { margin-top: 4px; color: #3f7d46; font-size: 12px; font-weight: 700; }
    .course-info-address { margin-top: 5px; color: #6f786f; font-size: 12px; line-height: 17px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="${sdkUrl}" onerror="notify('ERROR')"></script>
  <script>
    const markers = ${serializedMarkers};
    let openedInfo = null;

    function notify(type) {
      if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(type);
    }

    function textElement(className, text) {
      const element = document.createElement('div');
      element.className = className;
      element.textContent = text;
      return element;
    }

    function initMap() {
      try {
        if (!window.kakao || !window.kakao.maps || markers.length === 0) return notify('ERROR');
        const first = markers[0];
        const map = new kakao.maps.Map(document.getElementById('map'), {
          center: new kakao.maps.LatLng(first.latitude, first.longitude),
          level: 6
        });
        const bounds = new kakao.maps.LatLngBounds();

        markers.forEach((marker) => {
          const position = new kakao.maps.LatLng(marker.latitude, marker.longitude);
          bounds.extend(position);

          const markerElement = textElement('course-marker', String(marker.markerNumber));
          const markerOverlay = new kakao.maps.CustomOverlay({
            clickable: true,
            content: markerElement,
            map,
            position,
            xAnchor: 0.5,
            yAnchor: 0.5,
            zIndex: 2
          });

          markerElement.addEventListener('click', () => {
            if (openedInfo) openedInfo.setMap(null);
            const info = document.createElement('div');
            info.className = 'course-info';
            info.appendChild(textElement('course-info-title', marker.markerNumber + '. ' + marker.title));
            info.appendChild(textElement('course-info-time', marker.startTime.slice(0, 5) + ' ~ ' + marker.endTime.slice(0, 5)));
            if (marker.address) info.appendChild(textElement('course-info-address', marker.address));
            openedInfo = new kakao.maps.CustomOverlay({ content: info, map, position, xAnchor: 0.5, yAnchor: 1.25, zIndex: 3 });
          });
        });

        if (markers.length === 1) {
          map.setCenter(new kakao.maps.LatLng(first.latitude, first.longitude));
          map.setLevel(5);
        } else {
          map.setBounds(bounds, 52, 42, 42, 42);
        }
        kakao.maps.event.addListener(map, 'click', () => {
          if (openedInfo) openedInfo.setMap(null);
          openedInfo = null;
        });
        notify('READY');
      } catch (error) {
        notify('ERROR');
      }
    }

    const timeout = setTimeout(() => notify('ERROR'), 10000);
    kakao.maps.load(() => {
      clearTimeout(timeout);
      initMap();
    });
  </script>
</body>
</html>`;
}
