import axios from "axios";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

// ==========================================
// 🌟 1. 비가동 시간 트렌드 (Downtime Trend)
// ==========================================
export interface DowntimeDataPoint {
    label: string;
    value: number;
}

export interface DowntimeTrendResponse {
    data: DowntimeDataPoint[];
    unit: "hr" | "min"; // 하루 조회 시 분(min), 기간 조회 시 시간(hr)
}

export const fetchDowntimeTrend = async (
    equipmentIds: string, // 🌟 명세서 공통 규칙: lineId -> equipmentIds 변경
    date: DateRange | undefined
): Promise<DowntimeTrendResponse> => {
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    const startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const endDate = date?.to ? format(date.to, 'yyyy-MM-dd') : startDate;

    const response = await axios.get('/api/v1/equipments/downtime-trend', {
        params: { 
            equipmentIds, // 🌟 파라미터명 변경
            startDate, 
            endDate 
        }
    });
    
    if (!response.data) {
        throw new Error("서버에서 데이터를 받지 못했습니다.");
    }

    // 이 API는 응답 전체(unit 포함)를 반환해야 합니다.
    return response.data; 
};

// ==========================================
// 🌟 2. 평균 무고장 시간 (MTBF)
// ==========================================
export interface MtbfDataPoint {
    name: string; // 전체 조회 시 장비명, 개별 조회 시 일자
    hours: number;
}

export const fetchMtbf = async (
    equipmentIds: string, 
    date: DateRange | undefined
): Promise<MtbfDataPoint[]> => {
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    const startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const endDate = date?.to ? format(date.to, 'yyyy-MM-dd') : startDate;

    const response = await axios.get('/api/v1/equipments/mtbf', {
        params: { 
            equipmentIds, 
            startDate, 
            endDate 
        }
    });
    
    if (!response.data || !response.data.data) {
        throw new Error("서버에서 데이터를 받지 못했습니다.");
    }

    // 이 API는 데이터 배열(data)만 뽑아서 반환합니다.
    return response.data.data; 
};


// ==========================================
// 🌟 3. 불량 코드 통계 (Defects)
// ==========================================
export interface DefectStat {
    code: string;
    name: string;
    type: string;
    count: number;
    ratio: string;
    impact: string;
}

export const fetchDefects = async (
    equipmentIds: string, 
    date: DateRange | undefined
): Promise<DefectStat[]> => {
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    const startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const endDate = date?.to ? format(date.to, 'yyyy-MM-dd') : startDate;

    const response = await axios.get('/api/v1/equipments/defects', {
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

// ==========================================
// 🌟 4. 장비 개별 상세 리스트 (Status List)
// ==========================================

// 기존 EquipmentData 타입을 명세서에 맞게 완벽하게 교체합니다.
export interface EquipmentStatus {
    id: string;
    recipe: string;
    uptime: number;
    total: number;       // 🌟 신규: 총 검사 수
    fail: number;
    marginal: number;    // 🌟 신규: 마지널 판정 수
    yield: number;
    majorDefect: string;
    unresolvedAlert: boolean;
    yieldTrend: number[];
}

export const fetchEquipmentStatusList = async (
    equipmentIds: string, 
    date: DateRange | undefined
): Promise<EquipmentStatus[]> => {
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    const startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const endDate = date?.to ? format(date.to, 'yyyy-MM-dd') : startDate;

    const response = await axios.get('/api/v1/equipments/status-list', {
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