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
];
