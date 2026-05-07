import { PieChart, AlertTriangle, AlertCircle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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

interface EquipmentStatsProps {
  setSelectedEquipment: (id: string) => void;
}

export function EquipmentStats({ setSelectedEquipment }: EquipmentStatsProps) {
  return (
    <div className="animate-in fade-in duration-500 space-y-6">
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
                <TableRow 
                  key={eq.id} 
                  // 🌟 부모로부터 받아온 함수를 실행시켜 Sheet가 열리도록 합니다!
                  onClick={() => setSelectedEquipment(eq.id)} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
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
  )
}