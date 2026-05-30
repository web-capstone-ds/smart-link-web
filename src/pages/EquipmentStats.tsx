import { useState, useMemo } from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

// Hooks & Global Store
import { useFilterStore } from "@/store/useFilterStore"
import { useEquipmentQueries } from "@/hooks/useEquipmentQueries" // ?뙚 ?덈줈 留뚮뱺 而ㅼ뒪? ??

// Layout Components
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { EquipmentKPIChart } from "@/components/chart/EquipmentKPIChart"
import { DefectCodeTable } from "@/components/table/DefectCodeTable"
import { DefectPieChart } from "@/components/chart/DefectPieChart"
import { EquipmentDetailTable } from "@/components/table/EquipmentDetailTable"

import { DEFECT_COLORS } from "@/data/mockData"
import { noDataMessage } from "@/data/emptyData"

interface EquipmentStatsProps {
    setSelectedEquipment: (id: string) => void;
}

export function EquipmentStats({ setSelectedEquipment }: EquipmentStatsProps) {
    const { appliedEquipmentIds, appliedDate, setAppliedEquipmentIds, setAppliedDate, setLastUpdated } = useFilterStore();
    
    const [tempEquipmentIds, setTempEquipmentIds] = useState(appliedEquipmentIds);
    const [tempDate, setTempDate] = useState<DateRange | undefined>(appliedDate);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [sortBy, setSortBy] = useState("risk-desc");
    
    const equipmentParams = appliedEquipmentIds.length > 0 ? appliedEquipmentIds.join(',') : "all";
    
    const {
        downtimeRes,
        mtbfData,
        defectsData,
        equipmentList,
        availableEquipmentIds,
        isDowntimeLoading,
        isMtbfLoading,
        isDefectsLoading,
        isEquipmentListLoading,
        hasDataIssue
    } = useEquipmentQueries({ equipmentParams, appliedDate, appliedEquipmentIds });

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

    const filteredAndSortedData = useMemo(() => {
        const filtered = equipmentList.filter(eq => 
            appliedEquipmentIds.length === 0 ? true : appliedEquipmentIds.includes(eq.id)
        );

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "risk-desc": return getRiskScore(b) - getRiskScore(a);
                case "yield-delta-asc": return getYieldDelta(a) - getYieldDelta(b);
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

            {/* Header */}
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

            {hasDataIssue && (
                <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
                    {noDataMessage}
                </div>
            )}

            {/* Main */}
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

function getYieldDelta(eq: { yield: number; yieldTrend: number[] }) {
    const firstTrend = eq.yieldTrend[0] ?? eq.yield;
    const lastTrend = eq.yieldTrend[eq.yieldTrend.length - 1] ?? eq.yield;
    return lastTrend - firstTrend;
}

function getRiskScore(eq: {
    unresolvedAlert: boolean;
    uptime: number;
    yield: number;
    total: number;
    fail: number;
    yieldTrend: number[];
}) {
    const failRate = eq.total > 0 ? (eq.fail / eq.total) * 100 : 0;
    const yieldDrop = Math.max(0, -getYieldDelta(eq));

    let score = 0;
    if (eq.unresolvedAlert) score += 100;
    if (eq.uptime < 90) score += 80;
    else if (eq.uptime < 95) score += 35;
    if (eq.yield < 97) score += 70;
    else if (eq.yield < 98) score += 30;
    if (failRate >= 2) score += 25;
    score += yieldDrop * 10;

    return score;
}

