const SCRIPT_ID = 'kakao-maps-sdk';

let sdkPromise: Promise<typeof kakao.maps> | null = null;

export function loadKakaoMapsSdk(appKey: string): Promise<typeof kakao.maps> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.reject(new Error('Kakao Maps SDK는 브라우저에서만 사용할 수 있습니다.'));
  }

  const key = appKey.trim();
  if (!key) {
    return Promise.reject(new Error('Kakao Maps JavaScript 키가 설정되지 않았습니다.'));
  }

  if (window.kakao?.maps) {
    return new Promise((resolve) => window.kakao!.maps.load(() => resolve(window.kakao!.maps)));
  }

  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const finishLoading = () => {
      if (!window.kakao?.maps) {
        sdkPromise = null;
        reject(new Error('Kakao Maps SDK를 초기화하지 못했습니다.'));
        return;
      }
      window.kakao.maps.load(() => resolve(window.kakao!.maps));
    };

    const failLoading = () => {
      sdkPromise = null;
      reject(new Error('Kakao Maps SDK를 불러오지 못했습니다.'));
    };

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener('load', finishLoading, { once: true });
      existingScript.addEventListener('error', failLoading, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&autoload=false`;
    script.addEventListener('load', finishLoading, { once: true });
    script.addEventListener('error', failLoading, { once: true });
    document.head.appendChild(script);
  });

  return sdkPromise;
}
