import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, isSameDay } from "date-fns";
import type { DateRange } from "react-day-picker";
// 분리할 하위 컴포넌트들 (파일을 따로 파서 임포트한다고 가정)
import { ReportHeader } from "@/components/layout/ReportHeader";
import { ReportDocument } from "@/components/ReportDocument";

// 앞서 만든 리포트 API 및 목데이터 임포트
import { fetchReportSummary, fetchQualityDistribution, fetchReportHeatmap, fetchReportAlarms, fetchReportEquipments } from "@/api/report";
import { fetchDefectPareto, } from "@/api/dashboard";
import { equipmentComparisonData as mockEquipmentComparisonData, mockReportSummary, mockQualityDistribution, mockReportHeatmap, defectStatsData, mockReportAlarms} from "@/data/mockData"; 

import { useFilterStore } from "@/store/useFilterStore";

export function ReportPage() {
    // 🌟 1. 리포트 전용 필터 상태 관리
    const [targetEq, setTargetEq] = useState<string>("");
    
    const { appliedDate, setAppliedDate, setLastUpdated } = useFilterStore();
    const [tempDate, setTempDate] = useState<DateRange | undefined>(appliedDate);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const [reportMode, setReportMode] = useState<"daily" | "weekly" | "equipment">(
        appliedDate?.from && appliedDate?.to && !isSameDay(appliedDate.from, appliedDate.to)
            ? "weekly" 
            : "daily"  
    );

    // 🌟 2. 달력 팝업 여닫기 핸들러 (취소/바깥 클릭 시 롤백)
    const handleCalendarOpenChange = (open: boolean) => {
        setIsCalendarOpen(open);
        if (!open && !tempDate?.from) {
            setTempDate(appliedDate);
        }
    };

    // 🌟 3. 조회 버튼 핸들러 (여기서 실제 상태 적용 및 reportMode 자동 전환!)
    const handleSearch = () => {
        if (!tempDate?.from) {
            alert("조회할 날짜를 선택해주세요.");
            setTempDate(appliedDate);
            return;
        }

        setLastUpdated(format(new Date(), "yyyy-MM-dd HH:mm 'KST'"));
        // 찐 상태로 확정 및 달력 닫기
        setAppliedDate(tempDate);
        setIsCalendarOpen(false);

        // 💡 조회 시점에 날짜 길이에 따라 일일/기간누적 모드 자동 스위칭
        if (reportMode !== "equipment") {
            if (!tempDate.to || isSameDay(tempDate.from, tempDate.to)) {
                setReportMode("daily"); // 하루면 일일 리포트
            } else {
                setReportMode("weekly"); // 여러 날짜면 기간 누적 리포트
            }
        }
    };

    // 🌟 2. 메인 리포트 요약 API 호출
    const { 
        data: reportData, 
        isLoading: isReportLoading, 
        isError: isReportError 
    } = useQuery({
        queryKey: ["reportSummary", appliedDate, reportMode, targetEq],
        queryFn: () => fetchReportSummary(
            appliedDate?.from ? format(appliedDate.from, 'yyyy-MM-dd') : "",
            appliedDate?.to ? format(appliedDate.to, 'yyyy-MM-dd') : "",
            reportMode,
            targetEq
        ),
        retry: false,
        enabled: !!appliedDate?.from && (reportMode !== "equipment" || targetEq.length > 0),

        staleTime: 1000 * 60 * 10, // 10분 동안은 데이터를 '신선한(Fresh)' 상태로 유지하여 재조회 안 함
        refetchOnMount: false, // 다른 화면(대시보드)에 갔다가 돌아와도 재조회 안 함
        refetchOnWindowFocus: false, // 다른 창 띄웠다가 돌아와도 재조회 안 함
    });

    const safeReportData = (isReportError || !reportData) ? mockReportSummary : reportData;

    // 🌟 3. 품질(Cpk) 분포도 및 AI 치수 분석 API 호출 (6-4)
    const {
        data: qualityData,
        isLoading: isQualityLoading,
        isError: isQualityError
    } = useQuery({
        queryKey: ["reportQuality", appliedDate, reportMode, targetEq],
        queryFn: () => fetchQualityDistribution(
            appliedDate?.from ? format(appliedDate.from, 'yyyy-MM-dd') : "",
            appliedDate?.to ? format(appliedDate.to, 'yyyy-MM-dd') : "",
            reportMode,
            targetEq
        ),
        retry: false,
        enabled: !!appliedDate?.from && (reportMode !== "equipment" || targetEq.length > 0),

        staleTime: 1000 * 60 * 10, // 10분 동안은 데이터를 '신선한(Fresh)' 상태로 유지하여 재조회 안 함
        refetchOnMount: false, // 다른 화면(대시보드)에 갔다가 돌아와도 재조회 안 함
        refetchOnWindowFocus: false, // 다른 창 띄웠다가 돌아와도 재조회 안 함
    });

    const safeQualityData = (isQualityError || !qualityData) ? mockQualityDistribution : qualityData;

    // 🌟 4. 슬롯 히트맵 API 호출 (6-6)
    const {
        data: heatmapData,
        isLoading: isHeatmapLoading,
        isError: isHeatmapError
    } = useQuery({
        queryKey: ["reportHeatmap", appliedDate, reportMode, targetEq],
        queryFn: () => fetchReportHeatmap(
            appliedDate?.from ? format(appliedDate.from, 'yyyy-MM-dd') : "",
            appliedDate?.to ? format(appliedDate.to, 'yyyy-MM-dd') : "",
            reportMode,
            targetEq
        ),
        retry: false,
        enabled: !!appliedDate?.from && reportMode === "equipment" && targetEq.length > 0,

        staleTime: 1000 * 60 * 10, // 10분 동안은 데이터를 '신선한(Fresh)' 상태로 유지하여 재조회 안 함
        refetchOnMount: false, // 다른 화면(대시보드)에 갔다가 돌아와도 재조회 안 함
        refetchOnWindowFocus: false, // 다른 창 띄웠다가 돌아와도 재조회 안 함
    });

    const safeHeatmapData = (isHeatmapError || !heatmapData) ? mockReportHeatmap : heatmapData;

    // 🌟 5. 불량 통계(파레토) API 호출 (6-3)
    // (기존 대시보드용 fetchDefectPareto 함수를 재활용한다고 가정)
    const {
        data: defectData,
        isLoading: isDefectLoading,
        isError: isDefectError
    } = useQuery({
        queryKey: ["reportDefects", appliedDate, reportMode, targetEq],
        queryFn: () => fetchDefectPareto(
            reportMode === "equipment" ? targetEq : "all", 
            appliedDate
        ),
        retry: false,
        enabled: !!appliedDate?.from && (reportMode !== "equipment" || targetEq.length > 0),

        staleTime: 1000 * 60 * 10, // 10분 동안은 데이터를 '신선한(Fresh)' 상태로 유지하여 재조회 안 함
        refetchOnMount: false, // 다른 화면(대시보드)에 갔다가 돌아와도 재조회 안 함
        refetchOnWindowFocus: false, // 다른 창 띄웠다가 돌아와도 재조회 안 함
    });

    // 방어 로직: 기존 UI에서 사용하던 defectStatsData(또는 mockParetoData)를 기본값으로 사용
    const safeDefectData = (isDefectError || !defectData || defectData.length === 0) 
        ? defectStatsData 
        : defectData;


        //알람
    const {
        data: alarmData,
        isLoading: isAlarmLoading,
        isError: isAlarmError
    } = useQuery({
        queryKey: ["reportAlarms", appliedDate, reportMode, targetEq],
        queryFn: () => fetchReportAlarms(
            appliedDate?.from ? format(appliedDate.from, 'yyyy-MM-dd') : "",
            appliedDate?.to ? format(appliedDate.to, 'yyyy-MM-dd') : "",
            reportMode,
            targetEq
        ),
        retry: false,
        enabled: !!appliedDate?.from && (reportMode !== "equipment" || targetEq.length > 0),

        staleTime: 1000 * 60 * 10, // 10분 동안은 데이터를 '신선한(Fresh)' 상태로 유지하여 재조회 안 함
        refetchOnMount: false, // 다른 화면(대시보드)에 갔다가 돌아와도 재조회 안 함
        refetchOnWindowFocus: false, // 다른 창 띄웠다가 돌아와도 재조회 안 함
    });

    // 방어 로직 (데이터 없으면 목데이터 바인딩)
    const safeAlarmData = (isAlarmError || !alarmData) ? mockReportAlarms : alarmData;

    const {
        data: equipmentData,
        isLoading: isEqLoading,
        isError: isEqError
    } = useQuery({
        queryKey: ["reportEquipments", appliedDate, reportMode, targetEq],
        queryFn: () => fetchReportEquipments(
            appliedDate?.from ? format(appliedDate.from, 'yyyy-MM-dd') : "",
            appliedDate?.to ? format(appliedDate.to, 'yyyy-MM-dd') : "",
            reportMode, targetEq
        ),
        retry: false,
        enabled: !!appliedDate?.from && (reportMode !== "equipment" || targetEq.length > 0),

        staleTime: 1000 * 60 * 10, // 10분 동안은 데이터를 '신선한(Fresh)' 상태로 유지하여 재조회 안 함
        refetchOnMount: false, // 다른 화면(대시보드)에 갔다가 돌아와도 재조회 안 함
        refetchOnWindowFocus: false, // 다른 창 띄웠다가 돌아와도 재조회 안 함
    });

    // 💡 방어 로직: 에러 시 기존에 쓰던 mockData 활용!
    const safeEquipmentData = (isEqError || !equipmentData) ? mockEquipmentComparisonData : equipmentData;

    // 🌟 6. 전체 로딩 상태 통합 (하나라도 로딩 중이면 스켈레톤/블러 표시)
    const isAnyLoading = isReportLoading || isQualityLoading || (reportMode === "equipment" && isHeatmapLoading) || isDefectLoading || isAlarmLoading || isEqLoading;

    // 장비 드롭다운 옵션 추출 (에러 시 목데이터 활용)
    const availableEquipmentIds = useMemo(() => {
        return mockEquipmentComparisonData.map(eq => eq.id);
    }, []);

    
    return (
        <div className="flex flex-col items-center space-y-8 animate-in fade-in duration-500 pb-20 bg-muted/30 pt-8">
            
            {/* 🌟 1. 컨트롤 패널 (상단 툴바) 분리 적용 */}
            <ReportHeader 
                reportMode={reportMode}
                setReportMode={setReportMode}
                targetEq={targetEq}
                setTargetEq={setTargetEq}
                equipmentOptions={availableEquipmentIds}

                date={tempDate} 
                onDateChange={setTempDate}
                isCalendarOpen={isCalendarOpen}
                onCalendarOpenChange={handleCalendarOpenChange}
                onSearch={handleSearch}
            />

            <div className="flex flex-col items-center gap-8 print:block print:gap-0 print:m-0">
                    {reportMode === "equipment" && (!targetEq || targetEq.length === 0) ? (
                        
                        // [안내 화면] A4 사이즈의 예쁜 빈 껍데기
                        <div className="w-[210mm] h-[297mm] bg-white border border-dashed border-zinc-300 flex flex-col items-center justify-center shadow-sm shrink-0">
                            <div className="w-16 h-16 mb-4 rounded-full bg-zinc-100 flex items-center justify-center">
                                <span className="text-2xl">⚙️</span>
                            </div>
                            <h3 className="text-lg font-bold text-zinc-700 mb-2">대상 장비 미선택</h3>
                            <p className="text-sm font-medium text-zinc-400">상단 컨트롤 패널에서 분석할 장비를 선택하시면 리포트가 생성됩니다.</p>
                        </div>
                        
                    ) : (
           
            <ReportDocument 
                reportMode={reportMode}
                targetEq={targetEq}
                
                safeReportData={safeReportData}
                safeQualityData={safeQualityData}
                safeHeatmapData={safeHeatmapData}
                safeDefectData={safeDefectData}
                safeAlarmData={safeAlarmData}
                safeEquipmentData={safeEquipmentData}

                appliedDate={appliedDate}
                isLoading={isAnyLoading}
            />
            )}
            </div>
        </div>
    );
}