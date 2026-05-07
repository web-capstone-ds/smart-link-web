import { useState } from "react"
import { 
  Calendar, Settings2, Package, AlertTriangle, Activity, Zap, 
  BarChart3, PieChart, LineChart, Clock, Download, Search, AlertCircle, Info 
} from "lucide-react"

// UI 컴포넌트들 Import (경로는 프로젝트 설정에 맞게 유지해주세요)
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

export function Dashboard() {
  // 🎛️ App.tsx에 있던 카드 지표 변경 상태(State)들도 전부 이쪽으로 가져옵니다!
  const [cardOneMetric, setCardOneMetric] = useState("목표달성률");
  const [cardTwoMetric, setCardTwoMetric] = useState("종합수율");
  const [cardThreeMetric, setCardThreeMetric] = useState("치수 합격률");
  const [cardFourMetric, setCardFourMetric] = useState("AI 상태");

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* 타이틀 영역 */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">종합 대시보드</h1>
          <p className="text-muted-foreground mt-1 text-sm">종합 생산 지표 및 장비 가동 상태</p>
        </div>
        
        {/* 우측: 조회 기간 선택 캘린더 버튼 */}
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2.5 justify-start bg-card border-border text-foreground hover:bg-muted/50 hover:text-foreground font-normal min-w-[240px]">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>2026. 05. 01 - 2026. 05. 06</span>
          </Button>
          <Button variant="default" className="px-5">조회</Button>
        </div>
      </div>

      {/* 핵심 요약 지표 (KPI) 카드 영역 */}
      <div className="grid grid-cols-4 gap-4">
        {/* ================================== */}
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

        {/* ================================== */}
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

        {/* ================================== */}
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

        {/* ================================== */}
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
        <div className="flex items-center justify-between px-5 pb-3 pt-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">장비 현황</h2>
          <Button variant="outline" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <Download className="w-4 h-4" /> 데이터 다운로드
          </Button>
        </div>

        <div className="flex items-center gap-5 px-5 py-2.5 bg-muted/20 border-b border-border">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="장비 ID 또는 레시피 검색..." className="pl-8 bg-background border-border text-xs h-8" />
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

        <div className="overflow-auto px-4 pb-4">
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
    </div>
  )
}