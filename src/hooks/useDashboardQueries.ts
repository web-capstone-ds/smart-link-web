import { useQuery } from "@tanstack/react-query";
import { 
    fetchDashboardSummary, 
    fetchDashboardTrend, 
    fetchYieldComparison, 
    fetchDefectPareto 
} from "@/api/dashboard";
import { fetchEquipmentStatusList } from "@/api/equipment";
import { 
    mockDashboardSummary, 
    mockTrendData, 
    mockLineYieldData, 
    mockEquipmentYieldData, 
    mockParetoData,
    mockEquipmentComparisonData
} from "@/data/mockData";
import type { DateRange } from "react-day-picker";

interface UseDashboardQueriesProps {
    equipmentParams: string;
    appliedDate: DateRange | undefined;
    trendUnit: "daily" | "weekly";
}

export function useDashboardQueries({ equipmentParams, appliedDate, trendUnit }: UseDashboardQueriesProps) {
    
    const isEnabled = !!appliedDate?.from;

    const commonOptions = {
        enabled: isEnabled,
        retry: false,
        staleTime: 1000 * 60 * 10,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    };

    // 0. 헤더 셀렉트 옵션용 장비 목록 조회
    const { data: eqListForSelect } = useQuery({
        queryKey: ["equipmentListForSelect", appliedDate],
        queryFn: () => fetchEquipmentStatusList("all", appliedDate),
        enabled: isEnabled,
    });

    // 1. KPI & 가동 상태
    const { data: summaryData, isLoading: isSummaryLoading, isError: isSummaryError } = useQuery({
        queryKey: ["dashboardSummary", equipmentParams, appliedDate],
        queryFn: () => fetchDashboardSummary(equipmentParams, appliedDate),
        ...commonOptions,
    });

    // 2. 트렌드 차트
    const { data: trendDataRaw, isFetching: isTrendLoading, isError: isTrendError } = useQuery({
        queryKey: ["dashboardTrend", equipmentParams, appliedDate, trendUnit],
        queryFn: () => fetchDashboardTrend(equipmentParams, appliedDate, trendUnit),
        ...commonOptions,
    });

    // 3. 수율 비교
    const { data: yieldDataRaw, isLoading: isYieldLoading, isError: isYieldError } = useQuery({
        queryKey: ["yieldComparison", equipmentParams, appliedDate],
        queryFn: () => fetchYieldComparison(equipmentParams, appliedDate),
        ...commonOptions,
    });

    // 4. 불량 파레토
    const { data: paretoDataRaw, isLoading: isParetoLoading, isError: isParetoError } = useQuery({
        queryKey: ["defectPareto", equipmentParams, appliedDate],
        queryFn: () => fetchDefectPareto(equipmentParams, appliedDate),
        ...commonOptions,
    });

    // --- 🌟 데이터 방어 가공 레이어 ---
    
    // 장비 리스트 방어
    const availableEquipmentIds = !eqListForSelect || eqListForSelect.length === 0
        ? mockEquipmentComparisonData.map(eq => eq.id)
        : eqListForSelect.map(eq => eq.id);

    // KPI 방어
    const safeSummaryData = (isSummaryError || !summaryData)
        ? { 
            kpi: mockDashboardSummary.kpi, 
            status: mockDashboardSummary.status,
            aiMessage: "서버 연결 오류로 인한 기본 분석 메시지입니다."
          }
        : summaryData;

    // 파이차트용 포맷 정제
    const safeStatusData = [
        { name: "Run (가동)", value: safeSummaryData.status.run, color: "#10b981" },
        { name: "Idle (대기)", value: safeSummaryData.status.idle, color: "#f59e0b" },
        { name: "Down (정지)", value: safeSummaryData.status.down, color: "#ef4444" },
    ];

    // 트렌드 데이터 방어
    const safeTrendData = (isTrendError || !trendDataRaw || trendDataRaw.length === 0)
        ? mockTrendData
        : trendDataRaw;

    // 수율 데이터 방어
    const safeYieldData = (isYieldError || !yieldDataRaw || yieldDataRaw.length === 0)
        ? (equipmentParams === "all" ? mockLineYieldData : mockEquipmentYieldData)
        : yieldDataRaw;

    // 파레토 데이터 방어
    const safeParetoData = (isParetoError || !paretoDataRaw || paretoDataRaw.length === 0)
        ? mockParetoData
        : paretoDataRaw;

    return {
        availableEquipmentIds,
        summaryData: safeSummaryData,
        statusData: safeStatusData,
        trendData: safeTrendData,
        yieldData: safeYieldData,
        paretoData: safeParetoData,
        
        isSummaryLoading,
        isTrendLoading,
        isYieldLoading,
        isParetoLoading
    };
}