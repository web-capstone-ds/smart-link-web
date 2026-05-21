import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchDashboardSummary, fetchDashboardTrend, fetchYieldComparison, fetchDefectPareto } from "@/api/dashboard"
import { fetchEquipmentStatusList } from "@/api/equipment"

// Header
import type { DateRange } from "react-day-picker"
import { isSameDay, format } from "date-fns"
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { useFilterStore } from "@/store/useFilterStore"

// Component
import { KpiSummaryCards } from "@/components/card/KpiSummaryCards"
import { ParetoChart } from "@/components/chart/ParetoChart"
import { UptimePieChart } from "@/components/chart/UptimePieChart"
import { TrendChart } from "@/components/chart/TrendChart"
import { YieldComparisonChart } from "@/components/chart/YieldComparisonChart"

// Data
import { 
    trendData as mockTrendData, paretoData as mockParetoData, 
    lineYieldData as mockLineYieldData, equipmentYieldData as mockEquipmentYieldData,
    dashboardSummary as mockDashboardSummary, equipmentComparisonData as mockEquipmentComparisonData
} from "@/data/mockData";


export function Dashboard() {
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { appliedEquipmentIds, appliedDate, setAppliedEquipmentIds, setAppliedDate, setLastUpdated } = useFilterStore();
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

        setLastUpdated(format(new Date(), "yyyy-MM-dd HH:mm 'KST'"));
        setAppliedEquipmentIds(tempEquipmentIds);
        setAppliedDate(tempDate);
        setIsCalendarOpen(false);
    };
    
    // 🌟 0. 헤더 장비 선택기(Select) 옵션용 장비 목록 호출
    // 화면에 표를 그리진 않더라도, 셀렉트 박스에 띄워줄 ID 목록이 필요하므로 "all"로 호출합니다.
    const { data: eqListForSelect } = useQuery({
        queryKey: ["equipmentListForSelect", appliedDate],
        queryFn: () => fetchEquipmentStatusList("all", appliedDate),
        enabled: !!appliedDate?.from,
    });

    // 받아온 전체 장비 데이터에서 ID만 쏙쏙 뽑아내서 배열로 만듭니다.
    const availableEquipmentIds = useMemo(() => {
        // 서버에서 아직 안 왔거나 에러가 났다면 빈 배열(또는 기본 목업 배열) 반환
        if (!eqListForSelect || eqListForSelect.length === 0) {
            // 방어를 위해 기본 장비 ID 몇 개를 임시로 넣어둘 수도 있습니다.
            return mockEquipmentComparisonData.map(eq => eq.id);
        }
        return eqListForSelect.map(eq => eq.id);
    }, [eqListForSelect]);

    const equipmentParams = appliedEquipmentIds.length > 0 ? appliedEquipmentIds.join(',') : "all";

    // 1 KPI
    const { data: summaryData, isLoading: isSummaryLoading, isError: isSummaryError } = useQuery({
        queryKey: ["dashboardSummary", equipmentParams, appliedDate], // 👈 equipmentParams 적용
        queryFn: () => fetchDashboardSummary(equipmentParams, appliedDate),
        enabled: !!appliedDate?.from,
        retry: false,

        staleTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
        refetchOnMount: false,     // 컴포넌트 마운트 시(메뉴 이동 시) 재조회 금지
        refetchOnWindowFocus: false, // 브라우저 창 활성화 시 재조회 금지
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
        queryKey: ["dashboardTrend", equipmentParams, appliedDate, trendUnit], 
        queryFn: () => fetchDashboardTrend(equipmentParams, appliedDate, trendUnit),
        enabled: !!appliedDate?.from,
        retry: false,

        staleTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
        refetchOnMount: false,     // 컴포넌트 마운트 시(메뉴 이동 시) 재조회 금지
        refetchOnWindowFocus: false, // 브라우저 창 활성화 시 재조회 금지
    });

    // 🌟 방어 로직: 에러가 났거나 배열이 텅 비어있다면 목데이터를 쓴다!
    const safeTrendData = (isTrendError || !trendDataRaw || trendDataRaw.length === 0)
        ? mockTrendData
        : trendDataRaw;
    
    // 3 Yield Chart

    const { data: yieldDataRaw, isLoading: isYieldLoading, isError: isYieldError } = useQuery({
        queryKey: ["yieldComparison", equipmentParams, appliedDate],
        queryFn: () => fetchYieldComparison(equipmentParams, appliedDate),
        enabled: !!appliedDate?.from,
        retry: false,

        staleTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
        refetchOnMount: false,     // 컴포넌트 마운트 시(메뉴 이동 시) 재조회 금지
        refetchOnWindowFocus: false, // 브라우저 창 활성화 시 재조회 금지
    });

    // 🌟 방어 로직: 에러 시 appliedLine 상태에 따라 알맞은 목데이터를 꽂아줍니다!
    const safeYieldData = (isYieldError || !yieldDataRaw || yieldDataRaw.length === 0)
        ? (equipmentParams === "all" ? mockLineYieldData : mockEquipmentYieldData)
        : yieldDataRaw;
    
    

    // 4  Pareto Chart
    const { data: paretoDataRaw, isLoading: isParetoLoading, isError: isParetoError } = useQuery({
        queryKey: ["defectPareto", equipmentParams, appliedDate],
        queryFn: () => fetchDefectPareto(equipmentParams, appliedDate),
        enabled: !!appliedDate?.from,
        retry: false,

        staleTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
        refetchOnMount: false,     // 컴포넌트 마운트 시(메뉴 이동 시) 재조회 금지
        refetchOnWindowFocus: false, // 브라우저 창 활성화 시 재조회 금지
    });

    // 🌟 방어 로직
    const safeParetoData = (isParetoError || !paretoDataRaw || paretoDataRaw.length === 0)
        ? mockParetoData
        : paretoDataRaw;

    //const isUsingMockData = isSummaryError || !summaryData?.kpi || isTrendError || !trendDataRaw;

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
                equipmentOptions={availableEquipmentIds}
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