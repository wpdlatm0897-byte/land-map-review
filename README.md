# Parcel Ledger App

지도 기반으로 필지를 선택하고, 토지대장 발급 진행 여부를 관리하는 샘플 프로젝트입니다.

## 주요 기능

- 지도에서 필지 선택
- 필지별 대기목록 저장
- 정부24 발급 페이지 자동화 창 실행
- 발급 완료 / 실패 상태 관리
- 발급 여부를 지도 색상으로 표시

## 기술 스택

- Frontend: Next.js + React + OpenLayers
- Backend: FastAPI + SQLAlchemy + SQLite
- Automation: Playwright

## 디렉터리 구조

```text
parcel-ledger-app/
├─ backend/
├─ frontend/
└─ automation/
```

## 실행 방법

### 1) backend 실행

```bash
cd backend
python -m venv .venv
```

#### Windows

```bash
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### macOS / Linux

```bash
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

### 2) frontend 실행

```bash
cd frontend
npm install
npm run dev
```

---

### 3) automation 설치

```bash
cd automation
npm install
npx playwright install
```

## 접속 주소

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## 사용 흐름

1. 지도에서 필지를 클릭합니다.
2. 대기목록 저장 버튼을 누릅니다.
3. 발급 진행 버튼을 누릅니다.
4. 정부24 창이 열리면 사용자가 직접 로그인/인증을 진행합니다.
5. 자동화 실행 터미널에서 Enter를 누르면 자동 입력을 시도합니다.
6. 실제 발급 완료 시 화면에서 `발급 완료 처리` 버튼을 눌러 상태를 반영합니다.

## 상태값

- `not_issued`: 미발급
- `pending`: 진행중
- `issued`: 발급완료
- `failed`: 실패

## 주의사항

### 1. 현재 버전은 샘플 GeoJSON 기반입니다
현재 지도 데이터는 `frontend/public/sample-parcels.geojson` 파일을 사용합니다.

즉, 실제 KGEOP API 연동은 아직 붙지 않은 상태입니다.

### 2. 정부24 로그인 자동대행은 구현하지 않았습니다
이 프로젝트는 사용자가 직접 공식 로그인/인증을 한 뒤 자동 입력을 이어받는 구조입니다.

서버가 아이디/비밀번호를 저장하거나 대신 로그인하는 구조는 넣지 않았습니다.

### 3. Playwright selector는 수정이 필요할 수 있습니다
정부24 페이지 구조가 바뀌면 `automation/gov_issue_playwright.ts` 내부 selector를 수정해야 합니다.

## 향후 개선 포인트

- KGEOP/WFS/공간정보 API 실연동
- 시도 / 시군구 / 읍면동 필터 추가
- 다건 일괄 발급 처리
- PostGIS 연동
- 발급 성공 여부 자동 판정

## 라이선스
내부 테스트 / 프로토타입 용도
