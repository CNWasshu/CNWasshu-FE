import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackHeader } from '@/components/common/BackHeader';
import { CourseColors } from '@/constants/course-colors';
import { useSignup } from '@/hooks/auth/use-signup';

const MIN_PASSWORD_LENGTH = 8;

export default function SignupScreen() {
  const { errorMessage: signupErrorMessage, isSubmitting, signup } = useSignup();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setFormErrorMessage(null);

    const trimmedEmail = email.trim();
    const trimmedNickname = nickname.trim();

    if (!trimmedEmail || !password || !trimmedNickname) {
      setFormErrorMessage('이메일, 비밀번호, 닉네임을 모두 입력해 주세요.');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setFormErrorMessage(`비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`);
      return;
    }
    if (password !== passwordConfirm) {
      setFormErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    await signup(trimmedEmail, password, trimmedNickname);
  };

  const errorMessage = formErrorMessage ?? signupErrorMessage;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <BackHeader />
          <Text style={styles.heroTitle}>회원가입</Text>
          <Text style={styles.heroDescription}>
            이메일로 가입하고{`\n`}충남 여행을 시작해 보세요.
          </Text>
        </View>

        <View style={styles.body}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="이메일"
            placeholderTextColor={CourseColors.muted}
            style={styles.input}
            value={email}
          />
          <TextInput
            editable={!isSubmitting}
            onChangeText={setPassword}
            placeholder={`비밀번호 (${MIN_PASSWORD_LENGTH}자 이상)`}
            placeholderTextColor={CourseColors.muted}
            secureTextEntry
            style={styles.input}
            value={password}
          />
          <TextInput
            editable={!isSubmitting}
            onChangeText={setPasswordConfirm}
            placeholder="비밀번호 확인"
            placeholderTextColor={CourseColors.muted}
            secureTextEntry
            style={styles.input}
            value={passwordConfirm}
          />
          <TextInput
            editable={!isSubmitting}
            maxLength={50}
            onChangeText={setNickname}
            placeholder="닉네임"
            placeholderTextColor={CourseColors.muted}
            style={styles.input}
            value={nickname}
          />

          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

          <Pressable
            disabled={isSubmitting}
            onPress={() => void handleSubmit()}
            style={[styles.submitButton, isSubmitting && styles.disabled]}>
            {isSubmitting ? (
              <ActivityIndicator color={CourseColors.white} />
            ) : (
              <Text style={styles.submitButtonText}>회원가입</Text>
            )}
          </Pressable>

          <Link asChild href="/auth/login">
            <Pressable style={styles.loginLink}>
              <Text style={styles.loginLinkText}>이미 계정이 있으신가요? 로그인</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CourseColors.primary },
  container: { flexGrow: 1, backgroundColor: CourseColors.background },
  hero: {
    backgroundColor: CourseColors.primary,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 42,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    gap: 12,
  },
  heroTitle: { color: CourseColors.white, fontSize: 30, fontWeight: '900' },
  heroDescription: { color: '#E4EFE1', fontSize: 14, lineHeight: 22, marginTop: 3 },
  body: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 22,
    marginTop: 32,
    paddingBottom: 40,
    gap: 10,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: CourseColors.border,
    borderRadius: 15,
    paddingHorizontal: 16,
    fontSize: 15,
    color: CourseColors.text,
    backgroundColor: CourseColors.white,
  },
  error: { color: CourseColors.error, textAlign: 'center' },
  submitButton: {
    minHeight: 52,
    backgroundColor: CourseColors.primary,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitButtonText: { color: CourseColors.white, fontWeight: '900', fontSize: 15 },
  disabled: { opacity: 0.55 },
  loginLink: { alignItems: 'center', paddingVertical: 8 },
  loginLinkText: { color: CourseColors.primary, fontSize: 13, fontWeight: '700' },
});
