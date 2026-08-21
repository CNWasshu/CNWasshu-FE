export function getLocalTimetableAccessToken() {
  if (process.env.EXPO_PUBLIC_APP_ENV !== 'local') {
    return undefined;
  }

  const accessToken = process.env.EXPO_PUBLIC_DEV_ACCESS_TOKEN?.trim();
  return accessToken || undefined;
}
