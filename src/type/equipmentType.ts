export interface DowntimeDataPoint {
    label: string;
    value: number;
}

export interface DowntimeTrendResponse {
    data: DowntimeDataPoint[];
    unit: "hr" | "min"; // 하루 조회 시 분(min), 기간 조회 시 시간(hr)
}

export interface MtbfDataPoint {
    name: string; // 전체 조회 시 장비명, 개별 조회 시 일자
    hours: number;
}

export interface DefectStat {
    code: string;
    name: string;
    type: string;
    count: number;
    ratio: string;
    impact: string;
}

export interface EquipmentStatus {
    id: string;
    recipe: string;
    uptime: number;
    total: number;
    fail: number;
    marginal: number;
    yield: number;
    majorDefect: string;
    unresolvedAlert: boolean;
    yieldTrend: number[];
}