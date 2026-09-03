export type UserLoginType = 'KAKAO' | 'EMAIL';

export interface UserSummary {
  userId: number;
  nickname: string | null;
  email: string | null;
  loginType: UserLoginType;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  isNewUser: boolean;
  // 카카오가 닉네임 동의를 안 받았거나 거부당해 자동생성 닉네임으로 대체된 신규
  // 카카오 가입자일 때만 true. 이메일 회원가입/기존 유저 로그인은 항상 false.
  nicknameNeedsSetup: boolean;
  user: UserSummary;
}

export interface KakaoLoginRequest {
  authorizationCode?: string;
  redirectUri?: string;
  accessToken?: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface UserUpdateRequest {
  nickname?: string;
}

export type UserDeviceType = 'IOS' | 'ANDROID' | 'WEB';

export interface DeviceRegisterRequest {
  fcmToken: string;
  deviceType?: UserDeviceType;
}

export interface UserDeviceResponse {
  deviceId: number;
  deviceType: UserDeviceType | null;
}

export interface AuthApiErrorBody {
  code?: string;
  message?: string;
}
