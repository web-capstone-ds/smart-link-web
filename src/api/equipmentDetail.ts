import { apiClient } from "@/api/client";
import { format, subDays } from "date-fns";

import type { DowntimeTrendResponse } from "@/type/equipmentType";
import type { EquipmentSummary, EquipmentSPCTrend, EquipmentHeatmap, EquipmentHistory } from "@/type/equipmentDetailType";

// 1. Equipment Summary Data
export const fetchEquipmentSummary = async (
    equipmentId: string,
    targetDate: Date | string
): Promise<EquipmentSummary> => {
    
    await new Promise(resolve => setTimeout(resolve, 1000));

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
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 1. targetDate를 Date 객체로 확실하게 변환 (endDate 기준일)
    const endDateObj = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    
    // 2. 기준일로부터 6일 전을 시작일로 계산 (오늘 포함 총 7일치)
    const startDateObj = subDays(endDateObj, 6);

    // 3. 서버가 좋아하는 'YYYY-MM-DD' 문자열로 포맷팅
    const endDate = format(endDateObj, 'yyyy-MM-dd');
    const startDate = format(startDateObj, 'yyyy-MM-dd');

    // 4. 대시보드용 엔드포인트(/api/v1/equipments/downtime-trend) 호출!
    const response = await apiClient.get('/api/v1/equipments/downtime-trend', {
        params: { 
            equipmentIds: equipmentId, // 백엔드는 복수형(equipmentIds)을 원하므로 이름 맞춰주기
            startDate,
            endDate
        }
    });

    // 주의: downtime-trend 명세는 response.data 자체를 반환했었으므로 분기 처리
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

    await new Promise(resolve => setTimeout(resolve, 1000));
    const formattedDate = typeof targetDate === 'string' ? targetDate : format(targetDate, 'yyyy-MM-dd');

    const response = await apiClient.get(`/api/v1/equipments/${equipmentId}/spc-trend`, {
        params: { 
            limit,
            targetDate: formattedDate // 🌟 쿼리 추가 (limit과 함께 전달)
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

    await new Promise(resolve => setTimeout(resolve, 1000));
    const formattedDate = typeof targetDate === 'string' ? targetDate : format(targetDate, 'yyyy-MM-dd');

    const response = await apiClient.get(`/api/v1/equipments/${equipmentId}/heatmap`, {
        params: { targetDate: formattedDate } // 🌟 쿼리 추가
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

    await new Promise(resolve => setTimeout(resolve, 1000));
    const formattedDate = typeof targetDate === 'string' ? targetDate : format(targetDate, 'yyyy-MM-dd');

    const response = await apiClient.get(`/api/v1/equipments/${equipmentId}/history`, {
        params: { targetDate: formattedDate } // 🌟 쿼리 추가
    });

    if (!response.data || !response.data.data) {
        throw new Error("서버에서 조치 내역 히스토리를 받지 못했습니다.");
    }

    return response.data.data;
};
