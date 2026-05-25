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
    
    // UI 濡쒖뺄 ?곹깭 愿由?(?ㅻ뜑/?꾪꽣 ?꾩슜)
    const [tempEquipmentIds, setTempEquipmentIds] = useState(appliedEquipmentIds);
    const [tempDate, setTempDate] = useState<DateRange | undefined>(appliedDate);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [trendUnit, setTrendUnit] = useState<"daily" | "weekly">("daily");

    // 荑쇰━??李붾윭以??뚮씪誘명꽣 蹂??
    const equipmentParams = appliedEquipmentIds.length > 0 ? appliedEquipmentIds.join(',') : "all";

    // ?뙚 而ㅼ뒪? ???몄텧: 紐⑤뱺 蹂듭옟??荑쇰━? 諛⑹뼱濡쒖쭅??????以꾨줈 ?붿빟?⑸땲??
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

    // ?⑥씪 ?좎쭨 ?щ? ?먮떒 怨꾩궛
    const isSingleDay = useMemo(() => {
        if (!appliedDate?.from) return false;
        if (!appliedDate.to) return true;
        return isSameDay(appliedDate.from, appliedDate.to);
    }, [appliedDate]);
        
    // 罹섎┛??諛⑹뼱 ?몃뱾??
    const handleCalendarOpenChange = (open: boolean) => {
        setIsCalendarOpen(open);
        if (!open && !tempDate?.from) {
            setTempDate(appliedDate);
        }
    };
    
    // 議고쉶 踰꾪듉 ?대┃ ?몃뱾??
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
            
            {/* 1. ?곷떒 ?ㅻ뜑 ?곸뿭 */}
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

            {/* 2. ?곷떒 吏???뱀뀡 (KPI + ?뚮젅??+ 媛?숇퉬?? */}
            <div className="space-y-4 p-5 bg-muted/20 rounded-xl border border-border/50">
                <KpiSummaryCards 
                    isSingleDay={isSingleDay} 
                    data={summaryData}
                    isLoading={isSummaryLoading} 
                />

                <div className="grid grid-cols-3 gap-4">
                    <ParetoChart 
                        data={paretoData} 
                        className="col-span-2" 
                        isLoading={isParetoLoading}
                    />
                    <UptimePieChart 
                        data={statusData}
                        uptimePercent={summaryData.kpi.availability}
                        isLoading={isSummaryLoading} 
                        className="col-span-1" 
                    />
                </div>
            </div>

            {/* 3. ?섎떒 ?몃젋??遺꾩꽍 ?뱀뀡 (?앹궛???섏쑉 ?몃젋??+ ?섏쑉 鍮꾧탳) */}
            <div className="grid grid-cols-3 gap-6">
                <TrendChart 
                    data={trendData} 
                    isLoading={isTrendLoading}
                    trendUnit={trendUnit}
                    onTrendUnitChange={setTrendUnit}
                    className="col-span-2" 
                />
                <YieldComparisonChart 
                    data={yieldData} 
                    equipmentIds={appliedEquipmentIds} 
                    isLoading={isYieldLoading}
                    className="col-span-1" 
                />
            </div>

        </div>
    )
}

