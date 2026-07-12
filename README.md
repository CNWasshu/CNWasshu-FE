# CNWasshu-FE

충남 지역 체험 및 관광 정보를 제공하는 React Native + Expo 기반 프론트엔드 프로젝트입니다.

## 1. 개발 환경

| 항목 | 버전 |
| --- | --- |
| Node.js | 22.18.0 |
| npm | 10.9.x |
| Expo | SDK 54 |
| Language | TypeScript |
| Package Manager | npm |

> `expo`, `react`, `react-native` 버전은 임의로 변경하지 않습니다.

---

## 2. 프로젝트 시작 방법

### 저장소 Clone

```bash
git clone https://github.com/CNWasshu/CNWasshu-FE.git
cd CNWasshu-FE
git checkout develop
git pull origin develop
```

---

## 3. Node.js 설정

### Windows

NVM for Windows 설치 후 관리자 PowerShell에서 실행합니다.

```powershell
nvm install 22.18.0
nvm use 22.18.0
```

### macOS

nvm이 설치되어 있다면 프로젝트 루트에서 실행합니다.

```bash
nvm install
nvm use
```

버전을 확인합니다.

```bash
node -v
npm -v
```

정상 기준:

```text
v22.18.0
10.9.x
```

---

## 4. 환경변수 설정

### Windows PowerShell

```powershell
Copy-Item .env.example .env.local
```

### macOS

```bash
cp .env.example .env.local
```

기본 환경변수:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
EXPO_PUBLIC_APP_ENV=local
```

`.env.local`은 개인 개발 환경 파일이므로 GitHub에 올리지 않습니다.

실제 휴대전화에서 백엔드 서버에 접근하는 경우 `localhost` 대신 개발 PC의 로컬 IP 주소를 사용합니다.

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.0.10:8080
```

---

## 5. 의존성 설치

```bash
npm ci
```

처음 프로젝트를 내려받았을 때는 `npm install` 대신 `npm ci`를 사용합니다.

---

## 6. 프로젝트 실행

```bash
npm start
```

실행 후 사용할 수 있는 명령어:

```text
w : 웹 실행
a : Android 실행
i : iOS Simulator 실행 (macOS만 가능)
r : 앱 새로고침
j : 디버거 실행
```

휴대전화에서는 Expo Go 앱으로 QR 코드를 스캔합니다.

연결되지 않는 경우:

```bash
npx expo start --tunnel
```

캐시 문제가 발생한 경우:

```bash
npx expo start --clear
```

---

## 7. 프로젝트 검사

코드 검사:

```bash
npm run lint
```

Expo 프로젝트 환경 검사:

```bash
npx expo-doctor
```

---

## 8. 프로젝트 구조

```text
CNWasshu-FE/
├─ app/              # 화면 및 라우팅
├─ components/       # 공통 및 화면별 컴포넌트
├─ hooks/            # 커스텀 훅
├─ constants/        # 상수
├─ assets/           # 이미지, 아이콘, 폰트
├─ services/         # API 통신 코드
├─ store/            # 전역 상태
├─ types/            # TypeScript 타입
├─ utils/            # 공통 함수
├─ scripts/          # 프로젝트 스크립트
├─ app.json          # Expo 앱 설정
├─ package.json      # 패키지 및 실행 명령어
└─ tsconfig.json     # TypeScript 설정
```

현재 저장소에 없는 아래 폴더는 기능 개발 시 생성합니다.

```text
services/
store/
types/
utils/
```

---

## 9. 실제 개발 위치

| 작업 | 위치 |
| --- | --- |
| 화면 및 라우팅 | `app/` |
| 공통 컴포넌트 | `components/common/` |
| 화면별 컴포넌트 | `components/기능명/` |
| API 통신 | `services/api/` |
| 전역 상태 | `store/` |
| 타입 정의 | `types/` |
| 공통 함수 | `utils/` |
| 이미지 및 아이콘 | `assets/` |
| 커스텀 훅 | `hooks/` |
| 상수 | `constants/` |

### 예시

홈 화면:

```text
app/(tabs)/home.tsx
components/home/HomeBanner.tsx
components/home/ActivityCard.tsx
```

활동 상세 화면:

```text
app/activities/[id].tsx
components/activity/ActivityDetail.tsx
services/api/activityApi.ts
types/activity.ts
```

코스 화면:

```text
app/(tabs)/course.tsx
components/course/CourseTimeTable.tsx
store/courseStore.ts
types/course.ts
```

---

## 10. 브랜치 전략

- `main`: 배포 및 안정화 브랜치
- `develop`: 개발 내용 통합 브랜치
- `feature/...`: 기능 개발 브랜치
- `fix/...`: 오류 수정 브랜치
- `docs/...`: 문서 수정 브랜치
- `chore/...`: 설정 및 환경 작업 브랜치

`main`과 `develop`에서 직접 작업하지 않습니다.

### 작업 시작

```bash
git checkout develop
git pull origin develop
git checkout -b feature/작업명
```

예시:

```bash
git checkout -b feature/home
```

### 작업 완료

```bash
git add .
git commit -m "feat: 홈 화면 구현"
git push -u origin feature/home
```

Pull Request는 `develop` 브랜치를 대상으로 생성합니다.

---

## 11. 패키지 설치 규칙

### Expo 및 React Native 관련 패키지

```bash
npx expo install 패키지명
```

예시:

```bash
npx expo install expo-image
npx expo install expo-location
npx expo install expo-secure-store
```

### 일반 JavaScript 패키지

```bash
npm install 패키지명
```

예시:

```bash
npm install axios
npm install zustand
npm install @tanstack/react-query
```

패키지를 추가한 경우 아래 두 파일을 함께 커밋합니다.

```text
package.json
package-lock.json
```

---

## 12. 주의사항

다음 명령어는 실행하지 않습니다.

```bash
npm audit fix --force
npm update
npm install expo@latest
npm install react@latest
npm install react-native@latest
```

다음 파일과 폴더는 GitHub에 올리지 않습니다.

```text
.env.local
node_modules/
.expo/
```

패키지 매니저는 npm만 사용합니다.

다음 파일은 생성하거나 커밋하지 않습니다.

```text
yarn.lock
pnpm-lock.yaml
```
