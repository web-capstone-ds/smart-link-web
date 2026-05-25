import type { EquipmentStatus } from "@/type/equipmentType";
import type { QualityDistribution, ReportAlarm, ReportSummary } from "@/type/reportType";
import { EmptyBox, KpiTile, PriorityLine, ReportMasthead, ReportSheet, RiskBadge, SectionTitle } from "@/components/report-document/ReportLayout";
import { getShiftVerdict } from "@/components/report-document/utils";

interface ReportOverviewPageProps {
    isLoading: boolean;
    reportTitle: string;
    reportSubtitle: string;
    issueDateTime: string;
    periodText: string;
    targetText: string;
    isEquipmentReport: boolean;
    reportData: ReportSummary;
    qualityData: QualityDistribution;
    riskEquipments: EquipmentStatus[];
    topActions: ReportSummary["actionPlans"];
    criticalAlarms: ReportAlarm[];
    unresolvedAlarms: ReportAlarm[];
}

export function ReportOverviewPage({
    isLoading,
    reportTitle,
    reportSubtitle,
    issueDateTime,
    periodText,
    targetText,
    isEquipmentReport,
    reportData,
    qualityData,
    riskEquipments,
    topActions,
    criticalAlarms,
    unresolvedAlarms,
}: ReportOverviewPageProps) {
    const shiftVerdict = getShiftVerdict(reportData, qualityData, unresolvedAlarms.length);

    return (
        <ReportSheet isLoading={isLoading}>
            <ReportMasthead
                title={reportTitle}
                subtitle={reportSubtitle}
                issueDateTime={issueDateTime}
                periodText={periodText}
                targetText={targetText}
                pageLabel="Page 01"
            />

            <section className="grid grid-cols-[1.25fr_0.75fr] gap-5 mb-6 z-10">
                <div className={`border-2 p-5 rounded-sm ${shiftVerdict.className}`}>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-black uppercase tracking-wider">Shift Handover Summary</p>
                        <span className="text-[10px] font-black px-2 py-1 rounded-sm bg-white/70 border border-current/20">
                            {shiftVerdict.label}
                        </span>
                    </div>
                    <p className="text-sm leading-relaxed font-medium">{reportData.aiMessage}</p>
                </div>

                <div className="border border-zinc-200 rounded-sm p-4 bg-zinc-50">
                    <h3 className="text-xs font-black text-zinc-900 mb-3">오늘 우선 확인</h3>
                    <div className="space-y-3 text-xs">
                        <PriorityLine label="미조치 경보" value={`${unresolvedAlarms.length}건`} danger={unresolvedAlarms.length > 0} />
                        <PriorityLine label="Critical Alarm" value={`${criticalAlarms.length}건`} danger={criticalAlarms.length > 0} />
                        <PriorityLine label="수율" value={`${reportData.kpi.yield}%`} danger={reportData.kpi.yield < 97} />
                        <PriorityLine label="Cpk" value={String(reportData.kpi.cpk)} danger={reportData.kpi.cpk < 1.33} />
                        <PriorityLine label="가동률" value={`${reportData.kpi.availability}%`} danger={reportData.kpi.availability < 90} />
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-6 gap-3 mb-6 z-10">
                <KpiTile label="총 생산" value={reportData.kpi.totalProduction.toLocaleString()} unit="EA" />
                <KpiTile label="수율" value={reportData.kpi.yield} unit="%" danger={reportData.kpi.yield < 97} />
                <KpiTile label="Cpk" value={reportData.kpi.cpk} unit="" danger={reportData.kpi.cpk < 1.33} />
                <KpiTile label="가동률" value={reportData.kpi.availability} unit="%" danger={reportData.kpi.availability < 90} />
                <KpiTile label="미조치 경보" value={reportData.kpi.activeAlerts} unit="건" danger={reportData.kpi.activeAlerts > 0} />
                <KpiTile label="MTBF" value={reportData.kpi.mtbf} unit="hr" />
            </section>

            <section className="grid grid-cols-[1fr_0.9fr] gap-5 flex-1 z-10">
                <RiskEquipmentTable title={isEquipmentReport ? "대상 장비 상태" : "Risk 장비 Top 5"} equipments={riskEquipments} />
                <ActionPlanList topActions={topActions} />
            </section>
        </ReportSheet>
    );
}

function RiskEquipmentTable({ title, equipments }: { title: string; equipments: EquipmentStatus[] }) {
    return (
        <div>
            <SectionTitle index="01" title={title} />
            <table className="w-full text-[10px] border-collapse bg-white">
                <thead>
                    <tr className="border-y-2 border-zinc-900 bg-zinc-50 text-zinc-600">
                        <th className="py-2 px-2 text-left">장비</th>
                        <th className="py-2 px-2 text-center">Risk</th>
                        <th className="py-2 px-2 text-right">가동률</th>
                        <th className="py-2 px-2 text-right">수율</th>
                        <th className="py-2 px-2 text-left">주요 불량</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                    {equipments.map((eq) => (
                        <tr key={eq.id}>
                            <td className="py-2.5 px-2">
                                <p className="font-bold text-zinc-900">{eq.id}</p>
                                <p className="text-[9px] text-zinc-500">{eq.recipe}</p>
                            </td>
                            <td className="py-2.5 px-2 text-center">
                                <RiskBadge eq={eq} />
                            </td>
                            <td className={`py-2.5 px-2 text-right font-bold ${eq.uptime < 90 ? "text-red-600" : "text-zinc-800"}`}>{eq.uptime}%</td>
                            <td className={`py-2.5 px-2 text-right font-bold ${eq.yield < 97 ? "text-red-600" : "text-emerald-600"}`}>{eq.yield}%</td>
                            <td className="py-2.5 px-2 text-zinc-600">{eq.majorDefect}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ActionPlanList({ topActions }: { topActions: ReportSummary["actionPlans"] }) {
    return (
        <div>
            <SectionTitle index="02" title="인수인계 Action" />
            <div className="space-y-3">
                {topActions.length > 0 ? topActions.map((plan) => (
                    <div key={`${plan.priority}-${plan.title}`} className="border border-zinc-200 rounded-sm p-3 bg-white">
                        <div className="flex items-start gap-3">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-sm ${plan.isCritical ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                P{plan.priority}
                            </span>
                            <div>
                                <p className="text-xs font-bold text-zinc-900">{plan.title}</p>
                                <p className="text-[10px] text-zinc-600 leading-relaxed mt-1">{plan.description}</p>
                            </div>
                        </div>
                    </div>
                )) : (
                    <EmptyBox text="등록된 Action Plan이 없습니다." />
                )}
            </div>
        </div>
    );
}
