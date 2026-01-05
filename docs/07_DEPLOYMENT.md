# FEE-CHA 배포 가이드

## 목차
1. [개발 환경 설정](#1-개발-환경-설정)
2. [Mobile 앱 배포](#2-mobile-앱-배포)
3. [Backend API 배포](#3-backend-api-배포)
4. [CMS 배포](#4-cms-배포)
5. [데이터베이스 설정](#5-데이터베이스-설정)
6. [CI/CD 설정](#6-cicd-설정)
7. [모니터링 설정](#7-모니터링-설정)

---

## 1. 개발 환경 설정

### 필수 설치 항목

```bash
# Node.js 18+
node --version  # v18.0.0+

# npm 10+
npm --version   # 10.0.0+

# Git
git --version
```

### 모노레포 클론 및 설치

```bash
# 레포지토리 클론
git clone https://github.com/your-org/fee-cha.git
cd fee-cha

# 의존성 설치 (모든 워크스페이스)
npm install

# Turborepo 빌드
npm run build
```

---

## 2. Mobile 앱 배포

### 기술 스택
- **빌드 플랫폼**: Expo EAS (Expo Application Services)
- **배포 대상**: iOS App Store, Google Play Store

### 2.1 EAS 설정

```bash
# EAS CLI 설치
npm install -g eas-cli

# EAS 로그인
eas login

# 프로젝트 설정
cd apps/mobile
eas build:configure
```

**`eas.json` 설정:**
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "default"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "large"
      },
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDE12345"
      },
      "android": {
        "serviceAccountKeyPath": "./service-account.json",
        "track": "production"
      }
    }
  }
}
```

### 2.2 iOS 빌드 및 배포

**사전 준비:**
1. Apple Developer 계정 필요
2. App Store Connect에서 앱 등록
3. 프로비저닝 프로파일 및 인증서 설정

**빌드:**
```bash
# 프로덕션 빌드
eas build --platform ios --profile production

# TestFlight 업로드
eas submit --platform ios --latest
```

**배포 절차:**
1. EAS 빌드 완료 대기 (약 15-30분)
2. TestFlight 자동 업로드
3. App Store Connect에서 심사 제출
4. 애플 심사 대기 (보통 1-3일)
5. 승인 후 배포

### 2.3 Android 빌드 및 배포

**사전 준비:**
1. Google Play Console 계정
2. 앱 등록 및 스토어 리스팅 작성
3. 키스토어 생성

**빌드:**
```bash
# 프로덕션 빌드 (AAB)
eas build --platform android --profile production

# Play Store 업로드
eas submit --platform android --latest
```

**배포 절차:**
1. EAS 빌드 완료 대기
2. Play Console에 자동 업로드
3. 내부 테스트 → 비공개 테스트 → 프로덕션 단계별 배포
4. 구글 심사 (보통 수 시간 ~ 1일)
5. 배포 완료

### 2.4 OTA 업데이트 (Over-The-Air)

**Expo Updates 사용:**
```bash
# 업데이트 배포 (앱스토어 심사 없이 JS/Asset 업데이트)
eas update --branch production --message "버그 수정 및 UI 개선"
```

**사용 사례:**
- 긴급 버그 수정
- UI/UX 개선
- 텍스트 변경
- API 엔드포인트 변경

**제한사항:**
- 네이티브 코드 변경은 불가 (새 빌드 필요)
- iOS/Android 버전별 관리 필요

---

## 3. Backend API 배포

### 배포 옵션

#### 옵션 A: Railway (추천 - 간단함)

**장점:**
- 설정 간단
- 자동 HTTPS
- PostgreSQL, Redis 통합
- GitHub 연동 자동 배포

**배포 방법:**
```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login

# 프로젝트 생성
railway init

# 배포
cd apps/api
railway up
```

**환경 변수 설정:**
Railway 대시보드에서 설정
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
PORTONE_API_KEY=...
AWS_ACCESS_KEY_ID=...
```

#### 옵션 B: AWS EC2 + RDS

**인프라 구성:**
- EC2: t3.medium (프로덕션)
- RDS PostgreSQL: db.t3.micro
- ElastiCache Redis
- Application Load Balancer
- S3 (파일 저장소)

**배포 스크립트:**
```bash
# PM2로 프로세스 관리
npm install -g pm2

# 앱 시작
cd apps/api
pm2 start dist/main.js --name fee-cha-api -i max

# 자동 재시작 설정
pm2 startup
pm2 save
```

**Nginx 리버스 프록시:**
```nginx
server {
    listen 80;
    server_name api.fee-cha.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**SSL 인증서 (Let's Encrypt):**
```bash
sudo certbot --nginx -d api.fee-cha.com
```

#### 옵션 C: Docker + Docker Compose

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/api/package.json ./apps/api/
RUN npm install
COPY . .
RUN npm run build --workspace=apps/api

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  api:
    build: ./apps/api
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/fee_cha
      REDIS_URL: redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: fee_cha
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## 4. CMS 배포

### Vercel 배포 (추천)

**장점:**
- Next.js 최적화
- 자동 HTTPS
- GitHub 연동 자동 배포
- 무료 SSL
- 글로벌 CDN

**배포 방법:**

1. **Vercel 계정 연결**
   - GitHub 레포지토리 연결
   - 프로젝트 선택: `apps/cms`

2. **빌드 설정**
   ```
   Framework Preset: Next.js
   Root Directory: apps/cms
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **환경 변수 설정**
   ```
   NEXT_PUBLIC_API_URL=https://api.fee-cha.com/v1
   NEXT_PUBLIC_SOCKET_URL=wss://api.fee-cha.com
   ```

4. **도메인 설정**
   - Vercel 대시보드에서 `cms.fee-cha.com` 도메인 추가
   - DNS 레코드 설정 (CNAME)

5. **자동 배포**
   - `main` 브랜치 푸시 시 자동 배포
   - PR 생성 시 프리뷰 배포

---

## 5. 데이터베이스 설정

### PostgreSQL 프로덕션 설정

#### Railway PostgreSQL

```bash
# Railway에서 PostgreSQL 추가
railway add postgresql

# 연결 문자열 확인
railway variables
```

#### AWS RDS PostgreSQL

**인스턴스 생성:**
- 엔진: PostgreSQL 15
- 인스턴스 클래스: db.t3.micro (초기) → db.t3.medium (확장)
- 스토리지: 20GB (자동 확장 활성화)
- Multi-AZ: 프로덕션 환경에서 활성화
- 백업: 자동 백업 7일 보관

**보안 그룹:**
```
Inbound Rules:
- Type: PostgreSQL
- Port: 5432
- Source: EC2 Security Group or 0.0.0.0/0 (주의: 프로덕션에선 특정 IP만)
```

### Prisma 마이그레이션

```bash
# 프로덕션 DB 마이그레이션
cd apps/api
npx prisma migrate deploy

# Prisma Client 생성
npx prisma generate
```

### Redis 설정

#### Railway Redis

```bash
railway add redis
```

#### AWS ElastiCache

- 엔진: Redis 7.x
- 노드 타입: cache.t3.micro
- 클러스터 모드: 비활성화 (초기)

---

## 6. CI/CD 설정

### GitHub Actions

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run test

  deploy-api:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g @railway/cli
          railway up --service api

  deploy-cms:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: apps/cms

  build-mobile:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'release'
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: |
          cd apps/mobile
          eas build --platform all --non-interactive
```

---

## 7. 모니터링 설정

### Sentry (에러 추적)

**설치:**
```bash
npm install --save @sentry/node @sentry/nextjs @sentry/react-native
```

**Backend (NestJS):**
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

**CMS (Next.js):**
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
});
```

**Mobile (React Native):**
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
});
```

### Logging (Winston)

**Backend 로그 설정:**
```typescript
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const logger = WinstonModule.createLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### 헬스 체크

**Backend:**
```typescript
@Get('health')
healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
}
```

**모니터링 서비스:**
- **UptimeRobot**: 무료, 5분 간격 헬스 체크
- **BetterStack**: 유료, 고급 모니터링

---

## 환경별 설정

### Development

```env
# apps/api/.env.development
DATABASE_URL=postgresql://localhost:5432/fee_cha_dev
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

### Staging

```env
# apps/api/.env.staging
DATABASE_URL=postgresql://staging-db.railway.app/fee_cha
REDIS_URL=redis://staging-redis.railway.app
NODE_ENV=staging
```

### Production

```env
# apps/api/.env.production (Railway/AWS에서 설정)
DATABASE_URL=postgresql://prod-db.railway.app/fee_cha
REDIS_URL=redis://prod-redis.railway.app
NODE_ENV=production
JWT_SECRET=your-production-secret
PORTONE_API_KEY=your-production-key
```

---

## 롤백 전략

### Mobile 앱
- EAS Update 롤백: `eas update --branch production --message "Rollback to previous version"`
- 앱스토어 버전 롤백: 수동 (이전 버전 재배포)

### Backend API
- Railway: 이전 배포 버전으로 롤백 (클릭 한번)
- EC2: PM2 restart 또는 이전 Docker 이미지로 재배포

### CMS
- Vercel: 이전 배포로 롤백 (클릭 한번)

### Database
- RDS 스냅샷 복원
- Prisma 마이그레이션 롤백: `npx prisma migrate resolve --rolled-back <migration-name>`

---

## 체크리스트

### 배포 전
- [ ] 모든 테스트 통과
- [ ] 환경 변수 설정 확인
- [ ] 데이터베이스 마이그레이션 테스트
- [ ] API 문서 최신화
- [ ] 앱스토어 스크린샷 및 설명 준비

### 배포 후
- [ ] 헬스 체크 확인
- [ ] Sentry 에러 모니터링
- [ ] 로그 확인
- [ ] 주요 기능 테스트 (QA)
- [ ] 사용자 피드백 수집

---

## 관련 문서

- [백엔드 요구사항](./03_BACKEND_REQUIREMENTS.md)
- [CMS 요구사항](./06_CMS_REQUIREMENTS.md)
- [개발 로드맵](./08_ROADMAP.md)
