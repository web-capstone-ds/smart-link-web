import { Grid3X3, TrendingUp } from "lucide-react";
import { CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { EquipmentHeatmap, EquipmentSPCTrend, HeatmapSlot } from "@/type/equipmentDetailType";

interface SpcHeatmapSectionProps {
    spcData: EquipmentSPCTrend[];
    heatmapData: EquipmentHeatmap;
    isSpcLoading: boolean;
    isHeatmapLoading: boolean;
}

export function SpcHeatmapSection({
    spcData,
    heatmapData,
    isSpcLoading,
    isHeatmapLoading,
}: SpcHeatmapSectionProps) {
    return (
        <div className="grid grid-cols-2 gap-6">
            <Card className="shadow-sm border-border min-w-0">
                <CardHeader className="py-3 px-4 border-b border-border/50 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" /> 수율 및 SPC 추이
                    </CardTitle>
                    <Badge variant="outline" className="text-[9px] font-normal h-4 py-0 text-muted-foreground border-border">
                        최근 7 LOT
                    </Badge>
                </CardHeader>

                {isSpcLoading ? (
                    <CardContent className="h-48 pt-4 px-4 pb-3 animate-pulse bg-muted/5 flex flex-col justify-between">
                        <div className="space-y-6 w-full pt-2">
                            <div className="h-[1px] w-full bg-muted/20" />
                            <div className="h-[1px] w-full bg-muted/20" />
                            <div className="h-[1px] w-full bg-muted/10" />
                        </div>
                        <div className="flex justify-between px-2 pt-2">
                            {[0, 1, 2, 3, 4].map((index) => (
                                <div key={index} className="h-2 w-8 bg-muted/20 rounded" />
                            ))}
                        </div>
                    </CardContent>
                ) : (
                    <CardContent className="h-48 pt-4 px-2 pb-0 animate-in fade-in duration-500">
                        <ResponsiveContainer width="100%" height="100%" debounce={50}>
                            <ComposedChart data={spcData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="lot" tick={{ fontSize: 9, fill: "#a1a1aa" }} tickLine={false} axisLine={false} />
                                <YAxis domain={["auto", 100]} tick={{ fontSize: 9, fill: "#a1a1aa" }} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: "11px", padding: "8px", borderRadius: "6px" }}
                                    itemStyle={{ padding: "2px 0" }}
                                />
                                <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "5px" }} iconSize={8} />
                                <Line type="step" dataKey="lcl" name="관리하한(LCL)" stroke="#ef4444" strokeDasharray="4 4" dot={false} strokeWidth={1.5} />
                                <Line type="monotone" dataKey="equipAvg" name="장비 평균" stroke="#71717a" dot={false} strokeWidth={2} />
                                <Line type="monotone" dataKey="yield" name="LOT 수율" stroke="#3b82f6" dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }} activeDot={{ r: 5 }} strokeWidth={2.5} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </CardContent>
                )}
            </Card>

            <Card className="shadow-sm border-border min-w-0">
                <CardHeader className="py-3 px-4 border-b border-border/50 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Grid3X3 className="w-4 h-4 text-muted-foreground" /> 결함 슬롯 히트맵
                    </CardTitle>
                    {!isHeatmapLoading && heatmapData?.patternName && (
                        <Badge
                            variant={heatmapData.patternName.includes("집중") ? "destructive" : "outline"}
                            className="text-[9px] font-bold h-4 py-0"
                        >
                            패턴: {heatmapData.patternName}
                        </Badge>
                    )}
                </CardHeader>

                {isHeatmapLoading ? (
                    <CardContent className="h-48 flex items-center justify-center p-4 bg-muted/5 animate-pulse">
                        <div className="grid grid-cols-4 gap-2 w-full h-full max-h-32">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div key={`heatmap-skeleton-${index}`} className="bg-muted/20 border border-border/40 rounded-md" />
                            ))}
                        </div>
                    </CardContent>
                ) : (
                    <CardContent className="h-48 flex items-center justify-center p-4 bg-background animate-in fade-in duration-500">
                        <div className="grid grid-cols-4 gap-2 w-full h-full max-h-32">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <HeatmapCell
                                    key={index}
                                    index={index}
                                    slot={heatmapData?.slots?.find((slot) => slot.zAxisNum === index)}
                                />
                            ))}
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}

function HeatmapCell({ index, slot }: { index: number; slot?: HeatmapSlot }) {
    const safeSlot = slot || {
        zAxisNum: index,
        passCount: 0,
        failCount: 0,
        dominantError: null,
        severity: "normal",
    };
    const severityClass =
        safeSlot.severity === "critical"
            ? "border-destructive/50 bg-destructive/10 text-destructive"
            : safeSlot.severity === "warning"
                ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                : "border-border/80 bg-muted/20 text-muted-foreground hover:border-muted-foreground/30";

    return (
        <div
            className={cn("border rounded-md p-2 flex flex-col justify-between transition-colors cursor-help relative", severityClass)}
            title={`슬롯 ${index} | 양품: ${safeSlot.passCount} | 불량: ${safeSlot.failCount}${safeSlot.dominantError ? ` | 주요 에러: ${safeSlot.dominantError}` : ""}`}
        >
            <div className="flex justify-between items-start">
                <span className="text-[10px] font-black tracking-wider opacity-90">Z-{index}</span>
                {safeSlot.failCount > 0 && (
                    <span className="text-[9px] font-bold px-1 rounded bg-background/40">
                        F:{safeSlot.failCount}
                    </span>
                )}
            </div>
            <div className="text-right">
                <span className="text-[9px] font-medium block truncate">
                    {safeSlot.dominantError || "OK"}
                </span>
            </div>
        </div>
    );
}
