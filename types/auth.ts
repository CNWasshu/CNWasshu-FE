export interface UserSummary {
  userId: number;
  nickname: string | null;
  email: string | null;
  profileImage: string | null;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  isNewUser: boolean;
  user: UserSummary;
}

export interface KakaoLoginRequest {
  authorizationCode?: string;
  redirectUri?: string;
  accessToken?: string;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface UserUpdateRequest {
  nickname?: string;
  profileImage?: string;
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
