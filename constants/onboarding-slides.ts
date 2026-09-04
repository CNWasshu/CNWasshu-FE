import type { OnboardingSlide } from '@/types/onboarding';

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    accessibilityLabel: '충남의 체험과 맛집을 발견하고 일정과 방문 기록으로 이어지는 여행 여정',
    description: '가고 싶은 곳을 발견하고 나만의 여행을 만든 뒤\n방문의 순간까지 충남왔슈에 남겨보세요.',
    eyebrow: '발견 · 계획 · 방문 · 기록',
    image: require('@/assets/images/onboarding/onboarding-intro.png'),
    title: '충남 여행,\n찾는 순간부터 기록까지',
  },
  {
    accessibilityLabel: '도예 체험, 딸기 체험과 지역 맛집 카드를 둘러보고 관심 장소로 저장하는 화면',
    description: '지역과 취향에 맞는 농촌 체험과 맛집을 둘러보고\n마음에 드는 장소를 담아보세요.',
    eyebrow: 'HOME · 체험과 맛집 탐색',
    image: require('@/assets/images/onboarding/onboarding-home.png'),
    title: '숨은 충남을\n발견해보세요',
  },
  {
    accessibilityLabel: '도예 체험, 지역 맛집과 딸기 체험 카드를 하루 시간표에 배치하고 빈 슬롯에 자유 일정을 직접 추가하는 화면',
    description: '담아둔 체험과 맛집을 시간대별로 배치하고\n자유 일정도 직접 추가할 수 있어요.',
    eyebrow: '타임테이블 · 장소 배치 · 자유 일정',
    image: require('@/assets/images/onboarding/onboarding-timetable.png'),
    title: '가고 싶은 곳을\n여행 일정으로 만들어보세요',
  },
];
