# MD 신청 시스템 배포 가이드

## 📋 목차
1. [개요](#개요)
2. [사전 준비](#사전-준비)
3. [Vercel 배포](#vercel-배포)
4. [환경 변수 설정](#환경-변수-설정)
5. [테스트](#테스트)
6. [문제 해결](#문제-해결)

---

## 개요

이 프로젝트는 **Vercel Serverless Functions**를 사용하여 이메일 전송 기능을 구현했습니다.

### 아키텍처
```
프론트엔드 (React + Vite)
    ↓ fetch('/api/send-email')
Vercel Serverless Function (api/send-email.js)
    ↓ nodemailer
Gmail SMTP
    ↓
관리자 이메일 + 신청자 이메일
```

---

## 사전 준비

### 1. Gmail 앱 비밀번호 생성

이메일 전송을 위해 Gmail 2단계 인증과 앱 비밀번호가 필요합니다.

#### 단계별 가이드:

1. **Google 계정 설정** 접속
   - https://myaccount.google.com/security

2. **2단계 인증 활성화**
   - "Google에 로그인" → "2단계 인증" 클릭
   - 안내에 따라 2단계 인증 설정

3. **앱 비밀번호 생성**
   - https://myaccount.google.com/apppasswords
   - "앱 선택" → "메일" 선택
   - "기기 선택" → "기타(맞춤 이름)" 선택
   - 이름 입력: "MD 신청 시스템"
   - "생성" 클릭
   - **16자리 비밀번호 복사 및 저장** (공백 없이 연속된 문자)

---

## Vercel 배포

### 1. GitHub 저장소 준비

```bash
# 변경사항 커밋
git add .
git commit -m "Add email sending functionality with Vercel Serverless"
git push origin main
```

### 2. Vercel 프로젝트 생성

#### 방법 A: Vercel 웹사이트 사용

1. **Vercel 로그인**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **프로젝트 Import**
   - "Add New..." → "Project" 클릭
   - GitHub 저장소에서 `md-request` 선택
   - "Import" 클릭

3. **빌드 설정 확인**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Deploy** 클릭

#### 방법 B: Vercel CLI 사용

```bash
# Vercel CLI 설치 (처음 한 번만)
npm install -g vercel

# 프로젝트 디렉토리에서 실행
cd /Users/nakjoo/Project/md-request
vercel

# 프로덕션 배포
vercel --prod
```

---

## 환경 변수 설정

### Vercel Dashboard에서 설정

1. **프로젝트 설정 접속**
   - Vercel Dashboard → 프로젝트 선택
   - "Settings" 탭 클릭
   - "Environment Variables" 선택

2. **환경 변수 추가**

   | Name | Value | Example |
   |------|-------|---------|
   | `SENDER_EMAIL` | Gmail 주소 | `your-email@gmail.com` |
   | `SENDER_APP_PASSWORD` | Gmail 앱 비밀번호 (16자리) | `abcdabcdabcdabcd` |
   | `RECIPIENT_EMAIL` | 관리자 이메일 (쉼표로 구분) | `admin@company.com,manager@company.com` |

3. **적용 환경 선택**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Save** 클릭

5. **재배포**
   - "Deployments" 탭 이동
   - 최신 배포의 "..." 메뉴 클릭
   - "Redeploy" 선택 (환경 변수 적용을 위해)

### Vercel CLI로 설정 (선택사항)

```bash
# 환경 변수 설정
vercel env add SENDER_EMAIL
vercel env add SENDER_APP_PASSWORD
vercel env add RECIPIENT_EMAIL

# 프로덕션 재배포
vercel --prod
```

---

## 로컬 개발 환경 설정 (선택사항)

### 1. .env 파일 생성

```bash
# .env.example 복사
cp .env.example .env
```

### 2. .env 파일 편집

```bash
SENDER_EMAIL=your-email@gmail.com
SENDER_APP_PASSWORD=your-16-digit-app-password
RECIPIENT_EMAIL=admin@company.com
```

### 3. Vercel Dev 서버 실행

```bash
# Vercel CLI 필요
npm install -g vercel

# 개발 서버 시작 (Serverless Function 로컬 실행)
vercel dev
```

이제 `http://localhost:3000`에서 로컬 테스트 가능합니다.

---

## 테스트

### 1. 배포 확인

Vercel 배포 완료 후 제공되는 URL 접속:
```
https://your-project.vercel.app
```

### 2. 이메일 전송 테스트

1. MD 상품 선택
2. 신청자 정보 입력
3. 배송지 입력
4. "신청하기" 버튼 클릭
5. 이메일 수신 확인:
   - 관리자 이메일: 신청 알림
   - 신청자 이메일: 접수 확인

### 3. 로그 확인

#### Vercel Dashboard에서 로그 확인
1. 프로젝트 → "Deployments" 탭
2. 최신 배포 클릭
3. "Functions" 탭에서 `send-email` 함수 로그 확인

#### 실시간 로그 스트리밍
```bash
vercel logs --follow
```

---

## 문제 해결

### 이메일이 전송되지 않는 경우

#### 1. 환경 변수 확인
```bash
# Vercel CLI로 확인
vercel env ls
```

- `SENDER_EMAIL`, `SENDER_APP_PASSWORD`, `RECIPIENT_EMAIL`이 모두 설정되었는지 확인
- 앱 비밀번호는 **공백 없이** 16자리 연속 문자

#### 2. Gmail 설정 확인
- 2단계 인증이 활성화되어 있는지 확인
- 앱 비밀번호가 올바른지 확인 (필요시 재생성)
- Gmail 계정이 정상 상태인지 확인

#### 3. Vercel Function 로그 확인
```bash
vercel logs send-email --follow
```

에러 메시지를 확인하여 문제 진단

#### 4. 일반적인 오류

**오류: "Invalid login: 535-5.7.8 Username and Password not accepted"**
- 원인: 앱 비밀번호가 잘못되었거나 2단계 인증이 비활성화됨
- 해결: 앱 비밀번호 재생성 및 환경 변수 업데이트

**오류: "Greeting never received"**
- 원인: Gmail SMTP 연결 실패
- 해결: 네트워크 문제 또는 Vercel Function timeout 확인

**오류: "Missing credentials"**
- 원인: 환경 변수가 설정되지 않음
- 해결: Vercel Dashboard에서 환경 변수 추가 후 재배포

### API 엔드포인트 접근 불가

#### 상황: fetch('/api/send-email') 404 오류

**원인 1: Vercel 빌드 문제**
```bash
# 로컬에서 빌드 테스트
npm run build
```

**원인 2: vercel.json 설정 문제**
- `vercel.json` 파일 확인
- API 라우팅 설정 확인

**해결:**
```bash
# Vercel 재배포
vercel --prod --force
```

### 프론트엔드 빌드 실패

```bash
# 로컬에서 빌드 테스트
npm install
npm run build

# 빌드 성공 확인 후 배포
git add .
git commit -m "Fix build issues"
git push origin main
```

---

## 유지보수

### 수신자 이메일 추가/변경

```bash
# Vercel Dashboard → Settings → Environment Variables
# RECIPIENT_EMAIL 값 수정
# 예: admin@company.com,manager@company.com,support@company.com

# 재배포 필요 없음 (다음 요청부터 자동 반영)
```

### 이메일 템플릿 수정

`api/send-email.js` 파일의 `adminMailOptions` 및 `applicantMailOptions` 수정 후:

```bash
git add api/send-email.js
git commit -m "Update email template"
git push origin main
```

Vercel이 자동으로 재배포합니다.

---

## 추가 참고 자료

- [Vercel Serverless Functions 문서](https://vercel.com/docs/functions)
- [Nodemailer 문서](https://nodemailer.com/about/)
- [Gmail SMTP 설정](https://support.google.com/mail/answer/7126229)
- [Vercel 환경 변수 가이드](https://vercel.com/docs/environment-variables)

---

## 지원

문제가 계속되면:
1. Vercel Function 로그 확인
2. GitHub Issues 생성
3. Vercel Support 문의
