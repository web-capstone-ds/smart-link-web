export interface EquipmentSummaryInfo {
    recipe: string;
    currentLot: string;
    status: "Normal" | "Warning" | "Critical" | string;
}

export interface AIInsight {
    title: string;
    description: string;
}

export interface UptimeTimeline {
    status: "run" | "idle" | "error";
    start: string;
    end: string;
    ratio: number;
}

export interface EquipmentUptime {
    totalRate: number;
    runHour: number;
    idleHour: number;
    downHour: number;
    timeline: UptimeTimeline[];
}

export interface EquipmentParameter {
    name: string;
    avg: number;
    max: number;
    usl: number;
    zScore: number;
    isError: boolean;
}

export interface EquipmentSummary {
    info: EquipmentSummaryInfo;
    aiInsight: AIInsight;
    uptime: EquipmentUptime;
    parameters: EquipmentParameter[];
}

export interface EquipmentSPCTrend {
    lot: string;         
    yield: number;       
    equipAvg: number;    
    lcl: number;         
}

export interface HeatmapSlot {
    zAxisNum: number;          // 0 ~ 7 슬롯 번호
    passCount: number;         // 양품 수
    failCount: number;         // 불량 수
    dominantError: string | null; // 가장 많이 발생한 에러 코드 (예: "ET=12")
    severity?: "critical" | "warning" | "normal" | string; // 위험도 등급
}

export interface EquipmentHeatmap {
    patternName: string;       // AI가 분석한 패턴명
    slots: HeatmapSlot[];      // 8개 슬롯 데이터 배열
}

export interface YieldChange {
    before: number;
    after: number;
}

export interface EquipmentHistory {
    id: string;
    status: "unresolved" | "resolved" | string;
    time: string;
    title: string;
    description: string;
    worker: string | null;
    yieldChange: YieldChange | null;
}