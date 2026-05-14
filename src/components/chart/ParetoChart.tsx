import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
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
    defectCode: string;
    defectName: string;
    count: number;
    cumulative: number;
}

interface DefectParetoChartProps {
    data: ParetoData[];
    className?: string; // 부모 요소에서 넓이(col-span)나 여백을 조절할 수 있게 열어둠
    isLoading?: boolean;
}

export function ParetoChart({ data, className, isLoading }: DefectParetoChartProps) {
    return (
        <Card className={cn("shadow-sm border-border bg-card/50 pt-2", className)}>
            <CardHeader className="py-3 pb-0">
                <CardTitle className="text-xs font-bold">주요 불량 발생 원인 (Pareto)</CardTitle>
            </CardHeader>
            <CardContent className="h-45 pt-2">
                {isLoading ? (
                    <div className="w-full h-full min-h-40 flex flex-col items-center justify-center bg-muted/10 animate-pulse rounded-lg border border-dashed border-border text-muted-foreground">
                        <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary/50" />
                        <p className="text-sm">불량 데이터를 집계 중입니다...</p>
                    </div>
                ) : (
                <ResponsiveContainer width="100%" height="100%" debounce={300}>
                    <ComposedChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                        <XAxis 
                            dataKey="defectCode" 
                            // 🌟 테마 색상과 폰트 사이즈는 그대로 유지
                            tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} 
                            tickLine={false} 
                            axisLine={false} 
                            // 🌟 여기서 글자를 예쁘게 조립해서 내보냅니다!
                            tickFormatter={(value) => {
                                // value에는 "C-01" 같은 코드가 들어옵니다.
                                const currentItem = data.find(item => item.defectCode === value);
                                // 이름이 있으면 "C-01 (치핑)" 형태로, 없으면 그냥 "C-01"만 반환합니다.
                                return currentItem ? `${value} (${currentItem.defectName})` : value;
                            }}
                        />
                        <YAxis yAxisId="left" tick={{ fontSize: 9, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 9, fill: '#f59e0b' }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '10px' }} />
                        <Bar yAxisId="left" dataKey="count" name="발생 건수" fill="#64748b" radius={[2, 2, 0, 0]} maxBarSize={40} />
                        <Line yAxisId="right" type="monotone" dataKey="cumulative" name="누적 비율" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                    </ComposedChart>
                </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}