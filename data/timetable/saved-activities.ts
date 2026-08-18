import type { SavedActivity } from '@/types/timetable';

export const SAVED_ACTIVITIES: SavedActivity[] = [
  {
    endTime: '11:30',
    icon: '🍓',
    id: 'activity-strawberry-picking',
    location: '논산',
    operatingType: 'hours',
    requiresReservation: true,
    startTime: '10:00',
    title: '논산 딸기 수확 체험',
  },
  {
    endTime: '15:00',
    icon: '🏺',
    id: 'activity-pottery',
    location: '공주',
    operatingType: 'hours',
    requiresReservation: false,
    startTime: '13:30',
    title: '계룡산 도예 체험',
  },
  {
    endTime: '22:00',
    icon: '🌸',
    id: 'activity-forest-walk',
    location: '부여',
    operatingType: 'always',
    requiresReservation: false,
    startTime: '09:00',
    title: '부여 연꽃 축제 산책',
  },
];
