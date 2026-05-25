import { apiClient } from "@/api/client";
import { delayForMockData } from "@/api/mockDelay";
import { format, subDays, subWeeks, isSameDay } from 'date-fns';
import type { DateRange } from "react-day-picker";

import type { 
    DashboardSummaryResponse, TrendUnitType, TrendData, YieldComparisonData, ParetoData 
} from "@/type/dashboardType";

// 1. KPI Summary Data
export const fetchDashboardSummary = async (
    equipmentIds: string, 
    date: DateRange | undefined
): Promise<DashboardSummaryResponse> => {
    
    await delayForMockData();

    const startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const endDate = date?.to ? format(date.to, 'yyyy-MM-dd') : startDate;

    const response = await apiClient.get('/api/v1/dashboard/summary', {
        params: {
            equipmentIds,
            startDate,
            endDate
        }
    });

    if (!response.data || !response.data.data) {
        throw new Error("서버에서 올바른 데이터를 받지 못했습니다.");
    }
    
    return response.data.data; 
};

// 2. Defect Pareto Data
export const fetchDefectPareto = async (
    equipmentIds: string, 
    date: DateRange | undefined
): Promise<ParetoData[]> => {
    
    await delayForMockData();

    const startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const endDate = date?.to ? format(date.to, 'yyyy-MM-dd') : startDate;

    const response = await apiClient.get('/api/v1/dashboard/defects/pareto', {
        params: { equipmentIds, startDate, endDate }
    });
    
    if (!response.data || !response.data.data) {
        throw new Error("서버에서 올바른 데이터를 받지 못했습니다.");
    }

    return response.data.data; 
};

// 3. Trend Data 
export const fetchDashboardTrend = async (
    equipmentIds: string, 
    date: DateRange | undefined, 
    unit: TrendUnitType
): Promise<TrendData[]> => {
    
    await delayForMockData();

    const anchorDate = date?.to || date?.from || new Date();
    const endDate = format(anchorDate, 'yyyy-MM-dd');

    const isSingleDay = date?.from && (!date.to || isSameDay(date.from, date.to));

    let startDate: string;

    if (isSingleDay) {
        // ?뙚 [?섎（ ?좏깮 ?? 媛뺤젣濡?怨쇨굅 7媛??곗씠??踰붿쐞瑜??≪븘以띾땲??
        let calculatedStartDate: Date;
        if (unit === "daily") {
            calculatedStartDate = subDays(anchorDate, 6);
        } else {
            calculatedStartDate = subWeeks(anchorDate, 6);
        }
        startDate = format(calculatedStartDate, 'yyyy-MM-dd');
    } else {
        // ?뙚 [湲곌컙 ?좏깮 ?? ?ъ슜?먭? 吏?뺥븳 ?쒖옉?쇱쓣 洹몃?濡?議댁쨷?⑸땲??
        startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : endDate;
    }

    const response = await apiClient.get('/api/v1/dashboard/trend', {
        params: { 
            equipmentIds, 
            startDate, // 遺꾧린 泥섎━???쒖옉??
            endDate,   
            unit       
        }
    });

    if (!response.data || !response.data.data) {
        throw new Error("서버에서 올바른 데이터를 받지 못했습니다.");
    }
    
    return response.data.data; 
};

// 4. Yield Comparison Data
export const fetchYieldComparison = async (
    equipmentIds: string,
    date: DateRange | undefined
): Promise<YieldComparisonData[]> => {
    
    await delayForMockData();

    const startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const endDate = date?.to ? format(date.to, 'yyyy-MM-dd') : startDate;

    const response = await apiClient.get('/api/v1/dashboard/yield-comparison', {
        params: { 
            equipmentIds,
            startDate, 
            endDate 
        }
    });
    
    if (!response.data || !response.data.data) {
        throw new Error("서버에서 올바른 데이터를 받지 못했습니다.");
    }

    return response.data.data; 
};




