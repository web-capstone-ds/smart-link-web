import type { MtbfDataPoint } from "@/api/equipment"

export const dashboardSummary = {
  kpi: {
    totalProduction: 24563,
    uph: 2850,
    totalYield: 96.4,
    yieldTrend: -0.8,
    passRate: 98.7,
    cpk: 1.52,
    cpkTrend: 0.04,
    topDefect: "C-01",
    availability: 87.3,
    totalDowntimeMin: 257,
    mtbfHours: 12.5,
    activeEquipment: 4,
    totalEquipment: 5
  },
  status : {
    run : 84.0,
    idle: 11.5,
    down: 4.5
  }
};

export const trendData = [
  { date: "05-01", production: 3100, yield: 95.1 },
  { date: "05-02", production: 3400, yield: 96.2 },
  { date: "05-03", production: 2800, yield: 93.8 },
  { date: "05-04", production: 3500, yield: 97.1 },
  { date: "05-05", production: 3600, yield: 98.4 },
  { date: "05-06", production: 3900, yield: 99.1 },
  { date: "05-07", production: 3400, yield: 96.1 }
];

export const paretoData = [
  { defectCode: "C-01", defectName:"치핑", count: 342, cumulative: 45 },
  { defectCode: "B-01", defectName:"마모", count: 185, cumulative: 69 },
  { defectCode: "E-01", defectName:"오염", count: 89, cumulative: 81 },
  { defectCode: "F-01", defectName:"절단", count: 45, cumulative: 87 },
  { defectCode: "G-01", defectName:"기타", count: 99, cumulative: 100 },
];

export const lineYieldData = [
  { name: "DS-VIS-001", yield: 96.4 },
  { name: "DS-VIS-002", yield: 98.1 },
  { name: "DS-VIS-003", yield: 94.2 },
];

export const equipmentYieldData = [
  { name: "LOT#1", yield: 95.2 },
  { name: "LOT#2", yield: 97.4 },
  { name: "LOT#3", yield: 99.3 },
  { name: "LOT#4", yield: 99.4 },
  { name: "LOT#5", yield: 96.1 },
];


// equipment
export const downtimeResponse = {
    success: true,
    unit: "hr" as "hr" | "min",
    data: [
        { label: "5/01", value: 22.5 }, 
        { label: "5/02", value: 18.2 }, 
        { label: "5/03", value: 28.5 },
        { label: "5/04", value: 15.0 }, 
        { label: "5/05", value: 12.5 }, 
        { label: "5/06", value: 14.2 },
    ]
};

// 🌟 1. 전체 장비 조회 시 목데이터 (name = 장비명)
export const mockMtbfData_All: MtbfDataPoint[] = [
    { name: "DS-VIS-001", hours: 82 },
    { name: "DS-VIS-002", hours: 115 },
    { name: "DS-VIS-003", hours: 76 },
    { name: "DS-VIS-004", hours: 94 },
];

// 🌟 2. 특정 장비 조회 시 목데이터 (name = 날짜)
export const mockMtbfData_Single: MtbfDataPoint[] = [
    { name: "05/01", hours: 45 },
    { name: "05/02", hours: 52 },
    { name: "05/03", hours: 48 },
    { name: "05/04", hours: 61 },
    { name: "05/05", hours: 55 },
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