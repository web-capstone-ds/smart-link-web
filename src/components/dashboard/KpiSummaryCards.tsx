import { LayoutList, Package, AlertTriangle, Activity, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { BaseKpiCard } from "@/components/dashboard/BaseKpiCard"

import type { DashboardSummaryResponse } from "@/api/dashboard" // 타입 임포트

interface KpiSummaryCardsProps {
    isSingleDay: boolean;
    data?: DashboardSummaryResponse['kpi']; // 🌟 API에서 받아올 KPI 데이터
    isLoading?: boolean;
}

export function KpiSummaryCards({ isSingleDay, data, isLoading }: KpiSummaryCardsProps) {
    const compareText = isSingleDay ? "전일 대비" : "과거 평균 대비";

    if (isLoading || !data) {
        return <div className="h-[140px] flex items-center justify-center bg-muted/20 rounded-xl border border-border/50 text-muted-foreground text-sm">데이터를 불러오는 중입니다...</div>;
    }

    return (
        <div>
            {/* 🌟 생략했던 타이틀 영역 원상복구! */}
            <div className="flex items-center gap-2 mb-1 px-1 pb-3">
                <LayoutList className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">
                    {isSingleDay ? '선택 일자 종합 요약' : '조회 기간 누적 요약'}
                </h2>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
                
                {/* 1: 생산량 및 UPH */}
                <BaseKpiCard 
                    title="총 생산량 및 UPH" 
                    icon={<Package className="h-4 w-4 text-muted-foreground" />}
                    value={data.totalProduction.toLocaleString()} unit="EA"
                    badgeText={`달성률 ${data.productionRate}%`} 
                    badgeClassName={data.productionRate >= 100 ? "text-emerald-500 bg-emerald-500/10" : "text-amber-500 bg-amber-500/10"}
                >
                    <div className="flex justify-between"><span>시간당 생산 (UPH)</span><span className="text-foreground">2,850 EA/h</span></div>
                    <div className="flex justify-between"><span>{compareText} 증감</span><span className="text-emerald-500">+2.1%</span></div>
                </BaseKpiCard>

                {/* 2: 품질 및 치수 합격률 */}
                <BaseKpiCard 
                    title="종합 수율 및 품질" 
                    icon={<AlertTriangle className="h-4 w-4 text-destructive/70" />}
                    value="96.4" unit="%"
                    badgeText={`${compareText} -0.8%`} badgeClassName="text-destructive bg-destructive/10"
                >
                    <div className="flex justify-between"><span>검사 / F / M</span><span className="text-foreground">25.4k / <span className="text-destructive">342</span> / <span className="text-amber-500">128</span></span></div>
                    <div className="flex justify-between"><span>치수 합격률 (W/H)</span><span className="text-foreground">98.7%</span></div>
                </BaseKpiCard>

                {/* 3: 공정능력(Cpk) */}
                <BaseKpiCard 
                    title="공정능력 및 주요 불량" 
                    icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                    value="1.52" unit="Cpk"
                    badgeText={`${compareText} +0.04`} badgeClassName="text-emerald-500 bg-emerald-500/10"
                >
                    <div className="flex justify-between"><span>목표 대비 편차</span><span className="text-foreground">+0.02 μm</span></div>
                    <div className="flex justify-between items-center">
                        <span>최다 발생 불량</span>
                        <Badge variant="outline" className="h-4 text-[9px] px-1 bg-amber-500/10 text-amber-600 border-amber-500/20">C-01 (치핑)</Badge>
                    </div>
                </BaseKpiCard>

                {/* 4: 설비 효율(OEE) */}
                <BaseKpiCard 
                    title="설비 효율(OEE) 및 AI" 
                    icon={<Zap className="h-3.5 w-3.5 text-primary" />}
                    value="87.3" unit="%"
                    badgeText="(라인 가동률 84%)" badgeClassName="text-muted-foreground bg-transparent px-0"
                    className="border-primary/20 bg-primary/5"
                >
                    <div className="flex items-start gap-1.5 pt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 animate-pulse shrink-0"></div>
                        <p className="text-[10.5px] leading-relaxed text-foreground/80 font-medium whitespace-pre-line">
                            가동률은 안정적이나, <span className="text-amber-500 font-bold">블레이드 마모</span>로 인한 <span className="text-primary font-bold">LINE-A</span>의 치수 편차 징후가 감지됩니다.
                        </p>
                    </div>
                </BaseKpiCard>

            </div>
        </div>
    )
}