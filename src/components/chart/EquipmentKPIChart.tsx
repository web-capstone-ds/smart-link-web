import { Clock, ShieldCheck, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, Tooltip } from "recharts"
import { cn } from "@/lib/utils"

import type { DowntimeTrendResponse } from "@/api/equipment"

// 🌟 1. MTBF 데이터 타입 정의 추가
export interface MtbfDataPoint {
    name: string; // "DS-VIS-001" 또는 "05/01"
    hours: number;
}

interface ReliabilityKpiCardsProps {
    downtimeRes?: DowntimeTrendResponse; 
    mtbfData?: MtbfDataPoint[]; // 🌟 명확한 타입으로 교체
    className?: string;
    isDowntimeLoading?: boolean; // 로딩 상태를 명확히 분리하면 좋습니다
    isMtbfLoading?: boolean;     // MTBF 전용 로딩 상태
}

export function EquipmentKPIChart({ 
    downtimeRes, 
    mtbfData = [], // 기본값 빈 배열
    className, 
    isDowntimeLoading,
    isMtbfLoading 
}: ReliabilityKpiCardsProps) {

    // --- 비가동 시간 데이터 처리 ---
    const chartData = downtimeRes?.data || [];
    const currentUnit = downtimeRes?.unit || "hr";
    const displayUnit = currentUnit === "min" ? "분" : "시간";
    const totalDowntime = chartData.reduce((sum, item) => sum + item.value, 0).toFixed(1);
    
    // --- 🌟 MTBF 데이터 처리 (평균 계산) ---
    const avgMtbf = mtbfData.length > 0 
        ? (mtbfData.reduce((sum, item) => sum + item.hours, 0) / mtbfData.length).toFixed(1)
        : "0.0";

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            {/* 총 비가동 시간 카드 (Area 차트) */}
            <Card className="flex-1 shadow-sm border-border flex flex-col min-w-0">
                <CardHeader className="pb-0 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground">총 비가동 시간</CardTitle>
                    <Clock className="w-4 h-4 text-destructive/80" />
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-col">
                    {isDowntimeLoading ? (
                        <div className="w-full h-24 flex flex-col items-center justify-center bg-muted/10 animate-pulse border-t border-dashed border-border mt-2">
                            <Loader2 className="w-5 h-5 mb-1 animate-spin text-destructive/50" />
                            <p className="text-[10px] text-muted-foreground">데이터 집계 중...</p>
                        </div>
                    ) : (
                        <>
                            <div className="px-4 mt-1">
                                <span className="text-xl font-bold text-foreground">
                                    {totalDowntime} <span className="text-[11px] font-normal text-muted-foreground">{displayUnit}</span>
                                </span>
                            </div>
                            <div className="flex-1 w-full mt-2 h-16 min-h-15">
                                <ResponsiveContainer width="100%" height="100%" debounce={300}>
                                    <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--destructive)" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="var(--destructive)" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'var(--card)', 
                                                borderColor: 'var(--border)', 
                                                color: 'var(--card-foreground)',
                                                fontSize: '10px',
                                                borderRadius: '6px'
                                            }} 
                                            itemStyle={{ color: 'var(--card-foreground)' }}
                                            labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '2px' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="value" 
                                            name={`비가동(${currentUnit})`} 
                                            stroke="var(--destructive)" 
                                            fillOpacity={1} 
                                            fill="url(#colorDown)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* MTBF 평균 무고장 시간 카드 (Bar 차트) */}
            <Card className="flex-1 shadow-sm border-border flex flex-col min-w-0">
                <CardHeader className="pb-0 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground">평균 무고장 시간 (MTBF)</CardTitle>
                    <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-col">
                    {/* 🌟 MTBF 로딩 방어 로직 추가 */}
                    {isMtbfLoading ? (
                        <div className="w-full h-24 flex flex-col items-center justify-center bg-muted/10 animate-pulse border-t border-dashed border-border mt-2">
                            <Loader2 className="w-5 h-5 mb-1 animate-spin text-emerald-500/50" />
                            <p className="text-[10px] text-muted-foreground">데이터 분석 중...</p>
                        </div>
                    ) : (
                        <>
                            <div className="px-4 mt-1">
                                {/* 🌟 하드코딩 제거 및 계산된 평균 MTBF 적용 */}
                                <span className="text-xl font-bold text-foreground">{avgMtbf} <span className="text-[11px] font-normal text-muted-foreground">시간</span></span>
                            </div>
                            <div className="flex-1 w-full mt-2 px-2 h-20 min-h-20">
                                <ResponsiveContainer width="100%" height="100%" debounce={300}>
                                    <BarChart data={mtbfData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                                        {/* 🌟 툴팁 및 X축에 Zinc 테마 변수 적용 */}
                                        <Tooltip 
                                            cursor={{ fill: 'var(--muted)' }} 
                                            contentStyle={{ 
                                                fontSize: '10px', 
                                                backgroundColor: 'var(--card)', 
                                                borderColor: 'var(--border)',
                                                color: 'var(--card-foreground)',
                                                borderRadius: '6px'
                                            }} 
                                            itemStyle={{ color: 'var(--card-foreground)' }}
                                            labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '2px' }}
                                        />
                                        {/* 🌟 dataKey를 "line"에서 "name"으로 변경 (명세서 반영) */}
                                        <XAxis dataKey="name" tick={{ fontSize: 8, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                                        <Bar dataKey="hours" name="MTBF(hr)" fill="#10b981" radius={[2, 2, 0, 0]} barSize={16} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}