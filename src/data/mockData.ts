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
    { code: "L-03", name: "Lens Contamination", type: "개별 불량", count: 89, ratio: "12%", impact: "비전 인식 오류" },
    { code: "A-04", name: "Alignment Fail", type: "개별 불량", count: 45, ratio: "6%", impact: "자재 정렬 틀어짐" },
];

export const DEFECT_COLORS = ["#f59e0b", "#f97316", "#3b82f6", "#0ea5e9"]; // 파레토 파이 차트 색상

// 4. 장비 개별 데이터
import type { EquipmentStatus } from "@/api/equipment";

// 🌟 장비 상세 리스트 목데이터 (다양한 UI 상태 테스트용)
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
    }
];