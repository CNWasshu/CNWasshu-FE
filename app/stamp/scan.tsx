import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { normalizeStampApiError, stampApi } from '@/api/stampApi';
import { CourseColors } from '@/constants/course-colors';
import { clearTokens, getAccessToken, isSessionExpiredError } from '@/utils/auth';

type ScanStatus = 'checking-token' | 'scanning' | 'processing' | 'success' | 'error';

export default function StampScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [status, setStatus] = useState<ScanStatus>('checking-token');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultTitle, setResultTitle] = useState<string | null>(null);
  const scanLockRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const token = await getAccessToken();
      if (!cancelled) {
        setAccessToken(token);
        setStatus('scanning');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBarcodeScanned = async (result: { data: string }) => {
    if (scanLockRef.current || !accessToken) {
      return;
    }
    scanLockRef.current = true;
    setStatus('processing');
    setErrorMessage(null);

    try {
      const response = await stampApi.createStamp({ qrCode: result.data }, accessToken);
      setResultTitle(response.activityTitle);
      setStatus('success');
      setTimeout(() => {
        router.replace('/stamp');
      }, 1400);
    } catch (requestError) {
      if (isSessionExpiredError(requestError)) {
        await clearTokens();
        router.replace('/auth/login');
        return;
      }
      const apiError = normalizeStampApiError(requestError);
      setErrorMessage(apiError.message);
      setStatus('error');
    }
  };

  const handleRetry = () => {
    scanLockRef.current = false;
    setErrorMessage(null);
    setResultTitle(null);
    setStatus('scanning');
  };

  // TODO(디버그용, 확인 후 제거): 권한 요청 버튼이 반응 없다는 이슈 원인 파악용
  const handleRequestPermission = async () => {
    console.log('[stamp/scan] 권한 허용하기 버튼 클릭됨');
    try {
      const result = await requestPermission();
      console.log('[stamp/scan] requestPermission() 결과 =', JSON.stringify(result));
    } catch (permissionError) {
      console.error('[stamp/scan] requestPermission() 에러:', permissionError);
    }
  };

  if (!permission || status === 'checking-token') {
    return (
      <SafeAreaView style={styles.centerSafe}>
        <ActivityIndicator size="large" color={CourseColors.white} />
      </SafeAreaView>
    );
  }

  // TODO(디버그용, 확인 후 제거)
  console.log('[stamp/scan] 현재 permission 상태 =', JSON.stringify(permission));

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centerSafe}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>카메라 권한이 필요해요</Text>
          <Text style={styles.permissionDescription}>
            체험 인증 QR 코드를 스캔하려면{'\n'}카메라 접근을 허용해 주세요.
          </Text>
          <Pressable style={styles.primaryButton} onPress={handleRequestPermission}>
            <Text style={styles.primaryButtonText}>권한 허용하기</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>뒤로 가기</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={status === 'scanning' ? handleBarcodeScanned : undefined}
      />

      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            style={styles.closeButton}
            onPress={() => router.back()}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </Pressable>
        </View>

        <View style={styles.frameArea}>
          <View style={styles.scanFrame} />
          {status === 'scanning' ? (
            <Text style={styles.guideText}>QR 코드를 프레임 안에 맞춰주세요</Text>
          ) : null}
        </View>

        {status === 'processing' ? (
          <View style={styles.statusCard}>
            <ActivityIndicator color={CourseColors.primary} />
            <Text style={styles.statusText}>확인하고 있어요...</Text>
          </View>
        ) : null}

        {status === 'success' ? (
          <View style={styles.statusCard}>
            <Text style={styles.successTitle}>스탬프 획득!</Text>
            {resultTitle ? <Text style={styles.successDescription}>{resultTitle}</Text> : null}
          </View>
        ) : null}

        {status === 'error' ? (
          <View style={styles.statusCard}>
            <Text style={styles.errorTitle}>{errorMessage}</Text>
            <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={handleRetry}>
              <Text style={styles.primaryButtonText}>다시 스캔하기</Text>
            </Pressable>
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const FRAME_SIZE = 240;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centerSafe: {
    flex: 1,
    backgroundColor: CourseColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
    alignItems: 'flex-end',
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  closeButtonText: { color: CourseColors.white, fontWeight: '800', fontSize: 14 },
  frameArea: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  scanFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: CourseColors.primary,
  },
  guideText: {
    color: CourseColors.white,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  statusCard: {
    marginHorizontal: 22,
    marginBottom: 30,
    padding: 20,
    borderRadius: 20,
    backgroundColor: CourseColors.white,
    alignItems: 'center',
    gap: 10,
  },
  statusText: { color: CourseColors.muted, fontWeight: '700', fontSize: 14 },
  successTitle: { color: CourseColors.primary, fontSize: 20, fontWeight: '900' },
  successDescription: { color: CourseColors.text, fontSize: 14, fontWeight: '700' },
  errorTitle: {
    color: CourseColors.error,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  permissionCard: {
    marginHorizontal: 28,
    padding: 24,
    borderRadius: 24,
    backgroundColor: CourseColors.white,
    alignItems: 'center',
    gap: 14,
  },
  permissionTitle: { color: CourseColors.text, fontSize: 18, fontWeight: '900' },
  permissionDescription: {
    color: CourseColors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  primaryButton: {
    minWidth: 180,
    minHeight: 50,
    borderRadius: 15,
    backgroundColor: CourseColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  primaryButtonText: { color: CourseColors.white, fontWeight: '900', fontSize: 14 },
  secondaryButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  secondaryButtonText: { color: CourseColors.muted, fontWeight: '700', fontSize: 14 },
});
