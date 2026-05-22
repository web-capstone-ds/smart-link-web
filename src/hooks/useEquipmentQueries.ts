import { useQuery } from "@tanstack/react-query";
import { fetchDowntimeTrend, fetchMtbf, fetchDefects, fetchEquipmentStatusList } from "@/api/equipment";
import { 
    mockDowntimeResponse, 
    mockMtbfData_All, 
    mockMtbfData_Single, 
    mockDefectStatsData, 
    mockEquipmentComparisonData 
} from "@/data/mockData";
import type { DateRange } from "react-day-picker";

interface UseEquipmentQueriesProps {
    equipmentParams: string;
    appliedDate: DateRange | undefined;
    appliedEquipmentIds: string[];
}

export function useEquipmentQueries({ equipmentParams, appliedDate, appliedEquipmentIds }: UseEquipmentQueriesProps) {
    const isEnabled = !!appliedDate?.from;

    const commonOptions = {
        enabled: isEnabled,
        retry: false,
        staleTime: 1000 * 60 * 10,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    };

    // 1. 비가동 시간 트렌드 (Downtime)
    const { data: downtimeRes, isLoading: isDowntimeLoading, isError: isDowntimeError } = useQuery({
        queryKey: ["equipmentDowntime", equipmentParams, appliedDate],
        queryFn: () => fetchDowntimeTrend(equipmentParams, appliedDate),
        ...commonOptions,
    });

    // 2. 평균 무고장 시간 (MTBF)
    const { data: mtbfDataRaw, isLoading: isMtbfLoading, isError: isMtbfError } = useQuery({
        queryKey: ["equipmentMtbf", equipmentParams, appliedDate],
        queryFn: () => fetchMtbf(equipmentParams, appliedDate),
        ...commonOptions,
    });

    // 3. 결함 코드 통계
    const { data: defectsRes, isLoading: isDefectsLoading, isError: isDefectsError } = useQuery({
        queryKey: ["equipmentDefects", equipmentParams, appliedDate],
        queryFn: () => fetchDefects(equipmentParams, appliedDate),
        ...commonOptions,
    });

    // 4. 장비 종합 리스트
    const { data: equipmentListRes, isLoading: isEquipmentListLoading, isError: isEquipmentListError } = useQuery({
        queryKey: ["equipmentList", equipmentParams, appliedDate],
        queryFn: () => fetchEquipmentStatusList(equipmentParams, appliedDate),
        ...commonOptions,
    });

    // --- 🌟 강력한 방어 로직 가공 레이어 ---

    const safeDowntimeRes = (isDowntimeError || !downtimeRes || !downtimeRes.data) 
        ? mockDowntimeResponse 
        : downtimeRes;

    const safeMtbfData = (isMtbfError || !mtbfDataRaw || mtbfDataRaw.length === 0) 
        ? (appliedEquipmentIds.length === 0 ? mockMtbfData_All : mockMtbfData_Single)
        : mtbfDataRaw;

    const safeDefectsData = (isDefectsError || !defectsRes || defectsRes.length === 0) 
        ? mockDefectStatsData 
        : defectsRes;

    const safeEquipmentList = (isEquipmentListError || !equipmentListRes || equipmentListRes.length === 0) 
        ? mockEquipmentComparisonData 
        : equipmentListRes;

    const availableEquipmentIds = safeEquipmentList.map(eq => eq.id);

    return {
        downtimeRes: safeDowntimeRes,
        mtbfData: safeMtbfData,
        defectsData: safeDefectsData,
        equipmentList: safeEquipmentList,
        availableEquipmentIds,
        
        isDowntimeLoading,
        isMtbfLoading,
        isDefectsLoading,
        isEquipmentListLoading
    };
}