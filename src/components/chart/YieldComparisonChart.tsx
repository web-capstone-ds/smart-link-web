import { LayoutList, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar
} from "recharts"

// 🌟 차트 데이터 타입 정의
export interface YieldData {
    name: string;
    yield: number;
}

interface YieldComparisonChartProps {
    data: YieldData[];
    // 🌟 line -> equipmentIds로 프롭스 이름 변경
    equipmentIds: string; 
    className?: string;
    isLoading?: boolean;
}

export function YieldComparisonChart({ data, equipmentIds, className, isLoading }: YieldComparisonChartProps) {
    // 🌟 로직 변경: "all"이면 전체 장비 비교, 아니면 특정 장비의 LOT 비교
    const isAllEquipments = equipmentIds === "all";
    const formattedName = equipmentIds.toUpperCase();
    
    // 명세서 3-3에 맞춘 다이내믹 타이틀 생성
    const chartTitle = isAllEquipments ? "전체 장비별 수율 비교" : `${formattedName} LOT별 수율`;
    
    // 차트의 막대 색상 (전체는 보라색, 특정 장비/LOT는 파란색)
    const barColor = isAllEquipments ? "#8b5cf6" : "#0ea5e9";

    const minYield = data && data.length > 0 
        ? Math.floor(Math.min(...data.map(d => d.yield))) - 1
        : 90; 

    return (
        <Card className={cn("shadow-sm border-border pt-2 flex flex-col", className)}>
            <CardHeader className="py-4 pb-2 border-b border-border/50">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <LayoutList className="w-4 h-4 text-muted-foreground" />
                    {chartTitle}
                </CardTitle>
            </CardHeader>
            <CardContent className="h-70 pt-6 flex-1">
                {isLoading ? (
                    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-muted/10 animate-pulse rounded-lg border border-dashed border-border text-muted-foreground">
                        <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary/50" />
                        <p className="text-sm">수율 데이터를 분석 중입니다...</p>
                    </div>
                ) : (
                <ResponsiveContainer width="100%" height="100%" minHeight={300} debounce={300}>
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
                )}
            </CardContent>
        </Card>
    )
}