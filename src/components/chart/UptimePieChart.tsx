import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react" // 🌟 로딩 아이콘 추가!
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip
} from "recharts"

export interface UptimeData {
    name: string;
    value: number;
    color: string;
}

interface UptimePieChartProps {
    data: UptimeData[];
    uptimePercent: number;
    className?: string;
    isLoading?: boolean; // 🌟 로딩 상태 프롭스 (이미 있으셨네요!)
}

export function UptimePieChart({ data, uptimePercent, className, isLoading }: UptimePieChartProps) {
    return (
        <Card className={cn("shadow-sm border-border bg-card/50 relative pt-2 flex flex-col", className)}>
            <CardHeader className="py-3 pb-0">
                <CardTitle className="text-xs font-bold">종합 가동 비율</CardTitle>
            </CardHeader>
            <CardContent className="h-45 pt-0 flex-1 relative">
                {/* 🌟 로딩 상태 처리 시작 */}
                {isLoading ? (
                    // 파이 차트 공간에 맞춘 아담한 로딩창
                    <div className="w-full h-full flex flex-col items-center justify-center bg-muted/10 animate-pulse rounded-lg border border-dashed border-border text-muted-foreground mt-3 pb-4">
                        <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary/50" />
                        <p className="text-sm">데이터 분석 중...</p>
                    </div>
                ) : (
                    // 🌟 로딩이 끝나면 차트와 가운데 텍스트를 동시에 보여줍니다!
                    <>
                        <ResponsiveContainer width="100%" height="100%" debounce={300}>
                            <PieChart>
                                <Pie 
                                    data={data} 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={45} 
                                    outerRadius={65} 
                                    paddingAngle={2} 
                                    dataKey="value" 
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                {/* 🌟 하드코딩된 Hex 컬러를 기환님의 Zinc 테마 CSS 변수로 교체! */}
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'var(--card)', 
                                        borderColor: 'var(--border)', 
                                        color: 'var(--card-foreground)',
                                        fontSize: '10px',
                                        borderRadius: '6px'
                                    }} 
                                    itemStyle={{ color: 'var(--card-foreground)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        
                        {/* 가운데 퍼센트 텍스트 (데이터가 있을 때만 렌더링) */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xl font-black text-foreground">{uptimePercent}%</span>
                            <span className="text-[8px] text-muted-foreground font-bold uppercase">Uptime</span>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}