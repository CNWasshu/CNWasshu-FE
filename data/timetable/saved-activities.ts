import type { SavedActivity } from '@/types/timetable';

export const SAVED_ACTIVITIES: SavedActivity[] = [
  {
    endTime: '11:30',
    id: 'activity-strawberry-picking',
    requiresReservation: true,
    startTime: '10:00',
    title: '논산 딸기 수확 체험',
  },
  {
    endTime: '15:00',
    id: 'activity-pottery',
    requiresReservation: true,
    startTime: '13:30',
    title: '계룡산 도예 체험',
  },
  {
    endTime: '17:00',
    id: 'activity-forest-walk',
    requiresReservation: false,
    startTime: '16:00',
    title: '예산 치유의 숲 해설 체험',
  },
];
