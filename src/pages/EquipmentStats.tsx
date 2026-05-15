import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchDowntimeTrend, fetchMtbf } from "@/api/equipment"

import type { DateRange } from "react-day-picker"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { useFilterStore } from "@/store/useFilterStore"

import { EquipmentKPIChart } from "@/components/chart/EquipmentKPIChart"
import { DefectCodeTable } from "@/components/table/DefectCodeTable"
import { DefectPieChart } from "@/components/chart/DefectPieChart"
import { EquipmentDetailTable } from "@/components/table/EquipmentDetailTable"

import { downtimeResponse as mockDowntimeResponse, mockMtbfData_All, mockMtbfData_Single, defectStatsData, paretoColors, equipmentComparisonData } from "@/data/mockData"

interface EquipmentStatsProps {
    setSelectedEquipment: (id: string) => void;
}

export function EquipmentStats({ setSelectedEquipment }: EquipmentStatsProps) {
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { appliedEquipmentIds, appliedDate, setAppliedEquipmentIds, setAppliedDate } = useFilterStore();
    const [tempEquipmentIds, setTempEquipmentIds] = useState(appliedEquipmentIds);
    const [tempDate, setTempDate] = useState<DateRange | undefined>(appliedDate);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
        
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

        setAppliedEquipmentIds(tempEquipmentIds);
        setAppliedDate(tempDate);
        setIsCalendarOpen(false);
    };

    const [sortBy, setSortBy] = useState("yield-asc");

    // 나중에 Zustand나 React Context API 같은 상태 관리 라이브러리를 사용해서 "이 라인/날짜 상태를 App.tsx 최상단에 하나만 두고 모든 페이지가 공유하게 묶기
    const filteredAndSortedData = useMemo(() => {
        // 1. 라인 필터링 (새로운 배열 반환)
        const filtered = equipmentComparisonData.filter(eq => 
            appliedEquipmentIds === "all" ? true : eq.line === appliedEquipmentIds
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
    }, [appliedEquipmentIds, sortBy]);
    
    // 🌟 1. 비가동 시간 트렌드 (Downtime)
    const { data: downtimeRes, isFetching: isDowntimeLoading, isError: isDowntimeError } = useQuery({
        queryKey: ["equipmentDowntime", appliedEquipmentIds, appliedDate],
        queryFn: () => fetchDowntimeTrend(appliedEquipmentIds, appliedDate),
        enabled: !!appliedDate?.from,
        retry: false,
    });

    const safeDowntimeRes = (isDowntimeError || !downtimeRes) ? mockDowntimeResponse : downtimeRes;

    // 🌟 2. 평균 무고장 시간 (MTBF) 추가!
    const { data: mtbfDataRaw, isFetching: isMtbfLoading, isError: isMtbfError } = useQuery({
        queryKey: ["equipmentMtbf", appliedEquipmentIds, appliedDate],
        queryFn: () => fetchMtbf(appliedEquipmentIds, appliedDate),
        enabled: !!appliedDate?.from,
        retry: false,
    });

    // 🌟 방어 로직: 에러 시 "all"인지 특정 장비인지에 따라 알맞은 목데이터를 꽂아줍니다!
    const safeMtbfData = (isMtbfError || !mtbfDataRaw || mtbfDataRaw.length === 0) 
        ? (appliedEquipmentIds === "all" ? mockMtbfData_All : mockMtbfData_Single) 
        : mtbfDataRaw;


    return (
        <div className="animate-in fade-in duration-500 space-y-6">

            <DashboardHeader 
                title="장비 현황 통계"
                subtitle="장비별 상세 수율 현황 및 설비 신뢰성 지표를 분석"
                equipment={tempEquipmentIds}
                onEquipmentChange={setTempEquipmentIds}
                date={tempDate}
                onDateChange={setTempDate}
                onSearch={handleSearch}
                isCalendarOpen={isCalendarOpen}
                onCalendarOpenChange={handleCalendarOpenChange}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                
                {/* 🌟 3. 두 가지 데이터와 두 가지 로딩 상태를 각각 분리해서 주입 */}
                <EquipmentKPIChart 
                    downtimeRes={safeDowntimeRes} 
                    mtbfData={safeMtbfData} 
                    isDowntimeLoading={isDowntimeLoading} 
                    isMtbfLoading={isMtbfLoading} 
                />

                <DefectCodeTable 
                    data={defectStatsData} // <- 다음 단계에서 수정할 녀석!
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