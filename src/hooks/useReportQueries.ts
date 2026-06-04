import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
    fetchReportSummary,
    fetchQualityDistribution,
    fetchReportHeatmap,
    fetchReportAlarms,
    fetchReportEquipments,
    fetchReportDefects,
} from "@/api/report";
import {
    mockReportSummary,
    mockQualityDistribution,
    mockReportHeatmap,
    mockDefectStatsData,
    mockReportAlarms,
    mockEquipmentComparisonData,
} from "@/data/mockData";
import {
    emptyDefectStatsData,
    emptyEquipmentStatusData,
    emptyQualityDistribution,
    emptyReportAlarms,
    emptyReportHeatmap,
    emptyReportSummary,
} from "@/data/emptyData";
import { isDemoMockDateRange } from "@/lib/demoMockDate";
import { useAuthStore } from "@/store/useAuthStore";

interface UseReportQueriesProps {
    appliedDate: DateRange | undefined;
    reportMode: "daily" | "weekly" | "equipment";
    targetEq: string;
}

export function useReportQueries({ appliedDate, reportMode, targetEq }: UseReportQueriesProps) {
    const useMockData = useAuthStore((state) => state.useMockData);
    const forceMockData = isDemoMockDateRange(appliedDate);
    const shouldUseMockData = useMockData || forceMockData;
    const fromStr = appliedDate?.from ? format(appliedDate.from, "yyyy-MM-dd") : "";
    const toStr = appliedDate?.to ? format(appliedDate.to, "yyyy-MM-dd") : fromStr;
    const isEnabled = !!appliedDate?.from && (reportMode !== "equipment" || targetEq.length > 0);

    const commonOptions = {
        enabled: isEnabled && !forceMockData,
        retry: false,
        staleTime: 1000 * 60 * 10,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    };

    const { data: equipmentOptionsData, isLoading: isEquipmentOptionsLoading, isError: isEquipmentOptionsError } = useQuery({
        queryKey: ["reportEquipmentOptions", appliedDate],
        queryFn: () => fetchReportEquipments(fromStr, toStr, "daily"),
        enabled: !!appliedDate?.from && !forceMockData,
        retry: false,
        staleTime: 1000 * 60 * 10,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const { data: reportData, isLoading: isReportLoading, isError: isReportError } = useQuery({
        queryKey: ["reportSummary", appliedDate, reportMode, targetEq],
        queryFn: () => fetchReportSummary(fromStr, toStr, reportMode, targetEq),
        ...commonOptions,
    });

    const { data: qualityData, isLoading: isQualityLoading, isError: isQualityError } = useQuery({
        queryKey: ["reportQuality", appliedDate, reportMode, targetEq],
        queryFn: () => fetchQualityDistribution(fromStr, toStr, reportMode, targetEq),
        ...commonOptions,
    });

    const { data: heatmapData, isLoading: isHeatmapLoading, isError: isHeatmapError } = useQuery({
        queryKey: ["reportHeatmap", appliedDate, reportMode, targetEq],
        queryFn: () => fetchReportHeatmap(fromStr, toStr, reportMode, targetEq),
        ...commonOptions,
        enabled: !!appliedDate?.from && reportMode === "equipment" && targetEq.length > 0 && !forceMockData,
    });

    const { data: defectData, isLoading: isDefectLoading, isError: isDefectError } = useQuery({
        queryKey: ["reportDefects", appliedDate, reportMode, targetEq],
        queryFn: () => fetchReportDefects(fromStr, toStr, reportMode, targetEq),
        ...commonOptions,
    });

    const { data: alarmData, isLoading: isAlarmLoading, isError: isAlarmError } = useQuery({
        queryKey: ["reportAlarms", appliedDate, reportMode, targetEq],
        queryFn: () => fetchReportAlarms(fromStr, toStr, reportMode, targetEq),
        ...commonOptions,
    });

    const { data: equipmentData, isLoading: isEqLoading, isError: isEqError } = useQuery({
        queryKey: ["reportEquipments", appliedDate, reportMode, targetEq],
        queryFn: () => fetchReportEquipments(fromStr, toStr, reportMode, targetEq),
        ...commonOptions,
    });

    const safeReportData = (forceMockData || isReportError || !reportData) ? (shouldUseMockData ? mockReportSummary : emptyReportSummary) : reportData;
    const safeQualityData = (forceMockData || isQualityError || !qualityData) ? (shouldUseMockData ? mockQualityDistribution : emptyQualityDistribution) : qualityData;
    const safeHeatmapData = (forceMockData || isHeatmapError || !heatmapData) ? (shouldUseMockData ? mockReportHeatmap : emptyReportHeatmap) : heatmapData;
    const safeDefectData = (forceMockData || isDefectError || !defectData || defectData.length === 0) ? (shouldUseMockData ? mockDefectStatsData : emptyDefectStatsData) : defectData;
    const safeAlarmData = (forceMockData || isAlarmError || !alarmData) ? (shouldUseMockData ? mockReportAlarms : emptyReportAlarms) : alarmData;
    const safeEquipmentData = (forceMockData || isEqError || !equipmentData) ? (shouldUseMockData ? mockEquipmentComparisonData : emptyEquipmentStatusData) : equipmentData;

    const isAnyLoading = isReportLoading || isQualityLoading || (reportMode === "equipment" && isHeatmapLoading) || isDefectLoading || isAlarmLoading || isEqLoading || isEquipmentOptionsLoading;

    const availableEquipmentIds = (equipmentOptionsData?.length
        ? equipmentOptionsData
        : equipmentData?.length
            ? equipmentData
            : shouldUseMockData
                ? mockEquipmentComparisonData
                : emptyEquipmentStatusData
    ).map((eq) => eq.id);

    const hasDataIssue = !shouldUseMockData && !isAnyLoading && (
        isEquipmentOptionsError || isReportError || isQualityError || isHeatmapError || isDefectError || isAlarmError || isEqError || !reportData
    );

    return {
        safeReportData,
        safeQualityData,
        safeHeatmapData,
        safeDefectData,
        safeAlarmData,
        safeEquipmentData,
        availableEquipmentIds,
        isLoading: isAnyLoading,
        hasDataIssue,
    };
}
