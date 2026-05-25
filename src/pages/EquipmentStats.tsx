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
    
    // UI 濡쒖뺄 ?곹깭 愿由?(?ㅻ뜑/?꾪꽣 諛??뺣젹)
    const [tempEquipmentIds, setTempEquipmentIds] = useState(appliedEquipmentIds);
    const [tempDate, setTempDate] = useState<DateRange | undefined>(appliedDate);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [sortBy, setSortBy] = useState("yield-asc");
    
    const equipmentParams = appliedEquipmentIds.length > 0 ? appliedEquipmentIds.join(',') : "all";
    
    // ?뙚 而ㅼ뒪? ??1以??몄텧: 紐⑤뱺 荑쇰━ ?몄텧 諛?紐⑸뜲?댄꽣 ?ㅼ쐞移?泥섎━ ?꾨퉬
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

    // 罹섎┛???댄깉 諛⑹뼱 ?몃뱾??
    const handleCalendarOpenChange = (open: boolean) => {
        setIsCalendarOpen(open);
        if (!open && !tempDate?.from) {
            setTempDate(appliedDate);
        }
    };
    
    // 議고쉶 ?몃━嫄??몃뱾??
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

    // ?뙚 媛怨??꾪꽣留??뺣젹 濡쒖쭅? 硫붾え?댁젣?댁뀡 泥섎━ ?좎?
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

            {/* 1. 怨듯넻 ??쒕낫???ㅻ뜑 */}
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

            {/* 2. ?λ퉬 KPI & 遺덈웾 ?먯씤 遺꾩꽍 洹몃━???뱀뀡 */}
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
            
            {/* 3. ?섎떒 ?곸꽭 ?λ퉬 遺꾩꽍 ?뚯씠釉?*/}
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

