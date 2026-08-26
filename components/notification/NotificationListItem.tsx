import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CourseColors } from '@/constants/course-colors';
import type { NotificationResponse, NotificationType } from '@/types/notification';

const TYPE_LABELS: Record<NotificationType, string> = {
  COURSE: '코스',
  RESERVATION: '예약',
  SURVEY: '만족도 조사',
};

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function NotificationListItem({
  notification,
  onPress,
}: {
  notification: NotificationResponse;
  onPress: () => void;
}) {
  const isRead = notification.isRead;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        !isRead && styles.unreadCard,
        pressed && styles.pressed,
      ]}>
      <View style={styles.headerRow}>
        <View style={styles.typeRow}>
          {!isRead ? <View style={styles.unreadDot} /> : null}
          <Text style={styles.typeTag}>{TYPE_LABELS[notification.notificationType]}</Text>
        </View>
        <Text style={styles.time}>{formatCreatedAt(notification.createdAt)}</Text>
      </View>
      <Text style={styles.title}>{notification.title}</Text>
      <Text numberOfLines={2} style={styles.content}>
        {notification.content}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: CourseColors.white,
    gap: 6,
    borderWidth: 1,
    borderColor: CourseColors.border,
  },
  unreadCard: {
    backgroundColor: CourseColors.primarySoft,
    borderColor: '#ABD19C',
  },
  pressed: { opacity: 0.72 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: CourseColors.primary,
  },
  typeTag: {
    color: CourseColors.primaryDark,
    fontSize: 11,
    fontWeight: '900',
  },
  time: { color: CourseColors.muted, fontSize: 11 },
  title: { color: CourseColors.text, fontWeight: '800', fontSize: 15 },
  content: { color: CourseColors.muted, fontSize: 13, lineHeight: 19 },
});
