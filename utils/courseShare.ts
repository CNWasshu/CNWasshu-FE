import type { CourseDetail } from '@/types/course';
import { Platform, Share } from 'react-native';

export type CourseShareResult = 'COPIED' | 'DISMISSED' | 'SHARED';

export function buildCourseShareText(course: CourseDetail) {
  const sortedItems = [...course.items].sort((left, right) =>
    left.dayNo - right.dayNo || left.sortOrder - right.sortOrder || left.startTime.localeCompare(right.startTime)
  );
  const dayGroups = sortedItems.reduce<Map<number, string[]>>((groups, item) => {
    const places = groups.get(item.dayNo) ?? [];
    places.push(item.title);
    groups.set(item.dayNo, places);
    return groups;
  }, new Map());
  const schedule = [...dayGroups.entries()]
    .map(([dayNo, places]) => `Day ${dayNo}\n${places.map((place) => `📍 ${place}`).join('\n')}`)
    .join('\n\n');
  const header = [
    '🌿 충남왔슈 여행 코스',
    course.courseName,
    `📅 ${course.startDate.replaceAll('-', '.')} ~ ${course.endDate.replaceAll('-', '.')}`,
  ].join('\n');

  return schedule ? `${header}\n\n${schedule}` : header;
}

async function copyText(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  if (typeof document === 'undefined') throw new Error('클립보드를 사용할 수 없습니다.');

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  const copied = document.execCommand('copy');
  textArea.remove();
  if (!copied) throw new Error('공유 텍스트를 복사하지 못했습니다.');
}

export async function shareCourse(course: CourseDetail): Promise<CourseShareResult> {
  const text = buildCourseShareText(course);

  if (Platform.OS === 'web') {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ text, title: course.courseName });
        return 'SHARED';
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return 'DISMISSED';
      }
    }
    await copyText(text);
    return 'COPIED';
  }

  const result = await Share.share({ message: text, title: course.courseName });
  return result.action === Share.dismissedAction ? 'DISMISSED' : 'SHARED';
}
