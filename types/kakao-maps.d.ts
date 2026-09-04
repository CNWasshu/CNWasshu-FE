declare namespace kakao.maps {
  class LatLng {
    constructor(latitude: number, longitude: number);
  }

  class LatLngBounds {
    extend(position: LatLng): void;
  }

  class Map {
    constructor(container: HTMLElement, options: { center: LatLng; level: number });
    setBounds(
      bounds: LatLngBounds,
      paddingTop?: number,
      paddingRight?: number,
      paddingBottom?: number,
      paddingLeft?: number
    ): void;
    setCenter(position: LatLng): void;
    setLevel(level: number): void;
    relayout(): void;
  }

  class CustomOverlay {
    constructor(options: {
      clickable?: boolean;
      content: HTMLElement | string;
      map?: Map;
      position: LatLng;
      xAnchor?: number;
      yAnchor?: number;
      zIndex?: number;
    });
    setMap(map: Map | null): void;
  }

  namespace event {
    function addListener(target: Map, type: string, handler: () => void): void;
  }

  function load(callback: () => void): void;
}

interface Window {
  kakao?: { maps: typeof kakao.maps };
  ReactNativeWebView?: { postMessage(message: string): void };
}
