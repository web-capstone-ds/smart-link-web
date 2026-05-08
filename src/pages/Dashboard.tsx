import { useState } from "react"
import { Calendar, Package, AlertTriangle, Activity, Zap, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, LayoutList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Recharts Import
import { 
  ResponsiveContainer, ComposedChart, LineChart, BarChart, PieChart, 
  Line, Bar, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts"

// ==========================================
// 📦 목업 데이터 (선택 기간 5/01 - 5/06 동기화)
// ==========================================
const trendData = [
  { date: "5/01", production: 3100, yield: 95.1 },
  { date: "5/02", production: 3400, yield: 96.2 },
  { date: "5/03", production: 2800, yield: 93.8 },
  { date: "5/04", production: 3500, yield: 97.1 },
  { date: "5/05", production: 3600, yield: 98.4 },
  { date: "5/06", production: 3900, yield: 99.1 },
];

const paretoData = [
  { defect: "C-01 (치핑)", count: 342, cumulative: 45 },
  { defect: "B-02 (마모)", count: 185, cumulative: 69 },
  { defect: "L-03 (오염)", count: 89, cumulative: 81 },
  { defect: "A-04 (정렬)", count: 45, cumulative: 87 },
  { defect: "기타", count: 99, cumulative: 100 },
];

// 1. 전체 라인 비교 데이터
const lineYieldData = [
  { name: "LINE-A", yield: 96.4 },
  { name: "LINE-B", yield: 98.1 },
  { name: "LINE-C", yield: 94.2 },
];

// 2. 특정 라인(A) 선택 시 장비 비교 데이터
const equipmentYieldData = [
  { name: "EQ.01", yield: 95.2 },
  { name: "EQ.02", yield: 97.4 },
  { name: "EQ.03", yield: 99.3 },
  { name: "EQ.04", yield: 99.4 },
  { name: "EQ.05", yield: 96.1 },
];

const statusData = [
  { name: "Run (가동)", value: 84.0, color: "#10b981" },
  { name: "Idle (대기)", value: 11.5, color: "#f59e0b" },
  { name: "Down (정지)", value: 4.5, color: "#ef4444" },
];

export function Dashboard() {
    const [selectedLine, setSelectedLine] = useState("all");
    
    // 🌟 실제 달력 컴포넌트가 연동되었다고 가정하고, 날짜 상태를 시뮬레이션합니다.
    // (예: isSingleDay가 true면 '5월 6일 하루', false면 '5/1~5/6 기간')
    const [isSingleDay, setIsSingleDay] = useState(false);
    
    // 🌟 트렌드 차트용 로컬 단위 필터
    const [trendUnit, setTrendUnit] = useState("daily");

    // 날짜 모드에 따른 텍스트 동적 렌더링용 변수
    const compareText = isSingleDay ? "전일 대비" : "과거 평균 대비";

    return (
        <div className="animate-in fade-in duration-500 space-y-6">
            
            {/* 1. 상단 타이틀 및 글로벌 필터 */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">종합 대시보드</h1>
                    <p className="text-muted-foreground mt-1 text-sm text-balance">생산 공정 지표 분석 및 AI 예측 리포트</p>
                </div>
                
                <div className="flex items-center gap-2">
                    <Select value={selectedLine} onValueChange={setSelectedLine}>
                        <SelectTrigger className="w-32 bg-card border-border text-foreground font-medium h-10">
                            <SelectValue placeholder="라인 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">전체 라인</SelectItem>
                            <SelectItem value="line-a">SAW-LINE A</SelectItem>
                            <SelectItem value="line-b">SAW-LINE B</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* 🌟 캘린더 버튼: 클릭 시 하루/기간 모드가 토글되도록 임시 구현 (실제론 DatePicker가 들어갈 자리) 🌟 */}
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

            {/* ------------------------------------------------------------- */}
            {/* [Section 1] 고밀도 KPI 요약 영역 (기환 님 요청 지표 100% 복구) */}
            {/* ------------------------------------------------------------- */}
            <div className="space-y-4 p-5 bg-muted/20 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 mb-1 px-1 pb-3">
                    <LayoutList className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-bold text-foreground">
                        {isSingleDay ? '선택 일자 종합 요약' : '조회 기간 누적 요약'}
                    </h2>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                    {/* 🌟 카드 1: 생산량 및 UPH */}
                    <Card className="border-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground">총 생산량 및 UPH</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2">
                                <div className="text-2xl font-bold">24,563 <span className="text-[11px] font-normal text-muted-foreground">EA</span></div>
                                <span className="text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px] mb-1">달성률 102.4%</span>
                            </div>
                            <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-border/50 text-[11px] font-medium text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>시간당 생산 (UPH)</span><span className="text-foreground">2,850 EA/h</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{compareText} 증감</span><span className="text-emerald-500">+2.1%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 🌟 카드 2: 품질 및 치수 합격률 */}
                    <Card className="border-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground">종합 수율 및 품질</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-destructive/70" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2">
                                <div className="text-2xl font-bold">96.4 <span className="text-[11px] font-normal text-muted-foreground">%</span></div>
                                <span className="text-destructive font-bold bg-destructive/10 px-1.5 py-0.5 rounded text-[10px] mb-1">{compareText} -0.8%</span>
                            </div>
                            <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-border/50 text-[11px] font-medium text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>검사 / F / M</span><span className="text-foreground">25.4k / <span className="text-destructive">342</span> / <span className="text-amber-500">128</span></span>
                                </div>
                                <div className="flex justify-between">
                                    <span>치수 합격률 (W/H)</span><span className="text-foreground">98.7%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 🌟 카드 3: 공정능력(Cpk) 및 불량 유형 */}
                    <Card className="border-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground">공정능력 및 주요 불량</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2">
                                <div className="text-2xl font-bold">1.52 <span className="text-[11px] font-normal text-muted-foreground">Cpk</span></div>
                                <span className="text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px] mb-1">{compareText} +0.04</span>
                            </div>
                            <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-border/50 text-[11px] font-medium text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>목표 대비 편차</span><span className="text-foreground">+0.02 μm</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>최다 발생 불량</span>
                                    <Badge variant="outline" className="h-4 text-[9px] px-1 bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-sm">C-01 (치핑)</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 🌟 카드 4: 설비 효율(OEE) 및 AI 예측 */}
                    <Card className="border-primary/20 bg-primary/5 shadow-sm relative overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold text-primary flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" /> 설비 효율(OEE) 및 AI</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2 mb-2.5">
                                <div className="text-2xl font-bold text-foreground">87.3 <span className="text-[11px] font-normal text-muted-foreground">%</span></div>
                                <span className="text-[10px] font-bold text-muted-foreground mb-1">(라인 가동률 84%)</span>
                            </div>
                            <div className="flex items-start gap-1.5 pt-2 border-t border-primary/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 animate-pulse shrink-0"></div>
                                <p className="text-[10.5px] leading-relaxed text-foreground/80 font-medium">
                                    가동률은 안정적이나, <span className="text-amber-500 font-bold">블레이드 마모</span>로 인한 <span className="text-primary font-bold">LINE-A</span>의 치수 편차 징후가 감지됩니다.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pareto + Doughnut */}
                <div className="grid grid-cols-3 gap-4">
                    <Card className="col-span-2 shadow-sm border-border bg-card/50 pt-2">
                        <CardHeader className="py-3 pb-0"><CardTitle className="text-xs font-bold">주요 불량 발생 원인 (Pareto)</CardTitle></CardHeader>
                        <CardContent className="h-[180px] pt-2">
                            <ResponsiveContainer width="100%" height="100%" debounce={300}>
                                <ComposedChart data={paretoData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                                    <XAxis dataKey="defect" tick={{ fontSize: 9, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="left" tick={{ fontSize: 9, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 9, fill: '#f59e0b' }} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '10px' }} />
                                    <Bar yAxisId="left" dataKey="count" name="발생 건수" fill="#64748b" radius={[2, 2, 0, 0]} maxBarSize={40} />
                                    <Line yAxisId="right" type="monotone" dataKey="cumulative" name="누적 비율" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 shadow-sm border-border bg-card/50 relative pt-2">
                        <CardHeader className="py-3 pb-0"><CardTitle className="text-xs font-bold">종합 가동 비율</CardTitle></CardHeader>
                        <CardContent className="h-[180px] pt-0">
                            <ResponsiveContainer width="100%" height="100%" debounce={300}>
                                <PieChart>
                                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="value" stroke="none">
                                        {statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                                <span className="text-xl font-black">84%</span>
                                <span className="text-[8px] text-muted-foreground font-bold uppercase">Uptime</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* [Section 2] 시계열 트렌드 및 비교 영역 */}
            {/* ------------------------------------------------------------- */}
            <div className="grid grid-cols-3 gap-6">
                
                {/* 🌟 로컬 단위 필터가 적용된 트렌드 차트 🌟 */}
                <Card className="col-span-2 shadow-sm border-border pt-2">
                    <CardHeader className="py-3 pb-2 border-b border-border/50 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <LineChartIcon className="w-4 h-4 text-muted-foreground" /> 생산량 및 수율 트렌드
                        </CardTitle>
                        
                        {/* 🌟 로컬 차트 전용 단위 변경 필터 🌟 */}
                        <Select value={trendUnit} onValueChange={setTrendUnit}>
                            <SelectTrigger className="w-[110px] h-8 text-xs bg-background">
                                <SelectValue placeholder="단위 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily" className="text-xs">일별 (Daily)</SelectItem>
                                <SelectItem value="weekly" className="text-xs">주별 (Weekly)</SelectItem>
                                <SelectItem value="monthly" className="text-xs">월별 (Monthly)</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    
                    <CardContent className="h-[280px] pt-6">
                        <ResponsiveContainer width="100%" height="100%" debounce={300}>
                            <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                                <YAxis yAxisId="right" orientation="right" domain={[90, 100]} tick={{ fontSize: 10, fill: '#10b981' }} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '12px' }} />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                <Bar yAxisId="left" dataKey="production" name="생산량" fill="#3b82f6" radius={[2, 2, 0, 0]} maxBarSize={40} />
                                <Line yAxisId="right" type="monotone" dataKey="yield" name="수율(%)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 🌟 조건부 렌더링 수율 비교 차트 🌟 */}
                <Card className="col-span-1 shadow-sm border-border pt-2">
                    <CardHeader className="py-4 pb-2 border-b border-border/50">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <LayoutList className="w-4 h-4 text-muted-foreground" />
                            {selectedLine === "all" ? "라인별 수율 비교" : `${selectedLine.toUpperCase()} 장비별 수율`}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[280px] pt-6">
                        <ResponsiveContainer width="100%" height="100%" debounce={300}>
                            <BarChart 
                                data={selectedLine === "all" ? lineYieldData : equipmentYieldData} 
                                layout="vertical" 
                                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" horizontal={false} />
                                <XAxis type="number" domain={[90, 100]} tick={{ fontSize: 10, fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#a1a1aa' }} tickLine={false} axisLine={false} width={60} />
                                <Tooltip cursor={{ fill: '#27272a' }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '12px' }} />
                                <Bar 
                                    dataKey="yield" 
                                    name="수율(%)" 
                                    fill={selectedLine === "all" ? "#8b5cf6" : "#0ea5e9"} 
                                    radius={[0, 4, 4, 0]} 
                                    barSize={20} 
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}