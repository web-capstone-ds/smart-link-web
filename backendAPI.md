## [공통 요청 파라미터 (Query Parameters)]

startDate (String): 조회 시작일 (예: "2026-05-01")
endDate (String): 조회 종료일 (예: "2026-05-06") - 하루만 조회할 경우 startDate와 동일하게 세팅
lineId (String): 라인 필터 (예: "all", "line-a", "line-b")

```tsx
ex) const response = await axios.get('/api/v1/dashboard/trend', {
      params: {
        lineId: "line-a",
        startDate: "2026-05-01",
        endDate: "2026-05-06",
        unit: "daily"
      }
    });
```

# 📡 대시보드 화면 API 명세서 (Draft)

## 1. 대시보드 상단 KPI 및 가동 상태 요약

 : 대시보드 상단의 4개 KPI 카드와 파이 차트(가동/대기/정지 비율)를 그리기 위한 데이터를 한 번에 받아옵니다.

**Method / URI: GET /api/v1/dashboard/summary

Request: 공통 파라미터 사용**
Response (JSON):

```json
{
  "success": true,
  "data": {
    "kpi": {
      "totalProduction": 24563,       // 총 생산량
      "uph": 2850,                    // 시간당 생산량
      "productionRate": 102.4,        // 목표 대비 달성률(%)
      "productionTrend": 2.1,         // 전일(또는 평균) 대비 증감(%)
      "totalYield": 96.4,             // 종합 수율(%)
      "yieldTrend": -0.8,             // 전일(또는 평균) 대비 증감(%)
      "passRate": 98.7,               // 치수 합격률(%)
      "cpk": 1.52,                    // 공정 능력 지수
      "cpkTrend": 0.04,               // 전일(또는 평균) 대비 증감(%)
      "topDefect": "C-01",            // 최다 발생 불량 코드
      "oee": 87.3                     // 설비 종합 효율(%)
    },
    "status": {                       // 종합 가동 비율(%)
      "run": 84.0,
      "idle": 11.5,
      "down": 4.5
    }
  }
}
```

## 2. 생산량 및 수율 시계열 트렌드 (Trend Chart)

 : 좌측 하단의 꺾은선 + 막대 복합 차트(trendData)를 그리기 위한 API입니다. trendUnit에 따라 일별, 주별 데이터를 다르게 줍니다.

**Method / URI: GET /api/v1/dashboard/trend**

**Request Query: 공통 파라미터 + unit (String: "daily", "weekly", "monthly")**
Response (JSON):

```json
{
  "success": true,
  "data": [
    { "date": "05-01", "production": 3100, "yield": 95.1 },
    { "date": "05-02", "production": 3400, "yield": 96.2 }
    // ... (조회 기간에 맞게 배열로 반환)
  ]
}
```

## 3. 수율 비교 차트 (Yield Comparison)

 : 우측 하단의 가로형 막대 차트 데이터입니다. 
   프론트엔드가 "all"을 보내면 백엔드가 알아서 '라인별 데이터'를 주고, 
   "line-a"를 보내면 '해당 라인의 장비별 데이터'를 주도록 설계하면 프론트 코드가 훨씬 깔끔해집니다.

**Method / URI: GET /api/v1/dashboard/yield-comparison

Request Query: 공통 파라미터**
Response (JSON):

```json
{
  "success": true,
  "data": [
    // lineId가 "all"일 경우
    { "name": "LINE-A", "yield": 96.4 },
    { "name": "LINE-B", "yield": 98.1 }

    // lineId가 특정 라인일 경우 (예: "line-a")
    { "name": "EQ.01", "yield": 95.2 },
    { "name": "EQ.02", "yield": 97.4 }
  ]
}
```

## 4. 주요 불량 원인 (Pareto Chart)

 : 가운데 위치한 파레토 차트 데이터를 불러옵니다. 
   불량 건수가 많은 순서대로 정렬되어야 하며, 누적 비율(cumulative)은 프론트에서 계산할 수도 있지만 
   백엔드에서 줘버리면(DB 쿼리로 처리) 연산이 편합니다.

**Method / URI: GET /api/v1/dashboard/defects/pareto

Request Query: 공통 파라미터**
Response (JSON):

```json
{
  "success": true,
  "data": [
    { "defectCode": "C-01", "defectName": "치핑", "count": 342, "cumulative": 45 },
    { "defectCode": "B-02", "defectName": "마모", "count": 185, "cumulative": 69 },
    { "defectCode": "L-03", "defectName": "오염", "count": 89, "cumulative": 81 }
    // ...
  ]
}
```

# 📡 장비 현황 페이지 API 명세서 (Draft)

## 1. 총 비가동 시간 트렌드 (Downtime Trend)

 : 좌측 상단의 Area 차트를 그리기 위한 일자별 비가동 시간(Down Time) 추이 데이터입니다.
사용자가 단일 일자(하루)를 선택했을 때 차트가 깨지는 것을 방지하기 위해, 
요청된 기간에 따라 X축 단위와 데이터 그룹화 기준이 달라집니다.

**Method / URI: GET /api/v1/equipments/downtime-trend

Request Query: 공통 파라미터 적용**
Response (JSON):

**Backend 처리 요구사항:**

- `startDate`와 `endDate`가 **다를 경우 (기간 조회)**: 
                      '일(Day)' 단위로 비가동 시간을 합산하여 반환 (단위: 시간)
- `startDate`와 `endDate`가 **같을 경우 (하루 조회)**: 
                      '시간(Hour)' 단위(예: 2~4시간 간격)로 비가동 시간을 합산하여 반환 (단위: 분)

**Response (기간 조회 시 - 일별 Data):**

```json
{
  "success": true,
  "data": [
    { "label": "05/01", "value": 22.5 },
    { "label": "05/02", "value": 18.2 },
    { "label": "05/03", "value": 28.5 }
  ],
  "unit": "hr"
}
```

**Response (하루 조회 시 - 시간대별 Data):**

```json
{
  "success": true,
  "data": [
    { "label": "08:00", "value": 15 },
    { "label": "10:00", "value": 45 },
    { "label": "12:00", "value": 0 }
  ],
  "unit": "min"
}
```

## 2. 라인별 평균 무고장 시간 (MTBF by Line)

 : 좌측 두 번째 Bar 차트를 위한 데이터입니다. 
요청받은 lineID의 값에 따라 응답하는 데이터의 Depth(라인 기준 vs 장비 기준)가 달라집니다.
(프론트엔드 차트 컴포넌트 재사용성을 위해 X축 라벨 키값을 name 으로 통일해 주세요)
 
**Method / URI: GET /api/v1/equipments/mtbf

Request Query: 공통 파라미터 적용**
Response (JSON):

**Backend 처리 요구사항:**

- `lineId="all"` 인 경우: 각 라인별 평균 MTBF를 계산하여 반환
- `lineId="line-a"` 인 경우: 해당 라인(line-a)에 속한 **개별 장비들**의 MTBF를 계산하여 반환

```json
{
  "success": true,
  "data": [
    // 전체 라인인 경우
    { "line": "LINE-A", "hours": 82 },
    { "line": "LINE-B", "hours": 115 },
    { "line": "LINE-C", "hours": 78 }
    // 특정 라인이 선택된 경우
    { "name": "SAW-EQ.01", "hours": 45 },
    { "name": "SAW-EQ.02", "hours": 88 },
    { "name": "SAW-EQ.05", "hours": 32 }
  ]
}
```

## 3. 주요 불량 코드 통계 (Defect Stats)

 : 중앙의 표와 우측 파이 차트를 동시에 그리기 위한 불량 유형별 통계 데이터입니다. 
   발생 건수(count) 기준으로 내림차순 정렬되어 오는 것이 좋습니다.

**Method / URI: GET /api/v1/equipments/defects

Request Query: 공통 파라미터 적용**
Response (JSON):

```json
{
  "success": true,
  "data": [
    {
      "code": "C-01",
      "name": "Chipping (치핑)",
      "type": "공통 불량",
      "count": 342,
      "ratio": "45%",
      "impact": "Package Size 이상치 발생"
    },
    {
      "code": "B-02",
      "name": "Blade Wear (블레이드 마모)",
      "type": "공통 불량",
      "count": 185,
      "ratio": "24%",
      "impact": "절단면 품질 저하 및 부하"
    }
    // ...
  ]
}
```

## 4. 장비 개별 상세 가동/수율 리스트 (Equipment Comparison List)

 : 화면 하단의 가장 중요한 메인 테이블 데이터를 불러오는 API입니다. 
   테이블 내의 미니 스파크라인(Sparkline) 차트를 그리기 위한 yieldTrend 배열이 포함되어야 합니다.

+ 백엔드에서는 별도의 정렬 파라미터 없이, 
    선택된 날짜에 해당하는 모든 장비 데이터를 한 번에 통째로 내려주면 됨

**Method / URI: GET /api/v1/equipments/status-list

Request Query: 공통 파라미터 적용**
Response (JSON):

```json
{
  "success": true,
  "data": [
    {
      "id": "SAW-EQ.01",
      "line": "line-a",
      "recipe": "PKG_A12",
      "uptime": 82.5,
      "total": 24500,
      "fail": 850,
      "marginal": 320,
      "yield": 95.2,
      "majorDefect": "C-01 (Chipping)",
      "unresolvedAlert": true,
      "yieldTrend": [97, 96, 95, 93, 91, 95.2] 
    },
    {
      "id": "SAW-EQ.02",
      "line": "line-a",
      "recipe": "PKG_B08",
      "uptime": 91.2,
      "total": 22100,
      "fail": 410,
      "marginal": 150,
      "yield": 97.4,
      "majorDefect": "L-03 (Lens Contamination)",
      "unresolvedAlert": false,
      "yieldTrend": [96, 97, 97.5, 98, 97.2, 97.4]
    }
    // ...
  ]
}
```

# 📡 API 명세서: 
             장비 상세 분석 패널 (Equipment Detail Sheet)

## **[공통 요청 파라미터]**

- **Path Variable:** `{equipmentId}` (예: "SAW-EQ.01")
- **Query Parameter:** `targetDate` (예: "2026-05-06") 
          - 상세 시트는 보통 '특정 하루' 또는 '현재 시점'을 기준으로 보므로 단일 날짜를 넘깁니다.

## 1. 장비 기본 정보 및 가동/파라미터 요약 (Summary)

 : 헤더 정보, AI 징후 예측 텍스트, 가동 타임라인 수치, 세부 파라미터 측정 결과 표를 한 번에 그리기 위한 통합 API입니다.

**Method / URI: GET /api/v1/equipments/{equipmentId}/summary**
Response (JSON):

```json
{
  "success": true,
  "data": {
    "info": {
      "line": "Line-A",
      "recipe": "PKG_DICE_C15",
      "currentLot": "LOT-2605B-02",
      "status": "Critical"
    },
    "aiInsight": {
      "title": "AI 징후 예측 (Pattern Detected)",
      "description": "비전 검사 히트맵 분석 결과, 우측 하단 집중 치핑 패턴이 발견되었습니다..."
    },
    "uptime": {
      "totalRate": 82.5,
      "runHour": 6.6,
      "idleHour": 0.2,
      "downHour": 1.2,
      "timeline": [
        { "status": "run", "start": "08:00", "end": "10:24", "ratio": 30 },
        { "status": "idle", "start": "10:24", "end": "10:48", "ratio": 5 },
        { "status": "error", "start": "14:00", "end": "15:12", "ratio": 15 }
        // 타임라인 바 렌더링용 배열
      ]
    },
    "parameters": [
      {
        "name": "Chipping_Bottom",
        "avg": 12.4, // 평균
        "max": 28.7, // 최대치
        "usl": 25.0, // 관리 상한
        "zScore": 3.42,
        "isError": true
      },
      {
        "name": "Coplanarity",
        "avg": 5.2,
        "max": 7.8,
        "usl": 10.0,
        "zScore": 1.85,
        "isError": false
      }
    ]
  }
}
```

## 2. 수율 및 SPC 추이 (SPC Trend)

 : 최근 가동된 LOT들의 수율과 해당 라인의 평균 수율, 
  LCL(관리 하한선)을 비교하는 꺾은선 차트용 데이터입니다.

**Method / URI: `GET /api/v1/equipments/{equipmentId}/spc-trend`

Request Query: `limit=7` (최근 몇 개의 LOT을 볼 것인지)
Response (JSON):**

```json
{
  "success": true,
  "data": [
    { "lot": "L-01", "yield": 98.5, "lineAvg": 97.2, "lcl": 96.0 },
    { "lot": "L-05", "yield": 94.2, "lineAvg": 97.6, "lcl": 96.0 },
    { "lot": "L-06", "yield": 92.1, "lineAvg": 97.5, "lcl": 96.0 }
    // ...
  ]
}
```

## 3. 결함 히트맵 좌표 데이터 (Defect Heatmap)

 : 웨이퍼 상의 불량 위치를 점(Dot)으로 찍고,
 어느 쪽에 불량이 집중되었는지 AI가 요약한 패턴 이름을 던져주는 API입니다.

**Method / URI:** `GET /api/v1/equipments/{equipmentId}/heatmap`

**Response (JSON):**

```json
{
  "success": true,
  "data": {
    "patternName": "우측 하단 집중",
    "points": [
      { "x": 65, "y": 70, "type": "chipping" },
      { "x": 72, "y": 75, "type": "chipping" },
      { "x": 30, "y": 40, "type": "other" },
      // ...
    ]
  }
}
```

## 4. 최근 조치 내역 타임라인 (Action History)

 : 가장 하단에 위치한 미조치 경보 및 과거 엔지니어 조치 이력 리스트입니다. 
최신순(내림차순)으로 정렬되어야 합니다.

**Method / URI:** `GET /api/v1/equipments/{equipmentId}/history`

**Response (JSON):**

```json
{
  "success": true,
  "data": [
    {
      "id": "H-001",
      "status": "unresolved", // 미조치
      "time": "14:00 (현재)",
      "title": "Chipping 한계치 초과 발생",
      "description": "현재 장비 정지(Down) 상태. 블레이드 교체 대기 중.",
      "worker": null,
      "yieldChange": null
    },
    {
      "id": "H-002",
      "status": "resolved", // 조치 완료
      "time": "10:48",
      "title": "Z축 얼라인먼트 재보정",
      "description": "자재 대기 중 센서 오염 확인 후 클리닝 및 Z축 0점 세팅 완료.",
      "worker": "김엔지니어",
      "yieldChange": {
        "before": 92.1,
        "after": 98.5
      }
    }
  ]
}
```

# 📡 API 명세서: 
                 종합 데이터 요약 리포트 (Report Generator)

## **[공통 요청 파라미터 (Query Parameters)]**

리포트 컨트롤 패널에서 선택한 설정값들을 서버로 보냅니다.

- `startDate` (String): 조회 시작일 (예: "2026-05-01")
- `endDate` (String): 조회 종료일 (예: "2026-05-06")
- `reportMode` (String): 리포트 종류 (`daily`, `weekly`, `equipment`)
- `equipmentId` (String, Optional): `reportMode`가 `equipment`일 때만 필수 전송 (예: "SAW-EQ.01")

## 1. 리포트 종합 요약 및 AI Insight

 : 1페이지 상단의 KPI 수치와 AI 분석 텍스트, 그리고 3페이지의 AI 추천 Action Plan 텍스트를 한 번에 받아오는 API입니다. 백엔드에서 `reportMode`에 맞춰 텍스트를 완성해서 보내주면 프론트엔드가 매우 가벼워집니다.

**Method / URI: `GET /api/v1/reports/summary`

Request Query: 공통 파라미터 적용**
**Response (JSON):**

```json
{
  "success": true,
  "data": {
    "kpi": {
      "totalProduction": 24563,
      "productionRate": 102.4,
      "yield": 98.7,
      "cpk": 1.52,
      "oee": 87.3,
      "activeAlerts": 4,
      "mtbf": 91.6
    },
    "aiMessage": "금일 주간 가동 결과, 전체 생산량은 목표 대비 102.4%로 초과 달성되었습니다. 다만, SAW-EQ.01 장비에서 패키지 치수 편차가...",
    
    // 🌟 3페이지 상단용 가동 지표 및 타임라인
    "operationTimeline": {
      "runHour": 102.5,     // 총 가동 시간
      "downHour": 3.2,      // 총 비가동 시간
      "mtbf": 42.5,         // 3페이지용 라인/장비별 평균 무고장 시간
      "uph": 2850,          // 시간당 생산량
      "timeline": [         // 타임라인 바 차트를 그리기 위한 상태별 배열
        { "status": "run", "start": "08:00", "end": "10:24", "ratio": 20 },
        { "status": "idle", "start": "10:24", "end": "10:48", "ratio": 5 },
        { "status": "run", "start": "10:48", "end": "14:00", "ratio": 35 },
        { "status": "error", "start": "14:00", "end": "15:12", "ratio": 8 },
        { "status": "run", "start": "15:12", "end": "17:00", "ratio": 32 }
      ]
    },
    
    "actionPlans": [
      {
        "priority": 1,
        "title": "SAW-EQ.01 1번 스핀들 블레이드 즉시 교체",
        "description": "미조치 경보(A-001) 건과 관련하여, 현재 마모도로 보아 방치 시 익일 수율 하락 리스크가 높습니다.",
        "isCritical": true
      },
      {
        "priority": 2,
        "title": "라인 전체 Vision Sensor 렌즈 클리닝",
        "description": "광도 저하 알람 발생 빈도가 증가하고 있습니다.",
        "isCritical": false
      }
    ]
  }
}
```

## 2. 리포트 대상 장비 목록 (Raw Data)

 : 1페이지 하단의 메인 테이블 데이터입니다. `reportMode`가 `equipment`일 때는 1대 분량의 배열만 오고, `daily/weekly`일 때는 전체 장비 리스트가 옵니다. (앞서 만든 장비 현황 API 재사용 가능)

**Method / URI:** `GET /api/v1/reports/equipments`

**Request Query:** 공통 파라미터 적용
Response (JSON):

```json
{
  "success": true,
  "data": [
    {
      "id": "SAW-EQ.01",
      "recipe": "PKG_A12",
      "uptime": 82.5,
      "total": 24500,
      "fail": 850,
      "yield": 95.2,
      "majorDefect": "C-01 (Chipping)",
      "unresolvedAlert": true
    },
    {
      "id": "SAW-EQ.02",
      "recipe": "PKG_B08",
      "uptime": 91.2,
      "total": 22100,
      "fail": 410,
      "yield": 97.4,
      "majorDefect": "L-03 (Contamination)",
      "unresolvedAlert": false
    }
  ]
}
```

## 3. 리포트 품질 및 불량 통계 (Quality & Defects)

 : 2페이지의 주요 불량 유형 파레토(Pareto) 표와 차트를 그리기 위한 API입니다.

- **Method / URI:** `GET /api/v1/reports/defects`
- **Request Query:** 공통 파라미터 적용

Response (JSON):

```json
{
  "success": true,
  "data": [
    {
      "code": "C-01",
      "name": "Chipping (치핑)",
      "type": "공통 불량",
      "count": 342,
      "ratio": "45%",
      "impact": "Package Size (Width/Height) 이상치 발생"
    },
    {
      "code": "B-02",
      "name": "Blade Wear (블레이드 마모)",
      "type": "공통 불량",
      "count": 185,
      "ratio": "24%",
      "impact": "절단면 품질 저하 및 부하 증가"
    }
  ]
}
```

## 4. 품질(Cpk) 분포도 및 AI 치수 분석

- **Method / URI:** `GET /api/v1/reports/quality-distribution`
- **Request Query:** `startDate`, `endDate`, `reportMode`, `equipmentId`(선택)

Response (JSON):

```json
{
  "success": true,
  "data": {
    // 🌟 1. 좌측 KPI 요약 카드 데이터
    "summary": {
      "passRate": 99.2,
      "passRateSub": "목표 99.0% (초과 달성)",
      "cpk": 1.38,
      "cpkSub": "상한계(USL) 방향 편차 발생 중",
      "status": "warning" // 정상(ok), 경고(warning), 위험(danger) 등에 따라 UI 테마 변경용
    },
    
    // 🌟 2. 우측 정규분포(히스토그램) 차트 데이터
    "distributionChart": {
      "guidelines": {
        "lsl": 11.96,       // 규격 하한 (UI 표기용, 생략 시 프론트에서 임의 비율로 선 긋기 가능)
        "target": 12.00,    // 타겟 중앙값
        "usl": 12.04        // 규격 상한
      },
      // 막대 그래프(분포도)를 그리기 위한 10~12개 구간의 빈도수(count)
      "histogram": [
        { "range": "11.96 미만", "count": 10, "isWarning": false },
        { "range": "11.96-11.97", "count": 15, "isWarning": false },
        { "range": "11.97-11.98", "count": 25, "isWarning": false },
        { "range": "11.98-11.99", "count": 45, "isWarning": false },
        { "range": "11.99-12.00", "count": 75, "isWarning": false },
        { "range": "12.00-12.01", "count": 100, "isWarning": false },
        { "range": "12.01-12.02", "count": 85, "isWarning": false },
        { "range": "12.02-12.03", "count": 55, "isWarning": false },
        // isWarning이 true인 구간은 프론트엔드에서 노란색(amber)으로 칠합니다.
        { "range": "12.03-12.04", "count": 30, "isWarning": true },
        { "range": "12.04-12.05", "count": 15, "isWarning": true },
        { "range": "12.05 이상", "count": 8, "isWarning": true }
      ]
    },
    
    // 🌟 3. 하단 AI 치수 이상 원인 추론 박스
    "aiInference": {
      "hasAlert": true, // 알림 박스 표시 여부
      "title": "AI 치수 이상 원인 추론",
      "description": "분석 결과, 현재 생산 중인 LOT의 절단 폭(Width) 데이터가 타겟 중앙값에서 상한계(USL) 측으로 지속 이동(+0.02mm)하고 있습니다. 동일 라인의 과거 학습 데이터와 매칭 시, 이는 블레이드(Blade) 마모로 인한 절단 저항 증가 패턴과 88% 일치합니다. 즉각적인 블레이드 상태 확인을 요합니다."
    }
  }
}
```

## 5. 리포트 경보 이력 (Alarms History)

 : 3페이지의 경보 발생 및 조치 현황 표를 위한 API입니다. 프론트엔드에서 필터링할 필요 없이, 백엔드에서 `reportMode` 조건에 맞게 필터링된 데이터만 넘겨주는 것이 안전합니다.

- **Method / URI:** `GET /api/v1/reports/alarms`
- **Request Query:** 공통 파라미터 적용

Response (JSON):

```json
{
  "success": true,
  "data": [
    {
      "id": "A-001",
      "severity": "Critical",
      "eq": "SAW-EQ.01",
      "message": "Package Width USL 초과 위험",
      "time": "14:23:10",
      "status": "미조치",
      "action": "-",
      "worker": "-"
    },
    {
      "id": "A-002",
      "severity": "Warning",
      "eq": "SAW-EQ.05",
      "message": "Vision Sensor 조명 광도 저하",
      "time": "11:05:42",
      "status": "조치완료",
      "action": "광원 캘리브레이션 재수행",
      "worker": "김엔지"
    }
  ]
}
```

## 6. 웨이퍼 결함 히트맵 및 AI 분석 (Report Heatmap)

- **Method / URI:** `GET /api/v1/reports/heatmap`
- **Request Query:** `startDate`, `endDate`, `reportMode=equipment`, `equipmentId` (예: "SAW-EQ.01")
*(참고: 이 API는 `reportMode`가 `equipment`일 때만 호출되도록 프론트엔드에서 조건부로 요청합니다.)*

Response (JSON):

```json
{
  "success": true,
  "data": {
    "aiAnalysis": {
      "title": "우측 하단 집중 치핑(Chipping) 패턴 감지",
      "description": "비전 검사 데이터 좌표 매핑 결과, 웨이퍼의 4시~5시 방향(Edge 영역)에 결함이 집중되어 있습니다. 이는 대상 설비의 블레이드 장력 저하 및 Z축 미세 진동으로 인한 전형적인 물리적 파손 패턴으로 추정됩니다."
    },
    "visualData": {
      "patternType": "concentrated_bottom_right", 
      "heatArea": {
        "color": "bg-destructive", 
        "positionX": "60%", 
        "positionY": "60%",
        "size": "w-20 h-20"
      },
      "defectPoints": [
        { "x": 65, "y": 70, "type": "chipping", "intensity": "bg-destructive" },
        { "x": 72, "y": 75, "type": "chipping", "intensity": "bg-destructive" },
        { "x": 30, "y": 40, "type": "other", "intensity": "bg-amber-500" }
      ]
    }
  }
}
```