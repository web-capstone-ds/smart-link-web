import { LayoutList, Package, AlertTriangle, Activity, Loader2, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { BaseKpiCard } from "@/components/card/BaseKpiCard"

import type { DashboardSummaryResponse } from "@/type/dashboardType"

interface KpiSummaryCardsProps {
    isSingleDay: boolean;
    data?: DashboardSummaryResponse; // 🌟 API에서 받아올 KPI 데이터
    isLoading?: boolean;
}

export function KpiSummaryCards({ isSingleDay, data, isLoading }: KpiSummaryCardsProps) {
    const compareText = isSingleDay ? "전일 대비" : "과거 평균 대비";

    return (
        <div>
            <div className="flex items-center gap-2 mb-1 px-1 pb-3">
                <LayoutList className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">
                    {isSingleDay ? '선택 일자 종합 요약' : '조회 기간 누적 요약'}
                </h2>
            </div>

            {isLoading || !data ? (
                <div className="flex h-41.5 w-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card text-muted-foreground shadow-sm">
                    <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary/50" />
                    <p className="text-sm">핵심 지표 데이터를 불러오는 중입니다...</p>
                </div>
            ) : (   
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    
                    {/* 1: 생산량 및 UPH */}
                    <BaseKpiCard 
                        title="총 생산량 및 가동률" 
                        icon={<Package className="h-4 w-4 text-muted-foreground" />}
                        value={data.kpi.totalProduction.toLocaleString()} unit="EA"
                        badgeText={`가동률 ${data.kpi.availability}%`} 
                        badgeClassName={data.kpi.availability >= 80 ? "text-emerald-500 bg-emerald-500/10" : "text-amber-500 bg-amber-500/10"}
                    >
                        <div className="flex justify-between">
                            <span>시간당 생산 (UPH)</span>
                            <span className="text-foreground">{data.kpi.uph.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>현재 가동 장비</span>
                            <span className="text-foreground">{data.kpi.activeEquipment} / {data.kpi.totalEquipment} 대</span>
                        </div>
                    </BaseKpiCard>

                    {/* 2: 종합 수율 및 합격률 */}
                    <BaseKpiCard 
                        title="종합 수율 및 품질" 
                        icon={<AlertTriangle className="h-4 w-4 text-destructive/70" />}
                        value={data.kpi.totalYield.toString()} unit="%"
                        badgeText={`${compareText} ${data.kpi.yieldTrend > 0 ? '+' : ''}${data.kpi.yieldTrend}%`} 
                        badgeClassName={data.kpi.yieldTrend >= 0 ? "text-emerald-500 bg-emerald-500/10" : "text-destructive bg-destructive/10"}
                    >
                        <div className="flex justify-between">
                            <span>치수 합격률 (W/H)</span>
                            <span className="text-foreground">{data.kpi.passRate}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>최다 발생 불량</span>
                            <Badge variant="outline" className="h-4 text-[9px] px-1 bg-amber-500/10 text-amber-600 border-amber-500/20">
                                {data.kpi.topDefect}
                            </Badge>
                        </div>
                    </BaseKpiCard>

                    {/* 3: 공정능력(Cpk) */}
                    <BaseKpiCard 
                        title="공정능력지수 (Cpk)" 
                        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                        value={data.kpi.cpk.toFixed(2)} unit="Cpk"
                        badgeText={`${compareText} ${data.kpi.cpkTrend > 0 ? '+' : ''}${data.kpi.cpkTrend}`} 
                        badgeClassName={data.kpi.cpkTrend >= 0 ? "text-emerald-500 bg-emerald-500/10" : "text-destructive bg-destructive/10"}
                    >
                        <div className="flex justify-between">
                            <span>현재 공정 상태</span>
                            <span className={data.kpi.cpk >= 1.33 ? "text-emerald-500" : "text-amber-500"}>
                                {data.kpi.cpk >= 1.33 ? "안정 (Excellent)" : "경고 (Warning)"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>산포 관리 기준</span>
                            <span className="text-muted-foreground">USL / LSL 이내</span>
                        </div>
                    </BaseKpiCard>

                    {/* 4: 설비 효율 */}
                    <BaseKpiCard 
                        title="비가동 시간 및 MTBF" 
                        icon={<Clock className="h-4 w-4 text-destructive/70" />}
                        value={data.kpi.totalDowntimeMin.toString()} unit="분"
                        badgeText={`MTBF ${data.kpi.mtbfHours}h`} 
                        badgeClassName="text-muted-foreground bg-muted/20"
                        className="border-destructive/20 bg-destructive/5" 
                    >
                        <div className="flex justify-between pt-1">
                            <span>평균 무고장 시간(MTBF)</span>
                            <span className="text-foreground">{data.kpi.mtbfHours} 시간</span>
                        </div>
                        <div className="flex justify-between">
                            <span>가동 상태 (R / I / D)</span>
                            <span className="text-foreground font-medium">
                                <span className="text-emerald-500">{data.status.run}%</span> / 
                                <span className="text-amber-500"> {data.status.idle}%</span> / 
                                <span className="text-destructive"> {data.status.down}%</span>
                            </span>
                        </div>
                    </BaseKpiCard>

                </div>
            )}
        </div>
    )
}
