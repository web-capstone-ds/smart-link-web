import { useState, useMemo } from "react"
import { isSameDay, format } from "date-fns"
import type { DateRange } from "react-day-picker"

// Hooks & Components
import { useFilterStore } from "@/store/useFilterStore"
import { useDashboardQueries } from "@/hooks/useDashboardQueries" // ?뙚 而ㅼ뒪? ???꾪룷??
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { KpiSummaryCards } from "@/components/card/KpiSummaryCards"
import { ParetoChart } from "@/components/chart/ParetoChart"
import { UptimePieChart } from "@/components/chart/UptimePieChart"
import { TrendChart } from "@/components/chart/TrendChart"
import { YieldComparisonChart } from "@/components/chart/YieldComparisonChart"
import { noDataMessage } from "@/data/emptyData"

export function Dashboard() {
    const { appliedEquipmentIds, appliedDate, setAppliedEquipmentIds, setAppliedDate, setLastUpdated } = useFilterStore();
    
    const [tempEquipmentIds, setTempEquipmentIds] = useState(appliedEquipmentIds);
    const [tempDate, setTempDate] = useState<DateRange | undefined>(appliedDate);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [trendUnit, setTrendUnit] = useState<"daily" | "weekly">("daily");

    const equipmentParams = appliedEquipmentIds.length > 0 ? appliedEquipmentIds.join(',') : "all";

    const {
        availableEquipmentIds,
        summaryData,
        statusData,
        trendData,
        yieldData,
        paretoData,
        isSummaryLoading,
        isTrendLoading,
        isYieldLoading,
        isParetoLoading,
        hasDataIssue
    } = useDashboardQueries({ equipmentParams, appliedDate, trendUnit });

    const isSingleDay = useMemo(() => {
        if (!appliedDate?.from) return false;
        if (!appliedDate.to) return true;
        return isSameDay(appliedDate.from, appliedDate.to);
    }, [appliedDate]);
        
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
        setAppliedEquipmentIds(tempEquipmentIds);
        setAppliedDate(tempDate);
        setIsCalendarOpen(false);
    };
    
    return (
        <div className="animate-in fade-in duration-500 space-y-6">
            
            {/* Header */}
            <DashboardHeader 
                title="종합 대시보드"
                subtitle="생산 공정 지표 분석 및 AI 예측 리포트"
                equipment={tempEquipmentIds}
                onEquipmentChange={setTempEquipmentIds}
                equipmentOptions={availableEquipmentIds}
                date={tempDate}
                onDateChange={setTempDate}
                onSearch={handleSearch}
                isCalendarOpen={isCalendarOpen}
                onCalendarOpenChange={handleCalendarOpenChange}
            />

            {hasDataIssue && (
                <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
                    {noDataMessage}
                </div>
            )}

            {/* Main */}
            <div className="space-y-4">
                <KpiSummaryCards 
                    isSingleDay={isSingleDay} 
                    data={summaryData}
                    isLoading={isSummaryLoading} 
                />

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                    <ParetoChart 
                        data={paretoData} 
                        className="xl:col-span-2" 
                        isLoading={isParetoLoading}
                    />
                    <UptimePieChart 
                        data={statusData}
                        uptimePercent={summaryData.kpi.availability}
                        isLoading={isSummaryLoading} 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <TrendChart 
                    data={trendData} 
                    isLoading={isTrendLoading}
                    trendUnit={trendUnit}
                    onTrendUnitChange={setTrendUnit}
                    className="xl:col-span-2" 
                />
                <YieldComparisonChart 
                    data={yieldData} 
                    equipmentIds={appliedEquipmentIds} 
                    isLoading={isYieldLoading}
                />
            </div>

        </div>
    )
}

