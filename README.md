# DS Smart Link Web

반도체 후공정 비전 검사 장비 모니터링 웹 대시보드.  
Web-Backend REST API를 통해 장비 KPI, 검사 결과, AI 보고서를 조회합니다.

## 기술 스택

| 항목 | 내용 |
|---|---|
| Framework | React 18 + TypeScript |
| 번들러 | Vite |
| 상태 관리 | Zustand |
| UI | Tailwind CSS + shadcn/ui |
| 차트 | Recharts |
| HTTP | Axios |

## 디렉토리 구조

```
smart-link-web/src/
├── api/              # REST API 클라이언트 (auth, dashboard, equipment, report 등)
├── components/
│   ├── auth/         # 로그인 화면
│   ├── card/         # KPI 카드 컴포넌트
│   ├── chart/        # 차트 (Pareto, Trend, Yield, Defect, Uptime)
│   ├── equipment-detail/  # 장비 상세 패널
│   ├── layout/       # 사이드바, 헤더
│   └── report-document/   # 보고서 레이아웃 및 페이지
├── pages/            # Dashboard, EquipmentStats, ReportPage
└── store/            # Zustand 상태 (인증)
```

## 주요 화면

- **대시보드**: 전체 장비 KPI 요약, 수율 트렌드, 불량 분포
- **장비 현황**: 장비별 상세 통계, SPC 히트맵, 가동률, AI 인사이트
- **보고서**: AI 자동 생성 일별/주간 보고서 (Overview, Quality, Operations)

## 실행 방법

```bash
cd smart-link-web
npm install
npm run dev     # 개발 서버 (localhost:5173)
npm run build   # 프로덕션 빌드
```

## 포트

| 서비스 | 포트 |
|---|---|
| 개발 서버 | 5173 |

## 환경 설정

프론트엔드는 `/api` 상대 경로로 Web-Backend를 호출합니다.  
개발 서버 프록시 대상은 `VITE_API_PROXY_TARGET`로 설정합니다.

```bash
VITE_API_PROXY_TARGET=https://배포-백엔드-서버
npm run dev
```

`development` 모드에서 값을 지정하지 않으면 `http://localhost:8080`을 사용합니다.  
`production` 모드에서는 로컬 주소로 fallback하지 않으므로, 배포 서버에서 `/api`를 백엔드로 라우팅하거나 `VITE_API_PROXY_TARGET`를 명시해야 합니다.
