import { useQuery } from "@tanstack/react-query";
import {
    fetchEquipmentSummary,
    fetchEquipmentSPCTrend,
    fetchEquipmentHeatmap,
    fetchEquipmentHistory,
    fetchEquipmentDowntimeTrend,
} from "@/api/equipmentDetail";
import {
    mockEquipmentSummary,
    mockEquipmentSPCTrend,
    mockEquipmentHeatmap,
    mockEquipmentHistory,
    mockEquipmentDowntimeTrend,
} from "@/data/mockData";
import {
    emptyDowntimeResponse,
    emptyEquipmentHeatmap,
    emptyEquipmentHistory,
    emptyEquipmentSPCTrend,
    emptyEquipmentSummary,
} from "@/data/emptyData";
import { useAuthStore } from "@/store/useAuthStore";

interface UseDetailEquipmentQueriesProps {
    selectedEquipment: string | null;
    targetDate: Date;
    isReady: boolean;
}

export function useDetailEquipmentQueries({ selectedEquipment, targetDate, isReady }: UseDetailEquipmentQueriesProps) {
    const isEnabled = !!selectedEquipment;
    const useMockData = useAuthStore((state) => state.useMockData);

    const commonOptions = {
        enabled: isEnabled,
        retry: false,
        staleTime: 1000 * 60 * 10,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    };

    const { data: summaryData, isLoading: isSummaryLoading, isError: isSummaryError } = useQuery({
        queryKey: ["equipmentSummary", selectedEquipment, targetDate],
        queryFn: () => fetchEquipmentSummary(selectedEquipment!, targetDate),
        ...commonOptions,
    });

    const { data: spcData, isLoading: isSpcLoading, isError: isSpcError } = useQuery({
        queryKey: ["equipmentSPCTrend", selectedEquipment, targetDate],
        queryFn: () => fetchEquipmentSPCTrend(selectedEquipment!, targetDate),
        ...commonOptions,
    });

    const { data: heatmapData, isLoading: isHeatmapLoading, isError: isHeatmapError } = useQuery({
        queryKey: ["equipmentHeatmap", selectedEquipment, targetDate],
        queryFn: () => fetchEquipmentHeatmap(selectedEquipment!, targetDate),
        ...commonOptions,
    });

    const { data: historyData, isLoading: isHistoryLoading, isError: isHistoryError } = useQuery({
        queryKey: ["equipmentHistory", selectedEquipment, targetDate],
        queryFn: () => fetchEquipmentHistory(selectedEquipment!, targetDate),
        ...commonOptions,
    });

    const { data: downtimeTrendData, isLoading: isDowntimeLoading, isError: isDowntimeError } = useQuery({
        queryKey: ["equipmentDetailDowntime", selectedEquipment, targetDate],
        queryFn: () => fetchEquipmentDowntimeTrend(selectedEquipment!, targetDate),
        ...commonOptions,
    });

    const safeSummaryData = (isSummaryError || !summaryData) ? (useMockData ? mockEquipmentSummary : emptyEquipmentSummary) : summaryData;
    const safeSpcData = (isSpcError || !spcData || spcData.length === 0) ? (useMockData ? mockEquipmentSPCTrend : emptyEquipmentSPCTrend) : spcData;
    const safeHeatmapData = (isHeatmapError || !heatmapData) ? (useMockData ? mockEquipmentHeatmap : emptyEquipmentHeatmap) : heatmapData;
    const safeHistoryData = (isHistoryError || !historyData || historyData.length === 0) ? (useMockData ? mockEquipmentHistory : emptyEquipmentHistory) : historyData;
    const safeDowntimeTrendData = (isDowntimeError || !downtimeTrendData || !downtimeTrendData.data || downtimeTrendData.data.length === 0)
        ? (useMockData ? mockEquipmentDowntimeTrend : emptyDowntimeResponse)
        : downtimeTrendData;

    const isAnyLoading = isSummaryLoading || isSpcLoading || isHeatmapLoading || isHistoryLoading || isDowntimeLoading;
    const hasDataIssue = !useMockData && isReady && !isAnyLoading && (
        isSummaryError || isSpcError || isHeatmapError || isHistoryError || isDowntimeError || !summaryData
    );

    return {
        summaryData: safeSummaryData,
        spcData: safeSpcData,
        heatmapData: safeHeatmapData,
        historyData: safeHistoryData,
        downtimeTrendData: safeDowntimeTrendData,
        isSummaryLoading: !isReady || isSummaryLoading,
        isSpcLoading: !isReady || isSpcLoading,
        isHeatmapLoading: !isReady || isHeatmapLoading,
        isHistoryLoading: !isReady || isHistoryLoading,
        isDowntimeLoading: !isReady || isDowntimeLoading,
        hasDataIssue,
    };
}
