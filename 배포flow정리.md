# React 프로젝트 + Github Actions + S3 + Cloud Front 배포 flow 정리

### 0. 배포 전 기본 개념 정리

### Frontend 배포

    배포 흐름

    React build
    ↓
    S3 (정적 파일 저장)
    ↓
    CloudFront (CDN + HTTPS)
    ↓
    Route53 (도메인 연결)
    ↓
    사용자

---

### 1. React 프로젝트 빌드

### 개념 정리

- 빌드 시 정적 파일로 변한다.
  - 빌드 도구가 빌드를 실행함(vite, webpack, babel, rollup, esbuild 등)
  - React 의 JSX는 브라우저가 바로 실행할 수 없어서 이해할 수 있는 코드로 변환이 필요함.
  - Build Entry Point : main.jsx -> App.jsx 순으로 따라가며 Dependency Graph(의존성 그래프)를 만든다.
- 핵심 흐름

  ```
  Source Code
  ↓
  Transpile
  ↓
  Bundle
  ↓
  Optimize
  ↓
  Asset Processing
  ↓
  Output
  ```

- Transpile(문법 변환)
  - JSX, ES 최신 문법 등을 브라우저가 이해할 수 있는 문법으로 변환.(브라우저 호환성 확보를 위해)
- Module Resolve
  - import 경로 찾기 -> 이 단계에서 파일 시스템 탐색 발생.
- Bundle(번들링)
  - 여러 파일을 하나 or 몇개의 파일로 묶는다. 브라우저 요청 최적화 때문. -> 이 과정을 Webpack이나 Rollup 이 담당한다.
- Tree Shaking
  - 안 쓰는 코드 제거
- Code Splitting
  - 큰 파일 쪼개기 -> 초기 로딩 감소 목적.
  - 브라우저는 코드 실행 중 import()가 호출되는 순간 네트워크 요청을 발생시켜 다운로드함.
  ```
  *동적 import
    ex) const AdminPage = lazy(() => import("./AdminPage"));
        ㄴ이 구문 만나면 나중에 로드할 코드라는 것을 인식, chunk 파일 생성
  *import()는 Promise를 반환한다.
    ㄴ그래서 fallback 표시가 가능한 것.
  ```
- CSS 처리
  - 빌드 도구가 CSS를 따로 추출.
  - 압축, 중복 제거, 최소화 등의 최적화 진행 후 삽입
- Asset 처리
  - 에셋들에 해시를 붙여 처리(ex.assets/logo.abc123.png) -> 캐시 관리의 목적.(브라우저 캐시 갱신)
- Minify
  - 코드 압축. 파일 크기 감소와 다운로드 시간 감소 효과.(보통 esbuild 사용)
- hashing
  - 출력 파일 이름에 해시처리함. 브라우저 캐싱 효과(빌드시마다 이름 달라져서 새파일로 인식되게 한다.)

- 이렇게 최종 output 생성

  ```
  dist/
  ├─ index.html
  ├─ assets/
  │ ├─ main.a81f2d.js
  │ ├─ vendor.33a12d.js
  │ ├─ main.css
  │ └─ logo.png

  ❗이 tree는 브라우저가 바로 실행 가능하다.
  ```

- 실제 브라우저 실행 흐름
  ```
  index.html 요청
  ↓
  main.js 다운로드
  ↓
  JS engine 실행
  ↓
  React mount
  ↓
  DOM 생성
  ↓
  렌더링
  ```

---

### 2. S3 (정적 파일 저장)

- React / Vue / Next static build 결과는 결국 ➡️ HTML / JS / CSS 파일
  - 브라우저는 HTML, CSS, JS만 이해할 수 있다.
- AWS S3는 HTTP로 파일 제공이 가능하기 때문에 정적 웹 호스팅이 가능.

### 3. CloudFront (CDN + HTTPS)

- CloudFront?
  - 고속 콘텐츠 전송 네트워크 서비스(CDN).
    데이터, 동영상, 애플리케이션 및 API를 짧은 지연시간과 빠른 전송 속도로 안전하게 전송하는 서비스.
  -
