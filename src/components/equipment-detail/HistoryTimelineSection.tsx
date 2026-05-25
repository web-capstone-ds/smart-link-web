import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { EquipmentHistory } from "@/type/equipmentDetailType";

interface HistoryTimelineSectionProps {
    historyData: EquipmentHistory[];
    isReady: boolean;
    isHistoryLoading: boolean;
}

export function HistoryTimelineSection({
    historyData,
    isReady,
    isHistoryLoading,
}: HistoryTimelineSectionProps) {
    return (
        <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-muted-foreground" /> 최근 조치 이력 및 처리 현황
            </h3>
            <Card className="border-border shadow-sm p-6">
                {isReady && !isHistoryLoading && (!historyData || historyData.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <CheckCircle2 className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm font-medium">최근 조치 이력이 없습니다.</p>
                        <p className="text-xs opacity-70 mt-1">이 장비는 안정적으로 가동 중입니다.</p>
                    </div>
                ) : (
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-border before:to-transparent">
                        {!isReady || isHistoryLoading ? (
                            <HistorySkeleton />
                        ) : (
                            historyData.map((item, index) => (
                                <HistoryTimelineItem key={item.id || index} item={item} />
                            ))
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
}

function HistorySkeleton() {
    return (
        <>
            {[1, 2].map((index) => (
                <div key={`history-skeleton-${index}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse animate-pulse">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted shrink-0 md:order-1" />
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-border/40 bg-muted/5 space-y-3">
                        <div className="flex justify-between">
                            <div className="h-4 w-16 bg-muted/20 rounded" />
                            <div className="h-3 w-12 bg-muted/10 rounded" />
                        </div>
                        <div className="h-4 w-1/2 bg-muted/20 rounded" />
                        <div className="h-3 w-full bg-muted/10 rounded" />
                    </div>
                </div>
            ))}
        </>
    );
}

function HistoryTimelineItem({ item }: { item: EquipmentHistory }) {
    const isUnresolved = item.status === "unresolved";

    return (
        <div
            className={cn(
                "relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-in fade-in duration-500",
                isUnresolved && "is-active",
            )}
        >
            <div
                className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow",
                    isUnresolved ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground",
                )}
            >
                {isUnresolved ? (
                    <AlertTriangle className="w-4 h-4 animate-pulse" />
                ) : (
                    <CheckCircle2 className="w-4 h-4" />
                )}
            </div>

            <div
                className={cn(
                    "w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border shadow-sm",
                    isUnresolved ? "border-destructive/30 bg-destructive/5" : "border-border bg-card",
                )}
            >
                <div className="flex items-center justify-between mb-1">
                    {isUnresolved ? (
                        <Badge variant="destructive" className="text-[9px] h-4 py-0">
                            미조치
                        </Badge>
                    ) : (
                        <span className="text-[10px] font-bold text-emerald-500">
                            조치 완료 {item.worker ? `(${item.worker})` : ""}
                        </span>
                    )}
                    <time className={cn("text-[11px] font-medium", isUnresolved ? "text-destructive" : "text-muted-foreground")}>
                        {item.time} {isUnresolved ? "(현재)" : ""}
                    </time>
                </div>

                <div className="text-sm font-bold text-foreground mb-1">{item.title}</div>
                <div className="text-xs text-muted-foreground mb-2">{item.description}</div>

                {item.yieldChange && (
                    <div className="flex items-center gap-2 text-[10px] bg-muted/40 dark:bg-muted/20 p-1.5 rounded w-fit mt-3">
                        <span className="text-muted-foreground">수율 변화</span>
                        <span className="line-through text-muted-foreground/70">{item.yieldChange.before}%</span>
                        <span className="text-muted-foreground/50">→</span>
                        <span className="text-emerald-500 font-bold">{item.yieldChange.after}%</span>
                    </div>
                )}
            </div>
        </div>
    );
}
