import { Activity, BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DowntimeTrendResponse } from "@/type/equipmentType";
import type { EquipmentSummary, UptimeTimeline } from "@/type/equipmentDetailType";

interface UptimeDowntimeSectionProps {
    summaryData: EquipmentSummary;
    downtimeTrendData: DowntimeTrendResponse;
    isUptimeLoading: boolean;
    isDowntimeLoading: boolean;
}

export function UptimeDowntimeSection({
    summaryData,
    downtimeTrendData,
    isUptimeLoading,
    isDowntimeLoading,
}: UptimeDowntimeSectionProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-muted-foreground" /> 일일 가동 타임라인
                </h3>
                {isUptimeLoading ? <UptimeSkeleton /> : <UptimeCard summaryData={summaryData} />}
            </div>

            <div className="lg:col-span-1 flex flex-col">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-muted-foreground" /> 비가동 추이
                    </h3>
                    <span className="text-xs text-muted-foreground">
                        단위: {downtimeTrendData?.unit === "hr" ? "시간" : "분"}
                    </span>
                </div>

                <Card className="border-border shadow-sm flex-1 flex flex-col justify-center min-h-[200px]">
                    {isDowntimeLoading ? (
                        <CardContent className="p-4 h-full flex items-end justify-between gap-2 animate-pulse bg-muted/5">
                            {[24, 52, 35, 70, 44, 62, 30].map((height, index) => (
                                <div
                                    key={`trend-skel-${index}`}
                                    className="w-full bg-muted/20 rounded-t-sm"
                                    style={{ height: `${height}%` }}
                                />
                            ))}
                        </CardContent>
                    ) : (
                        <CardContent className="p-4 h-full animate-in fade-in duration-500">
                            <ResponsiveContainer width="100%" height="100%" debounce={50}>
                                <BarChart data={downtimeTrendData?.data || []} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#a1a1aa" }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fontSize: 9, fill: "#a1a1aa" }} tickLine={false} axisLine={false} domain={[0, "dataMax"]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: "11px", padding: "8px", borderRadius: "6px" }}
                                        itemStyle={{ padding: "2px 0", color: "#ef4444" }}
                                        cursor={{ fill: "#27272a", opacity: 0.4 }}
                                    />
                                    <Bar dataKey="value" name="비가동 시간" fill="#ef4444" radius={[2, 2, 0, 0]} barSize={16} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
}

function UptimeSkeleton() {
    return (
        <Card className="border-border animate-pulse bg-muted/5">
            <CardContent className="p-5">
                <div className="flex justify-between items-end mb-3">
                    <div className="space-y-2">
                        <div className="h-3 w-12 bg-muted/20 rounded" />
                        <div className="h-8 w-20 bg-muted/20 rounded" />
                    </div>
                    <div className="flex gap-3">
                        <div className="h-3 w-16 bg-muted/20 rounded" />
                        <div className="h-3 w-16 bg-muted/20 rounded" />
                        <div className="h-3 w-16 bg-muted/20 rounded" />
                    </div>
                </div>
                <div className="h-8 w-full bg-muted/20 rounded-md mb-2" />
                <div className="flex justify-between">
                    <div className="h-2 w-8 bg-muted/20 rounded" />
                    <div className="h-2 w-8 bg-muted/20 rounded" />
                    <div className="h-2 w-8 bg-muted/20 rounded" />
                </div>
            </CardContent>
        </Card>
    );
}

function UptimeCard({ summaryData }: { summaryData: EquipmentSummary }) {
    const downSegments = summaryData.uptime.timeline.filter((segment) => segment.status === "error");

    return (
        <Card className="border-border animate-in fade-in duration-500">
            <CardContent className="p-5">
                <div className="flex justify-between items-end mb-3">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-muted-foreground">총 가동률</p>
                        <p
                            className={cn(
                                "text-2xl font-black",
                                summaryData.uptime.totalRate < 90
                                    ? "text-destructive"
                                    : summaryData.uptime.totalRate < 95
                                        ? "text-amber-500"
                                        : "text-emerald-500",
                            )}
                        >
                            {summaryData.uptime.totalRate} <span className="text-sm font-normal text-muted-foreground">%</span>
                        </p>
                    </div>
                    <div className="flex gap-3 text-[10px] font-bold">
                        <span className="flex items-center gap-1 text-emerald-600">
                            <div className="w-2 h-2 bg-emerald-500 rounded-sm" /> Run ({summaryData.uptime.runHour}h)
                        </span>
                        <span className="flex items-center gap-1 text-amber-500">
                            <div className="w-2 h-2 bg-amber-400 rounded-sm" /> Idle ({summaryData.uptime.idleHour}h)
                        </span>
                        <span className="flex items-center gap-1 text-destructive">
                            <div className="w-2 h-2 bg-destructive rounded-sm" /> Down ({summaryData.uptime.downHour}h)
                        </span>
                    </div>
                </div>

                <div className="h-8 flex rounded-md overflow-hidden border border-border/50 relative group">
                    {summaryData.uptime.timeline.map((segment, index) => (
                        <TimelineSegment key={index} segment={segment} />
                    ))}
                </div>

                <div className="flex justify-between text-[10px] text-muted-foreground font-bold mt-2 px-1">
                    <span>{summaryData.uptime.timeline[0]?.start}</span>
                    {downSegments.length > 0 ? (
                        <span className="text-destructive/80">
                            총 {downSegments.length}건의 정지 발생
                        </span>
                    ) : (
                        <span />
                    )}
                    <span>{summaryData.uptime.timeline[summaryData.uptime.timeline.length - 1]?.end}</span>
                </div>
            </CardContent>
        </Card>
    );
}

function TimelineSegment({ segment }: { segment: UptimeTimeline }) {
    const isRun = segment.status === "run";
    const isIdle = segment.status === "idle";
    const bgClass = isRun
        ? "bg-emerald-500 hover:brightness-110"
        : isIdle
            ? "bg-amber-400 hover:brightness-110"
            : "bg-destructive hover:brightness-110 animate-pulse";
    const statusText = isRun ? "정상 가동" : isIdle ? "대기/휴지" : "정지";

    return (
        <div
            className={`${bgClass} h-full transition-all cursor-help relative`}
            style={{ width: `${segment.ratio}%` }}
            title={`${segment.start} - ${segment.end} (${statusText})`}
        />
    );
}
