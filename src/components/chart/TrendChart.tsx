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

export type TrendUnitType = "daily" | "weekly";

export interface TrendData {
    date: string;
    production: number;
    yield: number;
}

interface ProductionTrendChartProps {
    data: TrendData[];
    trendUnit: TrendUnitType; 
    onTrendUnitChange: (value: TrendUnitType) => void; 
    className?: string;
    isLoading?: boolean;
}

export function TrendChart({ data, trendUnit, onTrendUnitChange, className, isLoading }: ProductionTrendChartProps) {

    const isForcedRange = data?.length === 7; // 대략적인 유추
    // 🌟 1. API 명세 변경(limit 제거)에 따라 타이틀을 더 자연스럽게 수정
    const unitText = trendUnit === "daily" ? "일별" : "주별";
    const chartTitle = isForcedRange ? `최근 7${unitText.charAt(0)} 트렌드` : `조회 기간 내 ${unitText} 트렌드`;

    // 🌟 2. 수율 차트가 잘리지 않도록 최솟값 동적 계산 (데이터가 없으면 기본값 90)
    const minYield = data && data.length > 0 
        ? Math.floor(Math.min(...data.map(d => d.yield))) - 1
        : 90;

    return (
        <Card className={cn("shadow-sm border-border pt-2 flex flex-col", className)}>
            <CardHeader className="py-3 pb-2 border-b border-border/50 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <LineChartIcon className="w-4 h-4 text-muted-foreground" /> {chartTitle}
                </CardTitle>
                
                <Select value={trendUnit} onValueChange={(value) => onTrendUnitChange(value as TrendUnitType)}>
                    <SelectTrigger className="w-27.5 h-8 text-xs bg-background">
                        <SelectValue placeholder="단위 선택" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* 🌟 3. 명세서에 따라 "월별(monthly)" 옵션 완전 제거 */}
                        <SelectItem value="daily" className="text-xs">일별 (Daily)</SelectItem>
                        <SelectItem value="weekly" className="text-xs">주별 (Weekly)</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            
            <CardContent className="h-70 pt-6 flex-1">
                {isLoading || !data  ? (
                    <div className="w-full h-full pb-8 flex flex-col items-center justify-center bg-muted/10 animate-pulse rounded-lg border border-dashed border-border text-muted-foreground">
                        <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary/50" />
                        <p className="text-sm">차트 데이터를 분석 중입니다...</p>
                    </div>
                ) : (
                <ResponsiveContainer width="100%" height="100%" minHeight={250} debounce={300}>
                    <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        {/* 🌟 4. 기환 님의 눈 편안한 Zinc 테마 CSS 변수 전면 적용 */}
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="left" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                        
                        {/* 🌟 5. 계산된 minYield를 도메인에 적용 */}
                        <YAxis yAxisId="right" orientation="right" domain={[minYield, 100]} tick={{ fontSize: 10, fill: '#10b981' }} tickLine={false} axisLine={false} />
                        
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
                        
                        <Bar yAxisId="left" dataKey="production" name="생산량" fill="#3b82f6" radius={[2, 2, 0, 0]} maxBarSize={40} />
                        <Line yAxisId="right" type="monotone" dataKey="yield" name="수율(%)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    </ComposedChart>
                </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}