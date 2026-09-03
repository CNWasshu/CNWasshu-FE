import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 모든 유저의 프로필 사진을 이 마스코트 이미지로 고정한다 (개별 업로드/변경 기능 없음).
const PROFILE_IMAGE = require('@/assets/images/충남마스코트.jpg');

import { DeleteAccountModal } from '@/components/auth/DeleteAccountModal';
import { BackHeader } from '@/components/common/BackHeader';
import { CourseColors } from '@/constants/course-colors';
import { useDeleteAccount } from '@/hooks/auth/use-delete-account';
import { useLogout } from '@/hooks/auth/use-logout';
import { useMe } from '@/hooks/auth/use-me';
import { useUpdateNickname } from '@/hooks/auth/use-update-nickname';
import { useMyStampCount } from '@/hooks/stamp/use-my-stamp-count';
import { getAccessToken } from '@/utils/auth';

export default function MyPageScreen() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null | undefined>(undefined);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameDraft, setNicknameDraft] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const { error: meError, loading: meLoading, refetch: refetchMe, setUser, user } = useMe(
    accessToken ?? null
  );
  const {
    errorMessage: nicknameErrorMessage,
    isSubmitting: isSavingNickname,
    reset: resetNickname,
    updateNickname,
  } = useUpdateNickname(accessToken ?? null);
  const { isSubmitting: isLoggingOut, logout } = useLogout();
  const {
    errorMessage: deleteErrorMessage,
    isSubmitting: isDeletingAccount,
    deleteAccount,
    reset: resetDeleteAccount,
  } = useDeleteAccount();
  const { loading: stampCountLoading, stampCount } = useMyStampCount(accessToken ?? null);

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

  useEffect(() => {
    if (accessToken === null) {
      router.replace('/auth/login');
    }
  }, [accessToken, router]);

  const handleStartEditNickname = () => {
    resetNickname();
    setNicknameDraft(user?.nickname ?? '');
    setIsEditingNickname(true);
  };

  const handleCancelEditNickname = () => {
    resetNickname();
    setIsEditingNickname(false);
  };

  const handleSaveNickname = async () => {
    const trimmed = nicknameDraft.trim();
    if (!trimmed) {
      return;
    }

    const updated = await updateNickname(trimmed);
    if (updated) {
      setUser(updated);
      setIsEditingNickname(false);
    }
  };

  const handleLogout = async () => {
    if (!accessToken) {
      return;
    }

    await logout(accessToken);
    router.replace('/auth/login');
  };

  const handleOpenDeleteModal = () => {
    resetDeleteAccount();
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!accessToken) {
      return;
    }

    const deleted = await deleteAccount(accessToken);
    if (deleted) {
      setIsDeleteModalVisible(false);
      router.replace('/auth/login');
    }
  };

  if (accessToken === undefined || accessToken === null) {
    return (
      <SafeAreaView style={styles.checkingSafe}>
        <ActivityIndicator color={CourseColors.white} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <BackHeader />
          <View style={styles.heroTop}>
            <Text style={styles.heroTitle}>마이</Text>
            <Text style={styles.heroBadge}>체험 기록</Text>
          </View>
          <Text style={styles.heroDescription}>
            내 정보와 알림 설정을{`\n`}이곳에서 관리할 수 있어요.
          </Text>
        </View>

        <View style={styles.body}>
          {meLoading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator color={CourseColors.primary} size="large" />
              <Text style={styles.loadingText}>내 정보를 불러오고 있어요.</Text>
            </View>
          ) : null}

          {!meLoading && meError ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateIcon}>!</Text>
              <Text style={styles.error}>{meError}</Text>
              <Pressable onPress={() => void refetchMe()} style={styles.outlineButton}>
                <Text style={styles.outlineButtonText}>다시 시도</Text>
              </Pressable>
            </View>
          ) : null}

          {!meLoading && !meError && user ? (
            <>
              <View style={styles.profileCard}>
                <Image resizeMode="cover" source={PROFILE_IMAGE} style={styles.profileAvatar} />
                <View style={styles.profileInfo}>
                  {isEditingNickname ? (
                    <>
                      <TextInput
                        autoFocus
                        editable={!isSavingNickname}
                        maxLength={50}
                        onChangeText={setNicknameDraft}
                        placeholder="닉네임을 입력해 주세요"
                        placeholderTextColor={CourseColors.muted}
                        style={styles.nicknameInput}
                        value={nicknameDraft}
                      />
                      {nicknameErrorMessage ? (
                        <Text style={styles.nicknameError}>{nicknameErrorMessage}</Text>
                      ) : null}
                      <View style={styles.nicknameActions}>
                        <Pressable
                          disabled={isSavingNickname}
                          onPress={handleCancelEditNickname}
                          style={styles.nicknameCancelButton}>
                          <Text style={styles.nicknameCancelText}>취소</Text>
                        </Pressable>
                        <Pressable
                          disabled={isSavingNickname}
                          onPress={() => void handleSaveNickname()}
                          style={styles.nicknameSaveButton}>
                          <Text style={styles.nicknameSaveText}>
                            {isSavingNickname ? '저장 중...' : '저장'}
                          </Text>
                        </Pressable>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.profileNameRow}>
                        <Text style={styles.profileName}>{user.nickname || '닉네임 없음'}</Text>
                        <Pressable onPress={handleStartEditNickname} style={styles.editButton}>
                          <Text style={styles.editButtonText}>수정</Text>
                        </Pressable>
                      </View>
                      <Text style={styles.profileMeta}>
                        닉네임: {user.nickname || '-'}
                        {'\n'}
                        {user.loginType === 'KAKAO'
                          ? '카카오 계정으로 로그인'
                          : `이메일: ${user.email || '-'}`}
                      </Text>
                    </>
                  )}
                </View>
              </View>

              {/* TODO: 코스 도메인이 JWT 인증으로 전환되면 저장 코스도 실제 값으로 교체 */}
              <View style={styles.statGrid}>
                <View style={styles.statCard}>
                  {stampCountLoading ? (
                    <ActivityIndicator color={CourseColors.primary} size="small" />
                  ) : (
                    <Text style={styles.statValue}>{stampCount}</Text>
                  )}
                  <Text style={styles.statLabel}>완료 스탬프</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>0</Text>
                  <Text style={styles.statLabel}>저장 코스</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>-</Text>
                  <Text style={styles.statLabel}>추천 적합도</Text>
                </View>
              </View>

              <View style={styles.menuCard}>
                <View style={styles.menuRow}>
                  <Text style={styles.menuLabel}>내 예정 코스</Text>
                  {/* TODO: 코스 API 연동 후 다음 예정 코스로 교체 */}
                  <Text style={styles.menuValue}>저장한 코스에서 선택</Text>
                </View>
                <Pressable
                  onPress={() => router.push('/notification/settings')}
                  style={[styles.menuRow, styles.menuRowLast]}>
                  <Text style={styles.menuLabel}>알림톡 설정</Text>
                  <Text style={styles.menuValue}>알림 시점 설정하기 ›</Text>
                </Pressable>
              </View>

              <View style={styles.menuCard}>
                <Pressable
                  onPress={() =>
                    router.push('/reservation')
                  }
                  style={[
                    styles.menuRow,
                    styles.menuRowLast,
                  ]}
                >
                  <Text style={styles.menuLabel}>
                    예약 내역
                  </Text>

                  <Text style={styles.menuValue}>
                    예약 확인하기 ›
                  </Text>
                </Pressable>
              </View>

              <View style={styles.whiteCard}>
                <View style={styles.sectionHeading}>
                  <Text style={styles.cardTitle}>코스 목록</Text>
                  <Text style={styles.sectionHint}>이름 변경 · 삭제</Text>
                </View>
                {/* TODO: 코스 API 연동 후 저장된 코스 목록으로 교체 */}
                <Text style={styles.cardDesc}>아직 저장된 코스가 없어요.</Text>
              </View>

              <Pressable
                disabled={isLoggingOut}
                onPress={() => void handleLogout()}
                style={[styles.logoutButton, isLoggingOut && styles.disabled]}>
                <Text style={styles.logoutButtonText}>
                  {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                </Text>
              </Pressable>

              <Pressable onPress={handleOpenDeleteModal} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>회원 탈퇴</Text>
              </Pressable>
            </>
          ) : null}
        </View>
      </ScrollView>

      <DeleteAccountModal
        errorMessage={deleteErrorMessage}
        isSubmitting={isDeletingAccount}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={() => void handleConfirmDelete()}
        visible={isDeleteModalVisible}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  checkingSafe: {
    alignItems: 'center',
    backgroundColor: CourseColors.primary,
    flex: 1,
    justifyContent: 'center',
  },
  safe: { flex: 1, backgroundColor: CourseColors.primary },
  container: { flexGrow: 1, backgroundColor: CourseColors.background, paddingBottom: 44 },
  hero: {
    backgroundColor: CourseColors.primary,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 42,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    gap: 12,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  heroTitle: { color: CourseColors.white, fontSize: 30, fontWeight: '900' },
  heroBadge: {
    color: '#E6F3E3',
    fontSize: 12,
    fontWeight: '700',
    borderLeftWidth: 1,
    borderLeftColor: '#8DB392',
    paddingLeft: 10,
  },
  heroDescription: { color: '#E4EFE1', fontSize: 14, lineHeight: 22 },
  body: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: 18,
    marginTop: -18,
    gap: 12,
  },
  loadingCard: {
    minHeight: 220,
    backgroundColor: CourseColors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: CourseColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 13,
  },
  loadingText: { color: CourseColors.muted },
  stateCard: {
    backgroundColor: CourseColors.white,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: CourseColors.border,
    paddingHorizontal: 24,
    paddingVertical: 31,
    alignItems: 'center',
    gap: 14,
  },
  stateIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    textAlign: 'center',
    paddingTop: 8,
    backgroundColor: '#FFF1ED',
    color: CourseColors.error,
    fontWeight: '900',
    overflow: 'hidden',
  },
  error: { color: CourseColors.error, textAlign: 'center' },
  outlineButton: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: CourseColors.primary,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    alignSelf: 'stretch',
  },
  outlineButtonText: { color: CourseColors.primary, fontWeight: '900' },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: CourseColors.white,
    borderWidth: 1,
    borderColor: CourseColors.border,
    borderRadius: 22,
    padding: 16,
    shadowColor: '#5A4932',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  profileAvatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: CourseColors.primarySoft,
    flexShrink: 0,
  },
  profileInfo: { flex: 1, gap: 4 },
  profileNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  profileName: { fontSize: 19, fontWeight: '900', color: CourseColors.text },
  profileMeta: { fontSize: 12, color: CourseColors.muted, lineHeight: 18, marginTop: 4 },
  editButton: {
    backgroundColor: CourseColors.primarySoft,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editButtonText: { color: CourseColors.primaryDark, fontWeight: '800', fontSize: 12 },
  nicknameInput: {
    borderWidth: 1,
    borderColor: CourseColors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 15,
    color: CourseColors.text,
    backgroundColor: CourseColors.background,
  },
  nicknameError: { color: CourseColors.error, fontSize: 12, marginTop: 6 },
  nicknameActions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  nicknameCancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: CourseColors.beige,
  },
  nicknameCancelText: { color: CourseColors.text, fontWeight: '800', fontSize: 13 },
  nicknameSaveButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: CourseColors.primary,
  },
  nicknameSaveText: { color: CourseColors.white, fontWeight: '800', fontSize: 13 },
  statGrid: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: CourseColors.white,
    borderWidth: 1,
    borderColor: CourseColors.border,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statValue: { fontSize: 22, fontWeight: '900', color: CourseColors.primary, marginBottom: 6 },
  statLabel: { fontSize: 12, color: CourseColors.muted, fontWeight: '700' },
  menuCard: {
    backgroundColor: CourseColors.white,
    borderWidth: 1,
    borderColor: CourseColors.border,
    borderRadius: 22,
    paddingHorizontal: 16,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: CourseColors.border,
  },
  menuRowLast: { borderBottomWidth: 0 },
  menuLabel: { fontSize: 14, fontWeight: '800', color: CourseColors.text },
  menuValue: { fontSize: 13, color: CourseColors.muted, textAlign: 'right' },
  whiteCard: {
    backgroundColor: CourseColors.white,
    borderWidth: 1,
    borderColor: CourseColors.border,
    borderRadius: 22,
    padding: 14,
  },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: '900', color: CourseColors.text },
  sectionHint: { fontSize: 12, color: CourseColors.muted },
  cardDesc: { fontSize: 12.5, color: CourseColors.muted, lineHeight: 19 },
  logoutButton: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: CourseColors.primary,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  logoutButtonText: { color: CourseColors.primary, fontWeight: '900', fontSize: 15 },
  deleteButton: { alignItems: 'center', paddingVertical: 10 },
  deleteButtonText: { color: CourseColors.error, fontWeight: '700', fontSize: 13 },
  disabled: { opacity: 0.55 },
});
