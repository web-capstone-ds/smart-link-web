import { useState, useEffect } from "react"
import { Download, Info, Settings2, Loader2, Activity, CheckCircle2, AlertTriangle } from "lucide-react"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { ResponsiveContainer, Tooltip, XAxis, Line, YAxis, CartesianGrid, Legend, ComposedChart } from "recharts"

interface EquipmentDetailSheetProps {
    selectedEquipment: string | null;
    setSelectedEquipment: (id: string | null) => void;
}

// 📦 1. 수율 및 SPC 추이 목업 데이터 (최근 LOT 흐름)
const spcTrendData = [
    { lot: "L-01", yield: 98.5, lineAvg: 97.2, lcl: 96.0 },
    { lot: "L-02", yield: 98.2, lineAvg: 97.4, lcl: 96.0 },
    { lot: "L-03", yield: 97.1, lineAvg: 97.5, lcl: 96.0 },
    { lot: "L-04", yield: 96.5, lineAvg: 97.3, lcl: 96.0 },
    { lot: "L-05", yield: 94.2, lineAvg: 97.6, lcl: 96.0 }, // 수율 하락 시작
    { lot: "L-06", yield: 92.1, lineAvg: 97.5, lcl: 96.0 }, // LCL(하한선) 이탈 - 에러 발생 지점
    { lot: "L-07", yield: 98.5, lineAvg: 97.7, lcl: 96.0 }, // 조치 후 회복
];

// 📦 2. 결함 히트맵 목업 데이터 (X, Y 좌표 및 불량 강도/종류)
const defectPoints = [
    // 우측 하단 집중 치핑(Chipping) 데이터
    { x: 65, y: 70, type: 'chipping', intensity: 'bg-destructive' },
    { x: 72, y: 75, type: 'chipping', intensity: 'bg-destructive' },
    { x: 75, y: 68, type: 'chipping', intensity: 'bg-destructive' },
    { x: 80, y: 82, type: 'chipping', intensity: 'bg-destructive' },
    { x: 82, y: 74, type: 'chipping', intensity: 'bg-destructive' },
    { x: 68, y: 80, type: 'chipping', intensity: 'bg-destructive' },
    { x: 77, y: 85, type: 'chipping', intensity: 'bg-destructive' },
    // 간헐적 산발 데이터 (노이즈)
    { x: 30, y: 40, type: 'other', intensity: 'bg-amber-500' },
    { x: 45, y: 20, type: 'other', intensity: 'bg-amber-500' },
    { x: 25, y: 65, type: 'other', intensity: 'bg-amber-500' },
    { x: 55, y: 50, type: 'other', intensity: 'bg-amber-500' },
];

export function EquipmentDetailSheet({ selectedEquipment, setSelectedEquipment }: EquipmentDetailSheetProps) {

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (selectedEquipment) {
        setIsReady(false); // 열릴 때는 일단 비워둠
        const timer = setTimeout(() => setIsReady(true), 150); // 0.15초 뒤에 데이터 그리기 시작!
        return () => clearTimeout(timer);
        }
    }, [selectedEquipment]);

    return (
        <Sheet open={!!selectedEquipment} onOpenChange={(open) => !open && setSelectedEquipment(null)}>
        <SheetContent 
        side="right" 
        className="w-[90vw] max-w-350! overflow-y-auto custom-scrollbar p-0 transform-gpu contain-paint will-change-transform"
        >
            {/* 고정 헤더 영역 */}
            <div className="sticky top-0 z-10 bg-background border-b border-border p-6 flex items-center justify-between">
            <SheetHeader className="text-left space-y-1">
                <div className="flex items-center gap-3">
                <SheetTitle className="text-2xl font-bold">{selectedEquipment}</SheetTitle>
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Critical 경보 발생</Badge>
                </div>
                <SheetDescription>
                Line: Line-A | Current Recipe: PKG_DICE_C15 | Lot: LOT-2605B-02
                </SheetDescription>
            </SheetHeader>
            <Button className="gap-2">
                <Download className="w-4 h-4" /> 리포트 PDF 다운로드
            </Button>
            </div>

            {!isReady ? (
            // 타이머가 도는 0.15초 동안 보여질 로딩 화면 (아주 부드럽게 열림)
            <div className="w-full h-125 flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-sm">데이터를 불러오는 중입니다...</p>
            </div>
            ) : (
            <div className="p-6 space-y-8 animate-in fade-in duration-500">
            
            {/* 1. AI 예측 및 권고 */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5 flex gap-4">
                <Info className="w-6 h-6 text-blue-500 shrink-0" />
                <div>
                <h4 className="text-sm font-bold text-blue-500 mb-1">AI 징후 예측 (Pattern Detected)</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">
                    비전 검사 히트맵 분석 결과, 우측 하단 <strong>집중 치핑(Chipping) 패턴</strong>이 발견되었습니다. 
                    동일 레시피 과거 데이터와 비교 시, 이는 <strong>블레이드 장력 저하 및 미세 흔들림</strong>으로 인한 현상으로 추정됩니다. 
                    즉시 블레이드 상태 점검 및 Z-축 보정을 권고합니다.
                </p>
                </div>
            </div>
            {/* ========================================== */}
            {/* 🌟 새로 추가되는 일일 가동 타임라인 영역 🌟 */}
            {/* ========================================== */}
            <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-muted-foreground" /> 일일 가동 타임라인
            </h3>
            <Card className="border-border">
                <CardContent className="p-5">
                <div className="flex justify-between items-end mb-3">
                    <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground">총 가동률</p>
                    {/* 실제 데이터 연동 시 선택된 장비의 uptime 값을 매핑하면 됩니다 */}
                    <p className="text-2xl font-black text-destructive">82.5 <span className="text-sm font-normal text-muted-foreground">%</span></p>
                    </div>
                    <div className="flex gap-3 text-[10px] font-bold">
                    <span className="flex items-center gap-1 text-emerald-600"><div className="w-2 h-2 bg-emerald-500 rounded-sm"></div> Run (6.6h)</span>
                    <span className="flex items-center gap-1 text-amber-500"><div className="w-2 h-2 bg-amber-400 rounded-sm"></div> Idle (0.2h)</span>
                    <span className="flex items-center gap-1 text-destructive"><div className="w-2 h-2 bg-destructive rounded-sm"></div> Down (1.2h)</span>
                    </div>
                </div>
                
                {/* 타임라인 바 */}
                <div className="h-8 flex rounded-md overflow-hidden border border-border/50">
                    <div className="bg-emerald-500 h-full w-[30%] hover:brightness-110 transition-all" title="08:00 - 10:24 (정상 가동)"></div>
                    <div className="bg-amber-400 h-full w-[5%]" title="10:24 - 10:48 (자재 대기)"></div>
                    <div className="bg-emerald-500 h-full w-[40%]" title="10:48 - 14:00 (정상 가동)"></div>
                    <div className="bg-destructive h-full w-[15%] animate-pulse" title="14:00 - 15:12 (치핑 에러 정지)"></div>
                    <div className="bg-emerald-500 h-full w-[10%]" title="15:12 - 17:00 (정상 가동)"></div>
                </div>
                
                {/* 시간 눈금 */}
                <div className="flex justify-between text-[10px] text-muted-foreground font-bold mt-2 px-1">
                    <span>08:00</span>
                    <span>10:00</span>
                    <span>12:00</span>
                    <span>14:00 (Error)</span>
                    <span>17:00</span>
                </div>
                </CardContent>
            </Card>
            </div>
            {/* 2. 주요 파라미터 요약 */}
            <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-muted-foreground" /> 핵심 치수 통계
                </h3>
                <div className="grid grid-cols-2 gap-4">
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="py-3 pb-2 border-b border-border/50">
                    <CardTitle className="text-sm">Package Width (X)</CardTitle>
                    </CardHeader>
                    <CardContent className="py-3 flex justify-between items-center">
                    <div>
                        <div className="text-2xl font-bold">12.04 <span className="text-xs font-normal text-muted-foreground">mm</span></div>
                        <div className="text-xs text-muted-foreground mt-1">σ: 0.02 | 이상치: <span className="text-destructive font-bold">3건</span></div>
                    </div>
                    <Badge variant="destructive" className="bg-destructive/10 text-destructive">초과 위험</Badge>
                    </CardContent>
                </Card>

                <Card className="border-border">
                    <CardHeader className="py-3 pb-2 border-b border-border/50">
                    <CardTitle className="text-sm">Package Height (Y)</CardTitle>
                    </CardHeader>
                    <CardContent className="py-3 flex justify-between items-center">
                    <div>
                        <div className="text-2xl font-bold">8.51 <span className="text-xs font-normal text-muted-foreground">mm</span></div>
                        <div className="text-xs text-muted-foreground mt-1">σ: 0.01 | 이상치: 0건</div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500">정상 (OK)</Badge>
                    </CardContent>
                </Card>
                </div>
            </div>
{/* 3. 시각화 데이터 (트렌드 & 히트맵) */}
            <div className="grid grid-cols-2 gap-6">
                
                {/* 🌟 1. 수율 및 SPC 추이 차트 🌟 */}
                <Card className="shadow-sm border-border min-w-0">
                    <CardHeader className="py-3 px-4 border-b border-border/50 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold">수율 및 SPC 추이</CardTitle>
                        <Badge variant="outline" className="text-[9px] font-normal h-4 py-0 text-muted-foreground border-border">최근 7 LOT</Badge>
                    </CardHeader>
                    <CardContent className="h-48 pt-4 px-2 pb-0">
                        <ResponsiveContainer width="100%" height="100%" debounce={50}>
                            <ComposedChart data={spcTrendData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                                <XAxis dataKey="lot" tick={{ fontSize: 9, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                                <YAxis domain={[90, 100]} tick={{ fontSize: 9, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '11px', padding: '6px' }}
                                    itemStyle={{ padding: 0 }}
                                />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} iconSize={8} />
                                
                                {/* LCL (관리 하한선) - 붉은 점선 */}
                                <Line type="step" dataKey="lcl" name="관리하한(LCL)" stroke="#ef4444" strokeDasharray="4 4" dot={false} strokeWidth={1.5} isAnimationActive={false} />
                                
                                {/* 라인 평균 수율 - 회색 선 */}
                                <Line type="monotone" dataKey="lineAvg" name="라인 평균" stroke="#71717a" dot={false} strokeWidth={2} isAnimationActive={false} />
                                
                                {/* 해당 장비 수율 - 파란색 강조 선 */}
                                <Line type="monotone" dataKey="yield" name="장비 수율" stroke="#3b82f6" dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 5 }} strokeWidth={2.5} isAnimationActive={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 🌟 2. 결함 위치 히트맵 (Wafer Heatmap Simulation) 🌟 */}
                <Card className="shadow-sm border-border min-w-0">
                    <CardHeader className="py-3 px-4 border-b border-border/50 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            결함 위치 히트맵
                        </CardTitle>
                        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 text-[9px] font-bold h-4 py-0">패턴: 우측 하단 집중</Badge>
                    </CardHeader>
                    <CardContent className="h-48 flex items-center justify-center bg-background relative overflow-hidden">
                        
                        {/* 웨이퍼 배경 (원형) */}
                        <div className="relative w-36 h-36 rounded-full border border-border/80 bg-muted/10 shadow-inner overflow-hidden flex items-center justify-center">
                            
                            {/* 다이(Die) 격자 무늬 시뮬레이션 */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#71717a 1px, transparent 1px), linear-gradient(90deg, #71717a 1px, transparent 1px)', backgroundSize: '8px 8px' }}></div>
                            
                            {/* 플랫존 (웨이퍼 하단의 깎인 부분) */}
                            <div className="absolute bottom-0 w-16 h-1 bg-background z-10 border-t border-border/80"></div>

                            {/* 🌟 집중 불량 영역 열화상 Blur 효과 (우측 하단) 🌟 */}
                            <div className="absolute w-20 h-20 bg-destructive/40 rounded-full blur-xl" style={{ left: '60%', top: '60%' }}></div>

                            {/* 개별 결함 좌표(Dots) 렌더링 */}
                            {defectPoints.map((pt, i) => (
                                <div
                                    key={i}
                                    className={`absolute w-1.5 h-1.5 rounded-full shadow-sm ${pt.intensity}`}
                                    style={{
                                        left: `${pt.x}%`,
                                        top: `${pt.y}%`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                />
                            ))}
                        </div>

                        {/* 히트맵 범례 (Legend) */}
                        <div className="absolute right-4 bottom-4 flex flex-col gap-1.5 p-2 bg-card/80 backdrop-blur-sm border border-border rounded-md shadow-sm">
                            <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-medium">
                                <div className="w-2 h-2 rounded-full bg-destructive shadow-[0_0_4px_rgba(239,68,68,0.8)]"></div>
                                Chipping
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-medium">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                Others
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* ========================================== */}
            {/* 🌟 4. 세부 파라미터 및 경보 수치 근거 표 🌟 */}
            {/* ========================================== */}
            <div>
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-muted-foreground" /> 세부 파라미터 측정 결과
                    </h3>
                    <span className="text-xs text-muted-foreground">단위: μm (Z-Score &gt; 3.0 시 경보)</span>
                </div>
                <Card className="border-border shadow-sm overflow-hidden">
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
                            <TableRow className="border-border/50 bg-destructive/5">
                                <TableCell className="py-2.5 font-medium text-xs">Chipping_Bottom</TableCell>
                                <TableCell className="py-2.5 text-right text-xs">12.4</TableCell>
                                <TableCell className="py-2.5 text-right font-bold text-destructive text-xs">28.7</TableCell>
                                <TableCell className="py-2.5 text-right text-xs text-muted-foreground">25.0</TableCell>
                                <TableCell className="py-2.5 text-right font-bold text-destructive text-xs">3.42</TableCell>
                                <TableCell className="py-2.5 pl-6">
                                    <Badge variant="destructive" className="bg-destructive text-destructive-foreground text-[10px] h-4 py-0">초과 (Error)</Badge>
                                </TableCell>
                            </TableRow>
                            <TableRow className="border-border/50">
                                <TableCell className="py-2.5 font-medium text-xs">Coplanarity</TableCell>
                                <TableCell className="py-2.5 text-right text-xs">5.2</TableCell>
                                <TableCell className="py-2.5 text-right text-xs">7.8</TableCell>
                                <TableCell className="py-2.5 text-right text-xs text-muted-foreground">10.0</TableCell>
                                <TableCell className="py-2.5 text-right text-xs">1.85</TableCell>
                                <TableCell className="py-2.5 pl-6">
                                    <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 text-[10px] h-4 py-0 font-normal">정상 (OK)</Badge>
                                </TableCell>
                            </TableRow>
                            <TableRow className="border-border/50 bg-amber-500/5">
                                <TableCell className="py-2.5 font-medium text-xs">Kerf_Width</TableCell>
                                <TableCell className="py-2.5 text-right text-xs">42.1</TableCell>
                                <TableCell className="py-2.5 text-right font-semibold text-amber-500 text-xs">48.9</TableCell>
                                <TableCell className="py-2.5 text-right text-xs text-muted-foreground">50.0</TableCell>
                                <TableCell className="py-2.5 text-right font-semibold text-amber-500 text-xs">2.88</TableCell>
                                <TableCell className="py-2.5 pl-6">
                                    <Badge variant="outline" className="text-amber-500 border-amber-500/30 bg-amber-500/10 text-[10px] h-4 py-0 font-normal">근접 (Warn)</Badge>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Card>
            </div>

            {/* ========================================== */}
            {/* 🌟 5. 조치 내역 및 메모 (Timeline UI) 🌟 */}
            {/* ========================================== */}
            <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-muted-foreground" /> 최근 조치 내역 및 처리 현황
                </h3>
                <Card className="border-border shadow-sm p-6">
                    {/* 타임라인 컨테이너 */}
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                        
                        {/* 1. 미조치 경보 (최상단) */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-destructive text-destructive-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                                <AlertTriangle className="w-4 h-4 animate-pulse" />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-destructive/30 bg-destructive/5 shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                    <Badge variant="destructive" className="text-[9px] h-4 py-0">미조치</Badge>
                                    <time className="text-[11px] font-medium text-destructive">14:00 (현재)</time>
                                </div>
                                <div className="text-sm font-bold text-foreground mb-1">Chipping 한계치 초과 발생</div>
                                <div className="text-xs text-muted-foreground">현재 장비 정지(Down) 상태. 블레이드 교체 대기 중.</div>
                            </div>
                        </div>

                        {/* 2. 과거 조치 내역 */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted text-muted-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-border bg-card shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold text-emerald-500">조치 완료 (김엔지니어)</span>
                                    <time className="text-[11px] font-medium text-muted-foreground">10:48</time>
                                </div>
                                <div className="text-sm font-bold text-foreground mb-1">Z축 얼라인먼트 재보정</div>
                                <div className="text-xs text-muted-foreground mb-2">자재 대기 중 센서 오염 확인 후 클리닝 및 Z축 0점 세팅 완료.</div>
                                <div className="flex items-center gap-2 text-[10px] bg-muted/50 p-1.5 rounded">
                                    <span className="text-muted-foreground">수율 변화:</span>
                                    <span className="line-through text-muted-foreground">92.1%</span>
                                    <span>→</span>
                                    <span className="text-emerald-500 font-bold">98.5%</span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </Card>
            </div>
            
            </div>)}
        </SheetContent>
        </Sheet>
    )
}