import { ArrowUpDown, Download, BellRing, CheckCircle2, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts"
import { cn } from "@/lib/utils"

// 🌟 장비 데이터 타입 정의 (부모에서 넘겨줄 데이터의 형태)
export interface EquipmentData {
    id: string;
    line: string;
    recipe: string;
    unresolvedAlert: boolean;
    uptime: number;
    yield: number;
    yieldTrend: number[];
    fail: number;
    majorDefect: string;
}

interface EquipmentDetailTableProps {
    data: EquipmentData[];
    sortBy: string;
    onSortChange: (value: string) => void;
    onRowClick: (id: string) => void;
    className?: string;
}

export function EquipmentDetailTable({ 
    data, 
    sortBy, 
    onSortChange, 
    onRowClick,
    className 
}: EquipmentDetailTableProps) {
    return (
        <Card className={cn("gap-0 shadow-sm border-border mt-6", className)}>
            <CardHeader className="py-3 px-4 border-b border-border flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                    장비 개별 수율 및 가동 상세
                    <Badge variant="secondary" className="font-normal text-[10px] ml-2">
                        총 {data.length}대
                    </Badge>
                </CardTitle>
                
                <div className="flex items-center gap-2">
                    {/* 정렬 옵션 */}
                    <div className="flex items-center gap-1.5 bg-muted/50 rounded-md p-1 border border-border">
                        <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
                        <Select value={sortBy} onValueChange={onSortChange}>
                            <SelectTrigger className="h-7 text-xs border-0 bg-transparent shadow-none focus:ring-0 w-[140px]">
                                <SelectValue placeholder="정렬 기준" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yield-asc" className="text-xs">수율 낮은 순 (위험)</SelectItem>
                                <SelectItem value="yield-desc" className="text-xs">수율 높은 순</SelectItem>
                                <SelectItem value="uptime-asc" className="text-xs">가동률 낮은 순 (위험)</SelectItem>
                                <SelectItem value="uptime-desc" className="text-xs">가동률 높은 순</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 ml-2">
                        <Download className="w-3.5 h-3.5" /> 내보내기
                    </Button>
                </div>
            </CardHeader>
            
            <CardContent className="p-0 overflow-x-auto custom-scrollbar">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="h-10 px-4 py-2 text-xs">장비 ID (레시피)</TableHead>
                            <TableHead className="h-10 py-2 text-xs">상태 및 경보</TableHead>
                            <TableHead className="h-10 py-2 text-xs">가동률 (Uptime)</TableHead>
                            <TableHead className="h-10 py-2 text-xs text-center">최근 수율 추이</TableHead>
                            <TableHead className="h-10 py-2 text-xs text-right">종합 수율</TableHead>
                            <TableHead className="h-10 py-2 text-xs pl-8">주요 불량 현상</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((eq) => (
                            <TableRow 
                                key={eq.id} 
                                onClick={() => onRowClick(eq.id)} 
                                className="cursor-pointer hover:bg-muted/50 transition-colors border-border/50"
                            >
                                {/* 1. 장비 ID & 레시피 */}
                                <TableCell className="px-4 py-2.5 font-semibold text-foreground text-sm">
                                    <div className="flex flex-col gap-0.5">
                                        <span>{eq.id} <span className="text-[10px] text-muted-foreground font-normal ml-1">({eq.line.toUpperCase()})</span></span>
                                        <Badge variant="secondary" className="w-fit text-[9px] px-1 py-0 h-3.5 font-normal bg-secondary/50">{eq.recipe}</Badge>
                                    </div>
                                </TableCell>

                                {/* 2. 미조치 경보 유무 */}
                                <TableCell className="py-2.5">
                                    {eq.unresolvedAlert ? (
                                        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 gap-1 text-[10px] py-0 h-5">
                                            <BellRing className="w-3 h-3 animate-pulse" /> 미조치 경보
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1 text-[10px] py-0 h-5 font-normal">
                                            <CheckCircle2 className="w-3 h-3" /> 정상
                                        </Badge>
                                    )}
                                </TableCell>

                                {/* 3. 가동률 */}
                                <TableCell className="py-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${eq.uptime < 90 ? 'bg-destructive' : eq.uptime < 95 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                                style={{ width: `${eq.uptime}%` }}
                                            ></div>
                                        </div>
                                        <span className={`text-[11px] font-bold ${eq.uptime < 90 ? 'text-destructive' : 'text-foreground'}`}>
                                            {eq.uptime}%
                                        </span>
                                    </div>
                                </TableCell>

                                {/* 4. 미니 수율 추이 차트 (Sparkline) */}
                                <TableCell className="py-2.5">
                                    <div className="w-20 h-6 mx-auto">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={eq.yieldTrend.map(val => ({ value: val }))}>
                                                <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="value" 
                                                    stroke={eq.yield < 95 ? "#ef4444" : "#10b981"} 
                                                    strokeWidth={2} 
                                                    dot={false} 
                                                    isAnimationActive={false} 
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </TableCell>

                                {/* 5. 종합 수율 */}
                                <TableCell className="py-2.5 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className={`font-bold text-sm ${eq.yield < 97 ? 'text-destructive' : 'text-emerald-500'}`}>
                                            {eq.yield.toFixed(1)}%
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">Fail: {eq.fail}</span>
                                    </div>
                                </TableCell>

                                {/* 6. 주요 불량 현상 */}
                                <TableCell className="py-2.5 text-[11px] text-muted-foreground pl-8">
                                    {eq.majorDefect !== "-" ? (
                                        <Badge variant="outline" className="border-border bg-muted/30 text-muted-foreground font-normal">
                                            {eq.majorDefect}
                                        </Badge>
                                    ) : "-"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
                {data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                        <Filter className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-sm">선택한 조건에 해당하는 장비가 없습니다.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}