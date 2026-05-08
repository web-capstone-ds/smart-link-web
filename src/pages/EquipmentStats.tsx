import { useState, useMemo } from "react"
import { PieChart as PieChartIcon, Filter, ArrowUpDown, Download, Clock, ShieldCheck, Calendar, BellRing, CheckCircle2} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 🌟 Recharts 추가 Import
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, LineChart, Line, YAxis } from "recharts"

// ==========================================
// 📦 목업 데이터 모음
// ==========================================

// 1. 신규: 총 비가동 시간 트렌드 (최근 6일)
const downtimeData = [
    { date: "5/01", hours: 22.5 }, { date: "5/02", hours: 18.2 }, { date: "5/03", hours: 28.5 },
    { date: "5/04", hours: 15.0 }, { date: "5/05", hours: 12.5 }, { date: "5/06", hours: 14.2 },
];

// 2. 신규: 라인별 평균 무고장 시간 (MTBF)
const mtbfData = [
    { line: "LINE-A", hours: 82 },
    { line: "LINE-B", hours: 115 },
    { line: "LINE-C", hours: 78 },
];

// 3. 주요 불량 코드
const defectStatsData = [
    { code: "C-01", name: "Chipping (치핑)", type: "공통 불량", count: 342, ratio: "45%", impact: "Package Size 이상치 발생" },
    { code: "B-02", name: "Blade Wear (블레이드 마모)", type: "공통 불량", count: 185, ratio: "24%", impact: "절단면 품질 저하 및 부하" },
    { code: "L-03", name: "Lens Contamination", type: "개별 불량", count: 89, ratio: "12%", impact: "비전 인식 오류" },
    { code: "A-04", name: "Alignment Fail", type: "개별 불량", count: 45, ratio: "6%", impact: "자재 정렬 틀어짐" },
];

const paretoColors = ["#f59e0b", "#f97316", "#3b82f6", "#0ea5e9"]; // 파레토 파이 차트 색상

// 4. 장비 개별 데이터
const equipmentComparisonData = [
    { id: "SAW-EQ.01", line: "line-a", recipe: "PKG_A12", uptime: 82.5, total: 24500, fail: 850, marginal: 320, yield: 95.2, majorDefect: "C-01 (Chipping)", unresolvedAlert: true, yieldTrend: [97, 96, 95, 93, 91, 95.2] },
    { id: "SAW-EQ.02", line: "line-a", recipe: "PKG_B08", uptime: 91.2, total: 22100, fail: 410, marginal: 150, yield: 97.4, majorDefect: "L-03 (Lens Contamination)", unresolvedAlert: false, yieldTrend: [96, 97, 97.5, 98, 97.2, 97.4] },
    { id: "SAW-EQ.03", line: "line-b", recipe: "PKG_A12", uptime: 98.5, total: 25600, fail: 120, marginal: 50, yield: 99.3, majorDefect: "B-02 (Blade Wear)", unresolvedAlert: false, yieldTrend: [99, 99.1, 99.2, 99.5, 99.3, 99.3] },
    { id: "SAW-EQ.04", line: "line-b", recipe: "PKG_C15", uptime: 99.1, total: 23800, fail: 95, marginal: 30, yield: 99.4, majorDefect: "-", unresolvedAlert: false, yieldTrend: [98.5, 99, 99.2, 99.4, 99.5, 99.4] },
    { id: "SAW-EQ.05", line: "line-a", recipe: "PKG_A12", uptime: 78.0, total: 21500, fail: 950, marginal: 420, yield: 93.6, majorDefect: "C-01 (Chipping)", unresolvedAlert: true, yieldTrend: [98, 96, 94, 92, 91, 93.6] },
    { id: "SAW-EQ.06", line: "line-c", recipe: "PKG_B08", uptime: 94.2, total: 23100, fail: 310, marginal: 110, yield: 98.1, majorDefect: "A-04 (Alignment Fail)", unresolvedAlert: false, yieldTrend: [97, 97.5, 98, 98.1, 97.9, 98.1] },
    { id: "SAW-EQ.07", line: "line-c", recipe: "PKG_C15", uptime: 97.5, total: 24600, fail: 150, marginal: 60, yield: 99.1, majorDefect: "B-02 (Blade Wear)", unresolvedAlert: false, yieldTrend: [98, 98.5, 99, 99.2, 99.1, 99.1] },
    { id: "SAW-EQ.08", line: "line-b", recipe: "PKG_A12", uptime: 99.5, total: 24800, fail: 80, marginal: 20, yield: 99.6, majorDefect: "-", unresolvedAlert: false, yieldTrend: [99, 99.2, 99.4, 99.5, 99.6, 99.6] },
];

interface EquipmentStatsProps {
    setSelectedEquipment: (id: string) => void;
}

export function EquipmentStats({ setSelectedEquipment }: EquipmentStatsProps) {
    const [filterLine, setFilterLine] = useState("all");
    const [isSingleDay, setIsSingleDay] = useState(false);
    
    const [sortBy, setSortBy] = useState("yield-asc");

    // 나중에 Zustand나 React Context API 같은 상태 관리 라이브러리를 사용해서 "이 라인/날짜 상태를 App.tsx 최상단에 하나만 두고 모든 페이지가 공유하게 묶기
    const filteredAndSortedData = useMemo(() => {
        // 1. 라인 필터링 (새로운 배열 반환)
        const filtered = equipmentComparisonData.filter(eq => 
            filterLine === "all" ? true : eq.line === filterLine
        );

        // 2. 정렬 (원본 오염 방지를 위해 [...filtered] 로 복사 후 정렬!)
        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "yield-asc": return a.yield - b.yield;
                case "yield-desc": return b.yield - a.yield;
                case "uptime-asc": return a.uptime - b.uptime;
                case "uptime-desc": return b.uptime - a.uptime;
                default: return 0;
            }
        });
    }, [filterLine, sortBy]);

    return (
        <div className="animate-in fade-in duration-500 space-y-6 pb-10">
            
            {/* 🌟 1. 대시보드와 완벽히 통일된 상단 타이틀 & 글로벌 필터 영역 🌟 */}
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">장비 현황 통계</h2>
                    <p className="text-sm text-muted-foreground mt-1">장비별 상세 수율 현황 및 설비 신뢰성 지표를 분석합니다.</p>
                </div>
                
                <div className="flex items-center gap-2">
                    {/* 대시보드와 동일한 라인 선택기 */}
                    <Select value={filterLine} onValueChange={setFilterLine}>
                        <SelectTrigger className="w-32 bg-card border-border text-foreground font-medium h-10">
                            <SelectValue placeholder="라인 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">전체 라인</SelectItem>
                            <SelectItem value="line-a">SAW-LINE A</SelectItem>
                            <SelectItem value="line-b">SAW-LINE B</SelectItem>
                            <SelectItem value="line-c">SAW-LINE C</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* 대시보드와 동일한 달력 버튼 */}
                    <Button 
                        variant="outline" 
                        onClick={() => setIsSingleDay(!isSingleDay)}
                        className="gap-2.5 justify-start bg-card border-border text-foreground hover:bg-muted/50 font-normal min-w-56 h-10"
                    >
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{isSingleDay ? '2026. 05. 06 (하루)' : '26.05.01 - 26.05.06 (기간)'}</span>
                    </Button>
                    <Button variant="default" className="px-5 h-10">조회</Button>
                </div>
            </div>

            {/* 🌟 상단 영역: 신뢰성 지표(1) + 불량코드(2) + 차트(1) = 4칸 그리드 🌟 */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                
                {/* 1. 좌측 (1칸 차지): 신규 추가된 설비 신뢰성 KPI 미니 카드 2개 세로 배치 */}
                <div className="col-span-1 flex flex-col gap-4">
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

                {/* 2. 중앙 (2칸 차지): 주요 불량 코드 리스트 */}
                <Card className="col-span-2 flex flex-col gap-0 shadow-sm border-border min-w-0">
                    <CardHeader className="py-3 px-4 border-b border-border">
                        <CardTitle className="text-sm font-bold">주요 불량 코드 분석</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent border-border/50">
                                    <TableHead className="h-9 px-4 py-2 text-xs">코드명</TableHead>
                                    <TableHead className="h-9 py-2 text-xs">구분</TableHead>
                                    <TableHead className="h-9 py-2 text-xs text-right">발생 (비율)</TableHead>
                                    <TableHead className="h-9 py-2 text-xs pl-6">문제 현상 요약</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {defectStatsData.map((defect) => (
                                    <TableRow key={defect.code} className="border-border/50">
                                        <TableCell className="px-4 py-2 font-medium">
                                            <div className="flex flex-col">
                                                <span className="text-sm">{defect.code}</span>
                                                <span className="text-[10px] text-muted-foreground">{defect.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-2">
                                            <Badge variant="outline" className={`text-[9px] font-normal px-1.5 py-0 h-4 ${defect.type === '공통 불량' ? 'border-amber-500/50 text-amber-500' : 'border-blue-500/50 text-blue-500'}`}>
                                                {defect.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-2 text-right font-bold text-sm">
                                            {defect.count} <span className="text-[10px] text-muted-foreground font-normal">({defect.ratio})</span>
                                        </TableCell>
                                        <TableCell className="py-2 text-[11px] text-muted-foreground pl-6">
                                            {defect.impact}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* 3. 우측 (1칸 차지): 파이 차트 */}
                <Card className="col-span-1 flex flex-col shadow-sm border-border min-w-0">
                    <CardHeader className="py-3 px-4 border-b border-border">
                        <CardTitle className="text-sm font-bold">불량 점유율</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center justify-center pt-2 relative">
                        <div className="w-full h-[140px]">
                            <ResponsiveContainer width="100%" height="100%" debounce={50}>
                                <PieChart>
                                    <Pie data={defectStatsData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="count" stroke="none" isAnimationActive={false}>
                                        {defectStatsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={paretoColors[index % paretoColors.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ fontSize: '10px', backgroundColor: '#18181b', borderColor: '#27272a' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* 범례 */}
                        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-[9px] text-muted-foreground font-medium px-2">
                            {defectStatsData.map((d, i) => (
                                <span key={d.code} className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: paretoColors[i] }}></div>{d.code}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 🌟 하단 전체 영역: 필터/정렬 컨트롤이 포함된 장비 개별 표 🌟 */}
            {/* 🌟 하단 표 영역 (라인 필터 제거, 정렬만 유지) */}
            <Card className="gap-0 shadow-sm border-border mt-6">
                <CardHeader className="py-3 px-4 border-b border-border flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        장비 개별 수율 및 가동 상세
                        <Badge variant="secondary" className="font-normal text-[10px] ml-2">총 {filteredAndSortedData.length}대</Badge>
                    </CardTitle>
                    
                    <div className="flex items-center gap-2">
                        {/* ✅ 정렬 옵션만 남김 */}
                        <div className="flex items-center gap-1.5 bg-muted/50 rounded-md p-1 border border-border">
                            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
                            <Select value={sortBy} onValueChange={setSortBy}>
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
                            {filteredAndSortedData.map((eq) => (
                                <TableRow 
                                    key={eq.id} 
                                    onClick={() => setSelectedEquipment(eq.id)} 
                                    className="cursor-pointer hover:bg-muted/50 transition-colors border-border/50"
                                >
                                    {/* 1. 장비 ID & 레시피 */}
                                    <TableCell className="px-4 py-2.5 font-semibold text-foreground text-sm">
                                        <div className="flex flex-col gap-0.5">
                                            <span>{eq.id} <span className="text-[10px] text-muted-foreground font-normal ml-1">({eq.line.toUpperCase()})</span></span>
                                            <Badge variant="secondary" className="w-fit text-[9px] px-1 py-0 h-3.5 font-normal bg-secondary/50">{eq.recipe}</Badge>
                                        </div>
                                    </TableCell>

                                    {/* 🌟 2. 미조치 경보 유무 (Triage 핵심 요소) */}
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

                                    {/* 🌟 4. 미니 수율 추이 차트 (Sparkline) */}
                                    <TableCell className="py-2.5">
                                        <div className="w-20 h-6 mx-auto">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={eq.yieldTrend.map(val => ({ value: val }))}>
                                                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                                                    {/* 수율이 95 이하면 빨간색 선, 아니면 초록색 선으로 직관적 표시 */}
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
                    
                    {filteredAndSortedData.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                            <Filter className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-sm">선택한 조건에 해당하는 장비가 없습니다.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}