import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { cn } from "@/lib/utils"

interface DefectSharePieChartProps {
    data: any[]; // DefectStat[] 와 동일한 구조
    colors: string[];
    className?: string;
}

export function DefectPieChart({ data, colors, className }: DefectSharePieChartProps) {
    return (
        <Card className={cn("flex flex-col shadow-sm border-border min-w-0", className)}>
            <CardHeader className="py-3 px-4 border-b border-border">
                <CardTitle className="text-sm font-bold">불량 점유율</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center pt-2 relative">
                <div className="w-full h-[140px]">
                    <ResponsiveContainer width="100%" height="100%" debounce={50}>
                        <PieChart>
                            <Pie 
                                data={data} 
                                cx="50%" cy="50%" 
                                innerRadius={40} outerRadius={60} 
                                paddingAngle={2} 
                                dataKey="count" 
                                stroke="none" 
                                isAnimationActive={false}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ fontSize: '10px', backgroundColor: '#18181b', borderColor: '#27272a' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* 범례 */}
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-[9px] text-muted-foreground font-medium px-2 pb-2">
                    {data.map((d, i) => (
                        <span key={d.code} className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: colors[i % colors.length] }}></div>
                            {d.code}
                        </span>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}