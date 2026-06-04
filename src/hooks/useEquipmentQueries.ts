import { useQuery } from "@tanstack/react-query";
import { fetchPendingActions } from "@/api/actions";
import { fetchDowntimeTrend, fetchMtbf, fetchDefects, fetchEquipmentStatusList } from "@/api/equipment";
import {
    mockDowntimeResponse,
    mockMtbfData_All,
    mockMtbfData_Single,
    mockDefectStatsData,
    mockEquipmentComparisonData,
} from "@/data/mockData";
import {
    emptyDefectStatsData,
    emptyDowntimeResponse,
    emptyEquipmentStatusData,
    emptyMtbfData,
} from "@/data/emptyData";
import { isDemoMockDateRange } from "@/lib/demoMockDate";
import { useAuthStore } from "@/store/useAuthStore";
import type { DateRange } from "react-day-picker";

interface UseEquipmentQueriesProps {
    equipmentParams: string;
    appliedDate: DateRange | undefined;
    appliedEquipmentIds: string[];
}

export function useEquipmentQueries({ equipmentParams, appliedDate, appliedEquipmentIds }: UseEquipmentQueriesProps) {
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

    const { data: downtimeRes, isLoading: isDowntimeLoading, isError: isDowntimeError } = useQuery({
        queryKey: ["equipmentDowntime", equipmentParams, appliedDate],
        queryFn: () => fetchDowntimeTrend(equipmentParams, appliedDate),
        ...commonOptions,
    });

    const { data: mtbfDataRaw, isLoading: isMtbfLoading, isError: isMtbfError } = useQuery({
        queryKey: ["equipmentMtbf", equipmentParams, appliedDate],
        queryFn: () => fetchMtbf(equipmentParams, appliedDate),
        ...commonOptions,
    });

    const { data: defectsRes, isLoading: isDefectsLoading, isError: isDefectsError } = useQuery({
        queryKey: ["equipmentDefects", equipmentParams, appliedDate],
        queryFn: () => fetchDefects(equipmentParams, appliedDate),
        ...commonOptions,
    });

    const { data: equipmentListRes, isLoading: isEquipmentListLoading, isError: isEquipmentListError } = useQuery({
        queryKey: ["equipmentList", equipmentParams, appliedDate],
        queryFn: () => fetchEquipmentStatusList(equipmentParams, appliedDate),
        ...commonOptions,
    });

    const { data: pendingActionsRes } = useQuery({
        queryKey: ["pendingActions", appliedDate],
        queryFn: () => fetchPendingActions(appliedDate),
        ...commonOptions,
    });

    const safeDowntimeRes = (forceMockData || isDowntimeError || !downtimeRes || !downtimeRes.data)
        ? (shouldUseMockData ? mockDowntimeResponse : emptyDowntimeResponse)
        : downtimeRes;

    const safeMtbfData = (forceMockData || isMtbfError || !mtbfDataRaw || mtbfDataRaw.length === 0)
        ? (shouldUseMockData ? (appliedEquipmentIds.length === 0 ? mockMtbfData_All : mockMtbfData_Single) : emptyMtbfData)
        : mtbfDataRaw;

    const safeDefectsData = (forceMockData || isDefectsError || !defectsRes || defectsRes.length === 0)
        ? (shouldUseMockData ? mockDefectStatsData : emptyDefectStatsData)
        : defectsRes;

    const safePendingActions = (forceMockData ? null : pendingActionsRes) || (shouldUseMockData
        ? mockEquipmentComparisonData
            .filter((eq) => eq.unresolvedAlert)
            .map((eq) => ({
                equipmentId: eq.id,
                count: eq.unresolvedAlertCount ?? 1,
                highestSeverity: eq.yield < 97 || eq.uptime < 90 ? "critical" : "warning",
                latestMessage: eq.majorDefect !== "-" ? eq.majorDefect : "미조치 경보",
            }))
        : []);

    const pendingActionMap = new Map(safePendingActions.map((item) => [item.equipmentId, item]));

    const baseEquipmentList = (forceMockData || isEquipmentListError || !equipmentListRes || equipmentListRes.length === 0)
        ? (shouldUseMockData ? mockEquipmentComparisonData : emptyEquipmentStatusData)
        : equipmentListRes;

    const safeEquipmentList = baseEquipmentList.map((eq) => {
        const pendingAction = pendingActionMap.get(eq.id);

        return {
            ...eq,
            unresolvedAlert: eq.unresolvedAlert || !!pendingAction,
            unresolvedAlertCount: pendingAction?.count ?? eq.unresolvedAlertCount,
        };
    });

    const availableEquipmentIds = safeEquipmentList.map((eq) => eq.id);
    const isAnyLoading = isDowntimeLoading || isMtbfLoading || isDefectsLoading || isEquipmentListLoading;
    const hasDataIssue = !shouldUseMockData && !isAnyLoading && (
        isDowntimeError || isMtbfError || isDefectsError || isEquipmentListError || !equipmentListRes
    );

    return {
        downtimeRes: safeDowntimeRes,
        mtbfData: safeMtbfData,
        defectsData: safeDefectsData,
        equipmentList: safeEquipmentList,
        availableEquipmentIds,
        isDowntimeLoading,
        isMtbfLoading,
        isDefectsLoading,
        isEquipmentListLoading,
        hasDataIssue,
    };
}
