import { useQuery } from "@tanstack/react-query";
import {
    fetchDashboardSummary,
    fetchDashboardTrend,
    fetchYieldComparison,
    fetchDefectPareto,
} from "@/api/dashboard";
import { fetchEquipmentStatusList } from "@/api/equipment";
import {
    mockDashboardSummary,
    mockTrendData,
    mockLineYieldData,
    mockEquipmentYieldData,
    mockParetoData,
    mockEquipmentComparisonData,
} from "@/data/mockData";
import {
    emptyDashboardSummary,
    emptyParetoData,
    emptyTrendData,
    emptyYieldComparisonData,
} from "@/data/emptyData";
import { isDemoMockDateRange } from "@/lib/demoMockDate";
import { useAuthStore } from "@/store/useAuthStore";
import type { DateRange } from "react-day-picker";

interface UseDashboardQueriesProps {
    equipmentParams: string;
    appliedDate: DateRange | undefined;
    trendUnit: "daily" | "weekly";
}

export function useDashboardQueries({ equipmentParams, appliedDate, trendUnit }: UseDashboardQueriesProps) {
    const isEnabled = !!appliedDate?.from;
    const useMockData = useAuthStore((state) => state.useMockData);
    const forceMockData = isDemoMockDateRange(appliedDate);
    const shouldUseMockData = useMockData || forceMockData;

    const commonOptions = {
        enabled: isEnabled && !forceMockData,
        retry: false,
        staleTime: 1000 * 60 * 10,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    };

    const { data: eqListForSelect } = useQuery({
        queryKey: ["equipmentListForSelect", appliedDate],
        queryFn: () => fetchEquipmentStatusList("all", appliedDate),
        enabled: isEnabled && !forceMockData,
        retry: false,
    });

    const { data: summaryData, isLoading: isSummaryLoading, isError: isSummaryError } = useQuery({
        queryKey: ["dashboardSummary", equipmentParams, appliedDate],
        queryFn: () => fetchDashboardSummary(equipmentParams, appliedDate),
        ...commonOptions,
    });

    const { data: trendDataRaw, isFetching: isTrendLoading, isError: isTrendError } = useQuery({
        queryKey: ["dashboardTrend", equipmentParams, appliedDate, trendUnit],
        queryFn: () => fetchDashboardTrend(equipmentParams, appliedDate, trendUnit),
        ...commonOptions,
    });

    const { data: yieldDataRaw, isLoading: isYieldLoading, isError: isYieldError } = useQuery({
        queryKey: ["yieldComparison", equipmentParams, appliedDate],
        queryFn: () => fetchYieldComparison(equipmentParams, appliedDate),
        ...commonOptions,
    });

    const { data: paretoDataRaw, isLoading: isParetoLoading, isError: isParetoError } = useQuery({
        queryKey: ["defectPareto", equipmentParams, appliedDate],
        queryFn: () => fetchDefectPareto(equipmentParams, appliedDate),
        ...commonOptions,
    });

    const availableEquipmentIds = !eqListForSelect || eqListForSelect.length === 0
        ? (shouldUseMockData ? mockEquipmentComparisonData.map((eq) => eq.id) : [])
        : eqListForSelect.map((eq) => eq.id);

    const safeSummaryData = (forceMockData || isSummaryError || !summaryData)
        ? (shouldUseMockData
            ? {
                kpi: mockDashboardSummary.kpi,
                status: mockDashboardSummary.status,
            }
            : emptyDashboardSummary)
        : summaryData;

    const safeStatusData = [
        { name: "Run", value: safeSummaryData.status.run, color: "var(--chart-2)" },
        { name: "Idle", value: safeSummaryData.status.idle, color: "var(--chart-4)" },
        { name: "Down", value: safeSummaryData.status.down, color: "var(--destructive)" },
    ];

    const safeTrendData = (forceMockData || isTrendError || !trendDataRaw || trendDataRaw.length === 0)
        ? (shouldUseMockData ? mockTrendData : emptyTrendData)
        : trendDataRaw;

    const safeYieldData = (forceMockData || isYieldError || !yieldDataRaw || yieldDataRaw.length === 0)
        ? (shouldUseMockData ? (equipmentParams === "all" ? mockLineYieldData : mockEquipmentYieldData) : emptyYieldComparisonData)
        : yieldDataRaw;

    const safeParetoData = (forceMockData || isParetoError || !paretoDataRaw || paretoDataRaw.length === 0)
        ? (shouldUseMockData ? mockParetoData : emptyParetoData)
        : paretoDataRaw;

    const isAnyLoading = isSummaryLoading || isTrendLoading || isYieldLoading || isParetoLoading;
    const hasDataIssue = !shouldUseMockData && !isAnyLoading && (
        isSummaryError || isTrendError || isYieldError || isParetoError || !summaryData
    );

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
        isParetoLoading,
        hasDataIssue,
    };
}
