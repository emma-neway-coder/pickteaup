# 픽티업 (Pick Tea Up)

3040 초보 차 애호가를 위한 차 추천·기록 앱.
녹차 · 청차/우롱 · 보이차 · 홍차 · 꽃차 5개 카테고리, 규칙 기반 추천, 개인별 저장(구글/이메일 로그인).

- **스택**: React 18 · Vite 5 · Firebase 11 · 인라인 CSS(프레임워크 없음)
- **저장 구조(반틈에서 이식)**: `users/{uid}/records/{id}` Firestore 문서 + uid별 localStorage 캐시 + 메모리 폴백, 로그인 시 익명 기록 자동 병합(타임스탬프 우선)

---

## 0. 로컬에서 먼저 확인(선택, 권장)

터미널을 쓸 수 있으면 배포 전에 빌드가 되는지 한 번 확인하세요.

```
npm install
npm run build      # 오류 없이 끝나면 배포 준비 OK
npm run dev        # 브라우저에서 미리보기
```

터미널 없이 바로 배포해도 되지만, 그 경우 Vercel 첫 빌드에서 오류를 확인하게 됩니다.

---

## 1. Firebase 설정 (콘솔, 클릭만으로)

1. **프로젝트 만들기** — [console.firebase.google.com](https://console.firebase.google.com) → "프로젝트 추가" → 이름(예: `pickteaup`).
2. **로그인 켜기** — 좌측 **Authentication** → "시작하기" → **로그인 방법** 탭에서
   - **Google** 사용 설정(스위치 켜고 지원 이메일 선택 → 저장)
   - **이메일/비밀번호** 사용 설정 → 저장
3. **Firestore 만들기** — 좌측 **Firestore Database** → "데이터베이스 만들기" →
   **프로덕션 모드**로 시작 → 위치는 **asia-northeast3 (서울)** 권장.
4. **보안 규칙 넣기** — Firestore의 **규칙** 탭을 열어, 이 저장소의 `firestore.rules` 내용을
   그대로 붙여넣고 **게시**. (본인 문서만 읽고 쓰도록 잠급니다.)
5. **웹 앱 등록 → 설정값 복사** — 상단 톱니 **⚙️ 프로젝트 설정** → 하단 "내 앱"에서
   **웹(`</>`)** 아이콘 클릭 → 앱 닉네임 입력 → 등록.
   화면에 나오는 `firebaseConfig = { ... }` 객체를 복사해서
   **`src/firebase.js`** 안의 자리표시자(`YOUR_API_KEY` 등)를 교체하세요.
   > 웹 apiKey는 비밀키가 아니라 공개돼도 됩니다. 실제 보안은 4번 규칙 + 아래 6번 승인 도메인이 담당합니다.

---

## 2. GitHub에 올리기 (github.dev, 클릭만으로)

1. [github.com](https://github.com) → **New repository** → 이름 `pickteaup` → 생성.
2. 방금 받은 **zip을 풀면 `pickteaup` 폴더**가 생깁니다.
   ⚠️ **폴더째로 올리지 마세요.** 저장소에 폴더가 한 겹 더 생기면
   Vercel이 루트에서 `package.json`을 못 찾아 빌드가 실패합니다.
   반드시 **`pickteaup` 폴더를 열어서, 그 안의 파일·폴더만** 선택해 올리세요.
   (올려야 할 것: `package.json`, `vite.config.js`, `index.html`, `vercel.json`,
   `.gitignore`, `firestore.rules`, `README.md`, `src/` 폴더)
3. 저장소 주소 뒤를 바꿔 웹 에디터를 엽니다: `github.com/<계정>/pickteaup` → 키보드 `.`(점)
   또는 주소를 `github.dev/<계정>/pickteaup`로. 파일들을 드래그해 넣고
   좌측 **Source Control**에서 커밋 → **Commit & Push**.

---

## 3. Vercel 배포 (pickteaup.vercel.app)

1. [vercel.com](https://vercel.com) 로그인 → **Add New… → Project** → GitHub의 `pickteaup` **Import**.
2. 설정 확인:
   - **Framework Preset**: `Vite` (자동 감지)
   - **Root Directory**: 비워둠(루트). ← 2번에서 파일만 올렸으면 이대로 맞습니다.
   - Build Command / Output(`dist`)은 기본값 그대로.
3. **Deploy**.
4. **주소를 pickteaup.vercel.app로** —
   Vercel의 `*.vercel.app` 주소는 **프로젝트 이름**을 따라갑니다.
   프로젝트 이름이 `pickteaup`이면 기본 주소가 `pickteaup.vercel.app`이 됩니다.
   - 이미 다른 사람이 선점했다면 그 이름은 못 씁니다(전 세계 공용). 그때는
     **Project → Settings → Domains**에서 다른 이름을 지정하세요.
   - 이름을 바꾸려면 **Settings → General → Project Name**에서 변경하면
     `.vercel.app` 주소도 함께 바뀝니다.

---

## 4. 배포 후 마무리 (중요)

배포가 끝나면 실제 주소를 Firebase에 등록해야 로그인이 열립니다.

1. Firebase **Authentication → Settings(설정) → 승인된 도메인**으로 이동.
2. **도메인 추가** → `pickteaup.vercel.app` 입력 → 추가.
   (미리보기 배포도 쓰려면 `*.vercel.app` 관련 프리뷰 도메인도 필요 시 추가)
3. 앱을 열어 구글 로그인 → 차 추천 → 기록까지 한 번 돌려보세요.

> 로그인 시 `auth/unauthorized-domain` 오류가 나면 2번 도메인 등록이 빠진 것입니다.

---

## 앱 구조 한눈에

```
pickteaup/
├─ index.html
├─ package.json          # vite/@vitejs/plugin-react는 반드시 dependencies에 (회귀 주의)
├─ vite.config.js
├─ vercel.json           # SPA 새로고침 404 방지
├─ firestore.rules       # 본인 문서만 접근
└─ src/
   ├─ main.jsx           # 전역 스타일 주입 + ErrorBoundary
   ├─ App.jsx            # 오늘 마실 차 / 내 찻장 / 차 도감
   ├─ firebase.js        # ← 콘솔 config 붙여넣는 곳
   ├─ storage.js         # 개인별 저장 + 익명 병합 (반틈 구조)
   ├─ recommend.js       # 규칙 기반 추천 로직
   ├─ styles.js          # 얼그레이 오후 팔레트 토큰
   ├─ data/catalog.js    # 차 데이터 (홍차 4종 포함)
   └─ components/
      ├─ AuthPanel.jsx   # 구글/이메일 로그인
      ├─ LogoutSheet.jsx # 로그아웃 확인 시트
      ├─ ErrorBoundary.jsx
      └─ CupRating.jsx   # 카테고리별 찻잔 5잔 점수
```

## 데이터 구조 (Firestore)

```
users/{uid}/records/{recordId}
  { id, teaId, category, rating(1~5), tasteTags[], memo, createdAt, updatedAt }
```

로그인 전 남긴 기록은 이 기기(localStorage)에만 있다가, 로그인하는 순간
계정으로 병합됩니다. 같은 기록이 양쪽에 있으면 `updatedAt`이 더 최신인 쪽을 남깁니다.
