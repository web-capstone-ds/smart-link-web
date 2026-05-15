import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Download, Info, Settings2, Loader2, Activity, CheckCircle2, AlertTriangle, Sparkles, Grid3X3, TrendingUp } from "lucide-react"
import { ResponsiveContainer, Tooltip, XAxis, Line, YAxis, CartesianGrid, Legend, ComposedChart } from "recharts"

import { mockEquipmentHeatmap, mockEquipmentSPCTrend, mockEquipmentSummary, mockEquipmentHistory } from "@/data/mockData"

import { fetchEquipmentSummary, fetchEquipmentSPCTrend, fetchEquipmentHeatmap, fetchEquipmentHistory } from "@/api/equipmentDetail";

interface EquipmentDetailSheetProps {
    selectedEquipment: string | null;
    setSelectedEquipment: (id: string | null) => void;
}

export function EquipmentDetailSheet({ selectedEquipment, setSelectedEquipment }: EquipmentDetailSheetProps) {
    const [isReady, setIsReady] = useState(false);

    // 1. API 데이터 페칭 (isError 추가)
    const { 
        data: summaryData, 
        isLoading, 
        isError 
    } = useQuery({
        queryKey: ["equipmentSummary", selectedEquipment],
        queryFn: () => fetchEquipmentSummary(selectedEquipment!),
        enabled: !!selectedEquipment,
        retry: false,
    });

    // 🌟 2. 강력한 방어 로직: 데이터가 없거나 에러 시 목데이터로 대체
    const safeData = (isError || !summaryData) ? mockEquipmentSummary : summaryData;
    const info = safeData.info;

    useEffect(() => {
        if (selectedEquipment) {
            setIsReady(false);
            const timer = setTimeout(() => setIsReady(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [selectedEquipment]);
 
    // 2 spc
    const {
        data: spcData,
        isLoading: isSpcLoading,
        isError: isSpcError
    } = useQuery({
        queryKey: ["equipmentSPCTrend", selectedEquipment],
        queryFn: () => fetchEquipmentSPCTrend(selectedEquipment!), // 아까 만든 API 함수
        enabled: !!selectedEquipment,
        retry: false,
    });

    const safeSpcData = (isSpcError || !spcData) ? mockEquipmentSPCTrend : spcData;

    // 3 heatmap
    const {
        data: heatmapData,
        isLoading: isHeatmapLoading,
        isError: isHeatmapError
    } = useQuery({
        queryKey: ["equipmentHeatmap", selectedEquipment],
        queryFn: () => fetchEquipmentHeatmap(selectedEquipment!),
        enabled: !!selectedEquipment,
        retry: false,
    });

    // 데이터 누락 혹은 에러 발생 시 완벽 방어
    const safeHeatmapData = (isHeatmapError || !heatmapData) ? mockEquipmentHeatmap : heatmapData;

    // =========================================================
    // 🌟 4. 최근 조치 내역 히스토리 API 및 방어 로직 (형식 통일!)
    // =========================================================
    const {
        data: historyData,
        isLoading: isHistoryLoading,
        isError: isHistoryError
    } = useQuery({
        queryKey: ["equipmentHistory", selectedEquipment],
        queryFn: () => fetchEquipmentHistory(selectedEquipment!),
        enabled: !!selectedEquipment,
        retry: false,
    });

    const safeHistoryData = (isHistoryError || !historyData) ? mockEquipmentHistory : historyData;

    return (
        <Sheet open={!!selectedEquipment} onOpenChange={(open) => !open && setSelectedEquipment(null)}>
            <SheetContent 
                side="right" 
                className="w-[90vw] max-w-350! overflow-y-auto custom-scrollbar p-0"
            >
                {/* 헤더 영역 */}
                <div className="sticky top-0 z-10 bg-background border-b border-border p-6 flex items-center justify-between">
                    <SheetHeader className="text-left space-y-1">
                        <div className="flex items-center gap-3">
                            <SheetTitle className="text-2xl font-bold">{selectedEquipment}</SheetTitle>
                            
                            {/* 로딩 중일 때는 스켈레톤, 아니면 safeData의 상태 표시 */}
                            {isLoading ? (
                                <div className="h-5 w-24 bg-muted/20 animate-pulse rounded-full" />
                            ) : (
                                <Badge 
                                    variant="outline" 
                                    className={cn(
                                        "py-0 h-5 text-[10px]",
                                        info.status === "Critical" ? "bg-destructive/10 text-destructive border-destructive/20" :
                                        info.status === "Warning" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                        "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    )}
                                >
                                    {info.status} 상태
                                </Badge>
                            )}
                        </div>
                        
                        <SheetDescription className="flex items-center gap-2">
                            {isLoading ? (
                                <div className="h-4 w-48 bg-muted/10 animate-pulse rounded mt-1" />
                            ) : (
                                <>
                                    <span>Current Recipe: <strong className="font-medium text-foreground">{info.recipe}</strong></span>
                                    <span className="text-muted-foreground/30">|</span>
                                    <span>Lot: <strong className="font-medium text-foreground">{info.currentLot}</strong></span>
                                </>
                            )}
                        </SheetDescription>
                    </SheetHeader>
                    
                    <Button className="gap-2 h-9 text-xs">
                        <Download className="w-4 h-4" /> 리포트 PDF 다운로드
                    </Button>
                </div>

                <div className="p-6 space-y-8">
                    
                    {/* ========================================== */}
                    {/* 1. AI 예측 및 권고 */}
                    {/* ========================================== */}
                    {(!isReady || isLoading) ? (
                        /* 🌟 로딩 스켈레톤 */
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-5 flex gap-4 animate-pulse">
                            <div className="w-5 h-5 rounded-full bg-blue-500/20 shrink-0 mt-0.5" />
                            <div className="flex-1 space-y-3">
                                <div className="h-4 w-40 bg-blue-500/20 rounded" />
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-blue-500/10 rounded" />
                                    <div className="h-3 w-[95%] bg-blue-500/10 rounded" />
                                    <div className="h-3 w-[80%] bg-blue-500/10 rounded" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* 🌟 실제 데이터 */
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5 flex gap-4 animate-in fade-in duration-500">
                            <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> 
                            <div>
                                <h4 className="text-sm font-bold text-blue-500 mb-1.5">
                                    {safeData.aiInsight.title}
                                </h4>
                                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                    {safeData.aiInsight.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ========================================== */}
                    {/* 2. 일일 가동 타임라인 */}
                    {/* ========================================== */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-muted-foreground" /> 일일 가동 타임라인
                        </h3>
                        
                        {(!isReady || isLoading) ? (
                            /* 🌟 로딩 스켈레톤 */
                            <Card className="border-border animate-pulse bg-muted/5">
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-end mb-3">
                                        <div className="space-y-2">
                                            <div className="h-3 w-12 bg-muted/20 rounded" />
                                            <div className="h-8 w-20 bg-muted/20 rounded" />
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="h-3 w-16 bg-muted/20 rounded" />
                                            <div className="h-3 w-16 bg-muted/20 rounded" />
                                            <div className="h-3 w-16 bg-muted/20 rounded" />
                                        </div>
                                    </div>
                                    <div className="h-8 w-full bg-muted/20 rounded-md mb-2" />
                                    <div className="flex justify-between">
                                        <div className="h-2 w-8 bg-muted/20 rounded" />
                                        <div className="h-2 w-8 bg-muted/20 rounded" />
                                        <div className="h-2 w-8 bg-muted/20 rounded" />
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            /* 🌟 실제 데이터 */
                            <Card className="border-border animate-in fade-in duration-500">
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-end mb-3">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-muted-foreground">총 가동률</p>
                                            <p className={cn(
                                                "text-2xl font-black",
                                                safeData.uptime.totalRate < 90 ? "text-destructive" : 
                                                safeData.uptime.totalRate < 95 ? "text-amber-500" : "text-emerald-500"
                                            )}>
                                                {safeData.uptime.totalRate} <span className="text-sm font-normal text-muted-foreground">%</span>
                                            </p>
                                        </div>
                                        <div className="flex gap-3 text-[10px] font-bold">
                                            <span className="flex items-center gap-1 text-emerald-600">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-sm"></div> Run ({safeData.uptime.runHour}h)
                                            </span>
                                            <span className="flex items-center gap-1 text-amber-500">
                                                <div className="w-2 h-2 bg-amber-400 rounded-sm"></div> Idle ({safeData.uptime.idleHour}h)
                                            </span>
                                            <span className="flex items-center gap-1 text-destructive">
                                                <div className="w-2 h-2 bg-destructive rounded-sm"></div> Down ({safeData.uptime.downHour}h)
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="h-8 flex rounded-md overflow-hidden border border-border/50">
                                        {safeData.uptime.timeline.map((segment, index) => {
                                            const bgClass = segment.status === "run" ? "bg-emerald-500 hover:brightness-110" :
                                                            segment.status === "idle" ? "bg-amber-400 hover:brightness-110" : 
                                                            "bg-destructive animate-pulse";
                                            const statusText = segment.status === "run" ? "정상 가동" :
                                                               segment.status === "idle" ? "자재 대기/유휴" : "에러 정지";

                                            return (
                                                <div 
                                                    key={index}
                                                    className={`${bgClass} h-full transition-all cursor-help`} 
                                                    style={{ width: `${segment.ratio}%` }} 
                                                    title={`${segment.start} - ${segment.end} (${statusText})`}
                                                />
                                            );
                                        })}
                                    </div>
                                    
                                    <div className="flex justify-between text-[10px] text-muted-foreground font-bold mt-2 px-1 relative">
                                        <span>{safeData.uptime.timeline[0]?.start}</span>
                                        {safeData.uptime.timeline.find(t => t.status === "error") && (
                                            <span className="text-destructive/80 absolute left-1/2 -translate-x-1/2">
                                                {safeData.uptime.timeline.find(t => t.status === "error")?.start} (Error)
                                            </span>
                                        )}
                                        <span>{safeData.uptime.timeline[safeData.uptime.timeline.length - 1]?.end}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                </div>
                
            {/* 3. 시각화 데이터 (트렌드 & 히트맵 통합 Grid) */}
            <div className="grid grid-cols-2 gap-6">
                
                {/* 🌟 1. 수율 및 SPC 추이 차트 🌟 */}
                <Card className="shadow-sm border-border min-w-0">
                    <CardHeader className="py-3 px-4 border-b border-border/50 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-muted-foreground" /> 수율 및 SPC 추이
                        </CardTitle>
                        <Badge variant="outline" className="text-[9px] font-normal h-4 py-0 text-muted-foreground border-border">최근 7 LOT</Badge>
                    </CardHeader>
                    
                    {(!isReady || isSpcLoading) ? (
                        /* 차트 로딩 상태 스켈레톤 */
                        <CardContent className="h-48 pt-4 px-4 pb-3 animate-pulse bg-muted/5 flex flex-col justify-between">
                            <div className="space-y-6 w-full pt-2">
                                <div className="h-[1px] w-full bg-muted/20" />
                                <div className="h-[1px] w-full bg-muted/20" />
                                <div className="h-[1px] w-full bg-muted/10" />
                            </div>
                            <div className="flex justify-between px-2 pt-2">
                                <div className="h-2 w-8 bg-muted/20 rounded" />
                                <div className="h-2 w-8 bg-muted/20 rounded" />
                                <div className="h-2 w-8 bg-muted/20 rounded" />
                                <div className="h-2 w-8 bg-muted/20 rounded" />
                                <div className="h-2 w-8 bg-muted/20 rounded" />
                            </div>
                        </CardContent>
                    ) : (
                        /* 실제 차트 데이터 렌더링 */
                        <CardContent className="h-48 pt-4 px-2 pb-0 animate-in fade-in duration-500">
                            <ResponsiveContainer width="100%" height="100%" debounce={50}>
                                <ComposedChart data={safeSpcData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis dataKey="lot" tick={{ fontSize: 9, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                                    <YAxis domain={[90, 100]} tick={{ fontSize: 9, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', fontSize: '11px', padding: '8px', borderRadius: '6px' }}
                                        itemStyle={{ padding: '2px 0' }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} iconSize={8} />
                                    
                                    <Line type="step" dataKey="lcl" name="관리하한(LCL)" stroke="#ef4444" strokeDasharray="4 4" dot={false} strokeWidth={1.5} isAnimationActive={false} />
                                    <Line type="monotone" dataKey="equipAvg" name="장비 평균" stroke="#71717a" dot={false} strokeWidth={2} isAnimationActive={false} />
                                    <Line type="monotone" dataKey="yield" name="LOT 수율" stroke="#3b82f6" dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 5 }} strokeWidth={2.5} isAnimationActive={false} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    )}
                </Card>

                {/* 🌟 2. 결함 위치 히트맵 (변경 명세: 8슬롯 그리드 구조) 🌟 */}
                <Card className="shadow-sm border-border min-w-0">
                    <CardHeader className="py-3 px-4 border-b border-border/50 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Grid3X3 className="w-4 h-4 text-muted-foreground" /> 결함 슬롯 히트맵
                        </CardTitle>
                        {/* 🌟 로딩 중이 아닐 때만 AI 패턴명 배지를 노출합니다 */}
                        {!(!isReady || isHeatmapLoading) && (
                            <Badge 
                                variant={safeHeatmapData.patternName.includes("집중") ? "destructive" : "outline"} 
                                className="text-[9px] font-bold h-4 py-0"
                            >
                                패턴: {safeHeatmapData.patternName}
                            </Badge>
                        )}
                    </CardHeader>
                    
                    {/* 🌟 사용자가 요청한 로딩 하드코딩 조건 적용 */}
                    {(!isReady || isHeatmapLoading) ? (
                        /* 🌟 히트맵 로딩 상태 스켈레톤 (8칸 박스 실루엣 균등 분할) */
                        <CardContent className="h-48 flex items-center justify-center p-4 bg-muted/5 animate-pulse">
                            <div className="grid grid-cols-4 gap-2 w-full h-full max-h-32">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={`heatmap-skeleton-${i}`} className="bg-muted/20 border border-border/40 rounded-md" />
                                ))}
                            </div>
                        </CardContent>
                    ) : (
                        /* 🌟 실제 8슬롯 대칭 그리드 렌더링 (2행 4열 구조) */
                        <CardContent className="h-48 flex items-center justify-center p-4 bg-background animate-in fade-in duration-500">
                            <div className="grid grid-cols-4 gap-2 w-full h-full max-h-32">
                                {Array.from({ length: 8 }).map((_, i) => {
                                    // 0~7번 중 서버에서 내려온 슬롯 데이터를 찾고, 없으면 정상 기본값으로 방어 처리
                                    const slot = safeHeatmapData.slots.find(s => s.zAxisNum === i) || {
                                        zAxisNum: i, passCount: 0, failCount: 0, dominantError: null, severity: "normal"
                                    };

                                    // 명세서 등급(severity)에 기반한 직관적인 위험도 컬러 매핑
                                    const severityClass = 
                                        slot.severity === "critical" ? "border-destructive/50 bg-destructive/10 text-destructive" :
                                        slot.severity === "warning" ? "border-amber-500/40 bg-amber-500/10 text-amber-500" :
                                        "border-border/80 bg-muted/20 text-muted-foreground hover:border-muted-foreground/30";

                                    return (
                                        <div 
                                            key={i} 
                                            className={cn(
                                                "border rounded-md p-2 flex flex-col justify-between transition-colors cursor-help relative",
                                                severityClass
                                            )}
                                            title={`슬롯 ${i} | 양품: ${slot.passCount} | 불량: ${slot.failCount}${slot.dominantError ? ` | 주요 에러: ${slot.dominantError}` : ""}`}
                                        >
                                            {/* 상단 레이블 정보 */}
                                            <div className="flex justify-between items-start">
                                                <span className="text-[10px] font-black tracking-wider opacity-90">Z-{i}</span>
                                                {slot.failCount > 0 && (
                                                    <span className="text-[9px] font-bold px-1 rounded bg-background/40">
                                                        F:{slot.failCount}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* 하단 지배적 불량유형 코드 출력 */}
                                            <div className="text-right">
                                                <span className="text-[9px] font-medium block truncate">
                                                    {slot.dominantError || "OK"}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    )}
                </Card>

            </div>

                    {/* ========================================== */}
                    {/* 3. 세부 파라미터 측정 결과 (Table 통합 완료) */}
                    {/* ========================================== */}
                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Settings2 className="w-5 h-5 text-muted-foreground" /> 세부 파라미터 측정 결과
                            </h3>
                            <span className="text-xs text-muted-foreground">단위: μm (Z-Score &gt; 3.0 시 경보)</span>
                        </div>
                        
                        {(!isReady || isLoading) ? (
                            /* 🌟 1. 로딩 상태 (Skeleton) - 실제 표와 완벽하게 형태를 통일 */
                            <Card className="border-border shadow-sm overflow-hidden animate-pulse bg-muted/5">
                                {/* 헤더 영역 스켈레톤 */}
                                <div className="h-9 bg-muted/20 border-b border-border/50 flex items-center px-4 justify-between">
                                    <div className="h-3 w-16 bg-muted/30 rounded" />
                                    <div className="flex gap-16 pr-8">
                                        <div className="h-3 w-12 bg-muted/30 rounded" />
                                        <div className="h-3 w-12 bg-muted/30 rounded" />
                                        <div className="h-3 w-12 bg-muted/30 rounded" />
                                        <div className="h-3 w-12 bg-muted/30 rounded" />
                                    </div>
                                </div>
                                {/* 데이터 행 스켈레톤 (3개 행) */}
                                {[1, 2, 3].map((i) => (
                                    <div key={`table-row-skeleton-${i}`} className="h-10 border-b border-border/50 flex items-center px-4 justify-between last:border-none">
                                        <div className="h-3 w-28 bg-muted/20 rounded" />
                                        <div className="flex gap-16 pr-8">
                                            <div className="h-3 w-12 bg-muted/10 rounded" />
                                            <div className="h-3 w-12 bg-muted/10 rounded" />
                                            <div className="h-3 w-12 bg-muted/10 rounded" />
                                            <div className="h-3 w-12 bg-muted/10 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </Card>
                        ) : (
                            /* 🌟 2. 실제 데이터 렌더링 */
                            <Card className="border-border shadow-sm overflow-hidden animate-in fade-in duration-500">
                                <Table>
                                    <TableHeader className="bg-muted/30">
                                        <TableRow className="border-border/50 hover:bg-transparent">
                                            <TableHead className="h-9 py-2 text-xs font-semibold">파라미터명</TableHead>
                                            <TableHead className="h-9 py-2 text-xs font-semibold text-right">평균값 (Avg)</TableHead>
                                            <TableHead className="h-9 py-2 text-xs font-semibold text-right">최대치 (Max)</TableHead>
                                            <TableHead className="h-9 py-2 text-xs font-semibold text-right">관리 상한 (USL)</TableHead>
                                            <TableHead className="h-9 py-2 text-xs font-semibold text-right">Z-Score</TableHead>
                                            <TableHead className="h-9 py-2 text-xs font-semibold pl-6">판정</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {safeData.parameters.map((param, index) => {
                                            // Z-Score 수치나 isError 상태에 따라 위험도 분기 처리
                                            const isWarn = param.zScore >= 2.5 && param.zScore < 3.0;
                                            const rowBg = param.isError ? "bg-destructive/5" : isWarn ? "bg-amber-500/5" : "";
                                            
                                            return (
                                                <TableRow key={index} className={cn("border-border/50 transition-colors", rowBg)}>
                                                    <TableCell className="py-2.5 font-medium text-xs">{param.name}</TableCell>
                                                    <TableCell className="py-2.5 text-right text-xs">{param.avg}</TableCell>
                                                    <TableCell className={cn("py-2.5 text-right font-medium text-xs", param.isError && "font-bold text-destructive")}>
                                                        {param.max}
                                                    </TableCell>
                                                    <TableCell className="py-2.5 text-right text-xs text-muted-foreground">{param.usl}</TableCell>
                                                    <TableCell className={cn("py-2.5 text-right text-xs", param.isError && "font-bold text-destructive", isWarn && "text-amber-500 font-semibold")}>
                                                        {param.zScore}
                                                    </TableCell>
                                                    <TableCell className="py-2.5 pl-6">
                                                        {param.isError ? (
                                                            <Badge variant="destructive" className="bg-destructive text-destructive-foreground text-[10px] h-4 py-0">초과 (Error)</Badge>
                                                        ) : isWarn ? (
                                                            <Badge variant="outline" className="text-amber-500 border-amber-500/30 bg-amber-500/10 text-[10px] h-4 py-0 font-normal">근접 (Warn)</Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 text-[10px] h-4 py-0 font-normal">정상 (OK)</Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}
                    </div>

            {/* ========================================== */}
            {/* 🌟 5. 조치 내역 및 메모 (동적 렌더링 & 스켈레톤 완비) */}
            {/* ========================================== */}
            <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-muted-foreground" /> 최근 조치 내역 및 처리 현황
                </h3>
                <Card className="border-border shadow-sm p-6">
                    {/* 타임라인 축선 (중앙선 디자인 그대로 유지) */}
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-border before:to-transparent">
                        
                        {(!isReady || isHistoryLoading) ? (
                            /* 🌟 1. 로딩 상태 (Skeleton) - 타임라인 2줄 미리 채우기 */
                            [1, 2].map((i) => (
                                <div key={`history-skeleton-${i}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse animate-pulse">
                                    {/* 원형 아이콘 크기 고정 */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted shrink-0 md:order-1" />
                                    {/* 가로 카드 스켈레톤 */}
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-border/40 bg-muted/5 space-y-3">
                                        <div className="flex justify-between">
                                            <div className="h-4 w-16 bg-muted/20 rounded" />
                                            <div className="h-3 w-12 bg-muted/10 rounded" />
                                        </div>
                                        <div className="h-4 w-1/2 bg-muted/20 rounded" />
                                        <div className="h-3 w-full bg-muted/10 rounded" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* 🌟 2. 실제 데이터 동적 렌더링 */
                            safeHistoryData.map((item, index) => {
                                const isUnresolved = item.status === "unresolved";
                                
                                return (
                                    <div 
                                        key={item.id || index} 
                                        className={cn(
                                            "relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-in fade-in duration-500",
                                            isUnresolved && "is-active"
                                        )}
                                    >
                                        {/* 왼쪽 타임라인 거점 아이콘: 미조치(Red) vs 조치완료(Muted) */}
                                        <div className={cn(
                                            "flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow",
                                            isUnresolved ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground"
                                        )}>
                                            {isUnresolved ? (
                                                <AlertTriangle className="w-4 h-4 animate-pulse" />
                                            ) : (
                                                <CheckCircle2 className="w-4 h-4" />
                                            )}
                                        </div>

                                        {/* 타임라인 카드 바디: 미조치 스타일 분기 */}
                                        <div className={cn(
                                            "w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border shadow-sm",
                                            isUnresolved ? "border-destructive/30 bg-destructive/5" : "border-border bg-card"
                                        )}>
                                            <div className="flex items-center justify-between mb-1">
                                                {isUnresolved ? (
                                                    <Badge variant="destructive" className="text-[9px] h-4 py-0">미조치</Badge>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-emerald-500">
                                                        조치 완료 {item.worker ? `(${item.worker})` : ""}
                                                    </span>
                                                )}
                                                <time className={cn("text-[11px] font-medium", isUnresolved ? "text-destructive" : "text-muted-foreground")}>
                                                    {item.time} {isUnresolved ? "(현재)" : ""}
                                                </time>
                                            </div>
                                            
                                            <div className="text-sm font-bold text-foreground mb-1">{item.title}</div>
                                            <div className="text-xs text-muted-foreground mb-2">{item.description}</div>
                                            
                                            {/* 🌟 수율 변화 레이아웃: 데이터가 존재할 때만 스위칭 노출 */}
                                            {item.yieldChange && (
                                                <div className="flex items-center gap-2 text-[10px] bg-muted/40 dark:bg-muted/20 p-1.5 rounded w-fit">
                                                    <span className="text-muted-foreground">수율 변화:</span>
                                                    <span className="line-through text-muted-foreground/70">{item.yieldChange.before}%</span>
                                                    <span className="text-muted-foreground/50">→</span>
                                                    <span className="text-emerald-500 font-bold">{item.yieldChange.after}%</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        
                    </div>
                </Card>
            </div>
            </div>
        </SheetContent>
        </Sheet>
    )
}