import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseColors } from '@/constants/course-colors';
import { PAGE_LAYOUT } from '@/constants/layout';
import { useUpdateNickname } from '@/hooks/auth/use-update-nickname';
import { getAccessToken } from '@/utils/auth';

export default function OnboardingScreen() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null | undefined>(undefined);
  const [nickname, setNickname] = useState('');

  const { errorMessage, isSubmitting, updateNickname } = useUpdateNickname(accessToken ?? null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const token = await getAccessToken();
      if (!cancelled) {
        setAccessToken(token);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const trimmedNickname = nickname.trim();
  const canSubmit = trimmedNickname.length > 0 && !isSubmitting;

  const handleConfirm = async () => {
    if (!canSubmit) {
      return;
    }

    const updated = await updateNickname(trimmedNickname);
    if (updated) {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroBadge}>CNWASSHU</Text>
          <Text style={styles.heroTitle}>환영합니다!</Text>
          <Text style={styles.heroDescription}>
            사용하실 닉네임을 정해주세요.{'\n'}
            나중에 마이페이지에서 언제든 바꿀 수 있어요.
          </Text>
        </View>

        <View style={styles.body}>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력해 주세요"
            placeholderTextColor={CourseColors.muted}
            maxLength={50}
            editable={!isSubmitting}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
          />

          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

          <Pressable
            accessibilityRole="button"
            style={[styles.confirmButton, !canSubmit && styles.confirmButtonDisabled]}
            onPress={handleConfirm}
            disabled={!canSubmit}
          >
            {isSubmitting ? (
              <ActivityIndicator color={CourseColors.white} />
            ) : (
              <Text style={styles.confirmButtonText}>확인</Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CourseColors.primary },
  container: { flex: 1, backgroundColor: CourseColors.background },
  hero: {
    backgroundColor: CourseColors.primary,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 42,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    gap: 12,
  },
  heroBadge: {
    color: '#E6F3E3',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  heroTitle: { color: CourseColors.white, fontSize: 30, fontWeight: '900' },
  heroDescription: { color: '#E4EFE1', fontSize: 14, lineHeight: 22, marginTop: 3 },
  body: {
    flex: 1,
    width: '100%',
    maxWidth: PAGE_LAYOUT.desktopMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: 22,
    marginTop: 40,
    gap: 16,
  },
  input: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: CourseColors.border,
    borderRadius: 15,
    paddingHorizontal: 18,
    fontSize: 16,
    color: CourseColors.text,
    backgroundColor: CourseColors.white,
  },
  confirmButton: {
    minHeight: 56,
    backgroundColor: CourseColors.primary,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: { color: CourseColors.white, fontWeight: '900', fontSize: 16 },
  error: { color: CourseColors.error, textAlign: 'center' },
});
