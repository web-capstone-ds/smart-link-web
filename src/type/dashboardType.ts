// 1. KPI Summary Data Type
export interface DashboardSummaryResponse {
    kpi: {
        totalProduction: number;
        uph: number;
        totalYield: number;
        yieldTrend: number;
        passRate: number;
        cpk: number | null;
        cpkTrend: number | null;
        cpkReliable?: boolean;
        cpkSub?: string;
        topDefect: string | null;
        availability: number;      
        totalDowntimeMin: number;  
        mtbfHours: number;         
        activeEquipment: number;   
        totalEquipment: number;    
    };
    status: {
        run: number;
        idle: number;
        down: number;
    };
}
// 2. Defect Pareto Data Type
export interface ParetoData {
    defectCode: string;
    defectName: string;
    count: number;
    cumulative: number;
}
// 3. Trend Data Type
export type TrendUnitType = "daily" | "weekly";
export interface TrendData {
    date: string;
    production: number;
    yield: number;
}
// 4. Yield Comparison Type
export interface YieldComparisonData {
    name: string; 
    yield: number;
}
