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

export interface ParetoData {
    defectCode: string;
    defectName: string;
    count: number;
    cumulative: number;
}

export type TrendUnitType = "daily" | "weekly";

export interface TrendData {
    date: string;
    production: number;
    yield: number;
}

export interface YieldComparisonData {
    name: string; 
    yield: number;
}