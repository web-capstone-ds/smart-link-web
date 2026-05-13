import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

// Header
import type { DateRange } from "react-day-picker"
import { isSameDay } from "date-fns"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { useFilterStore } from "@/store/useFilterStore"

// Component
import { KpiSummaryCards } from "@/components/dashboard/KpiSummaryCards"
import { ParetoChart } from "@/components/chart/ParetoChart"
import { UptimePieChart } from "@/components/chart/UptimePieChart"
import { TrendChart } from "@/components/chart/TrendChart"
import { YieldComparisonChart } from "@/components/chart/YieldComparisonChart"

// Data
import { trendData, paretoData, lineYieldData, equipmentYieldData, statusData } from "@/data/mockData";

export function Dashboard() {
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { appliedLine, appliedDate, setAppliedLine, setAppliedDate } = useFilterStore();
    const [tempLine, setTempLine] = useState(appliedLine);
    const [tempDate, setTempDate] = useState<DateRange | undefined>(appliedDate);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    
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

        setAppliedLine(tempLine);
        setAppliedDate(tempDate);
        setIsCalendarOpen(false);

        // 💡 나중에 백엔드 API 호출 로직(axios.get...)도 이 안에서 실행하면 됩니다!
    };

    return (
        <div className="animate-in fade-in duration-500 space-y-6">
            
            <DashboardHeader 
                title="종합 대시보드"
                subtitle="생산 공정 지표 분석 및 AI 예측 리포트"
                line={tempLine}
                onLineChange={setTempLine}
                date={tempDate}
                onDateChange={setTempDate}
                onSearch={handleSearch}isCalendarOpen={isCalendarOpen}
                onCalendarOpenChange={handleCalendarOpenChange}
            />

            <div className="space-y-4 p-5 bg-muted/20 rounded-xl border border-border/50">

                <KpiSummaryCards isSingleDay={isSingleDay} />

                <div className="grid grid-cols-3 gap-4">

                    <ParetoChart data={paretoData} className="col-span-2" />

                    <UptimePieChart data={statusData} uptimePercent={84} className="col-span-1" />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                
                <TrendChart data={trendData} className="col-span-2" />

                <YieldComparisonChart 
                    data={appliedLine === "all" ? lineYieldData : equipmentYieldData} 
                    line={appliedLine} 
                    className="col-span-1" 
                />

            </div>
        </div>
    )
}