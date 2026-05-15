import axios from "axios";

// 🌟 5-1. 장비 요약 정보 타입 정의
export interface EquipmentSummaryInfo {
    recipe: string;
    currentLot: string;
    status: "Normal" | "Warning" | "Critical" | string;
}

export interface AIInsight {
    title: string;
    description: string;
}

export interface UptimeTimeline {
    status: "run" | "idle" | "error";
    start: string;
    end: string;
    ratio: number;
}

export interface EquipmentUptime {
    totalRate: number;
    runHour: number;
    idleHour: number;
    downHour: number;
    timeline: UptimeTimeline[];
}

export interface EquipmentParameter {
    name: string;
    avg: number;
    max: number;
    usl: number;
    zScore: number;
    isError: boolean;
}

export interface EquipmentSummary {
    info: EquipmentSummaryInfo;
    aiInsight: AIInsight;
    uptime: EquipmentUptime;
    parameters: EquipmentParameter[];
}

export const fetchEquipmentSummary = async (equipmentId: string): Promise<EquipmentSummary> => {
    // 빠른 응답(200ms 이내) 명세 반영 (목데이터용 딜레이를 짧게 줍니다)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await axios.get(`/api/v1/equipments/${equipmentId}/summary`);
    
    if (!response.data || !response.data.data) {
        throw new Error("장비 상세 데이터를 불러오지 못했습니다.");
    }

    return response.data.data;
};

export interface EquipmentSPCTrend {
    lot: string;         // LOT 해시 약칭 (8자리)
    yield: number;       // 해당 LOT의 장비 수율
    equipAvg: number;    // 🌟 변경: 라인 평균 대신 해당 장비의 누적 평균 수율
    lcl: number;         // 관리 하한선 (Lower Control Limit)
}

/**
 * 특정 장비의 최근 수율 및 SPC 트렌드 목록을 조회합니다.
 * @param equipmentId 장비 고유 ID
 * @param limit 조회할 LOT 개수 (기본값 7)
 */
export const fetchEquipmentSPCTrend = async (
    equipmentId: string,
    limit: number = 7
): Promise<EquipmentSPCTrend[]> => {
    
    // UI 로딩 스켈레톤 테스트를 위한 0.5초 대기 딜레이
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 명세서 규격 반영: /api/v1/equipments/{equipmentId}/spc-trend?limit=7
    const response = await axios.get(`/api/v1/equipments/${equipmentId}/spc-trend`, {
        params: { 
            limit 
        }
    });
    
    // 예외 처리 및 방어 로직 (기환 님의 형식을 그대로 유지)
    if (!response.data || !response.data.data) {
        throw new Error("서버에서 수율 및 SPC 추이 데이터를 받지 못했습니다.");
    }

    return response.data.data; 
};

// 🌟 5-3. 결함 히트맵 슬롯 상세 인터페이스
export interface HeatmapSlot {
    zAxisNum: number;          // 0 ~ 7 슬롯 번호
    passCount: number;         // 양품 수
    failCount: number;         // 불량 수
    dominantError: string | null; // 가장 많이 발생한 에러 코드 (예: "ET=12")
    severity?: "critical" | "warning" | "normal" | string; // 위험도 등급
}

// 결함 히트맵 전체 데이터 인터페이스
export interface EquipmentHeatmap {
    patternName: string;       // AI가 분석한 패턴명
    slots: HeatmapSlot[];      // 8개 슬롯 데이터 배열
}

/**
 * 특정 장비의 슬롯별 결함 히트맵 데이터를 조회합니다.
 */
export const fetchEquipmentHeatmap = async (equipmentId: string): Promise<EquipmentHeatmap> => {
    // 로딩 상태 체감을 위한 가짜 딜레이 (0.4초)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 명세서 규격: /api/v1/equipments/{equipmentId}/heatmap
    const response = await axios.get(`/api/v1/equipments/${equipmentId}/heatmap`);
    
    if (!response.data || !response.data.data) {
        throw new Error("서버에서 히트맵 데이터를 받지 못했습니다.");
    }

    return response.data.data;
};

// 🌟 5-4. 최근 조치 내역 인터페이스
export interface YieldChange {
    before: number;
    after: number;
}

export interface EquipmentHistory {
    id: string;
    status: "unresolved" | "resolved" | string;
    time: string;
    title: string;
    description: string;
    worker: string | null;
    yieldChange: YieldChange | null;
}

/**
 * 특정 장비의 최근 설비 조치 및 알람 히스토리 내역을 조회합니다.
 */
export const fetchEquipmentHistory = async (equipmentId: string): Promise<EquipmentHistory[]> => {
    // 스켈레톤 UI 확인용 0.4초 딜레이
    await new Promise(resolve => setTimeout(resolve, 400));

    const response = await axios.get(`/api/v1/equipments/${equipmentId}/history`);
    
    if (!response.data || !response.data.data) {
        throw new Error("서버에서 조치 내역 히스토리를 받지 못했습니다.");
    }

    return response.data.data;
};