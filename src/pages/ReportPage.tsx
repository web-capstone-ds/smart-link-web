import { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import type { DateRange } from "react-day-picker";

// Global Store & Hooks
import { useFilterStore } from "@/store/useFilterStore";
import { useReportQueries } from "@/hooks/useReportQueries";

// Sub Components
import { ReportHeader } from "@/components/layout/ReportHeader";
import { ReportDocument } from "@/components/ReportDocument";
import { noDataMessage } from "@/data/emptyData";

interface ReportPageProps {
    requestedEquipmentId?: string | null;
}

export function ReportPage({ requestedEquipmentId }: ReportPageProps) {
    const { appliedDate, setAppliedDate, setLastUpdated } = useFilterStore();
    
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
        isLoading,
        hasDataIssue
    } = useReportQueries({ appliedDate, reportMode, targetEq });

    const handleCalendarOpenChange = (open: boolean) => {
        setIsCalendarOpen(open);
        if (!open && !tempDate?.from) {
            setTempDate(appliedDate);
        }
    };

    const handleSearch = () => {
        if (!tempDate?.from) {
            alert("조회할 날짜를 선택해주세요.");
            setTempDate(appliedDate);
            return;
        }

        setLastUpdated(format(new Date(), "yyyy-MM-dd HH:mm 'KST'"));
        setAppliedDate(tempDate);
        setIsCalendarOpen(false);

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
            
            {/* Header */}
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

            {hasDataIssue && (
                <div className="w-[210mm] max-w-full rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
                    {noDataMessage}
                </div>
            )}
            {/* Main */}
            <div className="report-print-area flex flex-col items-center gap-8 print:block print:gap-0 print:m-0">
                {reportMode === "equipment" && (!targetEq || targetEq.length === 0) ? (
                    
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
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
}

