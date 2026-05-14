import { Clock, ShieldCheck, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, Tooltip } from "recharts"
import { cn } from "@/lib/utils"

import type { DowntimeTrendResponse } from "@/api/equipment"

// 필요한 데이터 타입 정의
interface ReliabilityKpiCardsProps {
    downtimeRes?: DowntimeTrendResponse; // 구체적인 타입이 있다면 교체해주세요
    mtbfData: any[];
    className?: string;
    isLoading?: boolean;
}

export function EquipmentKPIChart({ downtimeRes, mtbfData, className, isLoading }: ReliabilityKpiCardsProps) {

    const chartData = downtimeRes?.data || [];
    const currentUnit = downtimeRes?.unit || "hr";
    const displayUnit = currentUnit === "min" ? "분" : "시간";

    const totalDowntime = chartData.reduce((sum, item) => sum + item.value, 0).toFixed(1);
    
    return (
        <div className={cn("flex flex-col gap-4", className)}>
            {/* 총 비가동 시간 카드 (Area 차트) */}
            <Card className="flex-1 shadow-sm border-border flex flex-col min-w-0">
                <CardHeader className="pb-0 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground">총 비가동 시간</CardTitle>
                    <Clock className="w-4 h-4 text-destructive/80" />
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-col">
                    {isLoading ? (
                        // 🌟 로딩 중 스켈레톤 UI
                        <div className="w-full h-24 flex flex-col items-center justify-center bg-muted/10 animate-pulse border-t border-dashed border-border mt-2">
                            <Loader2 className="w-5 h-5 mb-1 animate-spin text-destructive/50" />
                            <p className="text-[10px] text-muted-foreground">데이터 집계 중...</p>
                        </div>
                    ) : (
                        <>
                            <div className="px-4 mt-1">
                                {/* 🌟 하드코딩된 값 대신 계산된 총합(totalDowntime)과 동적 단위(displayUnit) 적용 */}
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
                                        {/* 🌟 툴팁에 Zinc 테마 적용 */}
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
                                        {/* 🌟 dataKey를 "hours"에서 "value"로 변경하고 동적 단위 적용 */}
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
                    <div className="px-4 mt-1">
                        <span className="text-xl font-bold text-foreground">91.6 <span className="text-[11px] font-normal text-muted-foreground">시간/회</span></span>
                    </div>
                    <div className="flex-1 w-full mt-2 px-2 h-16 min-h-15">
                        <ResponsiveContainer width="100%" height="100%" debounce={50}>
                            <BarChart data={mtbfData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                                <Tooltip cursor={{ fill: '#27272a' }} contentStyle={{ fontSize: '10px', backgroundColor: '#18181b', borderColor: '#27272a' }} />
                                <XAxis dataKey="line" tick={{ fontSize: 8, fill: '#71717a' }} tickLine={false} axisLine={false} />
                                <Bar dataKey="hours" name="MTBF(hr)" fill="#10b981" radius={[2, 2, 0, 0]} barSize={16} isAnimationActive={false} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}