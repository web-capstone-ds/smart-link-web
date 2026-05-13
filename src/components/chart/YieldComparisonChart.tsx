import { LayoutList } from "lucide-react"
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
}

export function YieldComparisonChart({ data, line, className }: YieldComparisonChartProps) {
    // 선택된 라인에 따라 동적으로 변하는 값들
    const isAllLines = line === "all";
    const chartTitle = isAllLines ? "라인별 수율 비교" : `${line.toUpperCase()} 장비별 수율`;
    const barColor = isAllLines ? "#8b5cf6" : "#0ea5e9";

    return (
        <Card className={cn("shadow-sm border-border pt-2", className)}>
            <CardHeader className="py-4 pb-2 border-b border-border/50">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <LayoutList className="w-4 h-4 text-muted-foreground" />
                    {chartTitle}
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[280px] pt-6">
                <ResponsiveContainer width="100%" height="100%" debounce={300}>
                    <BarChart 
                        data={data} 
                        layout="vertical" 
                        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" horizontal={false} />
                        <XAxis type="number" domain={[90, 100]} tick={{ fontSize: 10, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#a1a1aa' }} tickLine={false} axisLine={false} width={60} />
                        <Tooltip cursor={{ fill: '#27272a' }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '12px' }} />
                        <Bar 
                            dataKey="yield" 
                            name="수율(%)" 
                            fill={barColor} // 계산된 색상 적용
                            radius={[0, 4, 4, 0]} 
                            barSize={20} 
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}