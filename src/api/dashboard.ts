import axios from "axios";
import { format, subDays, subWeeks, isSameDay } from 'date-fns'; // 날짜 포맷팅을 위한 라이브러리 (npm install date-fns)
import type { DateRange } from "react-day-picker";

// 🌟 1. 최종 명세서(3-1) 기준 응답 타입 수정
export interface DashboardSummaryResponse {
  kpi: {
    totalProduction: number;
    uph: number;
    totalYield: number;
    yieldTrend: number;
    passRate: number;
    cpk: number;
    cpkTrend: number;
    topDefect: string;
    // 신규 추가 및 대체 항목
    availability: number;      // 기존 oee 대체
    totalDowntimeMin: number;  // 기존 productionRate 대체
    mtbfHours: number;         // 신규
    activeEquipment: number;   // 신규
    totalEquipment: number;    // 신규
  };
  status: {
    run: number;
    idle: number;
    down: number;
  };
}

export const fetchDashboardSummary = async (
    // 명세서 2-2에 따라 lineId를 equipmentIds로 변경
    equipmentIds: string, 
    date: DateRange | undefined
): Promise<DashboardSummaryResponse> => {
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 날짜 포맷팅
    const startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const endDate = date?.to ? format(date.to, 'yyyy-MM-dd') : startDate;

    const response = await axios.get('/api/v1/dashboard/summary', {
        params: {
            equipmentIds, // lineId 대신 사용
            startDate,
            endDate
        }
    });

    if (!response.data || !response.data.data) {
        throw new Error("서버에서 올바른 데이터를 받지 못했습니다.");
    }
    
    return response.data.data; 
};

type TrendUnitType = "daily" | "weekly";

// 2번 API 응답 타입 정의
export interface TrendData {
  date: string;
  production: number;
  yield: number;
}
export const fetchDashboardTrend = async (
    equipmentIds: string, 
    date: DateRange | undefined, 
    unit: TrendUnitType
): Promise<TrendData[]> => {
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 1. 기준이 되는 마지막 날짜(endDate) 확정
    const anchorDate = date?.to || date?.from || new Date();
    const endDate = format(anchorDate, 'yyyy-MM-dd');

    // 2. 단일 일자(하루) 선택 여부 판별
    // to가 아예 없거나, from과 to가 같은 날짜면 "하루 선택"으로 간주합니다.
    const isSingleDay = date?.from && (!date.to || isSameDay(date.from, date.to));

    let startDate: string;

    if (isSingleDay) {
        // 🌟 [하루 선택 시] 강제로 과거 7개 데이터 범위를 잡아줍니다.
        let calculatedStartDate: Date;
        if (unit === "daily") {
            calculatedStartDate = subDays(anchorDate, 6);
        } else {
            calculatedStartDate = subWeeks(anchorDate, 6);
        }
        startDate = format(calculatedStartDate, 'yyyy-MM-dd');
    } else {
        // 🌟 [기간 선택 시] 사용자가 지정한 시작일을 그대로 존중합니다.
        startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : endDate;
    }

    const response = await axios.get('/api/v1/dashboard/trend', {
        params: { 
            equipmentIds, 
            startDate, // 분기 처리된 시작일
            endDate,   
            unit       
        }
    });

    if (!response.data || !response.data.data) {
        throw new Error("서버에서 올바른 데이터를 받지 못했습니다.");
    }
    
    return response.data.data; 
};

// 🌟 3번 API 응답 타입 정의
export interface YieldComparisonData {
  name: string; // equipmentIds="all"이면 장비명, 특정 ID면 LOT#
  yield: number;
}

export const fetchYieldComparison = async (
    equipmentIds: string, // 🌟 lineId에서 명칭 변경
    date: DateRange | undefined
): Promise<YieldComparisonData[]> => {
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 🌟 공통 쿼리 파라미터 규격(2-2)에 따른 날짜 포맷팅
    const startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const endDate = date?.to ? format(date.to, 'yyyy-MM-dd') : startDate;

    const response = await axios.get('/api/v1/dashboard/yield-comparison', {
        params: { 
            equipmentIds, // 🌟 파라미터 키 명칭 변경
            startDate, 
            endDate 
        }
    });
    
    if (!response.data || !response.data.data) {
        throw new Error("서버에서 올바른 데이터를 받지 못했습니다.");
    }

    return response.data.data; 
};

// 🌟 4번 API 응답 타입 정의
export interface ParetoData {
  defectCode: string;
  defectName: string;
  count: number;
  cumulative: number;
}

// 🌟 불량 파레토 차트 데이터 가져오기 API 함수
export const fetchDefectPareto = async (
    equipmentIds: string, 
    date: DateRange | undefined
): Promise<ParetoData[]> => {
    
    // 로딩 UI 확인용 1초 지연
    await new Promise(resolve => setTimeout(resolve, 1000));

    const startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const endDate = date?.to ? format(date.to, 'yyyy-MM-dd') : startDate;

    const response = await axios.get('/api/v1/dashboard/defects/pareto', {
        params: { equipmentIds, startDate, endDate }
    });
    
    if (!response.data || !response.data.data) {
        throw new Error("서버에서 올바른 데이터를 받지 못했습니다.");
    }

    return response.data.data; 
};