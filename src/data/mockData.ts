// Main Dashboard

// 1. KPI Summary Data
export const mockDashboardSummary = {
    kpi: {
        totalProduction: 24380,
        uph: 2157.4,
        totalYield: 96.8,
        yieldTrend: 0,
        passRate: 96.8,
        cpk: 2.95,
        cpkTrend: 0,
        cpkReliable: true,
        cpkSub: "표본 충분 · dimension_w_mm 기준 Cpk (USL 10.1 / LSL 9.9)",
        topDefect: "SIDE_VISION_FAIL",
        availability: 88.6,
        totalDowntimeMin: 318.6,
        mtbfHours: 8.8,
        activeEquipment: 3,
        totalEquipment: 4
    },
    status : {
        run : 88.6,
        idle: 7.4,
        down: 4.0
    }
};
// 2. Defect Pareto Data
export const mockParetoData = [
  { defectCode: "SIDE_VISION_FAIL", defectName:"SIDE 알고리즘 종합 실패", count: 294, cumulative: 42 },
  { defectCode: "DIMENSION_OUT_OF_SPEC", defectName:"dimension_w_mm 규격 이탈", count: 184, cumulative: 68 },
  { defectCode: "CHIPPING_EXCEED", defectName:"측면 칩핑 기준 초과", count: 132, cumulative: 87 },
  { defectCode: "ET=30", defectName:"이미지 미취득 / CAM_TIMEOUT 전조", count: 91, cumulative: 100 },
];
// 3. Trend Data 
export const mockTrendData = [
  { date: "05-17", production: 860, yield: 95.3 },
  { date: "05-18", production: 910, yield: 95.8 },
  { date: "05-19", production: 780, yield: 94.9 },
  { date: "05-20", production: 835, yield: 95.1 },
  { date: "05-21", production: 920, yield: 96.0 },
  { date: "05-22", production: 745, yield: 94.7 },
  { date: "05-23", production: 890, yield: 95.5 },
  { date: "05-24", production: 810, yield: 95.2 },
  { date: "05-25", production: 875, yield: 95.7 },
  { date: "05-26", production: 925, yield: 96.1 },
  { date: "05-27", production: 790, yield: 94.8 },
  { date: "05-28", production: 880, yield: 95.9 },
  { date: "05-29", production: 845, yield: 95.4 },
  { date: "05-30", production: 865, yield: 95.6 }
];
// 4-1. Line Yield Comparison Data
export const mockLineYieldData = [
  { name: "ae538c3fa024", yield: 98.1 },
  { name: "5f60747251ed", yield: 97.6 },
  { name: "b8f4d2c9a11e", yield: 97.2 },
  { name: "d4a0e8c17b5f", yield: 94.2 },
];
// 4-2. Equipment Yield Comparison Data
export const mockEquipmentYieldData = [
  { name: "LOT#1", yield: 95.2 },
  { name: "LOT#2", yield: 97.4 },
  { name: "LOT#3", yield: 99.3 },
  { name: "LOT#4", yield: 99.4 },
  { name: "LOT#5", yield: 96.1 },
];

// Equipment Dashboard

// 1. Downtime Trend Data (.data)
export const mockDowntimeResponse = {
    success: true,
    unit: "min" as "hr" | "min",
    data: [
        { label: "5/24", value: 188.5 },
        { label: "5/25", value: 162.4 },
        { label: "5/26", value: 231.0 },
        { label: "5/27", value: 194.2 },
        { label: "5/28", value: 207.8 },
        { label: "5/29", value: 151.6 },
        { label: "5/30", value: 318.6 },
    ]
};
// 2. Mtbf Data
import type { MtbfDataPoint } from "@/type/equipmentType"
export const mockMtbfData_All: MtbfDataPoint[] = [
    { name: "ae538c3fa024", hours: 12.8 },
    { name: "5f60747251ed", hours: 10.6 },
    { name: "b8f4d2c9a11e", hours: 7.4 },
    { name: "d4a0e8c17b5f", hours: 4.1 },
]; // ALL
export const mockMtbfData_Single: MtbfDataPoint[] = [
    { name: "05/26", hours: 5.2 },
    { name: "05/27", hours: 4.8 },
    { name: "05/28", hours: 4.1 },
    { name: "05/29", hours: 5.0 },
    { name: "05/30", hours: 8.8 },
]; // Single
// 3. Defects Data + Report Defects Pareto
export const mockDefectStatsData = [
    { code: "SIDE_VISION_FAIL", name: "SIDE 알고리즘 종합 실패", type: "SIDE", count: 294, ratio: "42%", impact: "side_result ET=52 계열 실패 증가" },
    { code: "DIMENSION_OUT_OF_SPEC", name: "dimension_w_mm 규격 이탈", type: "PRS", count: 184, ratio: "26%", impact: "USL 10.1 / LSL 9.9 기준 산포 확인 필요" },
    { code: "CHIPPING_EXCEED", name: "측면 칩핑 기준 초과", type: "SIDE", count: 132, ratio: "19%", impact: "블레이드 마모 또는 진공 흡착 불안정 가능" },
    { code: "ET=30", name: "이미지 미취득", type: "CAMERA", count: 91, ratio: "13%", impact: "CAM_TIMEOUT_ERR 전조. GrabLink dequeue timeout 확인" },
];
export const DEFECT_COLORS = ["#f59e0b", "#f97316", "#3b82f6", "#0ea5e9"]; // Pareto Pie Chart Color
// 4. Equipment Status Data + Report Equipment Table
import type { EquipmentStatus } from "@/type/equipmentType";
export const mockEquipmentComparisonData: EquipmentStatus[] = [
    {
        id: "ae538c3fa024",
        recipe: "RCP-fc12a043",
        uptime: 98.4,
        total: 7420,
        fail: 141,
        marginal: 42,
        yield: 98.1,
        majorDefect: "SIDE_VISION_FAIL",
        unresolvedAlert: false,
        yieldTrend: [97.6, 97.8, 98.0, 98.1, 98.2, 98.1]
    },
    {
        id: "5f60747251ed",
        recipe: "RCP-9a17dbbc",
        uptime: 96.8,
        total: 6820,
        fail: 164,
        marginal: 42,
        yield: 97.6,
        majorDefect: "DIMENSION_OUT_OF_SPEC",
        unresolvedAlert: false,
        yieldTrend: [97.0, 97.2, 97.4, 97.5, 97.7, 97.6]
    },
    {
        id: "b8f4d2c9a11e",
        recipe: "RCP-0f55d0d4",
        uptime: 93.2,
        total: 5140,
        fail: 144,
        marginal: 58,
        yield: 97.2,
        majorDefect: "ET=30",
        unresolvedAlert: false,
        yieldTrend: [97.8, 97.5, 97.3, 97.0, 97.1, 97.2]
    },
    {
        id: "d4a0e8c17b5f",
        recipe: "RCP-7c76149f",
        uptime: 86.0,
        total: 4980,
        fail: 279,
        marginal: 89,
        yield: 94.2,
        majorDefect: "CAM_TIMEOUT_ERR",
        unresolvedAlert: true,
        unresolvedAlertCount: 2,
        yieldTrend: [96.0, 95.5, 95.0, 94.5, 94.0, 94.2]
    }
];

// Equipment Detail Dashboard

// 1. Equipment Summary Data
import type { EquipmentSummary } from "@/type/equipmentDetailType";
export const mockEquipmentSummary: EquipmentSummary = {
    info: {
        recipe: "RCP-7c76149f",
        currentLot: "d4a0e8c1",
        status: "Critical"
    },
    aiInsight: {
        title: "CAM_TIMEOUT_ERR 및 EAP_DISCONNECTED 연쇄 감지",
        description: "ET=30 이미지 미취득 발생 후 GrabLinkGrabber dequeue timeout이 반복되었습니다. EAP process terminated unexpectedly 이력이 있어 카메라 Grabber와 EAP 프로세스 상태를 우선 확인하십시오."
    },
    uptime: {
        totalRate: 86.0,
        runHour: 20.6,
        idleHour: 1.8,
        downHour: 1.6,
        timeline: [
            { status: "run", start: "00:00", end: "20:38", ratio: 86.0 },
            { status: "idle", start: "20:38", end: "22:24", ratio: 7.4 },
            { status: "error", start: "22:24", end: "24:00", ratio: 6.6 }
        ]
    },
    parameters: [
        {
            name: "dimension_w_mm",
            avg: 10.04,
            max: 10.12,
            usl: 10.1,
            zScore: 2.18,
            isError: true
        },
        {
            name: "camera_dequeue_timeout_ms",
            avg: 1530,
            max: 5000,
            usl: 3000,
            zScore: 3.88,
            isError: true
        }
    ]
};
// 2. Equipment Down Time Trend Data
import type { DowntimeTrendResponse } from "@/type/equipmentType";
export const mockEquipmentDowntimeTrend: DowntimeTrendResponse = {
    unit: "min",
    data: [
        { label: "05/24", value: 48.5 },
        { label: "05/25", value: 62.4 },
        { label: "05/26", value: 91.0 },
        { label: "05/27", value: 74.2 },
        { label: "05/28", value: 107.8 },
        { label: "05/29", value: 85.6 },
        { label: "05/30", value: 96.0 },
    ]
};
// 3. SPC Trend Data
export const mockEquipmentSPCTrend = [
    { lot: "d4a0e8c1", yield: 96.0, equipAvg: 96.8, lcl: 95.0 },
    { lot: "7c76149f", yield: 95.5, equipAvg: 96.6, lcl: 95.0 },
    { lot: "e090493f", yield: 95.0, equipAvg: 96.3, lcl: 95.0 },
    { lot: "f5f8890a", yield: 94.5, equipAvg: 96.0, lcl: 95.0 },
    { lot: "f24fd4c2", yield: 94.0, equipAvg: 95.8, lcl: 95.0 },
    { lot: "8b7a8b4c", yield: 94.1, equipAvg: 95.5, lcl: 95.0 },
    { lot: "6f1be924", yield: 94.2, equipAvg: 95.3, lcl: 95.0 },
];
// 4. Heatmap Data
import type { EquipmentHeatmap } from "@/type/equipmentDetailType";
export const mockEquipmentHeatmap: EquipmentHeatmap = {
    patternName: "CAM_TIMEOUT_ERR 및 ET=30 집중",
    slots: [
        { zAxisNum: 0, passCount: 245, failCount: 6, dominantError: "SIDE_VISION_FAIL", severity: "normal" },
        { zAxisNum: 1, passCount: 240, failCount: 9, dominantError: "DIMENSION_OUT_OF_SPEC", severity: "warning" },
        { zAxisNum: 2, passCount: 252, failCount: 5, dominantError: null, severity: "normal" },
        { zAxisNum: 3, passCount: 249, failCount: 11, dominantError: "CHIPPING_EXCEED", severity: "warning" },
        { zAxisNum: 4, passCount: 241, failCount: 18, dominantError: "ET=30", severity: "warning" },
        { zAxisNum: 5, passCount: 238, failCount: 36, dominantError: "ET=30", severity: "warning" },
        { zAxisNum: 6, passCount: 120, failCount: 72, dominantError: "ET=30", severity: "critical" },
        { zAxisNum: 7, passCount: 115, failCount: 84, dominantError: "CAM_TIMEOUT_ERR", severity: "critical" }
    ]
};
// 5. History Data
import type { EquipmentHistory } from "@/type/equipmentDetailType";
export const mockEquipmentHistory: EquipmentHistory[] = [
    {
        id: "H-001",
        status: "unresolved",
        time: "14:31:56.033",
        title: "CAM_TIMEOUT_ERR 경보 발생",
        description: "GrabLinkGrabber failed to dequeue image within timeout. CancellationToken triggered. (GVisionWpf.Cameras.Grabber.GrabLinkGrabber:58 -> CameraBase.cs:97)",
        worker: null,
        yieldChange: null
    },
    {
        id: "H-002",
        status: "unresolved",
        time: "14:30:11.904",
        title: "EAP_DISCONNECTED 경보 발생",
        description: "EAP process terminated unexpectedly.",
        worker: null,
        yieldChange: null
    },
    {
        id: "H-003",
        status: "resolved",
        time: "14:24:02.118",
        title: "ET=30 연속 발생 확인",
        description: "INSPECTION_RESULT에서 ET=30이 연속 검출되어 카메라 acquisition timeout 전조로 분류했습니다.",
        worker: "김엔지니어",
        yieldChange: { before: 94.8, after: 95.6 }
    },
    {
        id: "H-004",
        status: "resolved",
        time: "13:48:35.440",
        title: "SIDE_VISION_FAIL 증가 확인",
        description: "SIDE 알고리즘 종합 실패가 동일 recipe에서 반복되어 기준 이미지와 조명 조건을 재확인했습니다.",
        worker: "이엔지니어",
        yieldChange: { before: 95.1, after: 95.6 }
    },
    {
        id: "H-005",
        status: "resolved",
        time: "12:15:09.732",
        title: "DIMENSION_OUT_OF_SPEC 샘플 확인",
        description: "dimension_w_mm 측정값을 USL 10.1 / LSL 9.9 기준으로 재검증했습니다.",
        worker: "최엔지니어",
        yieldChange: { before: 95.4, after: 95.6 }
    },
    {
        id: "H-006",
        status: "resolved",
        time: "11:42:18.208",
        title: "CHIPPING_EXCEED 발생 LOT 격리",
        description: "측면 칩핑 기준 초과 LOT를 분리하고 블레이드 사용 시간과 척 진공 압력을 확인했습니다.",
        worker: "정엔지니어",
        yieldChange: { before: 95.0, after: 95.5 }
    },
    {
        id: "H-007",
        status: "unresolved",
        time: "10:28:44.551",
        title: "Grabber queue 지연 재현 필요",
        description: "CAM_TIMEOUT_ERR 복구 후에도 intermittent dequeue delay가 관찰되어 GrabLink 설정 재확인이 필요합니다.",
        worker: null,
        yieldChange: null
    },
    {
        id: "H-008",
        status: "resolved",
        time: "09:16:02.774",
        title: "EAP 프로세스 재기동",
        description: "EAP process terminated unexpectedly 이후 프로세스 재기동 및 retained alarm 상태를 확인했습니다.",
        worker: "박엔지니어",
        yieldChange: null
    },
    {
        id: "H-009",
        status: "resolved",
        time: "08:03:27.012",
        title: "카메라 연결 상태 점검",
        description: "CameraBase timeout 이후 케이블 연결과 GrabLink board 상태를 점검했습니다.",
        worker: "김엔지니어",
        yieldChange: null
    },
    {
        id: "H-010",
        status: "unresolved",
        time: "07:41:50.665",
        title: "ET=30 발생률 추적 필요",
        description: "PRS/SIDE ET=30 발생률이 기준보다 높아 CAM_TIMEOUT_ERR 재발 가능성을 모니터링해야 합니다.",
        worker: null,
        yieldChange: null
    }
];

// Daily Report

// 1. Report Summary Data
import type { ReportSummary } from "@/type/reportType";
export const mockReportSummary: ReportSummary = {
    kpi: {
        totalProduction: 48620,
        yield: 96.2,
        cpk: 2.95,
        cpkTrend: 0,
        cpkReliable: true,
        cpkSub: "표본 충분 · dimension_w_mm 기준 Cpk (USL 10.1 / LSL 9.9)",
        availability: 92.8,
        activeAlerts: 4,
        mtbf: 8.8
    },
    aiMessage: "금일 생산량은 48,620 EA, 종합 수율은 96.2%입니다. 가동률은 92.8%로 안정권에 진입했지만 비가동 시간이 318.6분 발생했습니다. SIDE_VISION_FAIL과 ET=30 계열 이벤트, CAM_TIMEOUT_ERR 및 EAP_DISCONNECTED 조치 여부를 우선 확인해야 합니다.",
    operationTimeline: {
        runHour: 22.3,
        downHour: 0.9,
        mtbf: 8.8,
        uph: 4314.8,
        timeline: [
            { status: "run", start: "00:00", end: "22:16", ratio: 92.8 },
            { status: "idle", start: "22:16", end: "23:08", ratio: 3.6 },
            { status: "error", start: "23:08", end: "24:00", ratio: 3.6 }
        ]
    },
    actionPlans: [
        {
            priority: 1,
            title: "CAM_TIMEOUT_ERR 미조치 확인",
            description: "GrabLinkGrabber dequeue timeout과 CameraBase timeout 경로를 확인하고 카메라 acquisition 재발 여부를 점검.",
            isCritical: true
        },
        {
            priority: 2,
            title: "EAP_DISCONNECTED 원인 확인",
            description: "EAP process terminated unexpectedly 이후 프로세스 재기동 로그와 Will 메시지 상태를 확인.",
            isCritical: true
        },
        {
            priority: 3,
            title: "SIDE_VISION_FAIL 샘플 재검증",
            description: "SIDE 알고리즘 종합 실패가 집중된 LOT의 기준 이미지와 조명 조건을 재확인.",
            isCritical: false
        },
        {
            priority: 4,
            title: "dimension_w_mm Cpk 기록 보존",
            description: "Cpk 2.95로 우수 상태이나 DIMENSION_OUT_OF_SPEC 샘플과 USL/LSL 기준 계산 근거를 함께 보존.",
            isCritical: false
        }
    ]
};
// 2. Quality Distribution Data
import type { QualityDistribution } from "@/type/reportType";
export const mockQualityDistribution: QualityDistribution = {
    summary: {
        passRate: 96.2,
        passRateSub: "W/H 치수 합격률 96.2%",
        cpk: 2.95,
        cpkSub: "표본 충분 · dimension_w_mm 기준 Cpk (USL 10.1 / LSL 9.9)",
        status: "normal",
        cpkReliable: true
    },
    distributionChart: {
        guidelines: { lsl: 9.9, target: 10.0, usl: 10.1 },
        histogram: [
            { range: "9.90 미만", count: 8, isWarning: true },
            { range: "9.90-9.97", count: 72, isWarning: false },
            { range: "9.97-10.03", count: 420, isWarning: false },
            { range: "10.03-10.10", count: 91, isWarning: false },
            { range: "10.10 초과", count: 10, isWarning: true }
        ]
    },
    aiInference: {
        hasAlert: true,
        title: "dimension_w_mm 공정능력 우수, 카메라 계열 알람 우선",
        description: "dimension_w_mm 기준 Cpk는 2.95로 Excellent 상태입니다. 품질 산포보다는 SIDE_VISION_FAIL, ET=30, CAM_TIMEOUT_ERR 계열의 이미지 취득 실패가 수율과 가동률 저하에 더 큰 영향을 준 것으로 추정됩니다."
    }
};
// 3. Report Heat Map data
import type { ReportHeatmap } from "@/type/reportType";
export const mockReportHeatmap: ReportHeatmap = {
    aiAnalysis: {
        title: "ET=30 및 SIDE_VISION_FAIL 집중 패턴 감지",
        description: "비전 검사 데이터 분석 결과, 슬롯 5~7에 ET=30 및 SIDE_VISION_FAIL이 집중되어 있습니다. CAM_TIMEOUT_ERR와 연관된 GrabLink dequeue timeout 경로를 우선 점검하십시오."
    },
    slots: [
        { zAxisNum: 0, passCount: 245, failCount: 8, dominantError: "SIDE_VISION_FAIL", severity: "warning" },
        { zAxisNum: 1, passCount: 240, failCount: 12, dominantError: "DIMENSION_OUT_OF_SPEC", severity: "warning" },
        { zAxisNum: 2, passCount: 252, failCount: 4, dominantError: null, severity: "info" },
        { zAxisNum: 3, passCount: 249, failCount: 6, dominantError: "CHIPPING_EXCEED", severity: "info" },
        { zAxisNum: 4, passCount: 241, failCount: 10, dominantError: "SIDE_VISION_FAIL", severity: "warning" },
        { zAxisNum: 5, passCount: 238, failCount: 14, dominantError: "ET=30", severity: "warning" },
        { zAxisNum: 6, passCount: 120, failCount: 86, dominantError: "ET=30", severity: "critical" },
        { zAxisNum: 7, passCount: 115, failCount: 92, dominantError: "CAM_TIMEOUT_ERR", severity: "critical" }
    ]
};
// 4. Report Alarm Data
import type { ReportAlarm } from "@/type/reportType";
export const mockReportAlarms: ReportAlarm[] = [
    {
        id: "A-001",
        severity: "critical",
        eq: "ae538c3fa024",
        message: "CAM_TIMEOUT_ERR 경보 발생. GrabLinkGrabber failed to dequeue image within timeout.",
        time: "14:31:56.033",
        status: "미조치",
        action: "-",
        worker: "-"
    },
    {
        id: "A-002",
        severity: "critical",
        eq: "ae538c3fa024",
        message: "EAP_DISCONNECTED 경보 발생. EAP process terminated unexpectedly.",
        time: "14:30:11.904",
        status: "미조치",
        action: "-",
        worker: "-"
    },
    {
        id: "A-003",
        severity: "warning",
        eq: "b8f4d2c9a11e",
        message: "ET=30 연속 발생. 이미지 미취득 및 CAM_TIMEOUT 전조 감지",
        time: "14:24:02.118",
        status: "조치완료",
        action: "INSPECTION_RESULT ET=30 연속 검출 확인",
        worker: "김엔지니어"
    },
    {
        id: "A-004",
        severity: "warning",
        eq: "ae538c3fa024",
        message: "SIDE_VISION_FAIL 증가. SIDE 알고리즘 종합 실패 반복",
        time: "13:48:35.440",
        status: "조치완료",
        action: "기준 이미지 및 조명 조건 재확인",
        worker: "이엔지니어"
    },
    {
        id: "A-005",
        severity: "warning",
        eq: "5f60747251ed",
        message: "DIMENSION_OUT_OF_SPEC 샘플 확인. dimension_w_mm 규격 재검증",
        time: "12:15:09.732",
        status: "조치완료",
        action: "USL 10.1 / LSL 9.9 기준 측정값 재검증",
        worker: "최엔지니어"
    },
    {
        id: "A-006",
        severity: "warning",
        eq: "d4a0e8c17b5f",
        message: "CHIPPING_EXCEED 발생 LOT 격리",
        time: "11:42:18.208",
        status: "조치완료",
        action: "블레이드 사용 시간 및 척 진공 압력 확인",
        worker: "정엔지니어"
    },
    {
        id: "A-007",
        severity: "warning",
        eq: "ae538c3fa024",
        message: "Grabber queue 지연 재현 필요",
        time: "10:28:44.551",
        status: "미조치",
        action: "-",
        worker: "-"
    },
    {
        id: "A-008",
        severity: "critical",
        eq: "ae538c3fa024",
        message: "EAP 프로세스 재기동 및 retained alarm 상태 확인",
        time: "09:16:02.774",
        status: "조치완료",
        action: "EAP process restart 및 Will 상태 확인",
        worker: "박엔지니어"
    },
    {
        id: "A-009",
        severity: "info",
        eq: "ae538c3fa024",
        message: "CameraBase timeout 이후 카메라 연결 상태 점검",
        time: "08:03:27.012",
        status: "조치완료",
        action: "케이블 연결 및 GrabLink board 상태 확인",
        worker: "김엔지니어"
    },
    {
        id: "A-010",
        severity: "warning",
        eq: "b8f4d2c9a11e",
        message: "PRS/SIDE ET=30 발생률 기준 초과 모니터링 필요",
        time: "07:41:50.665",
        status: "미조치",
        action: "-",
        worker: "-"
    }
];
