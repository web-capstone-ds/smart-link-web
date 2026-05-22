import { Loader2 } from "lucide-react"
import { ResponsiveContainer, PieChart, Pie, Sector, Tooltip } from "recharts"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface UptimeData {
    name: string;
    value: number;
    color: string;
}

interface UptimePieChartProps {
    data: UptimeData[];
    uptimePercent: number;
    className?: string;
    isLoading?: boolean;
}

export function UptimePieChart({ data, uptimePercent, className, isLoading }: UptimePieChartProps) {
    
    const CustomPieSector = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, payload } = props;
        return (
            <Sector 
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={payload.color}
                stroke="none"
            />
        );
    };

    return (
        <Card className={cn("shadow-sm border-border bg-card/50 relative pt-2 flex flex-col", className)}>
            
            <CardHeader className="py-3 pb-0">
                <CardTitle className="text-xs font-bold">종합 가동 비율</CardTitle>
            </CardHeader>

            <CardContent className="h-45 pt-0 flex-1 relative">
                {isLoading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-muted/10 animate-pulse rounded-lg border border-dashed border-border text-muted-foreground mt-3 pb-4">
                        <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary/50" />
                        <p className="text-sm">데이터 분석 중...</p>
                    </div>
                ) : (
                    <>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={300}>
                            <PieChart>
                                <Pie 
                                    data={data} 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={45} 
                                    outerRadius={65} 
                                    paddingAngle={2} 
                                    dataKey="value" 
                                    shape={<CustomPieSector />}
                                />
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