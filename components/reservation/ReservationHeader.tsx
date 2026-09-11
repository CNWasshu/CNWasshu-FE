import { PageHero } from '@/components/layout';

export function ReservationHeader() {
  return (
    <PageHero
      description="원하는 날짜와 시간을 고르고 예약 정보를 확인해 주세요."
      eyebrow="체험 예약"
      icon="calendar-outline"
      showBack
      title="예약 시간을 선택해 주세요"
    />
  );
}
