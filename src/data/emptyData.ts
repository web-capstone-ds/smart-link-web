import type { DashboardSummaryResponse, TrendData, YieldComparisonData, ParetoData } from "@/type/dashboardType";
import type { DowntimeTrendResponse, MtbfDataPoint, DefectStat, EquipmentStatus } from "@/type/equipmentType";
import type { EquipmentSummary, EquipmentSPCTrend, EquipmentHeatmap, EquipmentHistory } from "@/type/equipmentDetailType";
import type { ReportSummary, QualityDistribution, ReportAlarm, ReportHeatmap } from "@/type/reportType";

export const noDataMessage = "서버가 연동되지 않았거나 조회된 데이터가 없습니다.";

export const emptyDashboardSummary: DashboardSummaryResponse = {
    kpi: {
        totalProduction: 0,
        uph: 0,
        totalYield: 0,
        yieldTrend: 0,
        passRate: 0,
        cpk: 0,
        cpkTrend: 0,
        topDefect: "-",
        availability: 0,
        totalDowntimeMin: 0,
        mtbfHours: 0,
        activeEquipment: 0,
        totalEquipment: 0,
    },
    status: {
        run: 0,
        idle: 0,
        down: 0,
    },
};

export const emptyTrendData: TrendData[] = [];
export const emptyYieldComparisonData: YieldComparisonData[] = [];
export const emptyParetoData: ParetoData[] = [];

export const emptyDowntimeResponse: DowntimeTrendResponse = {
    data: [],
    unit: "hr",
};

export const emptyMtbfData: MtbfDataPoint[] = [];
export const emptyDefectStatsData: DefectStat[] = [];
export const emptyEquipmentStatusData: EquipmentStatus[] = [];

export const emptyEquipmentSummary: EquipmentSummary = {
    info: {
        recipe: "-",
        currentLot: "-",
        status: "No Data",
    },
    aiInsight: {
        title: "데이터 없음",
        description: noDataMessage,
    },
    uptime: {
        totalRate: 0,
        runHour: 0,
        idleHour: 0,
        downHour: 0,
        timeline: [],
    },
    parameters: [],
};

export const emptyEquipmentSPCTrend: EquipmentSPCTrend[] = [];

export const emptyEquipmentHeatmap: EquipmentHeatmap = {
    patternName: "데이터 없음",
    slots: [],
};

export const emptyEquipmentHistory: EquipmentHistory[] = [];

export const emptyReportSummary: ReportSummary = {
    kpi: {
        totalProduction: 0,
        yield: 0,
        cpk: 0,
        availability: 0,
        activeAlerts: 0,
        mtbf: 0,
    },
    aiMessage: noDataMessage,
    operationTimeline: {
        runHour: 0,
        downHour: 0,
        mtbf: 0,
        uph: 0,
        timeline: [],
    },
    actionPlans: [],
};

export const emptyQualityDistribution: QualityDistribution = {
    summary: {
        passRate: 0,
        passRateSub: noDataMessage,
        cpk: 0,
        cpkSub: noDataMessage,
        status: "no-data",
    },
    distributionChart: {
        guidelines: { lsl: 0, target: 0, usl: 0 },
        histogram: [],
    },
    aiInference: {
        hasAlert: false,
        title: "데이터 없음",
        description: noDataMessage,
    },
};

export const emptyReportHeatmap: ReportHeatmap = {
    aiAnalysis: {
        title: "데이터 없음",
        description: noDataMessage,
    },
    slots: [],
};

export const emptyReportAlarms: ReportAlarm[] = [];
