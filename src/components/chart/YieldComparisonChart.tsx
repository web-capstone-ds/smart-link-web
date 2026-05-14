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
    line: string; // 현재 선택된 라인 정보 (제목과 색상 변경에 사용)
    className?: string;
    isLoading?: boolean;
}

export function YieldComparisonChart({ data, line, className, isLoading }: YieldComparisonChartProps) {
    const isAllLines = line === "all";
    const formattedLineName = line.toUpperCase();
    const chartTitle = isAllLines ? "라인별 수율 비교" : `${formattedLineName} 장비별 수율`;
    
    // 차트의 막대 색상은 기존의 포인트 컬러(보라/파랑)를 유지합니다.
    // 만약 이 색상도 테마에 맞추고 싶으시다면 'var(--primary)' 로 변경하시면 됩니다!
    const barColor = isAllLines ? "#8b5cf6" : "#0ea5e9";

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
                        {/* 🌟 수정됨: 기환님의 순수 Hex CSS 변수를 직접 호출합니다 */}
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
                            // 🌟 수정됨: 툴팁 배경을 --card 컬러(#27272A)로 부드럽게 매칭
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