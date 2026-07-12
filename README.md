# FitClip v1

DEMIC 유튜브 채널의 운동 영상을 확인한 뒤 바로 세트를 수행하고 기록하는 PWA 시제품입니다.

## 포함 기능

- 홈 화면
- 부위 중심 운동찾기
- 동작별 보조 탐색
- 세트 기록
- 검색
- 즐겨찾기
- 최근 본 영상
- 운동 수행/영상 상세
- PWA 설치 지원
- 스마트폰·태블릿 반응형 UI
- 기본 오프라인 캐시

## 현재 영상 데이터

- 사용자가 제공한 DEMIC Shorts 1개만 실제 연결되어 있습니다.
- 나머지 카드는 UI 테스트용 등록 예정 항목입니다.
- 실제 영상을 추가하려면 `app.js`의 `videos` 배열을 수정하세요.

## GitHub Pages 배포

1. GitHub 저장소의 `main` 브랜치 최상위에 이 파일들을 둡니다.
2. GitHub 저장소에서 **Settings → Pages**로 이동합니다.
3. **Build and deployment**에서 **Deploy from a branch**를 선택합니다.
4. Branch는 `main`, 폴더는 `/ (root)`를 선택합니다.
5. 저장 후 생성된 GitHub Pages 주소를 브라우저에서 엽니다.
6. 모바일에서는 브라우저 메뉴에서 **홈 화면에 추가**를 선택해 PWA처럼 사용할 수 있습니다.

## 주요 파일

- `index.html`: 앱 화면 구조
- `style.css`: 디자인과 반응형 레이아웃
- `app.js`: 영상 데이터, 운동찾기 필터, 검색, 즐겨찾기, 최근 본 영상, 세트 기록, PWA 설치 로직
- `manifest.json`: PWA 앱 정보와 아이콘 경로
- `service-worker.js`: 기본 파일 캐시와 오프라인 fallback
- `icon.svg`: PWA 아이콘

## PWA 아이콘 경로

아이콘 파일은 저장소 최상위의 `icon.svg`를 사용합니다. `manifest.json`과 `service-worker.js`도 같은 SVG 경로를 참조합니다. PNG 에셋은 PR 생성 제한을 피하기 위해 저장소에 포함하지 않습니다.
