import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAction, fetchActions, updateActionStatus } from "@/api/actions";
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
import type { ActionItem } from "@/type/actionType";
import type { EquipmentHistory } from "@/type/equipmentDetailType";

interface UseDetailEquipmentQueriesProps {
    selectedEquipment: string | null;
    targetDate: Date;
    isReady: boolean;
}

export function useDetailEquipmentQueries({ selectedEquipment, targetDate, isReady }: UseDetailEquipmentQueriesProps) {
    const isEnabled = !!selectedEquipment;
    const useMockData = useAuthStore((state) => state.useMockData);
    const queryClient = useQueryClient();
    const [localHistoryData, setLocalHistoryData] = useState<EquipmentHistory[] | null>(null);

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

    const { data: actionData, isLoading: isActionLoading, isError: isActionError } = useQuery({
        queryKey: ["equipmentActions", selectedEquipment, targetDate],
        queryFn: () => fetchActions(selectedEquipment!, targetDate),
        ...commonOptions,
    });

    useEffect(() => {
        setLocalHistoryData(null);
    }, [selectedEquipment, targetDate]);

    const { data: downtimeTrendData, isLoading: isDowntimeLoading, isError: isDowntimeError } = useQuery({
        queryKey: ["equipmentDetailDowntime", selectedEquipment, targetDate],
        queryFn: () => fetchEquipmentDowntimeTrend(selectedEquipment!, targetDate),
        ...commonOptions,
    });

    const safeSummaryData = (isSummaryError || !summaryData) ? (useMockData ? mockEquipmentSummary : emptyEquipmentSummary) : summaryData;
    const safeSpcData = (isSpcError || !spcData || spcData.length === 0) ? (useMockData ? mockEquipmentSPCTrend : emptyEquipmentSPCTrend) : spcData;
    const safeHeatmapData = (isHeatmapError || !heatmapData) ? (useMockData ? mockEquipmentHeatmap : emptyEquipmentHeatmap) : heatmapData;
    const actionHistoryData = !isActionError && actionData && actionData.length > 0
        ? actionData.map(toEquipmentHistory)
        : null;
    const remoteHistoryData = actionHistoryData || ((isHistoryError || !historyData || historyData.length === 0) ? (useMockData ? mockEquipmentHistory : emptyEquipmentHistory) : historyData);
    const safeHistoryData = localHistoryData || remoteHistoryData;
    const safeDowntimeTrendData = (isDowntimeError || !downtimeTrendData || !downtimeTrendData.data || downtimeTrendData.data.length === 0)
        ? (useMockData ? mockEquipmentDowntimeTrend : emptyDowntimeResponse)
        : downtimeTrendData;

    const isAnyLoading = isSummaryLoading || isSpcLoading || isHeatmapLoading || isHistoryLoading || isActionLoading || isDowntimeLoading;
    const hasDataIssue = !useMockData && isReady && !isAnyLoading && (
        isSummaryError || isSpcError || isHeatmapError || isHistoryError || isDowntimeError || !summaryData
    );

    const resolveActionMutation = useMutation({
        mutationFn: ({ id, action }: { id: string; action: string }) => {
            if (useMockData) {
                return Promise.resolve(null);
            }
            return updateActionStatus(id, { status: "resolved", action });
        },
        onMutate: ({ id, action }) => {
            setLocalHistoryData((current) => (current || remoteHistoryData).map((item) => (
                item.id === id
                    ? {
                        ...item,
                        status: "resolved",
                        description: item.description.includes("조치:")
                            ? item.description
                            : `${item.description} / 조치: ${action}`,
                        worker: item.worker || "현재 사용자",
                    }
                    : item
            )));
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: ["equipmentActions", selectedEquipment, targetDate] });
            void queryClient.invalidateQueries({ queryKey: ["pendingActions"] });
            void queryClient.invalidateQueries({ queryKey: ["equipmentList"] });
        },
    });

    const createActionMutation = useMutation({
        mutationFn: ({ title, message, action }: { title: string; message: string; action: string }) => {
            if (!selectedEquipment) return Promise.resolve(null);
            if (useMockData) {
                return Promise.resolve(null);
            }
            return createAction({
                equipmentId: selectedEquipment,
                title,
                message,
                action,
                status: action ? "resolved" : "pending",
            });
        },
        onMutate: ({ title, message, action }) => {
            const now = new Date();
            const nextItem: EquipmentHistory = {
                id: `local-${now.getTime()}`,
                status: action ? "resolved" : "unresolved",
                time: now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }),
                title,
                description: action ? `${message} / 조치: ${action}` : message,
                worker: action ? "현재 사용자" : null,
                yieldChange: null,
            };

            setLocalHistoryData((current) => [nextItem, ...(current || remoteHistoryData)]);
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: ["equipmentActions", selectedEquipment, targetDate] });
            void queryClient.invalidateQueries({ queryKey: ["pendingActions"] });
            void queryClient.invalidateQueries({ queryKey: ["equipmentList"] });
        },
    });

    return {
        summaryData: safeSummaryData,
        spcData: safeSpcData,
        heatmapData: safeHeatmapData,
        historyData: safeHistoryData,
        downtimeTrendData: safeDowntimeTrendData,
        isSummaryLoading: !isReady || isSummaryLoading,
        isSpcLoading: !isReady || isSpcLoading,
        isHeatmapLoading: !isReady || isHeatmapLoading,
        isHistoryLoading: !isReady || isActionLoading || (!actionHistoryData && isHistoryLoading),
        isDowntimeLoading: !isReady || isDowntimeLoading,
        isActionMutating: resolveActionMutation.isPending || createActionMutation.isPending,
        onResolveAction: (id: string, action: string) => resolveActionMutation.mutate({ id, action }),
        onCreateAction: (payload: { title: string; message: string; action: string }) => createActionMutation.mutate(payload),
        hasDataIssue,
    };
}

function toEquipmentHistory(action: ActionItem): EquipmentHistory {
    return {
        id: action.id,
        status: action.status === "resolved" || action.status === "completed" ? "resolved" : "unresolved",
        time: formatActionTime(action.time),
        title: action.title,
        description: action.action ? `${action.message} / 조치: ${action.action}` : action.message,
        worker: action.worker,
        yieldChange: action.yieldBefore !== null && action.yieldAfter !== null && action.yieldBefore !== undefined && action.yieldAfter !== undefined
            ? {
                before: action.yieldBefore,
                after: action.yieldAfter,
            }
            : null,
    };
}

function formatActionTime(value: string) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
    }
    return value;
}
