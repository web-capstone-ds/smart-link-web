import { useState } from "react"
import { LineChart as LineChartIcon } from "lucide-react"
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

// 🌟 차트 데이터 타입 정의
export interface TrendData {
    date: string;
    production: number;
    yield: number;
}

interface ProductionTrendChartProps {
    data: TrendData[];
    className?: string;
}

export function TrendChart({ data, className }: ProductionTrendChartProps) {
    // 🌟 메인 페이지에 있던 상태를 차트 내부로 가져옵니다! (성능 최적화)
    const [trendUnit, setTrendUnit] = useState("daily");

    // 💡 나중에 API 연동 시: 
    // trendUnit 값이 바뀔 때마다 useEffect를 통해 데이터를 다시 불러오거나(Fetch), 
    // 넘어온 data를 단위에 맞게 묶어주는(Grouping) 로직을 여기에 추가하면 됩니다.

    return (
        <Card className={cn("shadow-sm border-border pt-2", className)}>
            <CardHeader className="py-3 pb-2 border-b border-border/50 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <LineChartIcon className="w-4 h-4 text-muted-foreground" /> 생산량 및 수율 트렌드
                </CardTitle>
                
                {/* 로컬 차트 전용 단위 변경 필터 */}
                <Select value={trendUnit} onValueChange={setTrendUnit}>
                    <SelectTrigger className="w-[110px] h-8 text-xs bg-background">
                        <SelectValue placeholder="단위 선택" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily" className="text-xs">일별 (Daily)</SelectItem>
                        <SelectItem value="weekly" className="text-xs">주별 (Weekly)</SelectItem>
                        <SelectItem value="monthly" className="text-xs">월별 (Monthly)</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            
            <CardContent className="h-[280px] pt-6">
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
            </CardContent>
        </Card>
    )
}