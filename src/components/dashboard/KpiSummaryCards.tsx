import { LayoutList, Package, AlertTriangle, Activity, Zap, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { BaseKpiCard } from "@/components/dashboard/BaseKpiCard"

import type { DashboardSummaryResponse } from "@/api/dashboard" // 타입 임포트

interface KpiSummaryCardsProps {
    isSingleDay: boolean;
    data?: DashboardSummaryResponse; // 🌟 API에서 받아올 KPI 데이터
    isLoading?: boolean;
}

export function KpiSummaryCards({ isSingleDay, data, isLoading }: KpiSummaryCardsProps) {
    const compareText = isSingleDay ? "전일 대비" : "과거 평균 대비";

    return (
        <div>
            {/* 🌟 생략했던 타이틀 영역 원상복구! */}
            <div className="flex items-center gap-2 mb-1 px-1 pb-3">
                <LayoutList className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">
                    {isSingleDay ? '선택 일자 종합 요약' : '조회 기간 누적 요약'}
                </h2>
            </div>

            {isLoading || !data ? (
                // 🌟 다른 차트들과 동일한 디자인 적용!
                <div className="h-41.5 w-full flex flex-col items-center justify-center bg-muted/10 animate-pulse rounded-xl border border-dashed border-border text-muted-foreground">
                    <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary/50" />
                    <p className="text-sm">핵심 지표 데이터를 불러오는 중입니다...</p>
                </div>
            ) : (   
            <div className="grid grid-cols-4 gap-4">
                
                {/* 1: 생산량 및 UPH */}
                <BaseKpiCard 
                    title="총 생산량 및 UPH" 
                    icon={<Package className="h-4 w-4 text-muted-foreground" />}
                    value={data.kpi.totalProduction.toLocaleString()} unit="EA"
                    badgeText={`달성률 ${data.kpi.productionRate}%`} 
                    badgeClassName={data.kpi.productionRate >= 100 ? "text-emerald-500 bg-emerald-500/10" : "text-amber-500 bg-amber-500/10"}
                >
                    <div className="flex justify-between">
                        <span>시간당 생산 (UPH)</span><span className="text-foreground">{data.kpi.uph.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>{compareText} 증감</span>
                        <span className={data.kpi.productionTrend >= 0 ? "text-emerald-500" : "text-destructive"}>
                            {data.kpi.productionTrend > 0 ? '+' : ''}{data.kpi.productionTrend}%
                        </span>
                    </div>
                </BaseKpiCard>

                {/* 2: 품질 및 치수 합격률 */}
                <BaseKpiCard 
                    title="종합 수율 및 품질" 
                    icon={<AlertTriangle className="h-4 w-4 text-destructive/70" />}
                    value={data.kpi.totalYield.toString()} unit="%"
                    badgeText={`${compareText} ${data.kpi.yieldTrend > 0 ? '+' : ''}${data.kpi.yieldTrend}%`} 
                    badgeClassName={data.kpi.yieldTrend >= 0 ? "text-emerald-500 bg-emerald-500/10" : "text-destructive bg-destructive/10"}
                >
                    <div className="flex justify-between"><span>검사 / F / M</span>
                    <span className="text-foreground">
                        {(data.kpi.totalProduction / 1000).toFixed(1)}k / 
                        <span className="text-destructive"> {data.kpi.fail}</span> / 
                        <span className="text-amber-500"> {data.kpi.marginal}</span>
                    </span>
                    </div>
                    <div className="flex justify-between"><span>치수 합격률 (W/H)</span><span className="text-foreground">{data.kpi.passRate}%</span></div>
                </BaseKpiCard>

                {/* 3: 공정능력(Cpk) */}
                <BaseKpiCard 
                    title="공정능력 및 주요 불량" 
                    icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                    value={data.kpi.cpk.toString()} unit="Cpk"
                    badgeText={`${compareText} ${data.kpi.cpkTrend > 0 ? '+' : ''}${data.kpi.cpkTrend}`} 
                    badgeClassName={data.kpi.cpkTrend >= 0 ? "text-emerald-500 bg-emerald-500/10" : "text-destructive bg-destructive/10"}
                >
                    <div className="flex justify-between"><span>목표 대비 편차</span>
                    <span className="text-foreground">{data.kpi.cpkRate > 0 ? '+' : ''}{data.kpi.cpkRate} μm</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>최다 발생 불량</span>
                        <Badge variant="outline" className="h-4 text-[9px] px-1 bg-amber-500/10 text-amber-600 border-amber-500/20">{data.kpi.topDefect}</Badge>
                    </div>
                </BaseKpiCard>

                {/* 4: 설비 효율(OEE) */}
                <BaseKpiCard 
                    title="설비 효율(OEE) 및 AI" 
                    icon={<Zap className="h-3.5 w-3.5 text-primary" />}
                    value={data.kpi.oee.toString()} unit="%"
                    badgeText={`(가동률 ${data.status.run}%)`} badgeClassName="text-muted-foreground bg-transparent px-0"
                    className="border-primary/20 bg-primary/5"
                >
                    <div className="flex items-start gap-1.5 pt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 animate-pulse shrink-0"></div>
                        <p className="text-[10.5px] leading-relaxed text-foreground/80 font-medium whitespace-pre-line">
                           {data.aiMessage || "현재 설비 가동 상태 및 효율은 안정적인 범위를 유지하고 있습니다."}</p>
                    </div>
                </BaseKpiCard>

            </div>
            )}
        </div>
    )
}