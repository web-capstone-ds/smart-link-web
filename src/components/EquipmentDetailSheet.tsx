import { useState, useEffect } from "react"
import { Download, Info, Settings2, Loader2, Activity } from "lucide-react"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EquipmentDetailSheetProps {
    selectedEquipment: string | null;
    setSelectedEquipment: (id: string | null) => void;
}

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

            {/* 4. 기타 파라미터 및 조치 내역 영역 */}
            <div className="text-center p-8 border border-dashed border-border rounded-lg text-muted-foreground text-sm">
                스크롤을 내리면 추가적인 SPC 관리도, 세부 파라미터(Coplanarity, Burr height) 측정 표, <br/>그리고 작업자의 메모가 포함된 조치 이력(Timeline)이 이어집니다.
            </div>
            </div>)}
        </SheetContent>
        </Sheet>
    )
}