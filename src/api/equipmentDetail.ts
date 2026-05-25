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

    // 1. targetDate瑜?Date 媛앹껜濡??뺤떎?섍쾶 蹂??(endDate 湲곗???
    const endDateObj = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    
    // 2. 湲곗??쇰줈遺??6???꾩쓣 ?쒖옉?쇰줈 怨꾩궛 (?ㅻ뒛 ?ы븿 珥?7?쇱튂)
    const startDateObj = subDays(endDateObj, 6);

    // 3. ?쒕쾭媛 醫뗭븘?섎뒗 'YYYY-MM-DD' 臾몄옄?대줈 ?щ㎎??
    const endDate = format(endDateObj, 'yyyy-MM-dd');
    const startDate = format(startDateObj, 'yyyy-MM-dd');

    // 4. ??쒕낫?쒖슜 ?붾뱶?ъ씤??/api/v1/equipments/downtime-trend) ?몄텧!
    const response = await apiClient.get('/api/v1/equipments/downtime-trend', {
        params: { 
            equipmentIds: equipmentId, // 諛깆뿏?쒕뒗 蹂듭닔??equipmentIds)???먰븯誘濡??대쫫 留욎떠二쇨린
            startDate,
            endDate
        }
    });

    // 二쇱쓽: downtime-trend 紐낆꽭??response.data ?먯껜瑜?諛섑솚?덉뿀?쇰?濡?遺꾧린 泥섎━
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
            targetDate: formattedDate // ?뙚 荑쇰━ 異붽? (limit怨??④퍡 ?꾨떖)
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
        params: { targetDate: formattedDate } // ?뙚 荑쇰━ 異붽?
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
        params: { targetDate: formattedDate } // ?뙚 荑쇰━ 異붽?
    });

    if (!response.data || !response.data.data) {
        throw new Error("서버에서 조치 내역 히스토리를 받지 못했습니다.");
    }

    return response.data.data;
};




