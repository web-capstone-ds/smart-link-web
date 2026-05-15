import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchDashboardSummary, fetchDashboardTrend, fetchYieldComparison, fetchDefectPareto } from "@/api/dashboard"

// Header
import type { DateRange } from "react-day-picker"
import { isSameDay, format } from "date-fns"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { useFilterStore } from "@/store/useFilterStore"

// Component
import { KpiSummaryCards } from "@/components/dashboard/KpiSummaryCards"
import { ParetoChart } from "@/components/chart/ParetoChart"
import { UptimePieChart } from "@/components/chart/UptimePieChart"
import { TrendChart } from "@/components/chart/TrendChart"
import { YieldComparisonChart } from "@/components/chart/YieldComparisonChart"

// Data
import { 
    trendData as mockTrendData, paretoData as mockParetoData, 
    lineYieldData as mockLineYieldData, equipmentYieldData as mockEquipmentYieldData,
    dashboardSummary as mockDashboardSummary,
} from "@/data/mockData";


export function Dashboard() {
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { appliedEquipmentIds, appliedDate, setAppliedEquipmentIds, setAppliedDate } = useFilterStore();
    const [tempEquipmentIds, setTempEquipmentIds] = useState(appliedEquipmentIds);
    const [tempDate, setTempDate] = useState<DateRange | undefined>(appliedDate);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    
    const [trendUnit, setTrendUnit] = useState<"daily" | "weekly">("daily");

    const isSingleDay = useMemo(() => {
        if (!appliedDate?.from) return false;
        if (!appliedDate.to) return true;
        return isSameDay(appliedDate.from, appliedDate.to);
    }, [appliedDate]);
        
    const handleCalendarOpenChange = (open: boolean) => {
        setIsCalendarOpen(open);
        if (!open) {
            if (!tempDate?.from) {
                setTempDate(appliedDate);
            }
        }
    };
    
    const handleSearch = () => {
        // 방어 로직: 유저가 날짜를 지워놓고 조회를 누르면 경고 후 이전 날짜로 롤백
        if (!tempDate?.from) {
            alert("조회할 날짜를 선택해주세요.");
            setTempDate(appliedDate);
            return;
        }

        setAppliedEquipmentIds(tempEquipmentIds);
        setAppliedDate(tempDate);
        setIsCalendarOpen(false);
    };
    

    // 1 KPI
    const { data: summaryData, isLoading: isSummaryLoading, isError: isSummaryError } = useQuery({
        queryKey: ["dashboardSummary", appliedEquipmentIds, appliedDate],
        queryFn: () => fetchDashboardSummary(appliedEquipmentIds, appliedDate),
        enabled: !!appliedDate?.from,
        retry: false,
    });

    const safeSummaryData = (isSummaryError || !summaryData)
    ? { 
        kpi: mockDashboardSummary.kpi, 
        status: mockDashboardSummary.status,
        aiMessage: "서버 연결 오류로 인한 기본 분석 메시지입니다."
      }
    : summaryData;

    const safeStatusData = [
        { name: "Run (가동)", value: safeSummaryData.status.run, color: "#10b981" },
        { name: "Idle (대기)", value: safeSummaryData.status.idle, color: "#f59e0b" },
        { name: "Down (정지)", value: safeSummaryData.status.down, color: "#ef4444" },
    ];

    // 2 TrendChart

   const { data: trendDataRaw, isFetching: isTrendLoading, isError: isTrendError} = useQuery({
        queryKey: ["dashboardTrend", appliedEquipmentIds, appliedDate, trendUnit], 
        queryFn: () => fetchDashboardTrend(appliedEquipmentIds, appliedDate, trendUnit),
        enabled: !!appliedDate?.from,
    });

    // 🌟 방어 로직: 에러가 났거나 배열이 텅 비어있다면 목데이터를 쓴다!
    const safeTrendData = (isTrendError || !trendDataRaw || trendDataRaw.length === 0)
        ? mockTrendData
        : trendDataRaw;
    
    // 3 Yield Chart

    const { data: yieldDataRaw, isLoading: isYieldLoading, isError: isYieldError } = useQuery({
        queryKey: ["yieldComparison", appliedEquipmentIds, appliedDate],
        queryFn: () => fetchYieldComparison(appliedEquipmentIds, appliedDate),
        enabled: !!appliedDate?.from,
        retry: false,
    });

    // 🌟 방어 로직: 에러 시 appliedLine 상태에 따라 알맞은 목데이터를 꽂아줍니다!
    const safeYieldData = (isYieldError || !yieldDataRaw || yieldDataRaw.length === 0)
        ? (appliedEquipmentIds === "all" ? mockLineYieldData : mockEquipmentYieldData)
        : yieldDataRaw;
    
    

    // 4  Pareto Chart
    const { data: paretoDataRaw, isLoading: isParetoLoading, isError: isParetoError } = useQuery({
        queryKey: ["defectPareto", appliedEquipmentIds, appliedDate],
        queryFn: () => fetchDefectPareto(appliedEquipmentIds, appliedDate),
        enabled: !!appliedDate?.from,
        retry: false,
    });

    // 🌟 방어 로직
    const safeParetoData = (isParetoError || !paretoDataRaw || paretoDataRaw.length === 0)
        ? mockParetoData
        : paretoDataRaw;

    //const isUsingMockData = isSummaryError || !summaryData?.kpi || isTrendError || !trendDataRaw;
    //const isLoading = isSummaryLoading || isTrendLoading;

    return (
        <div className="animate-in fade-in duration-500 space-y-6">
            
            {/*isUsingMockData && !isLoading && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 p-2.5 text-xs text-center font-bold rounded-lg flex items-center justify-center gap-2">
                    <span>⚠️ 서버 통신 문제로 임시 시뮬레이션 데이터를 표시 중입니다. (상단 요약)</span>
                </div>
            )*/}

            <DashboardHeader 
                title="종합 대시보드"
                subtitle="생산 공정 지표 분석 및 AI 예측 리포트"
                equipment={tempEquipmentIds}
                onEquipmentChange={setTempEquipmentIds}
                date={tempDate}
                onDateChange={setTempDate}
                onSearch={handleSearch}
                isCalendarOpen={isCalendarOpen}
                onCalendarOpenChange={handleCalendarOpenChange}
            />

            <div className="space-y-4 p-5 bg-muted/20 rounded-xl border border-border/50">

                <KpiSummaryCards 
                    isSingleDay={isSingleDay} 
                    data={safeSummaryData}
                    isLoading={isSummaryLoading} 
                />

                <div className="grid grid-cols-3 gap-4">

                    <ParetoChart 
                        data={safeParetoData} 
                        className="col-span-2" 
                        isLoading={isParetoLoading}
                    />

                    <UptimePieChart 
                        data={safeStatusData}
                        uptimePercent={safeSummaryData.kpi.availability}
                        isLoading={isSummaryLoading} 
                        className="col-span-1" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                
                <TrendChart 
                    data={safeTrendData} 
                    isLoading={isTrendLoading}
                    trendUnit={trendUnit}                // <--- 현재 상태 전달
                    onTrendUnitChange={setTrendUnit}     // <--- 상태 변경 함수 전달
                    className="col-span-2" 
                />

                <YieldComparisonChart 
                    data={safeYieldData} 
                    equipmentIds={appliedEquipmentIds} 
                    isLoading={isYieldLoading}
                    className="col-span-1" 
                />

            </div>
        </div>
    )
}