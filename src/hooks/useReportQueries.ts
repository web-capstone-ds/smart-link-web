import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { 
    fetchReportSummary, 
    fetchQualityDistribution, 
    fetchReportHeatmap, 
    fetchReportAlarms, 
    fetchReportEquipments 
} from "@/api/report";
import { fetchDefectPareto } from "@/api/dashboard";
import { 
    mockReportSummary, 
    mockQualityDistribution, 
    mockReportHeatmap, 
    mockDefectStatsData, 
    mockReportAlarms, 
    mockEquipmentComparisonData 
} from "@/data/mockData";

interface UseReportQueriesProps {
    appliedDate: DateRange | undefined;
    reportMode: "daily" | "weekly" | "equipment";
    targetEq: string;
}

export function useReportQueries({ appliedDate, reportMode, targetEq }: UseReportQueriesProps) {
    // API에 꽂아줄 포맷팅된 문자열 날짜 계산
    const fromStr = appliedDate?.from ? format(appliedDate.from, 'yyyy-MM-dd') : "";
    const toStr = appliedDate?.to ? format(appliedDate.to, 'yyyy-MM-dd') : "";

    // 🌟 핵심 방어 조건: 필수 날짜가 있어야 하고, 장비 리포트 모드일 때는 반드시 장비 ID가 선택되어야 쿼리를 보냄
    const isEnabled = !!appliedDate?.from && (reportMode !== "equipment" || targetEq.length > 0);

    const commonOptions = {
        enabled: isEnabled,
        retry: false,
        staleTime: 1000 * 60 * 10,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    };

    // 1. 메인 리포트 요약 (KPI 등)
    const { data: reportData, isLoading: isReportLoading, isError: isReportError } = useQuery({
        queryKey: ["reportSummary", appliedDate, reportMode, targetEq],
        queryFn: () => fetchReportSummary(fromStr, toStr, reportMode, targetEq),
        ...commonOptions,
    });

    // 2. 품질(Cpk) 분포도
    const { data: qualityData, isLoading: isQualityLoading, isError: isQualityError } = useQuery({
        queryKey: ["reportQuality", appliedDate, reportMode, targetEq],
        queryFn: () => fetchQualityDistribution(fromStr, toStr, reportMode, targetEq),
        ...commonOptions,
    });

    // 3. 슬롯 히트맵 (장비 분석 모드 전용)
    const { data: heatmapData, isLoading: isHeatmapLoading, isError: isHeatmapError } = useQuery({
        queryKey: ["reportHeatmap", appliedDate, reportMode, targetEq],
        queryFn: () => fetchReportHeatmap(fromStr, toStr, reportMode, targetEq),
        ...commonOptions,
        enabled: !!appliedDate?.from && reportMode === "equipment" && targetEq.length > 0, // 하이퍼 방어
    });

    // 4. 불량 통계 (파레토)
    const { data: defectData, isLoading: isDefectLoading, isError: isDefectError } = useQuery({
        queryKey: ["reportDefects", appliedDate, reportMode, targetEq],
        queryFn: () => fetchDefectPareto(reportMode === "equipment" ? targetEq : "all", appliedDate),
        ...commonOptions,
    });

    // 5. 알람 내역 리스트
    const { data: alarmData, isLoading: isAlarmLoading, isError: isAlarmError } = useQuery({
        queryKey: ["reportAlarms", appliedDate, reportMode, targetEq],
        queryFn: () => fetchReportAlarms(fromStr, toStr, reportMode, targetEq),
        ...commonOptions,
    });

    // 6. 장비별 종합 비교 데이터
    const { data: equipmentData, isLoading: isEqLoading, isError: isEqError } = useQuery({
        queryKey: ["reportEquipments", appliedDate, reportMode, targetEq],
        queryFn: () => fetchReportEquipments(fromStr, toStr, reportMode, targetEq),
        ...commonOptions,
    });

    // --- 🌟 데이터 안전 가공/방어 레이어 ---
    const safeReportData = (isReportError || !reportData) ? mockReportSummary : reportData;
    const safeQualityData = (isQualityError || !qualityData) ? mockQualityDistribution : qualityData;
    const safeHeatmapData = (isHeatmapError || !heatmapData) ? mockReportHeatmap : heatmapData;
    const safeDefectData = (isDefectError || !defectData || defectData.length === 0) ? mockDefectStatsData : defectData;
    const safeAlarmData = (isAlarmError || !alarmData) ? mockReportAlarms : alarmData;
    const safeEquipmentData = (isEqError || !equipmentData) ? mockEquipmentComparisonData : equipmentData;

    // 전체 로딩 판단 통합
    const isAnyLoading = isReportLoading || isQualityLoading || (reportMode === "equipment" && isHeatmapLoading) || isDefectLoading || isAlarmLoading || isEqLoading;

    // 장비 드롭다운용 ID 추출
    const availableEquipmentIds = mockEquipmentComparisonData.map(eq => eq.id);

    return {
        safeReportData,
        safeQualityData,
        safeHeatmapData,
        safeDefectData,
        safeAlarmData,
        safeEquipmentData,
        availableEquipmentIds,
        isLoading: isAnyLoading
    };
}