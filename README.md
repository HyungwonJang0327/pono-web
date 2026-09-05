# Pono

사진 한 장의 **스냅**과 긴 글 **아티클**을 하나의 피드에서 함께 다루는 SNS 웹 클라이언트입니다.
브라우저에서는 독립 웹 서비스로, 네이티브 앱 안에서는 웹뷰로 동작하도록 설계했습니다.

- 배포: https://dev-pono.vercel.app/
- 백엔드(NestJS): https://github.com/HyungwonJang0327/pono-api

<!-- TODO: screenshot — 홈 피드 (아티클 카드 + 스냅 2열 그리드 혼합 레이아웃) -->
<!-- TODO: screenshot — 아티클 작성 화면 (TipTap 에디터 + 자동저장 상태 표시) -->
<!-- TODO: screenshot — 스냅 상세 (이미지 캐러셀 + 좋아요/댓글) -->
<!-- TODO: gif — 무한 스크롤 + 좋아요 낙관적 업데이트 동작 -->

## ✨ 주요 기능

- **혼합 피드** — 아티클은 큰 카드, 연속된 스냅은 2열 그리드로 묶어 렌더링. 팔로잉/추천 탭 + 무한 스크롤
- **아티클 작성** — 리치 텍스트 에디터(제목·굵게·인용·링크·본문 이미지), 30초 디바운스 자동저장 초안
- **스냅 작성** — 다중 이미지 업로드(클라이언트 압축 → S3 presigned URL), 캐러셀 뷰
- **소셜 기능** — 좋아요·댓글(대댓글)·북마크·팔로우/팔로워, 프로필의 스냅/아티클 탭
- **소셜 로그인 + 온보딩** — Clerk 인증 후 username 설정을 강제하는 온보딩 플로우
- **3개 언어 지원** — 한국어·영어·일본어 (next-intl)
- **공유 최적화** — 아티클 상세의 OG 메타태그(제목·본문 발췌·커버 이미지) 서버 생성

## 🛠 기술 스택

| 분류 | 스택 |
| --- | --- |
| 프레임워크 | Next.js 16.2 (App Router), React 19.2, TypeScript 5 |
| 스타일 | Tailwind CSS 4 |
| 인증 | Clerk (`@clerk/nextjs` 7.5) |
| 에디터 | TipTap 3.27 (StarterKit + Link·Image·Placeholder 확장) |
| i18n | next-intl 4.13 |
| 테스트 | Jest 30, React Testing Library 16 |
| 패키지 매니저 | pnpm |

## 📁 구조

```
src/
├── proxy.ts        # 웹뷰 감지·인증 보호 미들웨어 (Next.js 16의 middleware)
├── app/
│   ├── (main)/     # 홈 피드, 프로필, 포스트 상세, 글쓰기(article/snap), 탐색
│   ├── (auth)/     # 로그인·회원가입
│   ├── onboarding/ # username 설정 (인증 필수 강제 플로우)
│   └── settings/   # 설정·프로필 편집
├── components/     # feed / post / layout / ui 단위 컴포넌트
├── hooks/          # useInfiniteScroll, useToast, useErrorMessage 등
├── services/       # 백엔드 API 호출 계층 (auth·post·feed·comment·user)
├── lib/            # fetch 래퍼(ApiError), 이미지 압축, 피드 그룹핑
├── i18n/           # 로케일 결정 로직 (messages/: ko·en·ja)
└── __tests__/      # 31개 테스트 파일
```

## 🔍 기술적으로 신경 쓴 점

**1. 웹뷰 감지 미들웨어 — 하나의 코드베이스로 웹과 앱 내 웹뷰를 모두 서빙**
`src/proxy.ts`(Next.js 16에서 middleware가 proxy로 개편)에서 `app.` 서브도메인 또는 커스텀 User-Agent(`PonoApp`)를 감지해 `x-is-webview` 헤더를 주입합니다. 서버 컴포넌트(레이아웃·프로필·포스트 상세)가 이 헤더를 읽어 웹뷰에서는 뒤로가기 등 네이티브가 담당하는 UI를 웹에서 제거하는 식으로 분기합니다. 클라이언트 스니핑 없이 서버에서 한 번만 판별하므로 하이드레이션 불일치가 없습니다.

**2. TipTap 에디터 + 초안 자동저장 파이프라인**
아티클 본문을 TipTap JSON으로 저장하고, 제목·본문 변경 시 30초 디바운스로 초안을 생성/갱신합니다(첫 저장에서 draftId 확보 후 이후는 PATCH). 저장 상태(saving/saved/error)를 헤더에 노출해 실패를 무음 처리하지 않습니다. 본문 이미지는 클라이언트에서 압축(3MB·2048px 초과 시 canvas 리사이즈 + 품질 단계 조절) 후 presigned URL로 S3에 직접 업로드해 서버를 거치지 않습니다. 상세 페이지의 `generateMetadata`는 TipTap JSON을 순회해 텍스트 발췌를 뽑아 OG description을 만듭니다.

**3. 웹뷰 여부에 따른 i18n 로케일 결정 전략**
웹뷰에서는 네이티브 앱이 보내는 `x-locale` 헤더를, 브라우저에서는 `locale` 쿠키 → `Accept-Language` 폴백 순으로 로케일을 결정합니다(`src/i18n/request.ts`). 앱의 언어 설정과 웹뷰 화면 언어가 항상 일치합니다.

**4. 낙관적 업데이트 + in-flight 가드**
좋아요·팔로우는 UI를 즉시 반영하고 API 실패 시 이전 상태로 롤백 + 에러 토스트를 띄웁니다. ref 기반 in-flight 가드로 연타 시 중복 요청을 동기적으로 차단합니다.

**5. 에러 처리 표준화 — 백엔드 에러 코드를 i18n 메시지로**
fetch 래퍼가 모든 실패를 `ApiError`(status·code·isNetworkError)로 정규화하고, `useErrorMessage`가 백엔드의 머신 코드(`USERNAME_TAKEN`, `COMMENT_DEPTH_EXCEEDED` 등 26종)를 로케일별 사용자 메시지로 매핑합니다. 미지의 코드·네트워크 단절은 기본 메시지로 폴백합니다.

## 🚀 로컬 실행

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

`.env.local`에 다음 환경변수가 필요합니다.

```
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
```

백엔드 API 서버는 [pono-api](https://github.com/HyungwonJang0327/pono-api)를 함께 실행합니다.

## 🧪 테스트

```bash
pnpm test         # Jest + React Testing Library (31개 파일, 150+ 케이스)
pnpm test:watch
```

---

Claude Code를 활용한 1인 개발 프로젝트입니다. 아키텍처·데이터 모델·기술 선택은 직접 결정했습니다.
