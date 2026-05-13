import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
    ResponsiveContainer,
    ComposedChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    Line
} from "recharts"

// 🌟 차트에 들어갈 데이터의 타입을 명확히 정의합니다.
export interface ParetoData {
    defect: string;
    count: number;
    cumulative: number;
}

interface DefectParetoChartProps {
    data: ParetoData[];
    className?: string; // 부모 요소에서 넓이(col-span)나 여백을 조절할 수 있게 열어둠
}

export function ParetoChart({ data, className }: DefectParetoChartProps) {
    return (
        <Card className={cn("shadow-sm border-border bg-card/50 pt-2", className)}>
            <CardHeader className="py-3 pb-0">
                <CardTitle className="text-xs font-bold">주요 불량 발생 원인 (Pareto)</CardTitle>
            </CardHeader>
            <CardContent className="h-45 pt-2">
                <ResponsiveContainer width="100%" height="100%" debounce={300}>
                    <ComposedChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                        <XAxis dataKey="defect" tick={{ fontSize: 9, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="left" tick={{ fontSize: 9, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 9, fill: '#f59e0b' }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '10px' }} />
                        <Bar yAxisId="left" dataKey="count" name="발생 건수" fill="#64748b" radius={[2, 2, 0, 0]} maxBarSize={40} />
                        <Line yAxisId="right" type="monotone" dataKey="cumulative" name="누적 비율" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}