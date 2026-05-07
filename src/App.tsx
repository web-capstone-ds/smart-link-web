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
    Package, Activity, Zap, AlertTriangle, Download, Info, AlertCircle, Calendar, PanelLeft, Menu, Printer
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

// 3페이지용: 경보 발생 및 조치 이력 데이터
  const alarmHistoryData = [
    { id: "A-001", severity: "Critical", eq: "SAW-EQ.01", message: "Package Width USL 초과 위험", time: "14:23:10", status: "미조치", action: "-", worker: "-" },
    { id: "A-002", severity: "Warning", eq: "SAW-EQ.05", message: "Vision Sensor 조명 광도 저하", time: "11:05:42", status: "조치완료", action: "광원 캘리브레이션 재수행", worker: "김엔지" },
    { id: "A-003", severity: "Critical", eq: "SAW-EQ.02", message: "Alignment Fail (연속 3회)", time: "09:12:05", status: "조치완료", action: "자재 매거진 재정렬 및 영점 조정", worker: "이프로" },
    { id: "A-004", severity: "Warning", eq: "SAW-EQ.08", message: "Network Sync Timeout", time: "08:45:11", status: "조치완료", action: "버퍼 초기화 및 재접속", worker: "시스템" },
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

                        <Button 
                        variant={activeMenu === "report" ? "secondary" : "ghost"} 
                        className={`w-full justify-start gap-3 ${activeMenu !== "report" && "text-muted-foreground hover:text-foreground"}`}
                        onClick={() => setActiveMenu("report")}
                        >
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
                    {activeMenu === "dashboard" && (

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
                    )}

                    {activeMenu === "equipment" && (
                    // ==========================================
                    // 2. 장비 현황 통계 화면
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
                    {/* ========================================== */}
                    {/* 3. 일일 리포트 화면 (A4 스타일) */}
                    {/* ========================================== */}
                    {activeMenu === "report" && (
                    <div className="flex flex-col items-center space-y-8 animate-in fade-in duration-500 pb-20">
                        
                        {/* 상단 툴바 (인쇄/다운로드 버튼) */}
                        <div className="w-full max-w-[800px] flex justify-between items-center bg-card p-4 rounded-lg border border-border shadow-sm">
                            <div>
                                <h2 className="text-lg font-bold">일일 공정 분석 리포트</h2>
                                <p className="text-xs text-muted-foreground">PDF 내보내기 및 인쇄 최적화 포맷</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Printer className="w-4 h-4" /> 인쇄
                                </Button>
                                <Button size="sm" className="gap-2 bg-zinc-900 text-white hover:bg-zinc-800">
                                    <Download className="w-4 h-4" /> PDF 저장
                                </Button>
                            </div>
                        </div>

                        {/* 📄 리포트 1페이지 (A4) */}
                        <div className="w-[800px] min-h-[1132px] bg-white text-zinc-950 p-12 shadow-2xl flex flex-col font-sans border border-zinc-200">
                        
                            {/* 1. 헤더 & 결재란 */}
                            <div className="flex justify-between items-start mb-10">
                                <div className="space-y-1">
                                    <h1 className="text-3xl font-black tracking-tighter text-zinc-900 mb-4">DAILY REPORT</h1>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] text-zinc-600">
                                        <p><span className="font-bold text-zinc-400 mr-2">발행 일시:</span> 2026. 05. 06 17:00</p>
                                        <p><span className="font-bold text-zinc-400 mr-2">작성자:</span> 홍길동 선임</p>
                                        <p><span className="font-bold text-zinc-400 mr-2">집계 기간:</span> 2026.05.06 08:00 ~ 17:00</p>
                                        <p><span className="font-bold text-zinc-400 mr-2">대상 설비:</span> SAW-LINE A (12대)</p>
                                    </div>
                                </div>

                                {/* 결재란 */}
                                <div className="flex border border-zinc-300 text-center text-[10px]">
                                    <div className="w-12 border-r border-zinc-300">
                                        <div className="bg-zinc-50 border-b border-zinc-300 py-1">결재</div>
                                        <div className="h-16 flex items-center justify-center">작성</div>
                                    </div>
                                    <div className="w-16 border-r border-zinc-300">
                                        <div className="bg-zinc-50 border-b border-zinc-300 py-1">기안</div>
                                        <div className="h-16"></div>
                                    </div>
                                    <div className="w-16 border-r border-zinc-300">
                                        <div className="bg-zinc-50 border-b border-zinc-300 py-1">검토</div>
                                        <div className="h-16"></div>
                                    </div>
                                    <div className="w-16">
                                        <div className="bg-zinc-50 border-b border-zinc-300 py-1">승인</div>
                                        <div className="h-16"></div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. AI 상태 요약 (핵심 메시지) */}
                            <div className="bg-zinc-900 text-white p-6 rounded-sm mb-8 relative overflow-hidden">
                                <div className="absolute right-[-10px] top-[-10px] opacity-10">
                                    <Cpu className="w-32 h-32" />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-xs font-bold text-zinc-400 mb-2 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        AI EXECUTIVE SUMMARY
                                    </h3>
                                    <p className="text-sm leading-relaxed font-medium">
                                        금일 주간 가동 결과, 전체 생산량은 목표 대비 <span className="text-emerald-400">102.4%</span>로 초과 달성되었습니다. 
                                        다만, <span className="text-amber-400 font-bold">SAW-EQ.01</span> 장비에서 패키지 치수(Width) 편차가 USL 근계치(12.04mm)에 도달하는 징후가 포착되었습니다. 
                                        이는 블레이드 수명 종료(남은 수명 8%)에 따른 현상으로 판단되며, 야간 근무 조 교대 시 교체를 권고합니다.
                                    </p>
                                </div>
                            </div>

                            {/* 3. 핵심 요약 지표 (KPI Cards) */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {[
                                { label: "총 생산량 / 달성률", value: "24,563 EA", sub: "102.4%", trend: "+2.1%" },
                                { label: "종합 수율 (Yield)", value: "98.7%", sub: "목표 98.0%", trend: "+0.7%" },
                                { label: "설비 가동률 (OEE)", value: "87.3%", sub: "전일 85.1%", trend: "+2.2%" },
                                { label: "공정능력지수 (Cpk)", value: "1.52", sub: "Grade: Excellent", trend: "-0.04" },
                                { label: "치수 합격률", value: "99.2%", sub: "Width/Height", trend: "+0.1%" },
                                { label: "주요 불량 건수", value: "342건", sub: "Chipping 위주", trend: "-12건" },
                                ].map((kpi, idx) => (
                                <div key={idx} className="border border-zinc-200 p-4 rounded-sm">
                                    <p className="text-[10px] font-bold text-zinc-500 mb-1">{kpi.label}</p>
                                    <div className="flex justify-between items-end">
                                        <span className="text-xl font-black text-zinc-900">{kpi.value}</span>
                                        <span className="text-[10px] font-bold text-emerald-600">{kpi.trend}</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-400 mt-1">{kpi.sub}</p>
                                </div>
                                ))}
                            </div>

                            {/* 4. 장비 개별 수율 비교 표 */}
                            <div className="mt-4">
                                <h3 className="text-xs font-bold text-zinc-900 mb-3 flex items-center gap-2">
                                    <div className="w-1 h-3 bg-zinc-900"></div> 장비별 생산 현황 요약
                                </h3>
                                <table className="w-full text-[11px] border-collapse">
                                    <thead>
                                        <tr className="border-y-2 border-zinc-900 bg-zinc-50">
                                            <th className="py-2 px-2 text-left">장비 ID</th>
                                            <th className="py-2 px-2 text-left">상태</th>
                                            <th className="py-2 px-2 text-right">총 검사량</th>
                                            <th className="py-2 px-2 text-right">Fail / Marginal</th>
                                            <th className="py-2 px-2 text-right">수율</th>
                                            <th className="py-2 px-2 text-left pl-6">주요 불량</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200">
                                        {equipmentComparisonData.map((eq) => (
                                        <tr key={eq.id}>
                                            <td className="py-2.5 px-2 font-bold">{eq.id}</td>
                                            <td className="py-2.5 px-2">
                                                <span className={
                                                    eq.status === 'Critical' ? 'text-red-600 font-bold' : 
                                                    eq.status === 'Warning' ? 'text-amber-600' : 'text-zinc-600'
                                                }>{eq.status}</span>
                                            </td>
                                            <td className="py-2.5 px-2 text-right">{eq.total.toLocaleString()}</td>
                                            <td className="py-2.5 px-2 text-right text-zinc-500">{eq.fail} / {eq.marginal}</td>
                                            <td className="py-2.5 px-2 text-right font-bold text-zinc-900">{eq.yield}</td>
                                            <td className="py-2.5 px-2 pl-6 text-zinc-500">{eq.majorDefect}</td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* 하단 푸터 (페이지 번호 등) */}
                            <div className="mt-auto pt-10 flex justify-between items-center text-[10px] text-zinc-400 border-t border-zinc-100">
                                <p>© 2026 SMART LINK Vision Inspection Systems</p>
                                <p>Page 01 / 03</p>
                            </div>
                        </div>
                        {/* ========================================== */}
                        {/* 📄 리포트 2페이지 (품질 및 치수 분석) */}
                        {/* ========================================== */}
                        <div className="w-[800px] min-h-[1132px] bg-white text-zinc-950 p-12 shadow-2xl flex flex-col font-sans border border-zinc-200 shrink-0 relative overflow-hidden">
                            
                            {/* 우측 상단 워터마크 느낌의 배경 */}
                            <div className="absolute right-0 top-0 opacity-5 p-8 pointer-events-none">
                                <Activity className="w-64 h-64 text-zinc-900" />
                            </div>

                            {/* 페이지 타이틀 */}
                            <div className="mb-8 z-10">
                                <h2 className="text-2xl font-black text-zinc-900 border-b-2 border-zinc-900 pb-2 flex items-center gap-2">
                                    <span className="text-zinc-400 font-normal">02.</span> 품질 및 치수 상세 분석
                                </h2>
                            </div>

                            {/* 1. 공정능력지수(Cpk) 및 치수 데이터 */}
                            <div className="mb-10 z-10">
                                <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-zinc-900"></div> 공정능력지수(Cpk) 및 Package Width 산포도
                                </h3>
                            
                                <div className="grid grid-cols-3 gap-6">
                                    {/* 좌측: 수치 요약 */}
                                    <div className="col-span-1 space-y-4">
                                        <div className="bg-zinc-50 border border-zinc-200 p-4">
                                            <p className="text-[10px] font-bold text-zinc-500 mb-1">치수 합격률 (Pass Rate)</p>
                                            <p className="text-2xl font-black text-emerald-600">99.2%</p>
                                            <p className="text-[10px] text-zinc-500 mt-1">목표 99.0% (초과 달성)</p>
                                        </div>
                                        <div className="bg-zinc-50 border border-zinc-200 p-4">
                                            <p className="text-[10px] font-bold text-zinc-500 mb-1">Package Width Cpk</p>
                                            <p className="text-2xl font-black text-zinc-900">1.38</p>
                                            <p className="text-[10px] text-zinc-500 mt-1">상한계(USL) 방향 편차 발생 중</p>
                                        </div>
                                    </div>

                                    {/* 우측: 정규분포(Bell Curve) 시각화 흉내내기 (Tailwind UI) */}
                                    <div className="col-span-2 border border-zinc-200 p-4 flex flex-col justify-end relative h-[200px]">
                                        {/* 타겟 및 USL/LSL 가이드라인 */}
                                        <div className="absolute inset-0 flex justify-between px-8 py-4 pointer-events-none">
                                            <div className="h-full w-px border-l border-dashed border-red-400 relative"><span className="absolute -top-4 -translate-x-1/2 text-[9px] text-red-500 font-bold">LSL</span></div>
                                            <div className="h-full w-px border-l-2 border-emerald-500/30 relative"><span className="absolute -top-4 -translate-x-1/2 text-[9px] text-emerald-600 font-bold">Target</span></div>
                                            <div className="h-full w-px border-l border-dashed border-red-400 relative"><span className="absolute -top-4 -translate-x-1/2 text-[9px] text-red-500 font-bold">USL</span></div>
                                        </div>
                                
                                        {/* 분포도 막대그래프 (히스토그램 모형) - 우측으로 살짝 쏠린 형상 */}
                                        <div className="flex items-end justify-center gap-1 h-32 px-12 z-10">
                                            {[10, 15, 25, 45, 75, 100, 85, 55, 30, 15, 8].map((height, i) => (
                                            <div key={i} className={`w-full rounded-t-sm ${i > 7 ? 'bg-amber-400' : 'bg-zinc-800'}`} style={{ height: `${height}%` }}></div>
                                            ))}
                                        </div>
                                        <div className="w-full text-center text-[10px] text-zinc-500 mt-2 font-medium">Package Width (mm) 측정 분포</div>
                                    </div>
                                </div>

                                {/* AI 치수 원인 추론 박스 */}
                                <div className="mt-4 border-l-4 border-amber-500 bg-amber-50 p-4">
                                    <h4 className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-1.5">
                                        <AlertTriangle className="w-3.5 h-3.5" /> AI 치수 이상 원인 추론
                                    </h4>
                                    <p className="text-[11px] text-amber-900 leading-relaxed">
                                        분석 결과, 현재 생산 중인 LOT의 절단 폭(Width) 데이터가 타겟 중앙값에서 <span className="font-bold">상한계(USL) 측으로 지속 이동(+0.02mm)</span>하고 있습니다. 
                                        동일 라인의 과거 학습 데이터와 매칭 시, 이는 <span className="font-bold underline">블레이드(Blade) 마모로 인한 절단 저항 증가 패턴과 88% 일치</span>합니다. 
                                        즉각적인 블레이드 상태 확인을 요합니다.
                                    </p>
                                </div>
                            </div>

                            {/* 2. 주요 불량 분석 (파레토 및 테이블) */}
                            <div className="mb-auto z-10">
                                <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-zinc-900"></div> 주요 불량 유형 파레토 (Defect Pareto)
                                </h3>
                            
                                {/* 가로형 막대그래프 (Tailwind로 직접 구현) */}
                                <div className="space-y-3 mb-6 bg-zinc-50 p-5 border border-zinc-200">
                                    {defectStatsData.map((defect, idx) => (
                                    <div key={defect.code} className="flex items-center gap-3">
                                        <div className="w-24 text-[10px] font-bold text-right truncate text-zinc-700">{defect.name}</div>
                                        <div className="flex-1 h-4 bg-zinc-200 rounded-sm overflow-hidden flex">
                                            {/* 데이터에 있는 ratio("45%" 등) 문자열을 그대로 가로 길이에 사용 */}
                                            <div className={`h-full flex items-center px-2 text-[9px] font-bold text-white ${idx === 0 ? 'bg-zinc-900' : 'bg-zinc-400'}`} style={{ width: defect.ratio }}>
                                                {defect.ratio}
                                            </div>
                                        </div>
                                        <div className="w-12 text-[10px] text-zinc-600 text-right">{defect.count}건</div>
                                    </div>
                                    ))}
                                </div>

                                {/* 공통/개별 불량 상세 분류 표 */}
                                <table className="w-full text-[11px] border-collapse">
                                    <thead>
                                        <tr className="border-y-2 border-zinc-900 bg-zinc-50">
                                            <th className="py-2 px-3 text-left w-16">코드</th>
                                            <th className="py-2 px-3 text-left">불량명</th>
                                            <th className="py-2 px-3 text-center w-20">구분</th>
                                            <th className="py-2 px-3 text-left">품질 영향도 및 예상 문제 현상</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200">
                                        {defectStatsData.map((defect) => (
                                            <tr key={defect.code}>
                                                <td className="py-2.5 px-3 font-bold text-zinc-900">{defect.code}</td>
                                                <td className="py-2.5 px-3 font-medium text-zinc-700">{defect.name}</td>
                                                <td className="py-2.5 px-3 text-center">
                                                    <span className={`px-1.5 py-0.5 border text-[9px] ${defect.type === '공통 불량' ? 'border-amber-400 text-amber-700 bg-amber-50' : 'border-zinc-300 text-zinc-600 bg-zinc-50'}`}>
                                                    {defect.type}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-3 text-zinc-600">{defect.impact}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* 하단 푸터 */}
                            <div className="mt-auto pt-10 flex justify-between items-center text-[10px] text-zinc-400 border-t border-zinc-100 z-10">
                                <p>© 2026 SMART LINK Vision Inspection Systems</p>
                                <p>Page 02 / 03</p>
                            </div>
                        </div>
                        {/* ========================================== */}
                        {/* 📄 리포트 3페이지 (가동 이력 및 Action Plan) */}
                        {/* ========================================== */}
                        <div className="w-[800px] min-h-[1132px] bg-white text-zinc-950 p-12 shadow-2xl flex flex-col font-sans border border-zinc-200 shrink-0 relative overflow-hidden">
                            
                            {/* 우측 상단 워터마크 */}
                            <div className="absolute right-0 top-0 opacity-5 p-8 pointer-events-none">
                                <Settings2 className="w-64 h-64 text-zinc-900" />
                            </div>

                            {/* 페이지 타이틀 */}
                            <div className="mb-8 z-10">
                                <h2 className="text-2xl font-black text-zinc-900 border-b-2 border-zinc-900 pb-2 flex items-center gap-2">
                                    <span className="text-zinc-400 font-normal">03.</span> 설비 가동 이력 및 조치 현황
                                </h2>
                            </div>

                            {/* 1. 종합 가동 시간 (Timeline & OEE) */}
                            <div className="mb-10 z-10">
                                <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-zinc-900"></div> 라인 종합 가동 현황
                                </h3>
                                
                                {/* 가동 지표 요약 */}
                                <div className="grid grid-cols-4 gap-4 mb-6">
                                    <div className="bg-zinc-50 border border-zinc-200 p-3 text-center">
                                        <p className="text-[10px] font-bold text-zinc-500 mb-1">총 가동 시간</p>
                                        <p className="text-lg font-black text-zinc-900">102.5<span className="text-xs font-normal text-zinc-500 ml-1">hr</span></p>
                                    </div>
                                    <div className="bg-red-50 border border-red-100 p-3 text-center">
                                        <p className="text-[10px] font-bold text-red-500 mb-1">총 비가동 (Down)</p>
                                        <p className="text-lg font-black text-red-600">3.2<span className="text-xs font-normal text-red-400 ml-1">hr</span></p>
                                    </div>
                                    <div className="bg-zinc-50 border border-zinc-200 p-3 text-center">
                                        <p className="text-[10px] font-bold text-zinc-500 mb-1">MTBF (평균무고장)</p>
                                        <p className="text-lg font-black text-zinc-900">42.5<span className="text-xs font-normal text-zinc-500 ml-1">hr</span></p>
                                    </div>
                                    <div className="bg-zinc-50 border border-zinc-200 p-3 text-center">
                                        <p className="text-[10px] font-bold text-zinc-500 mb-1">UPH (시간당생산)</p>
                                        <p className="text-lg font-black text-emerald-600">2,850<span className="text-xs font-normal text-emerald-500/70 ml-1">ea</span></p>
                                    </div>
                                </div>

                                {/* 타임라인 시각화 바 */}
                                <div className="border border-zinc-200 p-4">
                                    <p className="text-[10px] font-bold text-zinc-500 mb-2">주간 가동 타임라인 (08:00 ~ 17:00)</p>
                                    <div className="h-6 flex rounded-sm overflow-hidden mb-2">
                                        <div className="bg-emerald-500 h-full w-[20%]" title="Run"></div>
                                        <div className="bg-amber-400 h-full w-[5%]" title="Idle"></div>
                                        <div className="bg-emerald-500 h-full w-[35%]" title="Run"></div>
                                        <div className="bg-red-500 h-full w-[8%]" title="Stop"></div>
                                        <div className="bg-emerald-500 h-full w-[32%]" title="Run"></div>
                                    </div>
                                    <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                                        <span>08:00</span>
                                        <span>10:00</span>
                                        <span>12:00</span>
                                        <span>14:00</span>
                                        <span>17:00</span>
                                    </div>
                                </div>
                            </div>

                            {/* 2. 경보 및 조치 현황 표 */}
                            <div className="mb-10 z-10">
                                <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-zinc-900"></div> 경보 발생 및 조치 현황
                                </h3>
                                
                                <table className="w-full text-[10px] border-collapse">
                                    <thead>
                                        <tr className="border-y-2 border-zinc-900 bg-zinc-50 text-left">
                                            <th className="py-2 px-2 w-14">심각도</th>
                                            <th className="py-2 px-2 w-16">발생 시각</th>
                                            <th className="py-2 px-2 w-20">장비 ID</th>
                                            <th className="py-2 px-2">경보 내용</th>
                                            <th className="py-2 px-2 w-14 text-center">상태</th>
                                            <th className="py-2 px-2 w-40">조치 내역 (작업자)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200">
                                    {alarmHistoryData.map((alarm) => (
                                        <tr key={alarm.id} className={alarm.status === "미조치" ? "bg-red-50/50" : ""}>
                                            <td className="py-2 px-2">
                                                <span className={`font-bold ${alarm.severity === 'Critical' ? 'text-red-600' : 'text-amber-500'}`}>
                                                {alarm.severity}
                                                </span>
                                            </td>
                                            <td className="py-2 px-2 text-zinc-500">{alarm.time}</td>
                                            <td className="py-2 px-2 font-bold text-zinc-800">{alarm.eq}</td>
                                            <td className="py-2 px-2 text-zinc-700">{alarm.message}</td>
                                            <td className="py-2 px-2 text-center">
                                                {alarm.status === "미조치" ? (
                                                <span className="bg-red-600 text-white px-1.5 py-0.5 rounded-sm font-bold">미조치</span>
                                                ) : (
                                                <span className="border border-emerald-500 text-emerald-600 px-1.5 py-0.5 rounded-sm">조치완료</span>
                                                )}
                                            </td>
                                            <td className="py-2 px-2 text-zinc-600">
                                                {alarm.action} {alarm.worker !== "-" && <span className="text-[9px] text-zinc-400">({alarm.worker})</span>}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* 3. AI 내일의 권고 (Action Plan) - 보고서의 결론 */}
                            <div className="mb-auto z-10">
                                <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-zinc-900"></div> AI 추천 익일 Action Plan (우선순위)
                                </h3>
                                
                                <div className="border-2 border-zinc-900 p-6 space-y-4 relative">
                                    <div className="absolute top-0 right-0 bg-zinc-900 text-white text-[10px] font-bold px-3 py-1">
                                    AI PREDICTION
                                    </div>
                                    
                                    <div className="flex gap-4 items-start">
                                        <div className="bg-red-100 text-red-600 text-xs font-black px-2 py-1 shrink-0 mt-0.5">Priority 1</div>
                                        <div>
                                            <h4 className="text-xs font-bold text-zinc-900 mb-1">SAW-EQ.01 1번 스핀들 블레이드 즉시 교체</h4>
                                            <p className="text-[11px] text-zinc-600 leading-relaxed">
                                            미조치 경보(A-001) 건과 관련하여, 현재 마모도로 보아 익일 오전 10시경 수율 95% 이하 하락이 92% 확률로 예상됩니다. 
                                            <strong className="text-red-600">야간 조 교대 시 반드시 예비품(B-Type)으로 교체 후 영점 세팅을 요합니다.</strong>
                                            </p>
                                        </div>
                                    </div>
                                
                                    <div className="w-full h-px bg-zinc-200"></div>
                                    
                                    <div className="flex gap-4 items-start">
                                        <div className="bg-amber-100 text-amber-700 text-xs font-black px-2 py-1 shrink-0 mt-0.5">Priority 2</div>
                                        <div>
                                            <h4 className="text-xs font-bold text-zinc-900 mb-1">라인 전체 Vision Sensor 렌즈 클리닝</h4>
                                            <p className="text-[11px] text-zinc-600 leading-relaxed">
                                            금일 조명 광도 저하 알람(A-002) 발생 빈도가 전주 대비 15% 증가했습니다. 미세 분진 누적으로 인한 오탐지 방지를 위해 
                                            주말 PM(정기보수) 전, 익일 중 전체 라인 렌즈부 에어 클리닝 및 광원 점검을 권장합니다.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 하단 푸터 및 서명 */}
                            <div className="mt-10 pt-6 flex justify-between items-end border-t border-zinc-200 z-10">
                                <div className="text-[10px] text-zinc-400 space-y-1">
                                    <p>© 2026 SMART LINK Vision Inspection Systems</p>
                                    <p>본 문서는 AI 시스템에 의해 분석 및 생성된 기밀 자료입니다.</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-zinc-500 mb-4">위와 같이 일일 공정 현황을 보고합니다.</p>
                                    <p className="text-sm font-bold text-zinc-900">담당자 : 홍 길 동 (인)</p>
                                </div>
                            </div>
                        </div>
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