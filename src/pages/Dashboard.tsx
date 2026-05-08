import { useState } from "react"
import { 
  Calendar, Settings2, Package, AlertTriangle, Activity, Zap, 
  BarChart3, PieChart, LineChart, Clock, Download, Search, AlertCircle, Info 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"   
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const equipmentData = [
    { id: "SAW-EQ.01", lotsProcessed: 12, runTime: "18.5", downTime: "1.2", yield: "95.2%", issue: "치핑 불량 다수 발생 (C-01)" },
    { id: "SAW-EQ.02", lotsProcessed: 14, runTime: "20.1", downTime: "0.5", yield: "98.1%", issue: "-" },
    { id: "SAW-EQ.03", lotsProcessed: 11, runTime: "15.2", downTime: "4.5", yield: "92.4%", issue: "오후 2시 자재 공급 지연 정지" },
    { id: "SAW-EQ.04", lotsProcessed: 15, runTime: "21.0", downTime: "0.2", yield: "99.5%", issue: "-" },
    { id: "SAW-EQ.01", lotsProcessed: 12, runTime: "18.5", downTime: "1.2", yield: "95.2%", issue: "치핑 불량 다수 발생 (C-01)" },
    { id: "SAW-EQ.02", lotsProcessed: 14, runTime: "20.1", downTime: "0.5", yield: "98.1%", issue: "-" },
    { id: "SAW-EQ.03", lotsProcessed: 11, runTime: "15.2", downTime: "4.5", yield: "92.4%", issue: "오후 2시 자재 공급 지연 정지" },
    { id: "SAW-EQ.04", lotsProcessed: 15, runTime: "21.0", downTime: "0.2", yield: "99.5%", issue: "-" },
    { id: "SAW-EQ.01", lotsProcessed: 12, runTime: "18.5", downTime: "1.2", yield: "95.2%", issue: "치핑 불량 다수 발생 (C-01)" },
    { id: "SAW-EQ.02", lotsProcessed: 14, runTime: "20.1", downTime: "0.5", yield: "98.1%", issue: "-" },
    { id: "SAW-EQ.03", lotsProcessed: 11, runTime: "15.2", downTime: "4.5", yield: "92.4%", issue: "오후 2시 자재 공급 지연 정지" },
    { id: "SAW-EQ.04", lotsProcessed: 15, runTime: "21.0", downTime: "0.2", yield: "99.5%", issue: "-" },
]

export function Dashboard() {
  // 🎛️ App.tsx에 있던 카드 지표 변경 상태(State)들도 전부 이쪽으로 가져옵니다!
  const [cardOneMetric, setCardOneMetric] = useState("목표달성률");
  const [cardTwoMetric, setCardTwoMetric] = useState("종합수율");
  const [cardThreeMetric, setCardThreeMetric] = useState("치수 합격률");
  const [cardFourMetric, setCardFourMetric] = useState("AI 상태");

  const [selectedLine, setSelectedLine] = useState("all");

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* 타이틀 영역 */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">종합 대시보드</h1>
          <p className="text-muted-foreground mt-1 text-sm">종합 생산 지표 및 장비 가동 상태</p>
        </div>
        
        {/* 🌟 글로벌 필터 영역 (우측 상단) 🌟 */}
        <div className="flex items-center gap-2">
            
            {/* ✅ 1. 라인 선택 드롭다운 (새로 추가) */}
            <Select value={selectedLine} onValueChange={setSelectedLine}>
                <SelectTrigger className="w-45 bg-card border-border text-foreground font-medium h-10">
                    <SelectValue placeholder="라인 선택" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">전체 라인 종합</SelectItem>
                    <SelectItem value="line-a">SAW-LINE A (12대)</SelectItem>
                    <SelectItem value="line-b">SAW-LINE B (8대)</SelectItem>
                    <SelectItem value="line-c">SAW-LINE C (10대)</SelectItem>
                </SelectContent>
            </Select>

            {/* ✅ 2. 조회 기간 선택 캘린더 버튼 (기존 유지) */}
            <Button variant="outline" className="gap-2.5 justify-start bg-card border-border text-foreground hover:bg-muted/50 hover:text-foreground font-normal min-w-60 h-10">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>2026. 05. 01 - 2026. 05. 06</span>
            </Button>
            
            {/* ✅ 3. 조회 버튼 (기존 유지) */}
            <Button variant="default" className="px-5 h-10">조회</Button>
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
          <DialogContent className="sm:max-w-125">
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
                <SelectTrigger className="w-35 h-8 text-xs"><SelectValue placeholder="지표 선택" /></SelectTrigger>
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
          <DialogContent className="sm:max-w-125">
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
                <SelectTrigger className="w-35 h-8 text-xs"><SelectValue placeholder="지표 선택" /></SelectTrigger>
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
          <DialogContent className="sm:max-w-125">
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
                <SelectTrigger className="w-35 h-8 text-xs"><SelectValue placeholder="지표 선택" /></SelectTrigger>
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
          <DialogContent className="sm:max-w-125">
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
                <SelectTrigger className="w-35 h-8 text-xs"><SelectValue placeholder="지표 선택" /></SelectTrigger>
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
      <Card className="flex flex-col overflow-hidden gap-0 shadow-sm">
            <div className="flex items-center justify-between px-5 pb-3 pt-3 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-foreground">장비별 일일 가동 종합</h2>
                    {/* 실시간 뱃지 대신 '일일 마감 데이터'임을 명시 */}
                    <Badge variant="secondary" className="bg-muted text-muted-foreground border-border font-normal">
                        Daily Aggregated Data
                    </Badge>
                </div>
                <Button variant="outline" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                    <Download className="w-4 h-4" /> CSV 내보내기
                </Button>
            </div>

            <div className="overflow-auto px-4 pb-4 bg-background">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="w-[150px] font-semibold text-muted-foreground">장비 ID</TableHead>
                            <TableHead className="font-semibold text-muted-foreground text-right">처리 LOT 수</TableHead>
                            <TableHead className="font-semibold text-muted-foreground text-right">총 가동 시간</TableHead>
                            <TableHead className="font-semibold text-muted-foreground text-right">총 비가동 시간</TableHead>
                            <TableHead className="font-semibold text-muted-foreground text-right">최종 수율</TableHead>
                            <TableHead className="font-semibold text-muted-foreground pl-8">주요 특이사항</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {equipmentData.map((row) => (
                            <TableRow key={row.id} className="border-border/50 border-b last:border-0 hover:bg-muted/30 transition-colors">
                                <TableCell className="font-bold text-foreground">{row.id}</TableCell>
                                <TableCell className="text-right font-medium">{row.lotsProcessed} <span className="text-xs text-muted-foreground font-normal">LOT</span></TableCell>
                                <TableCell className="text-right">
                                    <span className="text-emerald-600 font-medium">{row.runTime}</span> <span className="text-xs text-muted-foreground">hr</span>
                                </TableCell>
                                <TableCell className="text-right">
                                    {/* 비가동 시간이 길면(1시간 이상) 붉은색 강조 */}
                                    <span className={`font-medium ${parseFloat(row.downTime) >= 1.0 ? 'text-destructive' : 'text-amber-500'}`}>
                                        {row.downTime}
                                    </span> <span className="text-xs text-muted-foreground">hr</span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className={`font-bold ${parseFloat(row.yield) < 95 ? 'text-destructive' : 'text-foreground'}`}>
                                        {row.yield}
                                    </span>
                                </TableCell>
                                <TableCell className="pl-8">
                                    {row.issue !== "-" ? (
                                        <Badge variant="outline" className="border-amber-500/30 text-amber-600 bg-amber-500/5 font-normal">
                                            {row.issue}
                                        </Badge>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">-</span>
                                    )}
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