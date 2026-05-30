import { Loader2, LineChart as LineChartIcon } from "lucide-react"
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line } from "recharts"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type { TrendUnitType, TrendData } from "@/type/dashboardType"

interface ProductionTrendChartProps {
    data: TrendData[];
    trendUnit: TrendUnitType; 
    onTrendUnitChange: (value: TrendUnitType) => void; 
    className?: string;
    isLoading?: boolean;
}

export function TrendChart({ data, trendUnit, onTrendUnitChange, className, isLoading }: ProductionTrendChartProps) {

    const isForcedRange = data?.length === 7;
    const unitText = trendUnit === "daily" ? "일별" : "주별";
    const chartTitle = isForcedRange ? `최근 7${unitText.charAt(0)} 트렌드` : `조회 기간 내 ${unitText} 트렌드`;

    const minYield = data && data.length > 0 
        ? Math.floor(Math.min(...data.map(d => d.yield))) - 1
        : 90;
    const chartWidth = Math.max(640, (data?.length || 0) * 72);

    return (
        <Card className={cn("shadow-sm border-border bg-card pt-2 flex flex-col", className)}>
            
            <CardHeader className="py-3 pb-2 border-b border-border/50 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <LineChartIcon className="w-4 h-4 text-muted-foreground" /> {chartTitle}
                </CardTitle>
                
                <Select value={trendUnit} onValueChange={(value) => onTrendUnitChange(value as TrendUnitType)}>
                    <SelectTrigger className="w-28.5 h-8 text-xs bg-background">
                        <SelectValue placeholder="단위 선택" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily" className="text-xs">일별 (Daily)</SelectItem>
                        <SelectItem value="weekly" className="text-xs">주별 (Weekly)</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            
            <CardContent className="h-70 flex-1 overflow-hidden pt-6">
                {isLoading || !data  ? (
                    <div className="w-full h-full pb-8 flex flex-col items-center justify-center bg-muted/10 animate-pulse rounded-lg border border-dashed border-border text-muted-foreground">
                        <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary/50" />
                        <p className="text-sm">차트 데이터를 분석 중입니다...</p>
                    </div>
                ) : (
                    <div className="h-full overflow-x-auto overflow-y-hidden custom-scrollbar">
                        <div className="h-full" style={{ width: chartWidth }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250} debounce={300}>
                        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="right" orientation="right" domain={[minYield, 100]} tick={{ fontSize: 10, fill: 'var(--chart-2)' }} tickLine={false} axisLine={false} />
                            
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'var(--card)', 
                                    borderColor: 'var(--border)', 
                                    color: 'var(--card-foreground)', 
                                    fontSize: '12px', 
                                    borderRadius: '8px' 
                                }} 
                                itemStyle={{ color: 'var(--card-foreground)' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                            
                            <Bar yAxisId="left" dataKey="production" name="생산량" fill="var(--chart-1)" radius={[2, 2, 0, 0]} maxBarSize={40} />
                            <Line yAxisId="right" type="monotone" dataKey="yield" name="수율(%)" stroke="var(--chart-2)" strokeWidth={3} dot={{ r: 4, fill: 'var(--chart-2)', stroke: 'var(--card)' }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
