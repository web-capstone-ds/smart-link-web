import { Sparkles } from "lucide-react";

import type { EquipmentSummary } from "@/type/equipmentDetailType";

interface AiInsightPanelProps {
    summaryData: EquipmentSummary;
    isLoading: boolean;
}

export function AiInsightPanel({ summaryData, isLoading }: AiInsightPanelProps) {
    if (isLoading) {
        return (
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-5 flex gap-4 animate-pulse">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-3">
                    <div className="h-4 w-40 bg-blue-500/20 rounded" />
                    <div className="space-y-2">
                        <div className="h-3 w-full bg-blue-500/10 rounded" />
                        <div className="h-3 w-[95%] bg-blue-500/10 rounded" />
                        <div className="h-3 w-[80%] bg-blue-500/10 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5 flex gap-4 animate-in fade-in duration-500">
            <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
                <h4 className="text-sm font-bold text-blue-500 mb-1.5">
                    {summaryData.aiInsight.title}
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {summaryData.aiInsight.description}
                </p>
            </div>
        </div>
    );
}
