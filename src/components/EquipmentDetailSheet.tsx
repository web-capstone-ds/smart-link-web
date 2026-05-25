import { useEffect, useState } from "react";

import { AiInsightPanel } from "@/components/equipment-detail/AiInsightPanel";
import { DataIssueAlert } from "@/components/equipment-detail/DataIssueAlert";
import { EquipmentDetailHeader } from "@/components/equipment-detail/EquipmentDetailHeader";
import { HistoryTimelineSection } from "@/components/equipment-detail/HistoryTimelineSection";
import { ParameterTableSection } from "@/components/equipment-detail/ParameterTableSection";
import { SpcHeatmapSection } from "@/components/equipment-detail/SpcHeatmapSection";
import { UptimeDowntimeSection } from "@/components/equipment-detail/UptimeDowntimeSection";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useDetailEquipmentQueries } from "@/hooks/useDetailEquipmentQueries";
import { useAuthStore } from "@/store/useAuthStore";
import { useFilterStore } from "@/store/useFilterStore";

interface EquipmentDetailSheetProps {
    selectedEquipment: string | null;
    setSelectedEquipment: (id: string | null) => void;
    onOpenEquipmentReport: (id: string) => void;
}

export function EquipmentDetailSheet({
    selectedEquipment,
    setSelectedEquipment,
    onOpenEquipmentReport,
}: EquipmentDetailSheetProps) {
    const [readyEquipment, setReadyEquipment] = useState<string | null>(null);
    const useMockData = useAuthStore((state) => state.useMockData);
    const { appliedDate } = useFilterStore();
    const targetDate = appliedDate?.to || appliedDate?.from || new Date();
    const isReady = !useMockData || readyEquipment === selectedEquipment;

    useEffect(() => {
        if (!selectedEquipment || !useMockData) return;

        const timer = setTimeout(() => setReadyEquipment(selectedEquipment), 1000);
        return () => clearTimeout(timer);
    }, [selectedEquipment, useMockData]);

    const {
        summaryData,
        spcData,
        heatmapData,
        historyData,
        downtimeTrendData,
        isSummaryLoading,
        isSpcLoading,
        isHeatmapLoading,
        isHistoryLoading,
        isDowntimeLoading,
        hasDataIssue,
    } = useDetailEquipmentQueries({ selectedEquipment, targetDate, isReady });

    return (
        <Sheet open={!!selectedEquipment} onOpenChange={(open) => !open && setSelectedEquipment(null)}>
            <SheetContent side="right" className="w-[90vw] max-w-350! overflow-y-auto custom-scrollbar p-0">
                <EquipmentDetailHeader
                    selectedEquipment={selectedEquipment}
                    info={summaryData?.info}
                    targetDate={targetDate}
                    isSummaryLoading={isSummaryLoading}
                    onOpenEquipmentReport={onOpenEquipmentReport}
                />

                <div className="p-6 space-y-8">
                    {hasDataIssue && <DataIssueAlert />}

                    <AiInsightPanel
                        summaryData={summaryData}
                        isLoading={!isReady || isSummaryLoading}
                    />

                    <UptimeDowntimeSection
                        summaryData={summaryData}
                        downtimeTrendData={downtimeTrendData}
                        isUptimeLoading={!isReady || isSummaryLoading}
                        isDowntimeLoading={!isReady || isDowntimeLoading}
                    />

                    <SpcHeatmapSection
                        spcData={spcData}
                        heatmapData={heatmapData}
                        isSpcLoading={!isReady || isSpcLoading}
                        isHeatmapLoading={!isReady || isHeatmapLoading}
                    />

                    <ParameterTableSection
                        summaryData={summaryData}
                        isLoading={!isReady || isSummaryLoading}
                    />

                    <HistoryTimelineSection
                        historyData={historyData}
                        isReady={isReady}
                        isHistoryLoading={isHistoryLoading}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
