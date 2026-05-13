import { Clock, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, Tooltip } from "recharts"
import { cn } from "@/lib/utils"

// 필요한 데이터 타입 정의
interface ReliabilityKpiCardsProps {
    downtimeData: any[]; // 구체적인 타입이 있다면 교체해주세요
    mtbfData: any[];
    className?: string;
}

export function EquipmentKPIChart({ downtimeData, mtbfData, className }: ReliabilityKpiCardsProps) {
    return (
        <div className={cn("flex flex-col gap-4", className)}>
            {/* 총 비가동 시간 카드 (Area 차트) */}
            <Card className="flex-1 shadow-sm border-border flex flex-col min-w-0">
                <CardHeader className="pb-0 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground">총 비가동 시간</CardTitle>
                    <Clock className="w-4 h-4 text-destructive/80" />
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-col">
                    <div className="px-4 mt-1">
                        <span className="text-xl font-bold text-foreground">110.9 <span className="text-[11px] font-normal text-muted-foreground">시간</span></span>
                    </div>
                    <div className="flex-1 w-full mt-2 h-16 min-h-[60px]">
                        <ResponsiveContainer width="100%" height="100%" debounce={50}>
                            <AreaChart data={downtimeData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Tooltip contentStyle={{ fontSize: '10px', backgroundColor: '#18181b', borderColor: '#27272a' }} />
                                <Area type="monotone" dataKey="hours" name="비가동(hr)" stroke="#ef4444" fillOpacity={1} fill="url(#colorDown)" isAnimationActive={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* MTBF 평균 무고장 시간 카드 (Bar 차트) */}
            <Card className="flex-1 shadow-sm border-border flex flex-col min-w-0">
                <CardHeader className="pb-0 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-medium text-muted-foreground">평균 무고장 시간 (MTBF)</CardTitle>
                    <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-col">
                    <div className="px-4 mt-1">
                        <span className="text-xl font-bold text-foreground">91.6 <span className="text-[11px] font-normal text-muted-foreground">시간/회</span></span>
                    </div>
                    <div className="flex-1 w-full mt-2 px-2 h-16 min-h-[60px]">
                        <ResponsiveContainer width="100%" height="100%" debounce={50}>
                            <BarChart data={mtbfData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                                <Tooltip cursor={{ fill: '#27272a' }} contentStyle={{ fontSize: '10px', backgroundColor: '#18181b', borderColor: '#27272a' }} />
                                <XAxis dataKey="line" tick={{ fontSize: 8, fill: '#71717a' }} tickLine={false} axisLine={false} />
                                <Bar dataKey="hours" name="MTBF(hr)" fill="#10b981" radius={[2, 2, 0, 0]} barSize={16} isAnimationActive={false} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}