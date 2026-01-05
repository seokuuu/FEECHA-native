# FEE-CHA 트러블슈팅 로그

프로젝트 초기 세팅 과정에서 발생한 오류와 해결 방법을 기록합니다.

---

## 오류 1: react-native-reusables 패키지 404 에러

### 발생 시점
Mobile 앱 초기화 후 NativeWind + shadcn 스타일 컴포넌트 설치 시도

### 명령어
```bash
npm install nativewind tailwindcss react-native-reusables
```

### 오류 내용
```
npm error 404 Not Found - GET https://registry.npmjs.org/react-native-reusables
npm error 404  'react-native-reusables@*' is not in this registry.
```

### 원인
`react-native-reusables`는 직접 npm install로 설치하는 패키지가 아니라 CLI를 통해 설치해야 함

### 해결 방법
```bash
# 올바른 설치 방법
npx @react-native-reusables/cli@latest init
```

### 최종 선택
일단 NativeWind만 설치하고, shadcn 스타일 컴포넌트는 나중에 추가하기로 결정

---

## 오류 2: babel-preset-expo 없음

### 발생 시점
`npm start` 실행 시 Metro Bundler 시작 중

### 오류 내용
```
ERROR  Error: Cannot find module 'babel-preset-expo'
Require stack:
- /Users/.../node_modules/@babel/core/lib/config/files/plugins.js
...
```

### 원인
Expo 프로젝트 생성 시 `babel-preset-expo`가 자동으로 설치되지 않음

### 해결 방법
```bash
npm install babel-preset-expo @babel/core
```

### 결과
✅ 해결됨

---

## 오류 3: Tailwind CSS has not been configured with the NativeWind preset

### 발생 시점
babel-preset-expo 설치 후 `npm start` 재시도

### 오류 내용
```
Error: Tailwind CSS has not been configured with the NativeWind preset
Error: Tailwind CSS has not been configured with the NativeWind preset
    at tailwindConfigV3 (/Users/.../nativewind/src/metro/tailwind/v3/index.ts:97:11)
```

### 원인
`tailwind.config.js`에 NativeWind preset이 설정되지 않음

### 해결 방법
```javascript
// tailwind.config.js
module.exports = {
  presets: [require('nativewind/preset')], // ← 추가 필수
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // ...
    },
  },
};
```

### 결과
✅ 해결됨

---

## 오류 4: TypeScript colors.primary 참조 오류

### 발생 시점
공통 Tailwind 설정 (`packages/ui-config/tailwind.config.js`)에서 TypeScript 파일 import 시도

### 오류 내용
```
TypeError: Cannot read properties of undefined (reading 'primary')
    at /Users/.../packages/ui-config/tailwind.config.js:13:25
```

### 원인
Tailwind config는 CommonJS인데 TypeScript 파일(`./src/theme.ts`)을 require하려고 했지만 제대로 컴파일되지 않음

### 시도한 해결 방법
```javascript
// 잘못된 방법
const { colors } = require('./src/theme'); // ← TypeScript 파일이라 실패
```

### 최종 해결 방법
TypeScript에서 값을 import하지 않고, tailwind.config.js에 직접 색상 값 하드코딩

```javascript
module.exports = {
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3e7',
          500: '#f5870f', // 직접 값 입력
          // ...
        },
      },
    },
  },
};
```

### 결과
✅ 해결됨

---

## 오류 5: NativeWind 스타일이 전혀 적용되지 않음 (핵심 문제)

### 발생 시점
모든 설정 완료 후 앱 실행

### 증상
- `className="text-primary-500"` 작성했지만 검정색 텍스트로 표시
- `className="text-2xl font-bold"` 작성했지만 기본 크기로 표시
- 모든 Tailwind 클래스가 완전히 무시됨
- 흰 화면에 검정 글자만 표시 (스타일 0%)

### 진단 과정

#### 1단계: 설정 파일 확인
```bash
# babel.config.js - ✅ 정상
# metro.config.js - ✅ 정상
# tailwind.config.js - ✅ 정상
# global.css - ✅ 정상
```

#### 2단계: NativeWind 패키지 위치 확인
```bash
ls apps/mobile/node_modules/nativewind
# → No such file or directory ❌
```

**문제 발견!** NativeWind가 `apps/mobile/node_modules`에 없음!

#### 3단계: 실제 패키지 위치 확인
```bash
ls node_modules | grep nativewind
# → nativewind ✅ (루트에 있음)
```

### 원인 (최종 진단)

**모노레포(npm workspaces) 구조에서 패키지 호이스팅 문제**

1. npm workspaces는 중복 패키지를 루트로 호이스팅함
2. `nativewind`가 루트 `node_modules`로 올라감
3. Metro bundler는 기본적으로 앱 폴더(`apps/mobile`)의 `node_modules`만 찾음
4. `nativewind`를 찾지 못해서 Tailwind 클래스 변환이 전혀 안됨

### 해결 방법

#### Metro Config에 모노레포 지원 추가

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// ✅ 모노레포 지원: 루트 node_modules 찾기
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = withNativeWind(config, { input: './global.css' });
```

### 테스트 방법

```bash
# 1. 모든 Expo 프로세스 종료
pkill -f expo

# 2. 캐시 완전 삭제
cd apps/mobile
rm -rf .expo
rm -rf node_modules/.cache
cd ../..
rm -rf node_modules/.cache

# 3. 완전히 새로 시작
cd apps/mobile
npm start -- --clear

# 4. Android 에뮬레이터에서 테스트
# 터미널에서 'a' 키 누르기

# 5. 앱 로드 후 'r' 키로 reload
```

### 예상 결과

**수정 전:**
```
FEE-CHA              (검정색, 기본 크기)
커피차 매칭 플랫폼    (검정색, 기본 크기)
```

**수정 후:**
```
FEE-CHA              (오렌지색 #f5870f, 큰 글씨, 볼드)
커피차 매칭 플랫폼    (회색 #4b5563, 작은 글씨)
```

### 상태
🟡 **수정 완료, 테스트 대기 중**

---

## 오류 6: NativeWind v4 필수 의존성 누락

### 발생 가능성
NativeWind v4는 아래 패키지들이 필수

### 해결 방법
```bash
npm install react-native-reanimated react-native-safe-area-context
```

### 결과
✅ 설치 완료

---

## 추가 트러블슈팅 팁

### Metro Bundler 캐시 문제

**증상:** 설정을 수정했는데도 변경사항이 반영 안됨

**해결:**
```bash
# 방법 1: --clear 옵션
npm start -- --clear

# 방법 2: 캐시 수동 삭제
rm -rf .expo
rm -rf node_modules/.cache
npm start

# 방법 3: 앱에서 reload
# 터미널에서 'r' 키 누르기
```

### 모노레포 관련 문제

**증상:** 패키지를 설치했는데 "Cannot find module" 에러

**확인:**
```bash
# 패키지가 어디 설치되었는지 확인
ls node_modules/패키지명
ls apps/mobile/node_modules/패키지명
```

**해결:**
- Metro config에서 `watchFolders`와 `nodeModulesPaths` 설정
- 또는 특정 앱 폴더에 직접 설치: `npm install --workspace=apps/mobile 패키지명`

### Expo SDK 버전 경고

**경고:**
```
npm warn EBADENGINE required: { node: '>= 20.19.4' }
npm warn EBADENGINE current: { node: 'v20.18.1' }
```

**상태:** 무시 가능 (개발은 작동함)

**장기 해결:** Node.js 20.19.4+ 업그레이드

---

## 체크리스트

프로젝트 세팅 시 반드시 확인:

- [x] babel.config.js에 nativewind/babel 추가
- [x] metro.config.js에 withNativeWind 설정
- [x] tailwind.config.js에 nativewind/preset 추가
- [x] global.css 생성 (@tailwind 지시문)
- [x] nativewind-env.d.ts 생성
- [x] tsconfig.json에 nativewind-env.d.ts include
- [x] react-native-reanimated 설치
- [x] react-native-safe-area-context 설치
- [x] 모노레포: metro.config.js watchFolders 설정
- [ ] 캐시 삭제 후 재시작 (npm start -- --clear)
- [ ] 앱에서 'r' 키로 reload

---

## 관련 문서

- [프로젝트 개요](./01_OVERVIEW.md)
- [배포 가이드](./07_DEPLOYMENT.md)

---

## 업데이트 로그

- 2025-12-30: 초기 세팅 오류 기록
