import { apiClient } from "@/api/client";
import { delayForMockData } from "@/api/mockDelay";

import type { EquipmentStatus } from "@/type/equipmentType";
import type { DefectStat } from "@/type/equipmentType";
import type { ReportSummary, QualityDistribution, ReportAlarm, ReportHeatmap } from "@/type/reportType";

// 1. Report Summary Data
export const fetchReportSummary = async (
    startDate: string,
    endDate: string,
    reportMode: "daily" | "weekly" | "equipment",
    equipmentId?: string
): Promise<ReportSummary> => {
    
    await delayForMockData();

    const response = await apiClient.get("/api/v1/reports/summary", {
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

// 2. Report Equipment Data
export const fetchReportEquipments = async (
    startDate: string,
    endDate: string,
    reportMode: "daily" | "weekly" | "equipment",
    equipmentId?: string
): Promise<EquipmentStatus[]> => {
    
    await delayForMockData();

    const response = await apiClient.get("/api/v1/reports/equipments", {
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

// 3. Quality Distribution Data
export const fetchQualityDistribution = async (
    startDate: string,
    endDate: string,
    reportMode: "daily" | "weekly" | "equipment",
    equipmentId?: string
): Promise<QualityDistribution> => {
    
    await delayForMockData();

    const response = await apiClient.get("/api/v1/reports/quality-distribution", {
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

// 4. Report Heat Map data
export const fetchReportHeatmap = async (
    startDate: string,
    endDate: string,
    reportMode: "daily" | "weekly" | "equipment",
    equipmentId?: string
): Promise<ReportHeatmap> => {
    
    await delayForMockData();

    const response = await apiClient.get("/api/v1/reports/heatmap", {
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

// 5. Report Alarm Data
export const fetchReportAlarms = async (
    startDate: string,
    endDate: string,
    reportMode: "daily" | "weekly" | "equipment",
    equipmentId?: string
): Promise<ReportAlarm[]> => {
    
    await delayForMockData();

    const response = await apiClient.get("/api/v1/reports/alarms", {
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

// 6. Report Defect Data
export const fetchReportDefects = async (
    startDate: string,
    endDate: string,
    reportMode: "daily" | "weekly" | "equipment",
    equipmentId?: string
): Promise<DefectStat[]> => {

    await delayForMockData();

    const response = await apiClient.get("/api/v1/reports/defects", {
        params: {
            startDate,
            endDate,
            reportMode,
            ...(reportMode === "equipment" && equipmentId ? { equipmentId } : {})
        }
    });

    if (!response.data || !response.data.data) {
        throw new Error("서버에서 리포트 불량 통계 데이터를 받지 못했습니다.");
    }

    return response.data.data;
};




