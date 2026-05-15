import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { Loader2 } from "lucide-react" // 🌟 로딩 아이콘 추가
import { cn } from "@/lib/utils"

import type { DefectStat } from "@/api/equipment" // 🌟 타입 가져오기

interface DefectSharePieChartProps {
    data: DefectStat[]; // 🌟 any[] -> DefectStat[] 로 타입 명확화
    colors: string[];
    className?: string;
    isLoading?: boolean; // 🌟 로딩 상태 프롭스 추가
}

export function DefectPieChart({ data = [], colors, className, isLoading }: DefectSharePieChartProps) {
    return (
        <Card className={cn("flex flex-col shadow-sm border-border min-w-0 pt-2", className)}>
            <CardHeader className="py-3 px-4 border-b border-border">
                <CardTitle className="text-sm font-bold">불량 점유율</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center pt-2 relative">
                
                {/* 🌟 로딩 중일 때 보여줄 UI */}
                {isLoading ? (
                    <div className="w-full h-full min-h-40 flex flex-col items-center justify-center text-muted-foreground">
                        <Loader2 className="w-6 h-6 mb-2 animate-spin text-primary/50" />
                        <span className="text-[10px]">차트 렌더링 중...</span>
                    </div>
                ) : (
                    <>
                        <div className="w-full h-35">
                            <ResponsiveContainer width="100%" height="100%" debounce={50}>
                                <PieChart>
                                    <Pie 
                                        data={data} 
                                        cx="50%" cy="50%" 
                                        innerRadius={40} outerRadius={60} 
                                        paddingAngle={2} 
                                        dataKey="count" 
                                        stroke="none" 
                                        isAnimationActive={false} // 필요 시 true로 변경하여 애니메이션 추가 가능
                                    >
                                        {data.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                        ))}
                                    </Pie>
                                    {/* 🌟 하드코딩된 색상 대신 Zinc 테마 변수 적용 */}
                                    <Tooltip 
                                        contentStyle={{ 
                                            fontSize: '10px', 
                                            backgroundColor: 'var(--card)', 
                                            borderColor: 'var(--border)',
                                            color: 'var(--card-foreground)',
                                            borderRadius: '6px'
                                        }} 
                                        itemStyle={{ color: 'var(--card-foreground)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* 범례 */}
                        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-[9px] text-muted-foreground font-medium px-2 pb-2">
                            {data.map((d, i) => (
                                <span key={d.code} className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-xs" style={{ backgroundColor: colors[i % colors.length] }}></div>
                                    {d.code}
                                </span>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}