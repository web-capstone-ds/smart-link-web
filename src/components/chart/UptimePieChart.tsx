import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip
} from "recharts"

// 🌟 차트에 들어갈 데이터 타입 정의
export interface UptimeData {
    name: string;
    value: number;
    color: string;
}

interface UptimePieChartProps {
    data: UptimeData[];
    uptimePercent: number; // 🌟 가운데 표시될 가동률(%) 숫자
    className?: string;
}

export function UptimePieChart({ data, uptimePercent, className }: UptimePieChartProps) {
    return (
        <Card className={cn("shadow-sm border-border bg-card/50 relative pt-2", className)}>
            <CardHeader className="py-3 pb-0">
                <CardTitle className="text-xs font-bold">종합 가동 비율</CardTitle>
            </CardHeader>
            <CardContent className="h-[180px] pt-0">
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
                        <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '10px' }} />
                    </PieChart>
                </ResponsiveContainer>
                
                {/* 🌟 가운데 텍스트가 밖에서 주입받은 uptimePercent를 바라보도록 수정 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                    <span className="text-xl font-black">{uptimePercent}%</span>
                    <span className="text-[8px] text-muted-foreground font-bold uppercase">Uptime</span>
                </div>
            </CardContent>
        </Card>
    )
}