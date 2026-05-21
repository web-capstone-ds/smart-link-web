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