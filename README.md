# FitClip v1

DEMIC 유튜브 채널의 운동 영상을 부위별·동작별로 분류해서 보는 PWA 시제품입니다.

## 포함 기능
- 홈 화면
- 부위별 탐색
- 동작별 탐색
- 검색
- 즐겨찾기
- 최근 본 영상
- 영상 상세
- PWA 설치
- 스마트폰·태블릿 반응형 UI

## 현재 영상 데이터
- 사용자가 제공한 DEMIC Shorts 1개만 실제 연결
- 나머지 카드는 UI 테스트용 등록 예정 항목
- `app.js`의 `videos` 배열을 수정하면 실제 영상을 추가할 수 있음

## GitHub Pages 배포
1. 이 폴더의 파일을 GitHub 저장소 최상위에 업로드
2. Settings → Pages
3. Deploy from a branch
4. main / root 선택
5. 생성된 주소를 휴대폰 브라우저에서 열기
6. 홈 화면에 추가

## 주요 파일
- `index.html`: 화면 구조
- `style.css`: 디자인
- `app.js`: 영상 데이터와 기능
- `manifest.json`: PWA 앱 정보
- `service-worker.js`: 기본 파일 캐시
