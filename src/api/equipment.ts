import { apiClient } from "@/api/client";
import { delayForMockData } from "@/api/mockDelay";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import type { 
    DowntimeTrendResponse, MtbfDataPoint, DefectStat, EquipmentStatus 
} from "@/type/equipmentType";

// 1. Downtime Trend Data (.data)
export const fetchDowntimeTrend = async (
    equipmentIds: string,
    date: DateRange | undefined
): Promise<DowntimeTrendResponse> => {
    
    await delayForMockData();

    const startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const endDate = date?.to ? format(date.to, 'yyyy-MM-dd') : startDate;

    const response = await apiClient.get('/api/v1/equipments/downtime-trend', {
        params: { 
            equipmentIds,
            startDate, 
            endDate 
        }
    });
    
    if (!response.data) {
        throw new Error("서버에서 데이터를 받지 못했습니다.");
    }

    return response.data; 
};

// 2. Mtbf Data
export const fetchMtbf = async (
    equipmentIds: string, 
    date: DateRange | undefined
): Promise<MtbfDataPoint[]> => {
    
    await delayForMockData();

    const startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const endDate = date?.to ? format(date.to, 'yyyy-MM-dd') : startDate;

    const response = await apiClient.get('/api/v1/equipments/mtbf', {
        params: { 
            equipmentIds, 
            startDate, 
            endDate 
        }
    });
    
    if (!response.data || !response.data.data) {
        throw new Error("서버에서 데이터를 받지 못했습니다.");
    }

    return response.data.data; 
};

// 3. Defects Data
export const fetchDefects = async (
    equipmentIds: string, 
    date: DateRange | undefined
): Promise<DefectStat[]> => {
    
    await delayForMockData();

    const startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const endDate = date?.to ? format(date.to, 'yyyy-MM-dd') : startDate;

    const response = await apiClient.get('/api/v1/equipments/defects', {
        params: { 
            equipmentIds, 
            startDate, 
            endDate 
        }
    });
    
    if (!response.data || !response.data.data) {
        throw new Error("서버에서 데이터를 받지 못했습니다.");
    }

    return response.data.data; 
};

// 4. Equipment Status Data
export const fetchEquipmentStatusList = async (
    equipmentIds: string, 
    date: DateRange | undefined
): Promise<EquipmentStatus[]> => {
    
    await delayForMockData();

    const startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const endDate = date?.to ? format(date.to, 'yyyy-MM-dd') : startDate;

    const response = await apiClient.get('/api/v1/equipments/status-list', {
        params: { 
            equipmentIds, 
            startDate, 
            endDate 
        }
    });
    
    if (!response.data || !response.data.data) {
        throw new Error("서버에서 데이터를 받지 못했습니다.");
    }

    return response.data.data; 
};




