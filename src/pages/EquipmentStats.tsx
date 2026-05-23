import { useState, useMemo } from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

// Hooks & Global Store
import { useFilterStore } from "@/store/useFilterStore"
import { useEquipmentQueries } from "@/hooks/useEquipmentQueries" // 🌟 새로 만든 커스텀 훅

// Layout Components
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { EquipmentKPIChart } from "@/components/chart/EquipmentKPIChart"
import { DefectCodeTable } from "@/components/table/DefectCodeTable"
import { DefectPieChart } from "@/components/chart/DefectPieChart"
import { EquipmentDetailTable } from "@/components/table/EquipmentDetailTable"

import { DEFECT_COLORS } from "@/data/mockData"

interface EquipmentStatsProps {
    setSelectedEquipment: (id: string) => void;
}

export function EquipmentStats({ setSelectedEquipment }: EquipmentStatsProps) {
    const { appliedEquipmentIds, appliedDate, setAppliedEquipmentIds, setAppliedDate, setLastUpdated } = useFilterStore();
    
    // UI 로컬 상태 관리 (헤더/필터 및 정렬)
    const [tempEquipmentIds, setTempEquipmentIds] = useState(appliedEquipmentIds);
    const [tempDate, setTempDate] = useState<DateRange | undefined>(appliedDate);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [sortBy, setSortBy] = useState("yield-asc");
    
    const equipmentParams = appliedEquipmentIds.length > 0 ? appliedEquipmentIds.join(',') : "all";
    
    // 🌟 커스텀 훅 1줄 호출: 모든 쿼리 호출 및 목데이터 스위칭 처리 완비
    const {
        downtimeRes,
        mtbfData,
        defectsData,
        equipmentList,
        availableEquipmentIds,
        isDowntimeLoading,
        isMtbfLoading,
        isDefectsLoading,
        isEquipmentListLoading
    } = useEquipmentQueries({ equipmentParams, appliedDate, appliedEquipmentIds });

    // 캘린더 이탈 방어 핸들러
    const handleCalendarOpenChange = (open: boolean) => {
        setIsCalendarOpen(open);
        if (!open && !tempDate?.from) {
            setTempDate(appliedDate);
        }
    };
    
    // 조회 트리거 핸들러
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

    // 🌟 가공/필터링/정렬 로직은 메모이제이션 처리 유지
    const filteredAndSortedData = useMemo(() => {
        const filtered = equipmentList.filter(eq => 
            appliedEquipmentIds.length === 0 ? true : appliedEquipmentIds.includes(eq.id)
        );

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "yield-asc": return a.yield - b.yield;
                case "yield-desc": return b.yield - a.yield;
                case "uptime-asc": return a.uptime - b.uptime;
                case "uptime-desc": return b.uptime - a.uptime;
                default: return 0;
            }
        });
    }, [equipmentList, appliedEquipmentIds, sortBy]); 

    return (
        <div className="animate-in fade-in duration-500 space-y-6">

            {/* 1. 공통 대시보드 헤더 */}
            <DashboardHeader 
                title="장비 현황 통계"
                subtitle="장비별 상세 수율 현황 및 설비 신뢰성 지표를 분석"
                equipment={tempEquipmentIds}
                onEquipmentChange={setTempEquipmentIds}
                equipmentOptions={availableEquipmentIds}
                date={tempDate}
                onDateChange={setTempDate}
                onSearch={handleSearch}
                isCalendarOpen={isCalendarOpen}
                onCalendarOpenChange={handleCalendarOpenChange}
            />

            {/* 2. 장비 KPI & 불량 원인 분석 그리드 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <EquipmentKPIChart 
                    downtimeRes={downtimeRes} 
                    mtbfData={mtbfData} 
                    isDowntimeLoading={isDowntimeLoading} 
                    isMtbfLoading={isMtbfLoading} 
                />

                <DefectCodeTable 
                    data={defectsData}
                    isLoading={isDefectsLoading}
                    className="col-span-1 lg:col-span-2" 
                />

                <DefectPieChart 
                    data={defectsData} 
                    colors={DEFECT_COLORS} 
                    isLoading={isDefectsLoading}
                    className="col-span-1"
                />
            </div>
            
            {/* 3. 하단 상세 장비 분석 테이블 */}
            <EquipmentDetailTable 
                data={filteredAndSortedData} 
                isLoading={isEquipmentListLoading}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onRowClick={setSelectedEquipment}
                appliedDate={appliedDate}
                selectedEquipmentIds={appliedEquipmentIds}
            />

        </div>
    )
}
