import { useQuery } from "@tanstack/react-query";
import { 
    fetchEquipmentSummary, 
    fetchEquipmentSPCTrend, 
    fetchEquipmentHeatmap, 
    fetchEquipmentHistory, 
    fetchEquipmentDowntimeTrend 
} from "@/api/equipmentDetail";
import { 
    mockEquipmentSummary, 
    mockEquipmentSPCTrend, 
    mockEquipmentHeatmap, 
    mockEquipmentHistory, 
    mockEquipmentDowntimeTrend 
} from "@/data/mockData";

interface UseDetailEquipmentQueriesProps {
    selectedEquipment: string | null;
    targetDate: Date;
    isReady: boolean;
}

export function useDetailEquipmentQueries({ selectedEquipment, targetDate, isReady }: UseDetailEquipmentQueriesProps) {
    
    const isEnabled = !!selectedEquipment;

    const commonOptions = {
        enabled: isEnabled,
        retry: false,
        staleTime: 1000 * 60 * 10,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    };

    // 1. Summary 데이터
    const { data: summaryData, isLoading: isSummaryLoading, isError: isSummaryError } = useQuery({
        queryKey: ["equipmentSummary", selectedEquipment, targetDate],
        queryFn: () => fetchEquipmentSummary(selectedEquipment!, targetDate),
        ...commonOptions,
    });

    // 2. SPC 데이터
    const { data: spcData, isLoading: isSpcLoading, isError: isSpcError } = useQuery({
        queryKey: ["equipmentSPCTrend", selectedEquipment, targetDate],
        queryFn: () => fetchEquipmentSPCTrend(selectedEquipment!, targetDate),
        ...commonOptions,
    });

    // 3. Heatmap 데이터
    const { data: heatmapData, isLoading: isHeatmapLoading, isError: isHeatmapError } = useQuery({
        queryKey: ["equipmentHeatmap", selectedEquipment, targetDate],
        queryFn: () => fetchEquipmentHeatmap(selectedEquipment!, targetDate),
        ...commonOptions,
    });

    // 4. History 데이터
    const { data: historyData, isLoading: isHistoryLoading, isError: isHistoryError } = useQuery({
        queryKey: ["equipmentHistory", selectedEquipment, targetDate],
        queryFn: () => fetchEquipmentHistory(selectedEquipment!, targetDate),
        ...commonOptions,
    });

    // 5. Downtime 트렌드 데이터
    const { data: downtimeTrendData, isLoading: isDowntimeLoading, isError: isDowntimeError } = useQuery({
        queryKey: ["equipmentDetailDowntime", selectedEquipment, targetDate],
        queryFn: () => fetchEquipmentDowntimeTrend(selectedEquipment!, targetDate),
        ...commonOptions,
    });

    // --- 🌟 데이터 안전 가공/방어 레이어 ---
    const safeSummaryData = (isSummaryError || !summaryData) ? mockEquipmentSummary : summaryData;
    const safeSpcData = (isSpcError || !spcData || spcData.length === 0) ? mockEquipmentSPCTrend : spcData;
    const safeHeatmapData = (isHeatmapError || !heatmapData) ? mockEquipmentHeatmap : heatmapData;
    const safeHistoryData = (isHistoryError || !historyData || historyData.length === 0) ? mockEquipmentHistory : historyData;
    const safeDowntimeTrendData = (isDowntimeError || !downtimeTrendData || !downtimeTrendData.data || downtimeTrendData.data.length === 0) 
        ? mockEquipmentDowntimeTrend 
        : downtimeTrendData;

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
        isDowntimeLoading: !isReady || isDowntimeLoading
    };
}