import { useState, useMemo } from "react"
import { isSameDay, format } from "date-fns"
import type { DateRange } from "react-day-picker"

// Hooks & Components
import { useFilterStore } from "@/store/useFilterStore"
import { useDashboardQueries } from "@/hooks/useDashboardQueries" // 🌟 커스텀 훅 임포트
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { KpiSummaryCards } from "@/components/card/KpiSummaryCards"
import { ParetoChart } from "@/components/chart/ParetoChart"
import { UptimePieChart } from "@/components/chart/UptimePieChart"
import { TrendChart } from "@/components/chart/TrendChart"
import { YieldComparisonChart } from "@/components/chart/YieldComparisonChart"

export function Dashboard() {
    const { appliedEquipmentIds, appliedDate, setAppliedEquipmentIds, setAppliedDate, setLastUpdated } = useFilterStore();
    
    // UI 로컬 상태 관리 (헤더/필터 전용)
    const [tempEquipmentIds, setTempEquipmentIds] = useState(appliedEquipmentIds);
    const [tempDate, setTempDate] = useState<DateRange | undefined>(appliedDate);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [trendUnit, setTrendUnit] = useState<"daily" | "weekly">("daily");

    // 쿼리에 찔러줄 파라미터 변환
    const equipmentParams = appliedEquipmentIds.length > 0 ? appliedEquipmentIds.join(',') : "all";

    // 🌟 커스텀 훅 호출: 모든 복잡한 쿼리와 방어로직이 이 한 줄로 요약됩니다.
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
        isParetoLoading
    } = useDashboardQueries({ equipmentParams, appliedDate, trendUnit });

    // 단일 날짜 여부 판단 계산
    const isSingleDay = useMemo(() => {
        if (!appliedDate?.from) return false;
        if (!appliedDate.to) return true;
        return isSameDay(appliedDate.from, appliedDate.to);
    }, [appliedDate]);
        
    // 캘린더 방어 핸들러
    const handleCalendarOpenChange = (open: boolean) => {
        setIsCalendarOpen(open);
        if (!open && !tempDate?.from) {
            setTempDate(appliedDate);
        }
    };
    
    // 조회 버튼 클릭 핸들러
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
            
            {/* 1. 상단 헤더 영역 */}
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

            {/* 2. 상단 지표 섹션 (KPI + 파레토 + 가동비율) */}
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

            {/* 3. 하단 트렌드 분석 섹션 (생산량/수율 트렌드 + 수율 비교) */}
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