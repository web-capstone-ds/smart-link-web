import { apiClient } from "@/api/client";
import { delayForMockData } from "@/api/mockDelay";
import { format, subDays } from "date-fns";

import type { DowntimeTrendResponse } from "@/type/equipmentType";
import type { EquipmentSummary, EquipmentSPCTrend, EquipmentHeatmap, EquipmentHistory } from "@/type/equipmentDetailType";

// 1. Equipment Summary Data
export const fetchEquipmentSummary = async (
    equipmentId: string,
    targetDate: Date | string
): Promise<EquipmentSummary> => {
    
    await delayForMockData();

    const formattedDate = typeof targetDate === 'string' ? targetDate : format(targetDate, 'yyyy-MM-dd');

    const response = await apiClient.get(`/api/v1/equipments/${equipmentId}/summary`, {
        params: { targetDate: formattedDate }
    });

    if (!response.data || !response.data.data) {
        throw new Error("장비 상세 데이터를 불러오지 못했습니다.");
    }

    return response.data.data;
};

// 2. Equipment Down Time Trend Data
export const fetchEquipmentDowntimeTrend = async (
    equipmentId: string,
    targetDate: Date | string
): Promise<DowntimeTrendResponse> => {
    
    await delayForMockData();

    const endDateObj = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    
    const startDateObj = subDays(endDateObj, 6);

    const endDate = format(endDateObj, 'yyyy-MM-dd');
    const startDate = format(startDateObj, 'yyyy-MM-dd');

    const response = await apiClient.get('/api/v1/equipments/downtime-trend', {
        params: { 
            equipmentIds: equipmentId,
            startDate,
            endDate
        }
    });

    if (!response.data) {
        throw new Error("비가동 시간 트렌드 데이터를 불러오지 못했습니다.");
    }

    return response.data;
};

// 3. SPC Trend Data
export const fetchEquipmentSPCTrend = async (
    equipmentId: string,
    targetDate: Date | string,
    limit: number = 7
): Promise<EquipmentSPCTrend[]> => {

    await delayForMockData();
    const formattedDate = typeof targetDate === 'string' ? targetDate : format(targetDate, 'yyyy-MM-dd');

    const response = await apiClient.get(`/api/v1/equipments/${equipmentId}/spc-trend`, {
        params: { 
            limit,
            targetDate: formattedDate
        }
    });
    
    if (!response.data || !response.data.data) {
        throw new Error("서버에서 수율 및 SPC 추이 데이터를 받지 못했습니다.");
    }

    return response.data.data; 
};

// 4. Heatmap Data
export const fetchEquipmentHeatmap = async (
    equipmentId: string,
    targetDate: Date | string
): Promise<EquipmentHeatmap> => {

    await delayForMockData();
    const formattedDate = typeof targetDate === 'string' ? targetDate : format(targetDate, 'yyyy-MM-dd');

    const response = await apiClient.get(`/api/v1/equipments/${equipmentId}/heatmap`, {
        params: { targetDate: formattedDate }
    });
    if (!response.data || !response.data.data) {
        throw new Error("서버에서 히트맵 데이터를 받지 못했습니다.");
    }

    return response.data.data;
};

// 5. History Data
export const fetchEquipmentHistory = async (
    equipmentId: string,
    targetDate: Date | string
): Promise<EquipmentHistory[]> => {

    await delayForMockData();
    const formattedDate = typeof targetDate === 'string' ? targetDate : format(targetDate, 'yyyy-MM-dd');

    const response = await apiClient.get(`/api/v1/equipments/${equipmentId}/history`, {
        params: { targetDate: formattedDate }
    });

    if (!response.data || !response.data.data) {
        throw new Error("서버에서 조치 내역 히스토리를 받지 못했습니다.");
    }

    return response.data.data;
};




