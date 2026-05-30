import { LayoutList, Loader2 } from "lucide-react"
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { YieldComparisonData } from "@/type/dashboardType"

interface YieldComparisonChartProps {
    data: YieldComparisonData[];
    equipmentIds: string[]; 
    className?: string;
    isLoading?: boolean;
}

export function YieldComparisonChart({ data, equipmentIds, className, isLoading }: YieldComparisonChartProps) {
    
    const isAllEquipments = equipmentIds.length === 0;
    const formattedName = equipmentIds.length > 0 ? equipmentIds.join(', ').toUpperCase() : "ALL";
    
    const chartTitle = isAllEquipments ? "전체 장비별 수율 비교" : `${formattedName} LOT별 수율`;
    const barColor = "var(--chart-1)";

    const minYield = data && data.length > 0 
        ? Math.floor(Math.min(...data.map(d => d.yield))) - 1
        : 90; 
    const chartHeight = Math.max(280, (data?.length || 0) * 34);

    return (
        <Card className={cn("shadow-sm border-border bg-card pt-2 flex flex-col", className)}>

            <CardHeader className="py-4 pb-2 border-b border-border/50">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <LayoutList className="w-4 h-4 text-muted-foreground" />
                    {chartTitle}
                </CardTitle>
            </CardHeader>
            
            <CardContent className="h-70 flex-1 overflow-hidden pt-6">
                {isLoading ? (
                    <div className="w-full h-full min-h-75 flex flex-col items-center justify-center bg-muted/10 animate-pulse rounded-lg border border-dashed border-border text-muted-foreground">
                        <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary/50" />
                        <p className="text-sm">수율 데이터를 분석 중입니다...</p>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
                        <div style={{ height: chartHeight }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280} debounce={300}>
                        <BarChart 
                            data={data} 
                            layout="vertical" 
                            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                            
                            <XAxis 
                                type="number" 
                                domain={[minYield, 100]} 
                                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} 
                                tickLine={false} 
                                axisLine={false} 
                                width={60} 
                            />
                            <Tooltip 
                                cursor={{ fill: 'var(--muted)', opacity: 0.4 }} 
                                contentStyle={{ 
                                    backgroundColor: 'var(--card)', 
                                    borderColor: 'var(--border)', 
                                    color: 'var(--card-foreground)',
                                    fontSize: '12px',
                                    borderRadius: '8px'
                                }} 
                                itemStyle={{ color: 'var(--card-foreground)' }}
                            />
                            <Bar 
                                dataKey="yield" 
                                name="수율(%)" 
                                fill={barColor} 
                                radius={[0, 4, 4, 0]} 
                                barSize={20} 
                            />
                        </BarChart>
                    </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
