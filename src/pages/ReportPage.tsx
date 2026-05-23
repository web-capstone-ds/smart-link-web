import { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import type { DateRange } from "react-day-picker";

// Global Store & Hooks
import { useFilterStore } from "@/store/useFilterStore";
import { useReportQueries } from "@/hooks/useReportQueries"; // 🌟 분리한 쿼리 훅 불러오기

// Sub Components
import { ReportHeader } from "@/components/layout/ReportHeader";
import { ReportDocument } from "@/components/ReportDocument";

interface ReportPageProps {
    requestedEquipmentId?: string | null;
}

export function ReportPage({ requestedEquipmentId }: ReportPageProps) {
    const { appliedDate, setAppliedDate, setLastUpdated } = useFilterStore();
    
    // UI 로컬 제어 상태
    const [targetEq, setTargetEq] = useState<string>("");
    const [tempDate, setTempDate] = useState<DateRange | undefined>(appliedDate);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const [reportMode, setReportMode] = useState<"daily" | "weekly" | "equipment">(
        appliedDate?.from && appliedDate?.to && !isSameDay(appliedDate.from, appliedDate.to)
            ? "weekly" 
            : "daily"  
    );

    useEffect(() => {
        if (!requestedEquipmentId) return;

        setReportMode("equipment");
        setTargetEq(requestedEquipmentId);
        setTempDate(appliedDate);
    }, [requestedEquipmentId, appliedDate]);

    const {
        safeReportData,
        safeQualityData,
        safeHeatmapData,
        safeDefectData,
        safeAlarmData,
        safeEquipmentData,
        availableEquipmentIds,
        isLoading
    } = useReportQueries({ appliedDate, reportMode, targetEq });

    // 달력 팝업 오프 롤백 처리 핸들러
    const handleCalendarOpenChange = (open: boolean) => {
        setIsCalendarOpen(open);
        if (!open && !tempDate?.from) {
            setTempDate(appliedDate);
        }
    };

    // 조회 트리거
    const handleSearch = () => {
        if (!tempDate?.from) {
            alert("조회할 날짜를 선택해주세요.");
            setTempDate(appliedDate);
            return;
        }

        setLastUpdated(format(new Date(), "yyyy-MM-dd HH:mm 'KST'"));
        setAppliedDate(tempDate);
        setIsCalendarOpen(false);

        // 일자 길이에 따른 일일/주간 자동 전환 로직
        if (reportMode !== "equipment") {
            if (!tempDate.to || isSameDay(tempDate.from, tempDate.to)) {
                setReportMode("daily");
            } else {
                setReportMode("weekly");
            }
        }
    };

    return (
        <div className="report-page flex flex-col items-center space-y-8 animate-in fade-in duration-500 pb-20 bg-muted/30 pt-8">
            
            {/* 1. 상단 분석 조건 컨트롤 바 패널 */}
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

            {/* 2. 메인 인쇄용 리포트 도큐먼트 출력 영역 */}
            <div className="report-print-area flex flex-col items-center gap-8 print:block print:gap-0 print:m-0">
                {reportMode === "equipment" && (!targetEq || targetEq.length === 0) ? (
                    
                    /* [Empty State] 장비 리포트 모드인데 장비가 안 고르고 비어있을 때 표출할 A4 예쁜 공백 템플릿 */
                    <div className="w-[210mm] h-[297mm] bg-white border border-dashed border-zinc-300 flex flex-col items-center justify-center shadow-sm shrink-0">
                        <div className="w-16 h-16 mb-4 rounded-full bg-zinc-100 flex items-center justify-center">
                            <span className="text-2xl">⚙️</span>
                        </div>
                        <h3 className="text-lg font-bold text-zinc-700 mb-2">대상 장비 미선택</h3>
                        <p className="text-sm font-medium text-zinc-400">상단 컨트롤 패널에서 분석할 장비를 선택하시면 리포트가 생성됩니다.</p>
                    </div>
                    
                ) : (
                    
                    /* 실제 리포트 뷰 */
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
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
}
