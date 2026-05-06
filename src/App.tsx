import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, } from "@/components/ui/sheet"
import { useState } from "react"

import { 
    LayoutDashboard, Cpu, FileText, Settings, Bell, Search, User, Settings2, BarChart3, PieChart, LineChart, Clock,
    Package, Activity, Zap, AlertTriangle, Download, Info, AlertCircle, Calendar, PanelLeft, Menu
} from "lucide-react"

const equipmentData = [
    { id: "VELOCE-G7.01", recipe: "PKG_DICE_A12", status: "정지", yield: "48.0%", cpk: "0.85", uph: "245", alarm: "긴급", alarmCount: 2 },
    { id: "VELOCE-G7.02", recipe: "PKG_DICE_B08", status: "정상", yield: "97.2%", cpk: "1.68", uph: "312", alarm: null, alarmCount: 0 },
    { id: "VELOCE-G7.03", recipe: "PKG_DICE_A12", status: "경고", yield: "91.5%", cpk: "1.34", uph: "289", alarm: "주의", alarmCount: 1 },
    { id: "VELOCE-G7.04", recipe: "PKG_DICE_C15", status: "정상", yield: "98.1%", cpk: "1.72", uph: "318", alarm: "정보", alarmCount: 1 },
    { id: "VELOCE-G7.05", recipe: "PKG_DICE_B08", status: "정상", yield: "96.8%", cpk: "1.58", uph: "305", alarm: null, alarmCount: 0 },
    { id: "VELOCE-G7.01", recipe: "PKG_DICE_A12", status: "정지", yield: "48.0%", cpk: "0.85", uph: "245", alarm: "긴급", alarmCount: 2 },
    { id: "VELOCE-G7.02", recipe: "PKG_DICE_B08", status: "정상", yield: "97.2%", cpk: "1.68", uph: "312", alarm: null, alarmCount: 0 },
    { id: "VELOCE-G7.03", recipe: "PKG_DICE_A12", status: "경고", yield: "91.5%", cpk: "1.34", uph: "289", alarm: "주의", alarmCount: 1 },
    { id: "VELOCE-G7.04", recipe: "PKG_DICE_C15", status: "정상", yield: "98.1%", cpk: "1.72", uph: "318", alarm: "정보", alarmCount: 1 },
    { id: "VELOCE-G7.05", recipe: "PKG_DICE_B08", status: "정상", yield: "96.8%", cpk: "1.58", uph: "305", alarm: null, alarmCount: 0 },
    { id: "VELOCE-G7.04", recipe: "PKG_DICE_C15", status: "정상", yield: "98.1%", cpk: "1.72", uph: "318", alarm: "정보", alarmCount: 1 },
    { id: "VELOCE-G7.05", recipe: "PKG_DICE_B08", status: "정상", yield: "96.8%", cpk: "1.58", uph: "305", alarm: null, alarmCount: 0 },
    { id: "VELOCE-G7.01", recipe: "PKG_DICE_A12", status: "정지", yield: "48.0%", cpk: "0.85", uph: "245", alarm: "긴급", alarmCount: 2 },
]

// 주요 불량 코드 및 정지 사유 데이터
const defectStatsData = [
    { code: "C-01", name: "Chipping (치핑)", type: "공통 불량", count: 342, ratio: "45%", impact: "Package Size (Width/Height) 이상치 발생" },
    { code: "B-02", name: "Blade Wear (블레이드 마모)", type: "공통 불량", count: 185, ratio: "24%", impact: "절단면 품질 저하 및 부하 증가" },
    { code: "L-03", name: "Lens Contamination", type: "개별 불량", count: 89, ratio: "12%", impact: "비전 인식 오류 (False Alarm)" },
    { code: "A-04", name: "Alignment Fail", type: "개별 불량", count: 45, ratio: "6%", impact: "자재 정렬 틀어짐" },
];

// 장비 개별 수율 비교 데이터
const equipmentComparisonData = [
    { id: "SAW-EQ.01", status: "Critical", total: 24500, fail: 850, marginal: 320, yield: "95.2%", majorDefect: "C-01 (Chipping)" },
    { id: "SAW-EQ.02", status: "Warning", total: 22100, fail: 410, marginal: 150, yield: "97.4%", majorDefect: "L-03 (Lens Contamination)" },
    { id: "SAW-EQ.03", status: "Normal", total: 25600, fail: 120, marginal: 50, yield: "99.3%", majorDefect: "B-02 (Blade Wear)" },
    { id: "SAW-EQ.04", status: "Normal", total: 23800, fail: 95, marginal: 30, yield: "99.4%", majorDefect: "-" },
    { id: "SAW-EQ.01", status: "Critical", total: 24500, fail: 850, marginal: 320, yield: "95.2%", majorDefect: "C-01 (Chipping)" },
    { id: "SAW-EQ.02", status: "Warning", total: 22100, fail: 410, marginal: 150, yield: "97.4%", majorDefect: "L-03 (Lens Contamination)" },
    { id: "SAW-EQ.03", status: "Normal", total: 25600, fail: 120, marginal: 50, yield: "99.3%", majorDefect: "B-02 (Blade Wear)" },
    { id: "SAW-EQ.04", status: "Normal", total: 23800, fail: 95, marginal: 30, yield: "99.4%", majorDefect: "-" },
];

function App() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

    const [cardOneMetric, setCardOneMetric] = useState("목표달성률")
    const [cardTwoMetric, setCardTwoMetric] = useState("종합수율")
    const [cardThreeMetric, setCardThreeMetric] = useState("치수 합격률")
    const [cardFourMetric, setCardFourMetric] = useState("AI 상태")

    return (
        // 전체 화면을 덮는 가장 큰 컨테이너
        <div className="flex h-screen w-full bg-background text-foreground">

            {/* 1. 좌측 사이드바 (Sidebar) */}
            <aside 
                className={`
                ${isSidebarOpen ? "w-64" : "w-0 border-r-0"} 
                transition-[width,border] duration-300 ease-in-out 
                border-r border-border bg-card flex flex-col overflow-hidden shrink-0
                `}
            >
                {/* 닫힐 때 안쪽 글씨가 찌그러지지 않도록 w-64 고정 컨테이너로 한 번 감싸줍니다 */}
                <div className="w-64 flex flex-col h-full">
                    {/* 로고 영역 */}
                    <div className="h-16 flex items-center px-6 border-b border-border shrink-0 gap-1.5">
                        <div className="p-1.5 rounded-lg">
                            <Cpu className="w-5 h-5 block text-muted-foreground group-hover:hidden transition-all" />
                        </div>
                        <span className="text-lg font-bold text-primary tracking-wider">SMART LINK</span>
                    </div>
            
                    {/* 메뉴 영역 */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">

                        <Button 
                            variant={activeMenu === "dashboard" ? "secondary" : "ghost"} 
                            className={`w-full justify-start gap-3 ${activeMenu !== "dashboard" && "text-muted-foreground hover:text-foreground"}`}
                            onClick={() => setActiveMenu("dashboard")}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            종합 대시보드
                        </Button>

                        <Button 
                            variant={activeMenu === "equipment" ? "secondary" : "ghost"} 
                            className={`w-full justify-start gap-3 ${activeMenu !== "equipment" && "text-muted-foreground hover:text-foreground"}`}
                            onClick={() => setActiveMenu("equipment")}
                        >
                            <Cpu className="w-4 h-4" />
                            장비 현황 통계
                        </Button>

                        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                            <FileText className="w-4 h-4" />
                            일일 리포트
                        </Button>
                    </nav>
          
                    {/* 하단 설정 영역 */}
                    <div className="p-4 border-t border-border shrink-0">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                            <Settings className="w-4 h-4" />
                            시스템 설정
                        </Button>
                    </div>
                </div>
            </aside>

            {/* 2. 우측 메인 영역 (상단 헤더 + 본문) */}
            <main className="flex-1 flex flex-col overflow-hidden">
        
                {/* 상단 네비게이션 바 (Top Nav) */}
                <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                        {/* ✅ 토글 버튼 추가 영역 ✅ */}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            // group 클래스를 주어 자식 요소들이 호버 상태를 공유하게 만듭니다.
                            className="text-muted-foreground hover:bg-muted/50 group shrink-0"
                        >
                            {isSidebarOpen ? (
                                // 사이드바가 열려있을 때: 닫기 모양(PanelLeft) 유지
                                <PanelLeft className="w-5 h-5" />
                            ) : (
                                // 사이드바가 닫혀있을 때: 평소엔 Menu, 마우스 올리면 PanelLeft
                                <>
                                    <Cpu className="w-5 h-5 block group-hover:hidden transition-all" />
                                    <PanelLeft className="w-5 h-5 hidden group-hover:block transition-all" />
                                </>
                            )}
                        </Button>
                    
                        <span>최종 업데이트: 2026-05-06 11:06 KST</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted/50">
                            <Search className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground relative hover:bg-muted/50">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
                        </Button>
                        <div className="w-px h-6 bg-border mx-2"></div>
                        <Button variant="ghost" className="gap-2 text-muted-foreground hover:bg-muted/50">
                            <User className="w-5 h-5 bg-secondary rounded-full p-0.5" />
                            <span>운영팀</span>
                        </Button>
                    </div>
                </header>

                {/* 3. 실제 데이터가 들어갈 본문 (Content Area) */}
                <div className="flex-1 p-6 overflow-auto bg-background custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-6">
                    
                    {/* ✅ 여기서부터 조건부 렌더링을 시작합니다! ✅ */}
                    {activeMenu === "dashboard" ? (

                    // ==========================================
                    // 1. 기존 종합 대시보드 화면
                    // ==========================================
                    <>   
                        {/* 타이틀 영역 */}
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">종합 대시보드</h1>
                                <p className="text-muted-foreground mt-1 text-sm">종합 생산 지표 및 장비 가동 상태</p>
                            </div>
                        
                            {/* 우측: 조회 기간 선택 캘린더 버튼 */}
                            <div className="flex items-center gap-2">
                                <Button 
                                variant="outline" 
                                className="gap-2.5 justify-start bg-card border-border text-foreground hover:bg-muted/50 hover:text-foreground font-normal min-w-[240px]"
                                >
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span>2026. 05. 01 - 2026. 05. 06</span>
                                </Button>
                                <Button variant="default" className="px-5">
                                    조회
                                </Button>
                            </div>
                        </div>

                        {/* 핵심 요약 지표 (KPI) 카드 영역 */}
                        <div className="grid grid-cols-4 gap-4">
                        
                            {/* 1. 총 생산량 카드 */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Card className="cursor-pointer hover:border-primary/50 transition-colors group relative overflow-hidden">
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Settings2 className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium text-muted-foreground">총 생산량</CardTitle>
                                            <Package className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-foreground">
                                                24,563 <span className="text-sm font-normal text-muted-foreground">units</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-3 text-xs">
                                                {cardOneMetric === "목표달성률" ? (
                                                    <>
                                                        <span className="text-muted-foreground">목표달성률 <span className="text-foreground font-medium">102.4%</span></span>
                                                        <span className="text-emerald-500 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">+2.1%</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-muted-foreground">불량률 <span className="text-destructive font-medium">1.2%</span></span>
                                                        <span className="text-emerald-500 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">-0.3%</span>
                                                    </>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>총 생산량 상세 정보</DialogTitle>
                                        <DialogDescription>장비별 세부 생산 현황을 확인하고, 대시보드 표시 항목을 변경합니다.</DialogDescription>
                                    </DialogHeader>
                                    <div className="flex items-center justify-center h-40 bg-muted/30 rounded-lg border border-dashed border-border my-4">
                                        <div className="flex flex-col items-center text-muted-foreground">
                                            <BarChart3 className="w-8 h-8 mb-2 opacity-50" />
                                            <span className="text-sm">상세 생산량 트렌드 차트</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-medium text-foreground">대시보드 표시 항목</h4>
                                            <p className="text-xs text-muted-foreground">카드 하단에 표시될 보조 지표를 선택하세요.</p>
                                        </div>
                                        <Select value={cardOneMetric} onValueChange={setCardOneMetric}>
                                            <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="지표 선택" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="목표달성률" className="text-xs">목표달성률</SelectItem>
                                                <SelectItem value="불량률" className="text-xs">불량률 (Defect Rate)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {/* 2. Fail 및 Marginal 카드 */}
                            <Dialog>
                                <DialogTrigger asChild>
                                <Card className="cursor-pointer hover:border-primary/50 transition-colors group relative overflow-hidden">
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Settings2 className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Fail 및 Marginal</CardTitle>
                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                    </CardHeader>
                                    <CardContent>
                                    <div className="flex items-baseline gap-3">
                                        <div className="text-2xl font-bold text-destructive">342 <span className="text-sm font-normal text-destructive/70">건 (F)</span></div>
                                        <div className="text-lg font-medium text-amber-500">128 <span className="text-sm font-normal text-amber-500/70">건 (M)</span></div>
                                    </div>
                                    <div className="flex items-center justify-between mt-3 text-xs">
                                        {cardTwoMetric === "종합수율" ? (
                                        <>
                                            <span className="text-muted-foreground">종합수율 <span className="text-foreground font-medium">96.4%</span></span>
                                            <span className="text-destructive font-medium bg-destructive/10 px-1.5 py-0.5 rounded">-0.8%</span>
                                        </>
                                        ) : (
                                        <>
                                            <span className="text-muted-foreground">재작업률 <span className="text-amber-500 font-medium">2.1%</span></span>
                                            <span className="text-destructive font-medium bg-destructive/10 px-1.5 py-0.5 rounded">+0.2%</span>
                                        </>
                                        )}
                                    </div>
                                    </CardContent>
                                </Card>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>불량 및 마진 영역 분석</DialogTitle>
                                    <DialogDescription>Fail 사유별 파레토 차트 및 재작업 현황을 확인합니다.</DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center justify-center h-40 bg-muted/30 rounded-lg border border-dashed border-border my-4">
                                    <div className="flex flex-col items-center text-muted-foreground">
                                    <PieChart className="w-8 h-8 mb-2 opacity-50" />
                                    <span className="text-sm">Fail 유형별 비율 차트</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border">
                                    <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-foreground">대시보드 표시 항목</h4>
                                    </div>
                                    <Select value={cardTwoMetric} onValueChange={setCardTwoMetric}>
                                    <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="지표 선택" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="종합수율" className="text-xs">종합수율 (Yield)</SelectItem>
                                        <SelectItem value="재작업률" className="text-xs">재작업률 (Rework)</SelectItem>
                                    </SelectContent>
                                    </Select>
                                </div>
                                </DialogContent>
                            </Dialog>

                            {/* 3. 공정능력지수 카드 */}
                            <Dialog>
                                <DialogTrigger asChild>
                                <Card className="cursor-pointer hover:border-primary/50 transition-colors group relative overflow-hidden">
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Settings2 className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">공정능력지수</CardTitle>
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                    <div className="text-2xl font-bold text-foreground">1.52 <span className="text-sm font-normal text-muted-foreground">Cpk</span></div>
                                    <div className="flex items-center justify-between mt-3 text-xs">
                                        {cardThreeMetric === "치수 합격률" ? (
                                        <>
                                            <span className="text-muted-foreground">치수 합격률 <span className="text-foreground font-medium">98.7%</span></span>
                                            <span className="text-emerald-500 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">+1.3%</span>
                                        </>
                                        ) : (
                                        <>
                                            <span className="text-muted-foreground">평균 편차 <span className="text-foreground font-medium">0.02μm</span></span>
                                            <span className="text-emerald-500 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">-0.01</span>
                                        </>
                                        )}
                                    </div>
                                    </CardContent>
                                </Card>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>공정능력 상세 분석</DialogTitle>
                                    <DialogDescription>실시간 Cpk 트렌드 및 치수 산포도를 모니터링합니다.</DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center justify-center h-40 bg-muted/30 rounded-lg border border-dashed border-border my-4">
                                    <div className="flex flex-col items-center text-muted-foreground">
                                    <LineChart className="w-8 h-8 mb-2 opacity-50" />
                                    <span className="text-sm">정규분포 및 Cpk 트렌드 곡선</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border">
                                    <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-foreground">대시보드 표시 항목</h4>
                                    </div>
                                    <Select value={cardThreeMetric} onValueChange={setCardThreeMetric}>
                                    <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="지표 선택" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="치수 합격률" className="text-xs">치수 합격률</SelectItem>
                                        <SelectItem value="평균 편차" className="text-xs">평균 편차 (Deviation)</SelectItem>
                                    </SelectContent>
                                    </Select>
                                </div>
                                </DialogContent>
                            </Dialog>

                            {/* 4. 라인 장비 가동률 카드 */}
                            <Dialog>
                                <DialogTrigger asChild>
                                <Card className="cursor-pointer hover:border-primary/50 transition-colors group relative overflow-hidden">
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Settings2 className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">라인 장비 가동률</CardTitle>
                                    <Zap className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                    <div className="text-2xl font-bold text-foreground">87.3 <span className="text-sm font-normal text-muted-foreground">%</span></div>
                                    <div className="flex items-center justify-between mt-3 text-xs">
                                        {cardFourMetric === "AI 상태" ? (
                                        <>
                                            <span className="text-muted-foreground">AI 예측 상태 <span className="text-emerald-500 font-medium">양호</span></span>
                                            <span className="text-emerald-500 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">+3.2%</span>
                                        </>
                                        ) : (
                                        <>
                                            <span className="text-muted-foreground">유휴 시간 <span className="text-destructive font-medium">45분</span></span>
                                            <span className="text-emerald-500 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">-12분</span>
                                        </>
                                        )}
                                    </div>
                                    </CardContent>
                                </Card>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>설비 종합 효율 (OEE)</DialogTitle>
                                    <DialogDescription>전체 라인의 가동률, 성능, 품질 지표를 통합 확인합니다.</DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center justify-center h-40 bg-muted/30 rounded-lg border border-dashed border-border my-4">
                                    <div className="flex flex-col items-center text-muted-foreground">
                                    <Clock className="w-8 h-8 mb-2 opacity-50" />
                                    <span className="text-sm">가동/비가동 타임라인 분석</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border">
                                    <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-foreground">대시보드 표시 항목</h4>
                                    </div>
                                    <Select value={cardFourMetric} onValueChange={setCardFourMetric}>
                                    <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="지표 선택" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AI 상태" className="text-xs">AI 예측 상태</SelectItem>
                                        <SelectItem value="유휴 시간" className="text-xs">총 유휴 시간 (Idle)</SelectItem>
                                    </SelectContent>
                                    </Select>
                                </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                
                        {/* 장비 현황 데이터 그리드 영역 */}
                        <Card className="flex flex-col overflow-hidden gap-0">
                            {/* 헤더 영역 */}
                            <div className="flex items-center justify-between px-5 pb-3 border-b border-border">
                                <h2 className="text-lg font-bold text-foreground">장비 현황</h2>
                                <Button variant="outline" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                                    <Download className="w-4 h-4" />
                                    데이터 다운로드
                                </Button>
                            </div>

                            {/* 필터 및 검색 툴바 */}
                            <div className="flex items-center gap-5 px-5 py-2.5 bg-muted/20 border-b border-border">
                                {/* 검색창 */}
                                <div className="relative w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                    <Input 
                                        placeholder="장비 ID 또는 레시피 검색..." 
                                        className="pl-8 bg-background border-border text-xs h-8" 
                                    />
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-muted-foreground">상태:</span>
                                    <div className="flex gap-1.5">
                                        <Button variant="default" size="sm" className="h-8 rounded-full px-4 text-xs font-medium">전체</Button>
                                        <Button variant="secondary" size="sm" className="h-8 rounded-full px-4 text-xs font-medium bg-secondary/50 text-muted-foreground hover:text-foreground">정상</Button>
                                        <Button variant="secondary" size="sm" className="h-8 rounded-full px-4 text-xs font-medium bg-secondary/50 text-muted-foreground hover:text-foreground">경고</Button>
                                        <Button variant="secondary" size="sm" className="h-8 rounded-full px-4 text-xs font-medium bg-secondary/50 text-muted-foreground hover:text-foreground">정지</Button>
                                    </div>
                                </div>
                            </div>

                            {/* 테이블 본문 */}
                            <div className="overflow-auto px-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-border hover:bg-transparent">
                                            <TableHead className="w-[180px] font-semibold text-muted-foreground">장비ID</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">현재 레시피</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">상태</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">수율</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">Cpk</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">UPH</TableHead>
                                            <TableHead className="font-semibold text-muted-foreground">조치 알람</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {equipmentData.map((row) => (
                                            <TableRow key={row.id} className="border-border/50 border-b last:border-0 hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-medium text-foreground">{row.id}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="font-normal bg-secondary/40 text-muted-foreground hover:bg-secondary/40">
                                                        {row.recipe}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {/* 상태 렌더링 로직 */}
                                                    {row.status === "정상" && (
                                                        <Badge variant="outline" className="gap-1.5 border-emerald-500/30 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/10">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 정상
                                                        </Badge>
                                                    )}
                                                    {row.status === "경고" && (
                                                        <Badge variant="outline" className="gap-1.5 border-amber-500/30 text-amber-500 bg-amber-500/10 hover:bg-amber-500/10">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> 경고
                                                        </Badge>
                                                    )}
                                                    {row.status === "정지" && (
                                                        <Badge variant="outline" className="gap-1.5 border-destructive/30 text-destructive bg-destructive/10 hover:bg-destructive/10">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-destructive"></span> 정지
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-foreground">{row.yield}</TableCell>
                                                <TableCell className="text-foreground">{row.cpk}</TableCell>
                                                <TableCell className="text-foreground">{row.uph}</TableCell>
                                                <TableCell>
                                                {/* 조치 알람 렌더링 로직 */}
                                                    {row.alarm === "긴급" && (
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="gap-1 border-destructive/50 text-destructive font-normal">
                                                                <AlertCircle className="w-3 h-3" /> 긴급
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">({row.alarmCount})</span>
                                                        </div>
                                                    )}
                                                    {row.alarm === "주의" && (
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="gap-1 border-amber-500/50 text-amber-500 font-normal">
                                                                <AlertTriangle className="w-3 h-3" /> 주의
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">({row.alarmCount})</span>
                                                        </div>
                                                    )}
                                                    {row.alarm === "정보" && (
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="gap-1 border-blue-500/50 text-blue-500 font-normal">
                                                                <Info className="w-3 h-3" /> 정보
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">({row.alarmCount})</span>
                                                        </div>
                                                    )}
                                                    {!row.alarm && <span className="text-muted-foreground">-</span>}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </>
                    ) : (
                    // ==========================================
                    // 2. 새로운 장비 현황 통계 화면
                    // ==========================================
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-foreground">전체 장비 통계</h2>
                                <p className="text-sm text-muted-foreground mt-1">라인 내 전체 장비의 주요 정지 사유 및 수율 현황을 분석합니다.</p>
                            </div>
                        </div>

                        {/* 상단 2분할 영역: 정지 사유 및 불량 코드 분석 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            
                            {/* 불량 코드 및 정지 사유 리스트 */}
                            <Card className="flex flex-col gap-0">
                                <CardHeader className="pb-3 border-b border-border">
                                    <CardTitle className="text-base">주요 불량 코드 및 정지 사유</CardTitle>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow className="hover:bg-transparent">
                                                <TableHead className="h-9 px-4 py-2 text-xs">코드명</TableHead>
                                                <TableHead className="h-9 py-2 text-xs">구분</TableHead>
                                                <TableHead className="h-9 py-2 text-xs text-right">발생 건수 (비율)</TableHead>
                                                <TableHead className="h-9 py-2 text-xs">예상 문제 현상</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {defectStatsData.map((defect) => (
                                                <TableRow key={defect.code}>
                                                    <TableCell className="px-4 py-2.5 font-medium ">
                                                        <div className="flex flex-col">
                                                            <span>{defect.code}</span>
                                                            <span className="text-xs text-muted-foreground">{defect.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-2.5">
                                                        <Badge variant="outline" className={`text-[10px] font-normal ${defect.type === '공통 불량' ? 'border-amber-500/50 text-amber-500' : 'border-blue-500/50 text-blue-500'}`}>
                                                            {defect.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-2.5 text-right font-medium">
                                                        {defect.count} <span className="text-xs text-muted-foreground font-normal">({defect.ratio})</span>
                                                    </TableCell>
                                                    <TableCell className="py-2.5 text-xs text-muted-foreground">
                                                        {defect.impact}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            {/* 시각화 차트가 들어갈 예비 공간 */}
                            <Card className="flex flex-col items-center justify-center min-h-[250px] bg-muted/10 border-dashed">
                                <PieChart className="w-10 h-10 text-muted-foreground/50 mb-3" />
                                <p className="text-sm text-muted-foreground">불량 비율 파레토 차트 영역</p>
                            </Card>
                        </div>

                        {/* 하단 전체 영역: 장비 개별 수율 비교 표 */}
                        <Card className="gap-0">
                            <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                                <CardTitle className="text-base">장비 개별 수율 비교</CardTitle>
                                <Button variant="outline" size="sm" className="h-8 text-xs">상세 데이터 내보내기</Button>
                            </CardHeader>
                            <CardContent className="p-0 overflow-x-auto custom-scrollbar">
                                <Table>
                                    <TableHeader className="bg-muted/30">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="h-10 px-4 py-2">장비 ID</TableHead>
                                            <TableHead className="h-10 py-2">상태</TableHead>
                                            <TableHead className="h-10 py-2 text-right">총 검사 수량</TableHead>
                                            <TableHead className="h-10 py-2 text-right">Fail / Marginal</TableHead>
                                            <TableHead className="h-10 py-2 text-right">수율</TableHead>
                                            <TableHead className="h-10 py-2">주요 불량 코드</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {equipmentComparisonData.map((eq) => (
                                            <TableRow key={eq.id} onClick={() => setSelectedEquipment(eq.id)} className="cursor-pointer hover:bg-muted/50 transition-colors">
                                                <TableCell className="px-4 py-3 font-semibold text-foreground">{eq.id}</TableCell>
                                                <TableCell className="py-3">
                                                    {eq.status === "Critical" && <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 gap-1"><AlertTriangle className="w-3 h-3"/> Critical</Badge>}
                                                    {eq.status === "Warning" && <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1"><AlertCircle className="w-3 h-3"/> Warning</Badge>}
                                                    {eq.status === "Normal" && <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Normal</Badge>}
                                                </TableCell>
                                                <TableCell className="py-3 text-right font-medium">{eq.total.toLocaleString()}</TableCell>
                                                <TableCell className="py-3 text-right">
                                                    <span className="text-destructive font-semibold">{eq.fail}</span> / <span className="text-amber-500 font-medium">{eq.marginal}</span>
                                                </TableCell>
                                                <TableCell className="py-3 text-right">
                                                    <span className={`font-bold ${parseFloat(eq.yield) < 97 ? 'text-destructive' : 'text-emerald-500'}`}>{eq.yield}</span>
                                                </TableCell>
                                                <TableCell className="py-3 text-sm text-muted-foreground">{eq.majorDefect}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                    )}
                    </div>
                </div>
                {/* ========================================== */}
                {/* 장비 상세 리포트 슬라이드 오버 패널 (Sheet) */}
                {/* ========================================== */}
                <Sheet open={!!selectedEquipment} onOpenChange={(open) => !open && setSelectedEquipment(null)}>
                    {/* 모니터 화면의 80% 정도 넓이를 차지하도록 크기를 키웁니다 */}
                    <SheetContent 
                    side="right" 
                    // 이제 sm:max-w-none 상태이므로 아래 설정이 그대로 먹힙니다!
                    className="w-[90vw] !max-w-[1400px] overflow-y-auto custom-scrollbar p-0"
                    >
                    
                        {/* 고정 헤더 영역 */}
                        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-6 flex items-center justify-between">
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

                        {/* 스크롤되는 본문 내용 영역 */}
                        <div className="p-6 space-y-8">
                            
                            {/* 1. AI 예측 및 권고 (최우선 배치) */}
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

                            {/* 2. 주요 파라미터 요약 (강조 영역) */}
                            <div>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Settings2 className="w-5 h-5 text-muted-foreground" /> 핵심 치수 통계
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* 🌟 핵심 강조: Package Width & Height 🌟 */}
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
                                <Card>
                                    <CardHeader className="py-4">
                                        <CardTitle className="text-sm">수율 추이 (vs 라인 평균)</CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-48 flex items-center justify-center bg-muted/20">
                                        <p className="text-xs text-muted-foreground">Recharts 수율 비교 차트 영역</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="py-4">
                                        <CardTitle className="text-sm">결함 위치 히트맵</CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-48 flex items-center justify-center bg-muted/20">
                                        <p className="text-xs text-muted-foreground">불량 좌표 히트맵 시각화 영역</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* 4. 기타 파라미터 및 조치 내역 영역 (플레이스홀더) */}
                            <div className="text-center p-8 border border-dashed border-border rounded-lg text-muted-foreground text-sm">
                                스크롤을 내리면 추가적인 SPC 관리도, 세부 파라미터(Coplanarity, Burr height) 측정 표, <br/>그리고 작업자의 메모가 포함된 조치 이력(Timeline)이 이어집니다.
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </main>
        </div>
    )
}

export default App