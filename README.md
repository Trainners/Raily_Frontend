# Raily Frontend

> 기차 정기권·입석 승객을 위한 **구간별 빈자리 조회 서비스**

> 배포 URL : [Raily](raily-frontend.vercel.app)

> 시연영상 링크 : [영상](영상링크)

> 발표자료 링크 : [발표자료](발표자료)

한국철도공사의 정기권은 지정된 구간을 입석으로 이용하는 상품입니다. 좌석을 배정받지 않기 때문에 승객은 열차에 올라 빈자리를 직접 찾아야 합니다.

문제는 코레일이 **출발역부터 도착역까지 통으로 비어 있는 좌석만** 알려준다는 점입니다. 출퇴근 시간대에 그런 자리는 거의 없습니다. 실제로는 "천안에서 수원까지는 비어 있고 수원부터 팔린 자리"가 훨씬 많은데, 이런 자리를 찾으려면 검색 구간을 바꿔 가며 앱에서 수동으로 반복 조회해야 합니다.

Raily는 그 반복 조회를 자동화해 **좌석 × 구간 매트릭스**로 한 번에 보여주고, 앉은 자리가 팔리면 새 승객이 타기 전에 알려줍니다.

|  | 천안-평택 | 평택-수원 | 수원-영등포 | 판정 |
|---|---|---|---|---|
| 4호차 1A | 빈자리 | 빈자리 | 빈자리 | 하차역까지 이동 불필요 |
| 3호차 7A | 빈자리 | 빈자리 | 판매됨 | 수원까지 앉고 이동 |
| 3호차 7B | 판매됨 | 빈자리 | 빈자리 | 평택부터 착석 가능 |

팀 Trainners

---

## 기술 스택

| 영역 | 선택 | 버전 |
|---|---|---|
| 프레임워크 | React | 19.2 |
| 빌드 | Vite | 8.3 |
| 언어 | TypeScript | 6.0 |
| 상태·서버 통신 | Redux Toolkit / RTK Query | 2.12 |
| 라우팅 | React Router | 7.18 |
| 스타일 | CSS Modules + CSS 변수 토큰 | — |
| 폰트 | Pretendard (self-host) | 1.3 |
| 테스트 | Vitest | 5.0 |
| 배포 | Vercel | — |

---

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
```

| 스크립트 | 설명 |
|---|---|
| `npm run dev` | 개발 서버. `/api` 요청은 `localhost:8080`으로 프록시 |
| `npm run build` | `tsc -b` 타입 검사 후 프로덕션 빌드 |
| `npm run lint` | ESLint |
| `npm test` | Vitest (watch). CI·단발 실행은 `npx vitest run` |

백엔드가 함께 실행되어 있어야 조회 기능이 동작합니다. 개발 서버의 프록시 설정은 `vite.config.ts`에 있습니다.

> **알림 기능은 `localhost` 또는 HTTPS에서만 동작합니다.** Service Worker와 Push API의 제약입니다. 휴대폰으로 `http://192.168.x.x:5173`에 접속하면 "지원하지 않는 브라우저"로 표시되는 것이 정상이며, 실기기 확인은 배포본에서 해야 합니다.

---

## 아키텍처 — Feature-Sliced Design

의존 방향이 한쪽으로만 흐르도록 6개 레이어로 나눴습니다. 위 레이어는 아래를 import할 수 있고, 그 반대는 금지입니다.

```
app        전역 설정 — 스토어, 라우터 가드, 프로바이더, 전역 스타일
  ↓
pages      라우트 단위 화면 — 데이터를 모아 위젯에 내려보낸다
  ↓
widgets    화면의 큰 조각 — 앱 셸, 좌석 매트릭스, 여정 폼, 열차 목록
  ↓
features   사용자 행동 단위 — 로그인, 착석, 자리 비움, 알림 켜기, 호차 필터
  ↓
entities   도메인 단위 — user, journey, train, seat, station, notification
  ↓
shared     도메인을 모르는 공용 — UI 컴포넌트, API 클라이언트, 순수 함수, 라우트 설정
```

각 슬라이스는 `index.ts` 배럴로만 외부에 공개합니다. 내부 경로를 직접 import하지 않는 것이 규칙입니다.

```
entities/notification/
  ├── model/types.ts          백엔드 DTO와 1:1 타입
  ├── api/notificationApi.ts  RTK Query 엔드포인트
  ├── api/index.ts
  └── index.ts                <- 바깥에서는 이 파일만 확인
```

**FSD 아키텍처를 활용해서 얻은 이점**: 알림 기능을 7개 PR로 쪼개 순차 개발할 때, `entities/notification` -> `features/enable-push` -> `pages/notifications` 순으로 의존이 한 방향이라 앞 단계가 머지되지 않아도 다음 작업을 스택으로 쌓아 올릴 수 있었습니다.

---

## 인증 — RTK 전역 상태 + Silent Refresh

### 토큰을 보관하는 위치

| 토큰 | 저장 위치 | 이유 |
|---|---|---|
| accessToken | **Redux 메모리** (`entities/user/model/userSlice.ts`) | localStorage에 두면 XSS 한 번으로 탈취됩니다. 메모리에 두면 탭을 닫는 순간 사라집니다 |
| refreshToken | **HttpOnly 쿠키** (백엔드가 발급) | JS가 접근할 수 없습니다. 프론트 코드는 이 토큰을 **한 번도 만지지 않습니다** |

운영 빌드에서는 Redux DevTools 연결도 끊었습니다 (`app/store/store.ts`의 `devTools: import.meta.env.DEV`). 확장 프로그램을 통한 토큰 노출을 막기 위함입니다.

### Silent Refresh 동작

accessToken은 30분 뒤 만료됩니다. 사용자가 그 사실을 느끼지 못하게 하는 것이 목표입니다. 구현은 전부 `shared/api/client.ts`의 커스텀 `baseQuery`에 있습니다.

```
요청 → 401/403 감지
        ↓
   재발급이 이미 진행 중인가?
     ├─ 예 → 그 Promise를 기다린다 (single-flight)
     └─ 아니오 → POST /auth/reissue (쿠키 자동 전송)
        ↓
   성공 → tokenReissued 디스패치 → 원래 요청 1회 재시도
   실패 → sessionExpired 디스패치 → 로그인 화면
```

세 가지 장치가 들어 있습니다.

**1. 단일 비행(single-flight)** — 모듈 스코프의 `reissueInFlight` Promise를 공유합니다. 화면 진입 시 401이 동시에 여러 개 터져도 재발급 요청은 **한 번만** 나갑니다. 이게 없으면 재발급이 중복 실행되고, 서버가 refresh 토큰을 회전시키는 구조라면 서로를 무효화합니다.

**2. 무한 루프 차단** — `NO_REAUTH_PATHS`(`/auth/login`, `/auth/reissue`, `/users/signup`)에 속한 요청이 401을 받으면 재발급을 시도하지 않습니다. 재발급 자체가 실패했을 때 또 재발급하는 상황을 막습니다.

**3. 앱 시작 시 세션 복원** — `app/providers`의 `AuthBootstrap`이 마운트 시 `reissue`를 한 번 호출합니다. 새로고침이나 URL 직접 입력으로 들어와도 로그인이 유지되는 이유입니다. 이 응답에 `email`·`name`이 함께 실려 오기 때문에 사용자 정보를 받기 위한 추가 요청이 필요 없습니다.

### 레이어 경계를 지키는 방법

`shared/api/client.ts`는 `entities/user`를 import할 수 없습니다(FSD 위반). 그래서 `shared/api/authEvents.ts`에 액션만 정의해 두고, `userSlice`가 `extraReducers`로 그 액션을 구독합니다.

```ts
// shared/api/authEvents.ts — 도메인을 모르는 이벤트 정의
export const tokenReissued = createAction<TokenReissuedPayload>('auth/tokenReissued');
export const sessionExpired = createAction('auth/sessionExpired');
```

### 로그아웃

단순히 토큰만 지우지 않습니다. `features/logout/ui/LogoutButton.tsx`가 **accessToken이 살아 있는 동안** 정리 작업을 먼저 수행합니다.

1. 활성 좌석 감시 취소 (`DELETE /notifications/seat-watch/{id}`)
2. 푸시 구독 해제 — 브라우저 구독을 끊고 서버 레코드도 삭제
3. `POST /auth/logout`
4. `finishJourney()` + `notificationApi.util.resetApiState()` — 다음 사용자에게 이전 사람의 여정·알림이 보이지 않도록

1·2번을 3번 뒤에 두면 토큰이 이미 지워져 401이 납니다. 각 단계는 3초 타임아웃을 두고, 실패해도 로그아웃 자체는 진행합니다. **정리에 실패했다고 로그인 상태로 남는 것이 최악**이기 때문입니다.

---

## 외부 API 호출 — RTK Query

### 도메인별 API 슬라이스

| 슬라이스 | 담당 |
|---|---|
| `userApi` | 회원가입, 로그인, 재발급, 로그아웃 |
| `trainApi` | 열차 목록 조회 |
| `seatApi` | 구간별 좌석 현황 |
| `notificationApi` | 푸시 구독, 좌석 감시, 알림함 |

모두 `shared/api/client.ts`의 공용 `baseQuery`를 씁니다. 토큰 첨부와 재발급 재시도를 각 API가 다시 구현할 필요가 없습니다.

### 응답 변환은 API 계층에 격리

백엔드 응답 형식을 화면이 그대로 알 필요는 없습니다. `transformResponse`에서 화면용 모델로 바꿔 내보냅니다.

```ts
// entities/train/api/trainApi.ts
transformResponse: (response: TrainApiResponse[]): Train[] =>
    response.map((train) => ({
        trainNo: train.trainNum,
        trainName: train.trainTypeName,
        departureTime: formatApiTime(train.departureTime),  // '070100' → '07:01'
        arrivalTime: formatApiTime(train.arrivalTime),
    }))
```

백엔드 필드명이 바뀌어도 고칠 곳이 이 파일 하나입니다. 실제로 개발 중 좌석 조회 응답 구조가 한 번 크게 바뀌었는데, `seatApi`와 `transformSeats` 두 파일 수정으로 대응했습니다.

### 태그 기반 캐시 무효화

```ts
markAsRead: builder.mutation<void, number>({
    query: (id) => ({ url: `/notifications/${id}/read`, method: 'PATCH' }),
    invalidatesTags: ['Notifications', 'UnreadCount'],
}),
```

알림 하나를 읽음 처리하면 **알림함 목록과 NavBar 배지 숫자가 동시에** 다시 조회됩니다. 컴포넌트에서 `refetch()`를 수동으로 부를 필요가 없습니다.

### 프록시를 거치는 이유

프로덕션에서 API 요청은 백엔드를 직접 호출하지 않고 `vercel.json`의 rewrite를 거칩니다.

```
브라우저 → raily-frontend.vercel.app/api/...   (같은 출처)
              ↓ Vercel 엣지가 서버 간 통신으로 전달
           백엔드/api/...
```

**refresh 토큰 쿠키가 `SameSite=Strict`이기 때문입니다.** 이 설정은 교차 사이트 요청에 쿠키를 싣지 않습니다. 프론트에서 백엔드 도메인을 직접 호출하면 쿠키가 전송되지 않아 재발급이 영구히 실패합니다. 프록시를 거치면 브라우저 입장에서 같은 출처가 되어 쿠키가 정상 전송됩니다.

부수 효과로 CORS 프리플라이트가 사라지고, 백엔드 주소가 프론트 번들에 포함되지 않습니다. 개발 환경에서는 `vite.config.ts`의 dev proxy가 같은 역할을 합니다.

---

## 좌석 매트릭스

### 데이터 흐름

```
백엔드 응답                          화면 모델
{                                   {
  stops: ['천안','평택','수원',...],    stops: [...],
  seats: [                            seats: [
    { carNumber: 3,          →           { carNo: 3,
      seatNumber: '7A',                    seatNo: '7A',
      availabilityBySegment:               states: ['free','free','sold'] }
        [true, true, false] }            ]
  ]                                  }
}
```

`availabilityBySegment`의 길이는 `stops.length - 1`입니다. `i`번째 원소가 `stops[i] → stops[i+1]` 구간의 상태입니다. 변환은 `entities/seat/model/transformSeats.ts`의 `toSeat` 한 함수가 담당합니다.

좌석 목록은 **백엔드가 이미 추천 우선순위로 정렬해서** 보냅니다. 프론트는 재정렬하지 않고 첫 번째 원소를 추천 좌석으로 사용합니다.

### 판정 로직

`entities/seat/model/verdict.ts`는 좌석 하나의 구간 상태 배열을 사람이 읽을 문장으로 바꿉니다. 네트워크도 DOM도 모르는 순수 함수라 단위 테스트가 쉽습니다.

| 패턴 | 판정 | 문구 |
|---|---|---|
| 전부 free | `full` | 하차역까지 비어 있어 중간에 옮기지 않아도 됩니다 |
| free → sold | `until` | 수원까지 앉고 이동 |
| sold → free | `from` | 평택부터 착석 가능 |
| 중간만 sold | `partial` | 일부 구간만 착석 가능 |
| 전부 sold | `none` | 전 구간 판매됨 |

### 화면 구성

```
widgets/seat-matrix/
  ├── SeatMatrix.tsx      헤더 + 행 조립
  ├── MatrixHeader.tsx    정차역을 구간 라벨로 변환
  ├── MatrixRow.tsx       좌석 한 줄
  └── SeatLegend.tsx      범례
entities/seat/ui/SeatCell.tsx   구간 하나의 상태 셀
```

좌석 클릭은 위젯이 직접 처리하지 않고 콜백으로 상위 페이지에 위임합니다. 위젯은 "그리는 일"만, 페이지는 "무엇을 할지"를 담당합니다.

내가 앉은 좌석은 서버 응답에 없는 정보이므로, 페이지에서 `journeySlice`의 착석 정보와 대조해 `mine` 상태를 덧씌웁니다.

---

## 좌석 판매 알림 (웹 푸시)

앉은 자리가 이후 구간에서 팔리면 새 승객이 타기 전에 알려주는 기능입니다.

```
[좌석 선택] "이 자리에 앉음"
     → POST /notifications/seat-watch (서버에 감시 등록)
     → 응답의 id를 journeySlice에 보관

[서버]  각 정차역 도착 10분 전 ~ 출발 시각에 코레일을 확인
     → 판매 감지 시 웹 푸시 발송

[알림 클릭]
     → sw.js가 열린 창을 찾아 postMessage
     → ServiceWorkerBridge가 수신 → 새로고침 없이 알림함으로 이동

[폴백] 좌석 화면에서 20초마다 감시 상태 조회 (포그라운드에서만)
```

| 파일 | 역할 |
|---|---|
| `public/sw.js` | Service Worker — 푸시 수신, 알림 클릭 처리 |
| `shared/lib/push.ts` | 브라우저 Push API 래퍼 (순수 함수, React를 모름) |
| `features/enable-push/` | 권한 상태별 UI와 구독 등록 |
| `app/providers/ServiceWorkerBridge.tsx` | SW ↔ React 메시지 브리지 |
| `pages/notifications/` | 알림함 |

**새로고침 대신 postMessage를 쓰는 이유**: accessToken과 여정 상태가 Redux 메모리에만 있어서, 전체 새로고침이 일어나면 전부 사라지고 재발급부터 다시 시작합니다. SW는 "이 경로로 가라"는 메시지만 보내고 실제 이동은 React Router가 처리합니다.

**환경별 제약 대응**: iOS는 16.4 이상에서 홈 화면에 추가한 경우에만 웹 푸시를 지원합니다. `push.ts`의 판별 순서를 `iOS 미설치 → 미지원 → 권한 거부`로 두어, iPhone 사용자에게 "지원하지 않는 브라우저"라고 잘못 안내하지 않도록 했습니다. 권한이 거부된 상태에서는 버튼을 아예 그리지 않습니다. 다시 요청해도 브라우저가 팝업 없이 즉시 거부하므로, 눌러도 아무 일이 없는 버튼을 남기지 않기 위함입니다.

---

## 라우팅

### 경로 설정을 한곳에

`shared/config/routes.ts`가 경로별 메타데이터를 관리합니다. `NavBar`와 `ScreenShell`이 같은 출처를 읽습니다.

```ts
[ROUTES.SEAT_MATRIX]: {
    title: '구간 빈자리 현황',
    showBackButton: true,
    showTabBar: false,
    rightAction: 'LIVE',
    backTo: ROUTES.TRAIN_SELECT,
    showNotificationButton: true,
},
```

화면이 늘어날 때 `NavBar` 내부에 `if (pathname === ...)` 분기를 추가하는 대신 설정 한 줄을 추가합니다.

### 인증 가드

```
<ScreenShell>                      앱 셸 (헤더 + 본문 + 탭바)
  ├── <RedirectIfAuthenticated>    로그인·회원가입 — 이미 로그인했으면 내보냄
  ├── <RequireAuth>                나머지 전부 — 비로그인이면 로그인으로
  └── path="*"                     정의되지 않은 경로
```

세 상태(`restoring` / `authenticated` / `anonymous`)를 구분합니다. `restoring`은 앱 시작 직후 재발급 응답을 기다리는 중으로, 이때 로딩 화면을 보여주지 않으면 **로그인한 사용자에게 로그인 폼이 잠깐 노출**됩니다.

### 목적지 보존

알림을 눌러 들어왔는데 세션이 만료된 경우, 로그인 후 원래 가려던 곳으로 돌려보내야 합니다.

```
/notifications?highlight=12  →  RequireAuth가 state.from에 경로 저장
                             →  로그인 화면
                             →  로그인 성공
                             →  /notifications?highlight=12 복귀
```

복귀 경로는 `shared/lib/safePath.ts`에서 검증합니다. `/`로 시작하는 내부 경로만 통과시키고 `//evil.com`·`/\evil.com` 같은 프로토콜 상대 URL은 차단해 오픈 리다이렉트를 막습니다. 같은 검증을 푸시 payload의 `url`에도 적용합니다.

`RedirectIfAuthenticated`와 `LoginPage`가 **동일한 `resolvePostLoginPath` 함수**로 목적지를 계산합니다. 로그인 성공 시 두 곳이 거의 동시에 이동을 시도하는데 실행 순서가 보장되지 않기 때문입니다.

---

## 스타일

### CSS Modules

컴포넌트마다 `*.module.css`를 두고 클래스명 충돌을 빌드 타임에 제거합니다. 전역 CSS는 `reset.css`, `tokens.css`, `global.css` 셋뿐입니다.

```
SeatMatrixPage.tsx  ←→  SeatMatrixPage.module.css
NavBar.tsx          ←→  NavBar.module.css
```

### 디자인 토큰

색상은 전부 CSS 변수로 관리하고 컴포넌트에서는 원시 색상값을 쓰지 않습니다.

```css
--accent-600:      #2A5AA3;   /* 브랜드 */
--accent-base:     var(--accent-600);
--seat-free-bg:    #D8E8DE;   /* 빈자리 */
--seat-sold-bg:    #E6E9ED;   /* 판매됨 */
--seat-mine-bg:    ...        /* 내 자리 */
```

좌석 상태 색을 조정할 때 토큰 한 줄만 바꾸면 매트릭스·범례·상세 시트에 동시에 반영됩니다. 실제로 판매 좌석 텍스트의 명암비가 부족해 `--seat-sold-text` 값을 조정했는데, 사용처를 찾아다닐 필요가 없었습니다.

### 모바일 우선

열차 안에서 한 손으로 쓰는 상황을 기준으로 했습니다.

- `100dvh` 기반 앱 셸 — 모바일 주소창 높이 변화에 대응
- 헤더·탭바 `position: sticky`
- 탭바에 `env(safe-area-inset-bottom)` — 홈 인디케이터 기기 대응
- 터치 타깃 최소 44px
- 데스크톱에서는 `max-width` 컨테이너로 중앙 정렬

폰트는 Pretendard를 npm 패키지로 self-host합니다. CDN에 의존하지 않아 네트워크가 불안정한 환경에서도 렌더링이 흔들리지 않습니다.

---

## 품질

```bash
npx tsc -b        # 타입 검사
npm run lint      # ESLint
npx vitest run    # 단위 테스트
```

테스트는 **순수 함수 위주**입니다. 네트워크와 DOM에 의존하지 않는 로직을 별도 파일로 분리해 두었기 때문에 가능합니다.

| 대상 | 검증 내용 |
|---|---|
| `verdict.ts` | 구간 상태 배열 → 판정 |
| `safePath.ts` | 내부 경로 통과, 외부 URL 차단 |
| `push.ts` | base64url → 바이트 배열 변환 |

TypeScript는 `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`를 켜 두었습니다. 타입만 가져올 때는 `import type`을 써야 합니다.

---

## 한계점

- **새로고침 시 여정 상태 소실** — 검색 조건과 선택 열차가 Redux 메모리에만 있어 F5하면 여정 검색으로 돌아갑니다. 서버의 좌석 감시는 살아 있으므로 푸시는 정상 수신됩니다. `sessionStorage` 보존이 후속 과제입니다.
- **감시 종료 상태 미반영** — 서버에서 감시가 `EXPIRED`/`CANCELED`로 끝나도 화면은 착석 상태를 유지합니다.
- **`새로 조회` 버튼 미동작** — 좌석 화면의 재조회 버튼에 핸들러가 연결되어 있지 않습니다.
- **접근성** — `Field`의 label-input 연결, 커스텀 콤보박스의 키보드 조작, 시트의 포커스 트랩이 미비합니다.

---

## 관련 저장소

- 백엔드: [Trainners/Raily_Backend](https://github.com/Trainners/Raily_Backend) — Spring Boot 4.1, Java 21, PostgreSQL
