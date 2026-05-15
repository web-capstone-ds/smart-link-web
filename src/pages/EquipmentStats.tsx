import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchDowntimeTrend, fetchMtbf, fetchDefects, fetchEquipmentStatusList } from "@/api/equipment"

import type { DateRange } from "react-day-picker"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { useFilterStore } from "@/store/useFilterStore"

import { EquipmentKPIChart } from "@/components/chart/EquipmentKPIChart"
import { DefectCodeTable } from "@/components/table/DefectCodeTable"
import { DefectPieChart } from "@/components/chart/DefectPieChart"
import { EquipmentDetailTable } from "@/components/table/EquipmentDetailTable"

import { downtimeResponse as mockDowntimeResponse, mockMtbfData_All, mockMtbfData_Single, defectStatsData as mockDefectStatsData,
     DEFECT_COLORS, equipmentComparisonData as mockEquipmentComparisonData } from "@/data/mockData"

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
    
    // 🌟 1. 비가동 시간 트렌드 (Downtime)
    const { data: downtimeRes, isFetching: isDowntimeLoading, isError: isDowntimeError } = useQuery({
        queryKey: ["equipmentDowntime", appliedEquipmentIds, appliedDate],
        queryFn: () => fetchDowntimeTrend(appliedEquipmentIds, appliedDate),
        enabled: !!appliedDate?.from,
    });

    // 🌟 수정: 서버에서 받은 data 배열이 텅 비어있을 때도 목데이터를 쓰도록 조건을 추가합니다!
    const safeDowntimeRes = (
        isDowntimeError ||                 // 통신 에러가 났거나
        !downtimeRes ||                    // 아예 데이터가 없거나
        !downtimeRes.data                  // data 속성이 없거나
        //||downtimeRes.data.length === 0      
    ) 
        ? mockDowntimeResponse 
        : downtimeRes;
        
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

    console.log("safeDowntimeRes", safeDowntimeRes);
    
    const { 
        data: defectsRes, 
        isFetching: isDefectsLoading, 
        isError: isDefectsError 
    } = useQuery({
        queryKey: ["equipmentDefects", appliedEquipmentIds, appliedDate],
        queryFn: () => fetchDefects(appliedEquipmentIds, appliedDate),
        enabled: !!appliedDate?.from,
        retry: false,
    });

    // 🌟 2. 강력한 방어 로직: 에러, null, 빈 배열일 경우 모두 목데이터로 대체!
    const safeDefectsData = (
        isDefectsError || 
        !defectsRes || 
        defectsRes.length === 0
    ) 
        ? mockDefectStatsData // 기환님이 작성하신 목데이터
        : defectsRes;

    const { 
        data: equipmentListRes, 
        isFetching: isEquipmentListLoading, 
        isError: isEquipmentListError 
    } = useQuery({
        queryKey: ["equipmentList", appliedEquipmentIds, appliedDate],
        queryFn: () => fetchEquipmentStatusList(appliedEquipmentIds, appliedDate),
        enabled: !!appliedDate?.from,
        retry: false, // 개발/디버깅 편의를 위해 일단 false
    });

    // 🌟 2. 강력한 방어 로직: 에러, null, 빈 배열 시 목데이터 스위칭
    const safeEquipmentList = (
        isEquipmentListError || 
        !equipmentListRes || 
        equipmentListRes.length === 0
    ) 
        ? mockEquipmentComparisonData // 기환님이 data/mockData.ts 에 준비해두신 목데이터
        : equipmentListRes;
        
        // 🌟 서버에서 받은(혹은 목데이터로 대체된) 데이터를 기반으로 필터링 및 정렬 수행
    const filteredAndSortedData = useMemo(() => {
        
        // 1. 장비 필터링 (명세 변경 반영: eq.line -> eq.id)
        const filtered = safeEquipmentList.filter(eq => 
            appliedEquipmentIds === "all" ? true : eq.id === appliedEquipmentIds
        );

        // 2. 정렬 (기존의 훌륭한 얕은 복사 정렬 로직 유지!)
        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "yield-asc": return a.yield - b.yield;
                case "yield-desc": return b.yield - a.yield;
                case "uptime-asc": return a.uptime - b.uptime;
                case "uptime-desc": return b.uptime - a.uptime;
                default: return 0;
            }
        });
    }, [safeEquipmentList, appliedEquipmentIds, sortBy]); 

    return (
        <div className="animate-in fade-in duration-500 space-y-6 ">

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
                    data={safeDefectsData}
                    isLoading={isDefectsLoading}
                    className="col-span-1 lg:col-span-2" 
                />

                <DefectPieChart 
                    data={safeDefectsData} 
                    colors={DEFECT_COLORS} 
                    isLoading={isDefectsLoading}
                    className="col-span-1"
                />

            </div>
            
            <EquipmentDetailTable 
                data={filteredAndSortedData} 
                isLoading={isEquipmentListLoading}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onRowClick={setSelectedEquipment}
            />

        </div>
        
    )
}