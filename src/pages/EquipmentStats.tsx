import { useState, useMemo } from "react"
import { useFilterStore } from "@/store/useFilterStore"

import type { DateRange } from "react-day-picker"
import { isSameDay } from "date-fns"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"

import { EquipmentKPIChart } from "@/components/chart/EquipmentKPIChart"
import { DefectCodeTable } from "@/components/table/DefectCodeTable"
import { DefectPieChart } from "@/components/chart/DefectPieChart"
import { EquipmentDetailTable } from "@/components/table/EquipmentDetailTable"

import { downtimeData, mtbfData, defectStatsData, paretoColors, equipmentComparisonData } from "@/data/mockData"

interface EquipmentStatsProps {
    setSelectedEquipment: (id: string) => void;
}

export function EquipmentStats({ setSelectedEquipment }: EquipmentStatsProps) {
    
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

    const [sortBy, setSortBy] = useState("yield-asc");

    // 나중에 Zustand나 React Context API 같은 상태 관리 라이브러리를 사용해서 "이 라인/날짜 상태를 App.tsx 최상단에 하나만 두고 모든 페이지가 공유하게 묶기
    const filteredAndSortedData = useMemo(() => {
        // 1. 라인 필터링 (새로운 배열 반환)
        const filtered = equipmentComparisonData.filter(eq => 
            appliedLine === "all" ? true : eq.line === appliedLine
        );

        // 2. 정렬 (원본 오염 방지를 위해 [...filtered] 로 복사 후 정렬!)
        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "yield-asc": return a.yield - b.yield;
                case "yield-desc": return b.yield - a.yield;
                case "uptime-asc": return a.uptime - b.uptime;
                case "uptime-desc": return b.uptime - a.uptime;
                default: return 0;
            }
        });
    }, [appliedLine, sortBy]);

    return (
        <div className="animate-in fade-in duration-500 space-y-6">

            <DashboardHeader 
                title="장비 현황 통계"
                subtitle="장비별 상세 수율 현황 및 설비 신뢰성 지표를 분석"
                line={tempLine}
                onLineChange={setTempLine}
                date={tempDate}
                onDateChange={setTempDate}
                onSearch={handleSearch}isCalendarOpen={isCalendarOpen}
                onCalendarOpenChange={handleCalendarOpenChange}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                
                <EquipmentKPIChart
                    downtimeData={downtimeData} 
                    mtbfData={mtbfData} 
                    className="col-span-1" 
                />

                <DefectCodeTable 
                    data={defectStatsData} 
                    className="col-span-1 lg:col-span-2" 
                />

                <DefectPieChart 
                    data={defectStatsData} 
                    colors={paretoColors} 
                    className="col-span-1" 
                />

            </div>

            <EquipmentDetailTable 
                data={filteredAndSortedData} 
                sortBy={sortBy} 
                onSortChange={setSortBy} 
                onRowClick={setSelectedEquipment} 
            />

        </div>
    )
}