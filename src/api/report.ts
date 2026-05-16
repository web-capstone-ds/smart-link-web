import axios from "axios";

// ==========================================
// 🌟 1. 리포트 종합 요약 데이터 타입 정의
// ==========================================
export interface ReportKPI {
    totalProduction: number;
    yield: number;
    cpk: number;
    availability: number; // 명세 변경: oee -> availability
    activeAlerts: number;
    mtbf: number;
}

export interface ReportTimelineSegment {
    status: "run" | "error" | "idle" | string;
    start: string;
    end: string;
    ratio: number;
}

export interface ReportOperationTimeline {
    runHour: number;
    downHour: number;
    mtbf: number;
    uph: number;
    timeline: ReportTimelineSegment[];
}

export interface ReportActionPlan {
    priority: number;
    title: string;
    description: string;
    isCritical: boolean;
}

export interface ReportSummary {
    kpi: ReportKPI;
    aiMessage: string; // 리포트 전용 RAG 호출 결과 (Cron 캐싱)
    operationTimeline: ReportOperationTimeline;
    actionPlans: ReportActionPlan[];
}

// ==========================================
// 🌟 2. API 호출 함수
// ==========================================
export const fetchReportSummary = async (
    startDate: string,
    endDate: string,
    reportMode: "daily" | "weekly" | "equipment",
    equipmentId?: string // equipment 모드일 때만 필수
): Promise<ReportSummary> => {
    
    // 리포트 페이지 로딩(스켈레톤) 체감을 위한 0.5초 딜레이
    await new Promise(resolve => setTimeout(resolve, 500));

    const response = await axios.get("/api/v1/reports/summary", {
        params: {
            startDate,
            endDate,
            reportMode,
            ...(reportMode === "equipment" && equipmentId ? { equipmentId } : {})
        }
    });

    if (!response.data || !response.data.data) {
        throw new Error("서버에서 리포트 종합 요약 데이터를 받지 못했습니다.");
    }

    return response.data.data;
};

// ==========================================
// 🌟 6-4. 품질(Cpk) 분포도 + AI 치수 분석
// ==========================================
export interface QualityDistribution {
    summary: {
        passRate: number;
        passRateSub: string;
        cpk: number;
        cpkSub: string;
        status: "normal" | "warning" | "critical" | string;
    };
    distributionChart: {
        guidelines: { lsl: number; target: number; usl: number };
        histogram: { range: string; count: number; isWarning: boolean }[];
    };
    aiInference: {
        hasAlert: boolean;
        title: string;
        description: string;
    };
}

export const fetchQualityDistribution = async (
    startDate: string,
    endDate: string,
    reportMode: "daily" | "weekly" | "equipment",
    equipmentId?: string
): Promise<QualityDistribution> => {
    
    await new Promise(resolve => setTimeout(resolve, 300)); // 스켈레톤용 딜레이

    const response = await axios.get("/api/v1/reports/quality-distribution", {
        params: {
            startDate,
            endDate,
            reportMode,
            ...(reportMode === "equipment" && equipmentId ? { equipmentId } : {})
        }
    });

    if (!response.data || !response.data.data) {
        throw new Error("서버에서 품질 분포도 데이터를 받지 못했습니다.");
    }

    return response.data.data;
};

// ==========================================
// 🌟 6-5. 리포트 경보 이력
// ==========================================
export interface ReportAlarm {
    id: string;
    severity: "critical" | "warning" | "info" | string;
    eq: string;
    message: string;
    time: string;
    status: string;
    action: string;
    worker: string;
}

export const fetchReportAlarms = async (
    startDate: string,
    endDate: string,
    reportMode: "daily" | "weekly" | "equipment",
    equipmentId?: string
): Promise<ReportAlarm[]> => {
    
    await new Promise(resolve => setTimeout(resolve, 300));

    const response = await axios.get("/api/v1/reports/alarms", {
        params: {
            startDate,
            endDate,
            reportMode,
            ...(reportMode === "equipment" && equipmentId ? { equipmentId } : {})
        }
    });

    if (!response.data || !response.data.data) {
        throw new Error("서버에서 경보 이력 데이터를 받지 못했습니다.");
    }

    return response.data.data;
};

// ==========================================
// 🌟 6-6. 리포트 슬롯 히트맵 + AI 분석
// ==========================================
// (참고: HeatmapSlot 타입은 기존 5-3의 것을 재사용하거나 새로 정의)
export interface ReportHeatmap {
    aiAnalysis: {
        title: string;
        description: string;
    };
    slots: {
        zAxisNum: number;
        passCount: number;
        failCount: number;
        dominantError: string | null;
        severity: "critical" | "warning" | "info" | "normal" | string;
    }[];
}

export const fetchReportHeatmap = async (
    startDate: string,
    endDate: string,
    reportMode: "daily" | "weekly" | "equipment",
    equipmentId?: string
): Promise<ReportHeatmap> => {
    
    await new Promise(resolve => setTimeout(resolve, 300));

    const response = await axios.get("/api/v1/reports/heatmap", {
        params: {
            startDate,
            endDate,
            reportMode,
            ...(reportMode === "equipment" && equipmentId ? { equipmentId } : {})
        }
    });

    if (!response.data || !response.data.data) {
        throw new Error("서버에서 슬롯 히트맵 데이터를 받지 못했습니다.");
    }

    return response.data.data;
};

// (기존에 선언한 EquipmentStatus 임포트 필요 - 경로에 맞게 수정)
import type { EquipmentStatus } from "./equipment";

// ==========================================
// 🌟 6-2. 리포트 대상 장비 목록 API
// ==========================================
export const fetchReportEquipments = async (
    startDate: string,
    endDate: string,
    reportMode: "daily" | "weekly" | "equipment",
    equipmentId?: string
): Promise<EquipmentStatus[]> => {
    
    await new Promise(resolve => setTimeout(resolve, 300));

    const response = await axios.get("/api/v1/reports/equipments", {
        params: {
            startDate, endDate, reportMode,
            ...(reportMode === "equipment" && equipmentId ? { equipmentId } : {})
        }
    });

    if (!response.data || !response.data.data) {
        throw new Error("서버에서 리포트 장비 목록 데이터를 받지 못했습니다.");
    }

    return response.data.data;
};