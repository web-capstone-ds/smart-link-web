import { useState } from "react"
import { Loader2, LineChart as LineChartIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
    ResponsiveContainer,
    ComposedChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
    Line
} from "recharts"

type TrendUnitType = "daily" | "weekly" | "monthly";

// 🌟 차트 데이터 타입 정의
export interface TrendData {
    date: string;
    production: number;
    yield: number;
}

interface ProductionTrendChartProps {
    data: TrendData[];
    trendUnit: TrendUnitType; // 🌟 부모로부터 현재 선택된 단위를 받음
    onTrendUnitChange: (value: TrendUnitType) => void; // 🌟 부모의 상태를 변경할 리모컨 함수를 받음
    className?: string;
    isLoading?: boolean;
}

export function TrendChart({ data, trendUnit, onTrendUnitChange, className, isLoading }: ProductionTrendChartProps) {

    const unitText = trendUnit === "daily" ? "7일" : trendUnit === "weekly" ? "7주" : "7개월";
    const chartTitle = `기준일 대비 최근 ${unitText} 트렌드`;

    return (
        <Card className={cn("shadow-sm border-border pt-2", className)}>
            <CardHeader className="py-3 pb-2 border-b border-border/50 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <LineChartIcon className="w-4 h-4 text-muted-foreground" /> {chartTitle}
                </CardTitle>
                
                {/* 로컬 차트 전용 단위 변경 필터 */}
                <Select value={trendUnit} onValueChange={(value) => onTrendUnitChange(value as TrendUnitType)}>
                    <SelectTrigger className="w-27.5 h-8 text-xs bg-background">
                        <SelectValue placeholder="단위 선택" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily" className="text-xs">일별 (Daily)</SelectItem>
                        <SelectItem value="weekly" className="text-xs">주별 (Weekly)</SelectItem>
                        <SelectItem value="monthly" className="text-xs">월별 (Monthly)</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            
            <CardContent className="h-70 pt-6">
                {isLoading || !data  ? (
                    // 데이터 로딩 중일 때 보여줄 스켈레톤 UI (깜빡이는 효과)
                    <div className="w-full h-full flex flex-col items-center justify-center bg-muted/10 animate-pulse rounded-lg border border-dashed border-border text-muted-foreground">
                        <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary/50" />
                        <p className="text-sm">차트 데이터를 분석 중입니다...</p>
                    </div>
                ) : (
                <ResponsiveContainer width="100%" height="100%" debounce={300}>
                    <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="right" orientation="right" domain={[90, 100]} tick={{ fontSize: 10, fill: '#10b981' }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '12px' }} />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        <Bar yAxisId="left" dataKey="production" name="생산량" fill="#3b82f6" radius={[2, 2, 0, 0]} maxBarSize={40} />
                        <Line yAxisId="right" type="monotone" dataKey="yield" name="수율(%)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    </ComposedChart>
                </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}