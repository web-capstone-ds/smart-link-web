export const trendData = [
  { date: "5/01", production: 3100, yield: 95.1 },
  { date: "5/02", production: 3400, yield: 96.2 },
  { date: "5/03", production: 2800, yield: 93.8 },
  { date: "5/04", production: 3500, yield: 97.1 },
  { date: "5/05", production: 3600, yield: 98.4 },
  { date: "5/06", production: 3900, yield: 99.1 },
];

export const paretoData = [
  { defect: "C-01 (치핑)", count: 342, cumulative: 45 },
  { defect: "B-02 (마모)", count: 185, cumulative: 69 },
  { defect: "L-03 (오염)", count: 89, cumulative: 81 },
  { defect: "A-04 (정렬)", count: 45, cumulative: 87 },
  { defect: "기타", count: 99, cumulative: 100 },
];

export const lineYieldData = [
  { name: "LINE-A", yield: 96.4 },
  { name: "LINE-B", yield: 98.1 },
  { name: "LINE-C", yield: 94.2 },
];

export const equipmentYieldData = [
  { name: "EQ.01", yield: 95.2 },
  { name: "EQ.02", yield: 97.4 },
  { name: "EQ.03", yield: 99.3 },
  { name: "EQ.04", yield: 99.4 },
  { name: "EQ.05", yield: 96.1 },
];

export const statusData = [
  { name: "Run (가동)", value: 84.0, color: "#10b981" },
  { name: "Idle (대기)", value: 11.5, color: "#f59e0b" },
  { name: "Down (정지)", value: 4.5, color: "#ef4444" },
];

// equipment
export const downtimeData = [
    { date: "5/01", hours: 22.5 }, { date: "5/02", hours: 18.2 }, { date: "5/03", hours: 28.5 },
    { date: "5/04", hours: 15.0 }, { date: "5/05", hours: 12.5 }, { date: "5/06", hours: 14.2 },
];

// 2. 신규: 라인별 평균 무고장 시간 (MTBF)
export const mtbfData = [
    { line: "LINE-A", hours: 82 },
    { line: "LINE-B", hours: 115 },
    { line: "LINE-C", hours: 78 },
];

// 3. 주요 불량 코드
export const defectStatsData = [
    { code: "C-01", name: "Chipping (치핑)", type: "공통 불량", count: 342, ratio: "45%", impact: "Package Size 이상치 발생" },
    { code: "B-02", name: "Blade Wear (블레이드 마모)", type: "공통 불량", count: 185, ratio: "24%", impact: "절단면 품질 저하 및 부하" },
    { code: "L-03", name: "Lens Contamination", type: "개별 불량", count: 89, ratio: "12%", impact: "비전 인식 오류" },
    { code: "A-04", name: "Alignment Fail", type: "개별 불량", count: 45, ratio: "6%", impact: "자재 정렬 틀어짐" },
];

export const paretoColors = ["#f59e0b", "#f97316", "#3b82f6", "#0ea5e9"]; // 파레토 파이 차트 색상

// 4. 장비 개별 데이터
export const equipmentComparisonData = [
    { id: "SAW-EQ.01", line: "line-a", recipe: "PKG_A12", uptime: 82.5, total: 24500, fail: 850, marginal: 320, yield: 95.2, majorDefect: "C-01 (Chipping)", unresolvedAlert: true, yieldTrend: [97, 96, 95, 93, 91, 95.2] },
    { id: "SAW-EQ.02", line: "line-a", recipe: "PKG_B08", uptime: 91.2, total: 22100, fail: 410, marginal: 150, yield: 97.4, majorDefect: "L-03 (Lens Contamination)", unresolvedAlert: false, yieldTrend: [96, 97, 97.5, 98, 97.2, 97.4] },
    { id: "SAW-EQ.03", line: "line-b", recipe: "PKG_A12", uptime: 98.5, total: 25600, fail: 120, marginal: 50, yield: 99.3, majorDefect: "B-02 (Blade Wear)", unresolvedAlert: false, yieldTrend: [99, 99.1, 99.2, 99.5, 99.3, 99.3] },
    { id: "SAW-EQ.04", line: "line-b", recipe: "PKG_C15", uptime: 99.1, total: 23800, fail: 95, marginal: 30, yield: 99.4, majorDefect: "-", unresolvedAlert: false, yieldTrend: [98.5, 99, 99.2, 99.4, 99.5, 99.4] },
    { id: "SAW-EQ.05", line: "line-a", recipe: "PKG_A12", uptime: 78.0, total: 21500, fail: 950, marginal: 420, yield: 93.6, majorDefect: "C-01 (Chipping)", unresolvedAlert: true, yieldTrend: [98, 96, 94, 92, 91, 93.6] },
    { id: "SAW-EQ.06", line: "line-c", recipe: "PKG_B08", uptime: 94.2, total: 23100, fail: 310, marginal: 110, yield: 98.1, majorDefect: "A-04 (Alignment Fail)", unresolvedAlert: false, yieldTrend: [97, 97.5, 98, 98.1, 97.9, 98.1] },
    { id: "SAW-EQ.07", line: "line-c", recipe: "PKG_C15", uptime: 97.5, total: 24600, fail: 150, marginal: 60, yield: 99.1, majorDefect: "B-02 (Blade Wear)", unresolvedAlert: false, yieldTrend: [98, 98.5, 99, 99.2, 99.1, 99.1] },
    { id: "SAW-EQ.08", line: "line-b", recipe: "PKG_A12", uptime: 99.5, total: 24800, fail: 80, marginal: 20, yield: 99.6, majorDefect: "-", unresolvedAlert: false, yieldTrend: [99, 99.2, 99.4, 99.5, 99.6, 99.6] },
];