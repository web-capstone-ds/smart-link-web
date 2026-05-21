// Main Dashboard

// 1. KPI Summary Data
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
// 2. Defect Pareto Data
export const paretoData = [
  { defectCode: "C-01", defectName:"치핑", count: 342, cumulative: 45 },
  { defectCode: "B-01", defectName:"마모", count: 185, cumulative: 69 },
  { defectCode: "E-01", defectName:"오염", count: 89, cumulative: 81 },
  { defectCode: "F-01", defectName:"절단", count: 45, cumulative: 87 },
  { defectCode: "G-01", defectName:"기타", count: 99, cumulative: 100 },
];
// 3. Trend Data 
export const trendData = [
  { date: "05-01", production: 3100, yield: 95.1 },
  { date: "05-02", production: 3400, yield: 96.2 },
  { date: "05-03", production: 2800, yield: 93.8 },
  { date: "05-04", production: 3500, yield: 97.1 },
  { date: "05-05", production: 3600, yield: 98.4 },
  { date: "05-06", production: 3900, yield: 99.1 },
  { date: "05-07", production: 3400, yield: 96.1 }
];
// 4-1. Line Yield Comparison Data
export const lineYieldData = [
  { name: "DS-VIS-001", yield: 96.4 },
  { name: "DS-VIS-002", yield: 98.1 },
  { name: "DS-VIS-003", yield: 94.2 },
];
// 4-2. Equipment Yield Comparison Data
export const equipmentYieldData = [
  { name: "LOT#1", yield: 95.2 },
  { name: "LOT#2", yield: 97.4 },
  { name: "LOT#3", yield: 99.3 },
  { name: "LOT#4", yield: 99.4 },
  { name: "LOT#5", yield: 96.1 },
];

// Equipment Dashboard

// 1. Downtime Trend Data (.data)
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
// 2. Mtbf Data
import type { MtbfDataPoint } from "@/type/equipmentType"
export const mockMtbfData_All: MtbfDataPoint[] = [
    { name: "DS-VIS-001", hours: 82 },
    { name: "DS-VIS-002", hours: 115 },
    { name: "DS-VIS-003", hours: 76 },
    { name: "DS-VIS-004", hours: 94 },
]; // ALL
export const mockMtbfData_Single: MtbfDataPoint[] = [
    { name: "05/01", hours: 45 },
    { name: "05/02", hours: 52 },
    { name: "05/03", hours: 48 },
    { name: "05/04", hours: 61 },
    { name: "05/05", hours: 55 },
]; // Single
// 3. Defects Data + Report Defects Pareto
export const defectStatsData = [
    { code: "C-01", name: "Chipping (치핑)", type: "공통 불량", count: 342, ratio: "45%", impact: "Package Size 이상치 발생" },
    { code: "B-02", name: "Blade Wear (블레이드 마모)", type: "공통 불량", count: 185, ratio: "24%", impact: "절단면 품질 저하 및 부하" },
    { code: "L-03", name: "Lens Contamination", type: "개별 불량", count: 89, ratio: "12%", impact: "비전 인식 오류" },
    { code: "A-04", name: "Alignment Fail", type: "개별 불량", count: 45, ratio: "6%", impact: "자재 정렬 틀어짐" },
    { code: "L-04", name: "Lens Contamination", type: "개별 불량", count: 89, ratio: "12%", impact: "비전 인식 오류" },
    { code: "A-05", name: "Alignment Fail", type: "개별 불량", count: 45, ratio: "6%", impact: "자재 정렬 틀어짐" },
];
export const DEFECT_COLORS = ["#f59e0b", "#f97316", "#3b82f6", "#0ea5e9"]; // Pareto Pie Chart Color
// 4. Equipment Status Data + Report Equipment Table
import type { EquipmentStatus } from "@/type/equipmentType";
export const equipmentComparisonData: EquipmentStatus[] = [
    { 
        id: "DS-VIS-001", 
        recipe: "PKG_A12", 
        uptime: 82.5,          // 가동률 90 미만 (빨간색)
        total: 24500, 
        fail: 850, 
        marginal: 320, 
        yield: 95.2,           // 수율 97 미만 (빨간색)
        majorDefect: "C-01 (Chipping)", 
        unresolvedAlert: true, // 미조치 경보 발생
        yieldTrend: [97, 96, 95, 93, 91, 95.2] 
    },
    { 
        id: "DS-VIS-002", 
        recipe: "PKG_B05", 
        uptime: 98.2,          // 가동률 우수 (초록색)
        total: 31200, 
        fail: 120, 
        marginal: 85, 
        yield: 99.3,           // 수율 우수 (초록색)
        majorDefect: "-", 
        unresolvedAlert: false, // 정상
        yieldTrend: [99.0, 99.1, 99.5, 99.2, 99.4, 99.3] 
    },
    { 
        id: "DS-VIS-003", 
        recipe: "PKG_A12", 
        uptime: 92.5,          // 가동률 경고 (주황색)
        total: 18400, 
        fail: 450, 
        marginal: 210, 
        yield: 96.4,           // 수율 저하 (빨간색)
        majorDefect: "L-03 (Lens Contamination)", 
        unresolvedAlert: true, 
        yieldTrend: [98.5, 98.0, 97.2, 96.8, 96.0, 96.4] 
    },
    { 
        id: "DS-VIS-004", 
        recipe: "PKG_C01", 
        uptime: 96.5, 
        total: 42000, 
        fail: 310, 
        marginal: 150, 
        yield: 98.9, 
        majorDefect: "B-02 (Blade Wear)", 
        unresolvedAlert: false, 
        yieldTrend: [98.2, 98.5, 98.7, 99.0, 98.8, 98.9] 
    },
    { 
        id: "DS-VIS-005", 
        recipe: "PKG_B05", 
        uptime: 88.0,          // 가동률 90 미만 (빨간색)
        total: 15600, 
        fail: 180, 
        marginal: 95, 
        yield: 98.2, 
        majorDefect: "A-04 (Alignment Fail)", 
        unresolvedAlert: false, 
        yieldTrend: [98.0, 97.5, 98.1, 98.3, 98.0, 98.2] 
    },
    
    { 
        id: "DS-VIS-006", 
        recipe: "PKG_A12", 
        uptime: 82.5,          // 가동률 90 미만 (빨간색)
        total: 24500, 
        fail: 850, 
        marginal: 320, 
        yield: 95.2,           // 수율 97 미만 (빨간색)
        majorDefect: "C-01 (Chipping)", 
        unresolvedAlert: true, // 미조치 경보 발생
        yieldTrend: [97, 96, 95, 93, 91, 95.2] 
    },
    { 
        id: "DS-VIS-007", 
        recipe: "PKG_B05", 
        uptime: 98.2,          // 가동률 우수 (초록색)
        total: 31200, 
        fail: 120, 
        marginal: 85, 
        yield: 99.3,           // 수율 우수 (초록색)
        majorDefect: "-", 
        unresolvedAlert: false, // 정상
        yieldTrend: [99.0, 99.1, 99.5, 99.2, 99.4, 99.3] 
    },
    { 
        id: "DS-VIS-008", 
        recipe: "PKG_A12", 
        uptime: 92.5,          // 가동률 경고 (주황색)
        total: 18400, 
        fail: 450, 
        marginal: 210, 
        yield: 96.4,           // 수율 저하 (빨간색)
        majorDefect: "L-03 (Lens Contamination)", 
        unresolvedAlert: true, 
        yieldTrend: [98.5, 98.0, 97.2, 96.8, 96.0, 96.4] 
    },
    { 
        id: "DS-VIS-009", 
        recipe: "PKG_C01", 
        uptime: 96.5, 
        total: 42000, 
        fail: 310, 
        marginal: 150, 
        yield: 98.9, 
        majorDefect: "B-02 (Blade Wear)", 
        unresolvedAlert: false, 
        yieldTrend: [98.2, 98.5, 98.7, 99.0, 98.8, 98.9] 
    },
    { 
        id: "DS-VIS-010", 
        recipe: "PKG_B05", 
        uptime: 88.0,          // 가동률 90 미만 (빨간색)
        total: 15600, 
        fail: 180, 
        marginal: 95, 
        yield: 98.2, 
        majorDefect: "A-04 (Alignment Fail)", 
        unresolvedAlert: false, 
        yieldTrend: [98.0, 97.5, 98.1, 98.3, 98.0, 98.2] 
    },
    
    { 
        id: "DS-VIS-011", 
        recipe: "PKG_A12", 
        uptime: 92.5,          // 가동률 경고 (주황색)
        total: 18400, 
        fail: 450, 
        marginal: 210, 
        yield: 96.4,           // 수율 저하 (빨간색)
        majorDefect: "L-03 (Lens Contamination)", 
        unresolvedAlert: true, 
        yieldTrend: [98.5, 98.0, 97.2, 96.8, 96.0, 96.4] 
    },
    { 
        id: "DS-VIS-012", 
        recipe: "PKG_C01", 
        uptime: 96.5, 
        total: 42000, 
        fail: 310, 
        marginal: 150, 
        yield: 98.9, 
        majorDefect: "B-02 (Blade Wear)", 
        unresolvedAlert: false, 
        yieldTrend: [98.2, 98.5, 98.7, 99.0, 98.8, 98.9] 
    },
    { 
        id: "DS-VIS-013", 
        recipe: "PKG_B05", 
        uptime: 88.0,          // 가동률 90 미만 (빨간색)
        total: 15600, 
        fail: 180, 
        marginal: 95, 
        yield: 98.2, 
        majorDefect: "A-04 (Alignment Fail)", 
        unresolvedAlert: false, 
        yieldTrend: [98.0, 97.5, 98.1, 98.3, 98.0, 98.2] 
    },
    { 
        id: "DS-VIS-014", 
        recipe: "PKG_A12", 
        uptime: 92.5,          // 가동률 경고 (주황색)
        total: 18400, 
        fail: 450, 
        marginal: 210, 
        yield: 96.4,           // 수율 저하 (빨간색)
        majorDefect: "L-03 (Lens Contamination)", 
        unresolvedAlert: true, 
        yieldTrend: [98.5, 98.0, 97.2, 96.8, 96.0, 96.4] 
    },
    { 
        id: "DS-VIS-015", 
        recipe: "PKG_C01", 
        uptime: 96.5, 
        total: 42000, 
        fail: 310, 
        marginal: 150, 
        yield: 98.9, 
        majorDefect: "B-02 (Blade Wear)", 
        unresolvedAlert: false, 
        yieldTrend: [98.2, 98.5, 98.7, 99.0, 98.8, 98.9] 
    },
    { 
        id: "DS-VIS-017", 
        recipe: "PKG_B05", 
        uptime: 88.0,          // 가동률 90 미만 (빨간색)
        total: 15600, 
        fail: 180, 
        marginal: 95, 
        yield: 98.2, 
        majorDefect: "A-04 (Alignment Fail)", 
        unresolvedAlert: false, 
        yieldTrend: [98.0, 97.5, 98.1, 98.3, 98.0, 98.2] 
    },
    { 
        id: "DS-VIS-016", 
        recipe: "PKG_A12", 
        uptime: 92.5,          // 가동률 경고 (주황색)
        total: 18400, 
        fail: 450, 
        marginal: 210, 
        yield: 96.4,           // 수율 저하 (빨간색)
        majorDefect: "L-03 (Lens Contamination)", 
        unresolvedAlert: true, 
        yieldTrend: [98.5, 98.0, 97.2, 96.8, 96.0, 96.4] 
    },
    { 
        id: "DS-VIS-018", 
        recipe: "PKG_C01", 
        uptime: 96.5, 
        total: 42000, 
        fail: 310, 
        marginal: 150, 
        yield: 98.9, 
        majorDefect: "B-02 (Blade Wear)", 
        unresolvedAlert: false, 
        yieldTrend: [98.2, 98.5, 98.7, 99.0, 98.8, 98.9] 
    },
    { 
        id: "DS-VIS-019", 
        recipe: "PKG_B05", 
        uptime: 88.0,          // 가동률 90 미만 (빨간색)
        total: 15600, 
        fail: 180, 
        marginal: 95, 
        yield: 98.2, 
        majorDefect: "A-04 (Alignment Fail)", 
        unresolvedAlert: false, 
        yieldTrend: [98.0, 97.5, 98.1, 98.3, 98.0, 98.2] 
    }
];

// Equipment Detail Dashboard

// 1. Equipment Summary Data
import type { EquipmentSummary } from "@/type/equipmentDetailType";
export const mockEquipmentSummary: EquipmentSummary = {
    info: {
        recipe: "PKG_DICE_C15",
        currentLot: "a3f2b1c8", // 8자리 해시 적용
        status: "Critical"
    },
    aiInsight: {
        title: "AI 징후 예측 (Pattern Detected)",
        description: "비전 검사 히트맵 분석 결과, 슬롯 6~7에 ET=12 집중 패턴이 발견되었습니다. 해당 구간의 절단 압력 정밀 점검을 권장합니다."
    },
    uptime: {
        totalRate: 82.5,
        runHour: 6.6,
        idleHour: 0.2,
        downHour: 1.2,
        timeline: [
            { status: "run", start: "08:00", end: "10:24", ratio: 30 },
            { status: "idle", start: "10:24", end: "10:48", ratio: 5 },
            { status: "run", start: "10:48", end: "14:00", ratio: 40 },
            { status: "error", start: "14:00", end: "15:12", ratio: 15 },
            { status: "run", start: "15:12", end: "16:00", ratio: 10 }
        ]
    },
    parameters: [
        {
            name: "Chipping_Bottom",
            avg: 12.4,
            max: 28.7,
            usl: 25.0,
            zScore: 3.42,
            isError: true
        },
        {
            name: "Blade_Vibration",
            avg: 0.42,
            max: 0.85,
            usl: 1.20,
            zScore: 1.15,
            isError: false
        }
    ]
};
// 2. Equipment Down Time Trend Data
import type { DowntimeTrendResponse } from "@/type/equipmentType";
export const mockEquipmentDowntimeTrend: DowntimeTrendResponse = {
    unit: "min",
    data: [
        { label: "05/14", value: 45 },  // 🌟 date -> label, downtime -> value 복구
        { label: "05/15", value: 15 },
        { label: "05/16", value: 0 },
        { label: "05/17", value: 120 },
        { label: "05/18", value: 30 },
        { label: "05/19", value: 8 },
        { label: "05/20", value: 55 },
    ]
};
// 3. SPC Trend Data
export const mockEquipmentSPCTrend = [
    { lot: "a3f2b1c8", yield: 98.5, equipAvg: 97.2, lcl: 95.0 },
    { lot: "b7e4d2a1", yield: 98.2, equipAvg: 97.4, lcl: 95.0 },
    { lot: "c9f1a5d3", yield: 97.1, equipAvg: 97.5, lcl: 95.0 },
    { lot: "d2c8b4e6", yield: 96.5, equipAvg: 97.3, lcl: 95.0 },
    { lot: "e5f3a1b7", yield: 94.2, equipAvg: 97.6, lcl: 95.0 }, // 수율 하락 시작
    { lot: "f8d2e4c1", yield: 92.1, equipAvg: 97.5, lcl: 95.0 }, // LCL(하한선) 이탈 - 에러 발생 지점
    { lot: "g1b7a3f2", yield: 98.5, equipAvg: 97.7, lcl: 95.0 }, // 조치 후 회복
];
// 4. Heatmap Data
import type { EquipmentHeatmap } from "@/type/equipmentDetailType";
export const mockEquipmentHeatmap: EquipmentHeatmap = {
    patternName: "슬롯 6~7 ET=12 집중",
    slots: [
        { zAxisNum: 0, passCount: 245, failCount: 3,   dominantError: null, severity: "normal" },
        { zAxisNum: 1, passCount: 240, failCount: 8,   dominantError: "ET=52", severity: "warning" },
        { zAxisNum: 2, passCount: 252, failCount: 0,   dominantError: null, severity: "normal" },
        { zAxisNum: 3, passCount: 249, failCount: 1,   dominantError: null, severity: "normal" },
        { zAxisNum: 4, passCount: 241, failCount: 4,   dominantError: "ET=05", severity: "normal" },
        { zAxisNum: 5, passCount: 238, failCount: 7,   dominantError: "ET=05", severity: "normal" },
        { zAxisNum: 6, passCount: 120, failCount: 128, dominantError: "ET=12", severity: "critical" }, // 명세서 불량 슬롯
        { zAxisNum: 7, passCount: 115, failCount: 133, dominantError: "ET=12", severity: "critical" }  // 명세서 불량 슬롯
    ]
};
// 5. History Data
import type { EquipmentHistory } from "@/type/equipmentDetailType";
export const mockEquipmentHistory: EquipmentHistory[] = [
    {
        id: "H-001",
        status: "unresolved",
        time: "14:00",
        title: "Chipping 한계치 초과 발생",
        description: "현재 장비 정지(Down) 상태. 블레이드 교체 대기 중.",
        worker: null,
        yieldChange: null
    },
    {
        id: "H-002",
        status: "resolved",
        time: "10:48",
        title: "Z축 얼라인먼트 재보정",
        description: "센서 오염 확인 후 클리닝 및 Z축 0점 세팅 완료.",
        worker: "김엔지니어",
        yieldChange: { before: 92.1, after: 98.5 }
    }
];

// Daily Report

// 1. Report Summary Data
import type { ReportSummary } from "@/type/reportType";
export const mockReportSummary: ReportSummary = {
    kpi: {
        totalProduction: 24563,
        yield: 98.7,
        cpk: 1.52,
        availability: 87.3,
        activeAlerts: 4,
        mtbf: 91.6
    },
    aiMessage: "금일 가동 결과, 전체 생산량 24,563 유닛 중 수율 98.7%로 안정적입니다. 다만 DS-VIS-001에서 chipping_bottom 경고가 지속되고 있어 선제적 블레이드 교체를 권장합니다. 전반적인 라인 가동률은 전일 대비 2.1% 상승했습니다.",
    operationTimeline: {
        runHour: 102.5,
        downHour: 3.2,
        mtbf: 42.5,
        uph: 2850,
        timeline: [
            { status: "run", start: "08:00", end: "10:24", ratio: 20 },
            { status: "run", start: "10:24", end: "14:00", ratio: 30 },
            { status: "error", start: "14:00", end: "15:12", ratio: 8 },
            { status: "run", start: "15:12", end: "17:00", ratio: 15 }
        ]
    },
    actionPlans: [
        {
            priority: 1,
            title: "DS-VIS-001 블레이드 상태 점검",
            description: "chipping_bottom 경고 지속. Rule R14 WARNING 구간 진입.",
            isCritical: true
        },
        {
            priority: 2,
            title: "라인 B 세정액 필터 교체",
            description: "수압 저하 징후 포착. 익일 예방 정비 스케줄에 추가 요망.",
            isCritical: false
        }
    ]
};
// 2. Quality Distribution Data
import type { QualityDistribution } from "@/type/reportType";
export const mockQualityDistribution: QualityDistribution = {
    summary: {
        passRate: 99.2,
        passRateSub: "목표 99.0% (초과 달성)",
        cpk: 1.38,
        cpkSub: "상한계(USL) 방향 편차 발생 중",
        status: "warning"
    },
    distributionChart: {
        guidelines: { lsl: 11.96, target: 12.00, usl: 12.04 },
        histogram: [
            { range: "11.96 미만", count: 10, isWarning: false },
            { range: "11.96-11.99", count: 45, isWarning: false },
            { range: "11.99-12.00", count: 75, isWarning: false },
            { range: "12.00-12.04", count: 150, isWarning: false },
            { range: "12.04-12.05", count: 15, isWarning: true }
        ]
    },
    aiInference: {
        hasAlert: true,
        title: "AI 치수 이상 원인 추론",
        description: "분석 결과, 절단 폭(Width)이 USL 방향으로 지속 이동 중입니다. Rule R13 chipping_top WARNING 구간 진입. 블레이드 장력 저하가 의심되므로 점검을 요합니다."
    }
};
// 3. Report Heat Map data
import type { ReportHeatmap } from "@/type/reportType";
export const mockReportHeatmap: ReportHeatmap = {
    aiAnalysis: {
        title: "슬롯 6~7 ET=12 집중 패턴 감지",
        description: "비전 검사 데이터 분석 결과, ZAxisNum 6~7에 ET=12(Chipping) 결함이 집중되어 있습니다. 해당 슬롯의 척(Chuck) 진공 흡착 불량 또는 블레이드 수평 틀어짐을 점검하십시오."
    },
    slots: [
        { zAxisNum: 0, passCount: 245, failCount: 3, dominantError: null, severity: "info" },
        { zAxisNum: 1, passCount: 240, failCount: 8, dominantError: "ET=52", severity: "warning" },
        { zAxisNum: 2, passCount: 250, failCount: 1, dominantError: null, severity: "info" },
        { zAxisNum: 3, passCount: 248, failCount: 2, dominantError: null, severity: "info" },
        { zAxisNum: 4, passCount: 242, failCount: 5, dominantError: "ET=05", severity: "info" },
        { zAxisNum: 5, passCount: 239, failCount: 7, dominantError: "ET=05", severity: "info" },
        { zAxisNum: 6, passCount: 120, failCount: 128, dominantError: "ET=12", severity: "critical" },
        { zAxisNum: 7, passCount: 115, failCount: 133, dominantError: "ET=12", severity: "critical" }
    ]
};
// 4. Report Alarm Data
import type { ReportAlarm } from "@/type/reportType";
export const mockReportAlarms: ReportAlarm[] = [
    {
        id: "A-001",
        severity: "critical",
        eq: "DS-VIS-001",
        message: "chipping_bottom 50μm 초과 (Rule R14 CRITICAL)",
        time: "14:23:10",
        status: "미조치",
        action: "-",
        worker: "-"
    },
    {
        id: "A-002",
        severity: "warning",
        eq: "DS-VIS-002",
        message: "Vision 검사 조명 조도 저하 (Rule R02 WARNING)",
        time: "11:05:22",
        status: "조치완료",
        action: "조명 캘리브레이션",
        worker: "이엔지니어"
    }
];