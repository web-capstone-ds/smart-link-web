import axios from "axios";
import { format } from "date-fns"; // 날짜 포맷팅을 위한 라이브러리 (npm install date-fns)
import type { DateRange } from "react-day-picker";

// 1번 API 응답 타입 정의 (명세서 기준)
export interface DashboardSummaryResponse {
  kpi: {
    totalProduction: number;
    uph: number;
    productionRate: number;
    productionTrend: number;
    totalYield: number;
    yieldTrend: number;
    passRate: number;
    cpk: number;
    cpkTrend: number;
    cpkRate: number;
    topDefect: string;
    oee: number;
    fail: number;
    marginal: number;
  };
  status: {
    run: number;
    idle: number;
    down: number;
  };
  aiMessage: string;
}

type TrendUnitType = "daily" | "weekly" | "monthly";

// 🌟 요약 데이터 가져오기 API 함수
export const fetchDashboardSummary = async (
    lineId: string, 
    date: DateRange | undefined
): Promise<DashboardSummaryResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 날짜 포맷팅 (YYYY-MM-DD). 하루만 선택된 경우 to가 없으므로 from과 동일하게 세팅
    const startDate = date?.from ? format(date?.from, 'yyyy-MM-dd') : '';
    const endDate = date?.to ? format(date?.to, 'yyyy-MM-dd') : startDate;

    const response = await axios.get('/api/v1/dashboard/summary', {
        params: {
            lineId,
            startDate,
            endDate
        }
    });

    if (!response.data || !response.data.data) {
        throw new Error("서버에서 올바른 데이터를 받지 못했습니다.");
    }
    
    // axios는 기본적으로 data 객체 안에 응답을 담으므로, 명세서의 "data" 객체만 꺼내서 반환
    return response.data.data; 
};

// 2번 API 응답 타입 정의
export interface TrendData {
  date: string;
  production: number;
  yield: number;
}

// 🌟 트렌드 차트 데이터 가져오기 API 함수
export const fetchDashboardTrend = async (
    lineId: string, 
    // DateRange가 아니라 단일 Date(기준일)를 받도록 수정합니다.
    anchorDate: Date | undefined, 
    unit: TrendUnitType
): Promise<TrendData[]> => {
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 기준일이 없으면 오늘 날짜를 사용
    const targetDate = anchorDate ? format(anchorDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

    const response = await axios.get('/api/v1/dashboard/trend', {
        params: { 
            lineId, 
            endDate: targetDate, // 🌟 시작일 없이 종료일(기준일)만 보냅니다.
            unit, 
            limit: 7             // 🌟 백엔드에게 7개만 달라고 명시합니다! (백엔드에서 처리)
        }
    });

    if (!response.data || !response.data.data) {
        throw new Error("서버에서 올바른 데이터를 받지 못했습니다.");
    }
    
    return response.data.data; 
};

// 🌟 3번 API 응답 타입 정의
export interface YieldComparisonData {
  name: string;
  yield: number;
}

// 🌟 수율 비교 차트 데이터 가져오기 API 함수
export const fetchYieldComparison = async (
    lineId: string, 
    date: DateRange | undefined
): Promise<YieldComparisonData[]> => {
    
    // 로딩 UI 확인을 위한 1초 지연 
    await new Promise(resolve => setTimeout(resolve, 1000));

    const startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const endDate = date?.to ? format(date.to, 'yyyy-MM-dd') : startDate;

    const response = await axios.get('/api/v1/dashboard/yield-comparison', {
        params: { lineId, startDate, endDate }
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
    lineId: string, 
    date: DateRange | undefined
): Promise<ParetoData[]> => {
    
    // 로딩 UI 확인용 1초 지연
    await new Promise(resolve => setTimeout(resolve, 1000));

    const startDate = date?.from ? format(date.from, 'yyyy-MM-dd') : '';
    const endDate = date?.to ? format(date.to, 'yyyy-MM-dd') : startDate;

    const response = await axios.get('/api/v1/dashboard/defects/pareto', {
        params: { lineId, startDate, endDate }
    });
    
    if (!response.data || !response.data.data) {
        throw new Error("서버에서 올바른 데이터를 받지 못했습니다.");
    }

    return response.data.data; 
};