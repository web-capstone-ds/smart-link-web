import type { EquipmentStatus } from "@/type/equipmentType";
import type { ReactNode } from "react";
import type { QualityDistribution, ReportAlarm, ReportSummary } from "@/type/reportType";
import { EmptyBox, KpiTile, PriorityLine, ReportFooter, ReportMasthead, ReportSheet, RiskBadge, SectionTitle } from "@/components/report-document/ReportLayout";
import { formatCpk, formatEquipmentIdLines, getShiftVerdict, isCpkWarning } from "@/components/report-document/utils";

interface ReportOverviewPageProps {
    isLoading: boolean;
    reportTitle: ReactNode;
    reportSubtitle: ReactNode;
    issueDateTime: string;
    periodText: string;
    targetText: ReactNode;
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

            <section className="grid grid-cols-[1.2fr_0.8fr] gap-4 mb-4 z-10">
                <div className={`border-2 p-4 rounded-sm ${shiftVerdict.className}`}>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-black uppercase tracking-wider">Shift Handover Summary</p>
                        <span className="text-[10px] font-black px-2 py-1 rounded-sm bg-white/70 border border-current/20">
                            {shiftVerdict.label}
                        </span>
                    </div>
                    <p className="text-sm leading-relaxed font-medium">{reportData.aiMessage}</p>
                </div>

                <div className="border border-zinc-200 rounded-sm p-3 bg-zinc-50">
                    <h3 className="text-xs font-black text-zinc-900 mb-3">오늘 우선 확인</h3>
                    <div className="space-y-2.5 text-xs">
                        <PriorityLine label="미조치 경보" value={`${unresolvedAlarms.length}건`} danger={unresolvedAlarms.length > 0} />
                        <PriorityLine label="Critical Alarm" value={`${criticalAlarms.length}건`} danger={criticalAlarms.length > 0} />
                        <PriorityLine label="수율" value={`${reportData.kpi.yield}%`} danger={reportData.kpi.yield < 97} />
                        <PriorityLine label="Cpk" value={formatCpk(reportData.kpi.cpk)} danger={isCpkWarning(reportData.kpi.cpk)} />
                        <PriorityLine label="가동률" value={`${reportData.kpi.availability}%`} danger={reportData.kpi.availability < 90} />
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-6 gap-2.5 mb-5 z-10">
                <KpiTile label="총 생산" value={reportData.kpi.totalProduction.toLocaleString()} unit="EA" />
                <KpiTile label="수율" value={reportData.kpi.yield} unit="%" danger={reportData.kpi.yield < 97} />
                <KpiTile label="Cpk" value={formatCpk(reportData.kpi.cpk)} unit="" danger={isCpkWarning(reportData.kpi.cpk)} />
                <KpiTile label="가동률" value={reportData.kpi.availability} unit="%" danger={reportData.kpi.availability < 90} />
                <KpiTile label="미조치 경보" value={reportData.kpi.activeAlerts} unit="건" danger={reportData.kpi.activeAlerts > 0} />
                <KpiTile label="MTBF" value={reportData.kpi.mtbf} unit="hr" />
            </section>

            <section className="grid grid-cols-[1.08fr_0.92fr] gap-4 flex-1 z-10">
                <div className="flex flex-col gap-4">
                    <RiskEquipmentTable title={isEquipmentReport ? "대상 장비 상태" : "Risk 장비 Top 5"} equipments={riskEquipments} />
                    <DecisionBasis reportData={reportData} qualityData={qualityData} unresolvedCount={unresolvedAlarms.length} />
                </div>
                <div className="flex flex-col gap-4">
                    <ActionPlanList topActions={topActions} />
                    <DailyReviewBox reportData={reportData} criticalCount={criticalAlarms.length} />
                </div>
            </section>
            <ReportFooter pageLabel="Page 01" />
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
                        <th className="w-[7.5rem] py-2 px-2 text-left">장비</th>
                        <th className="py-2 px-2 text-center">Risk</th>
                        <th className="py-2 px-2 text-right">가동률</th>
                        <th className="py-2 px-2 text-right">수율</th>
                        <th className="py-2 px-2 text-left">주요 불량</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                    {equipments.map((eq) => (
                        <tr key={eq.id}>
                            <td className="w-[7.5rem] py-2 px-2 align-top">
                                <p className="font-bold leading-tight text-zinc-900 break-words" title={eq.id}>
                                    {formatEquipmentIdLines(eq.id).map((line) => (
                                        <span key={line} className="block">{line}</span>
                                    ))}
                                </p>
                                <p className="text-[9px] text-zinc-500">{eq.recipe}</p>
                            </td>
                            <td className="py-2 px-2 text-center">
                                <RiskBadge eq={eq} />
                            </td>
                            <td className={`py-2 px-2 text-right font-bold ${eq.uptime < 90 ? "text-red-600" : "text-zinc-800"}`}>{eq.uptime}%</td>
                            <td className={`py-2 px-2 text-right font-bold ${eq.yield < 97 ? "text-red-600" : "text-emerald-600"}`}>{eq.yield}%</td>
                            <td className="py-2 px-2 text-zinc-600">{eq.majorDefect}</td>
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
            <div className="space-y-2">
                {topActions.length > 0 ? topActions.map((plan) => (
                    <div key={`${plan.priority}-${plan.title}`} className="border border-zinc-200 rounded-sm p-2.5 bg-white">
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

function DecisionBasis({
    reportData,
    qualityData,
    unresolvedCount,
}: {
    reportData: ReportSummary;
    qualityData: QualityDistribution;
    unresolvedCount: number;
}) {
    const basisRows = [
        { label: "수율 기준", value: `${reportData.kpi.yield}%`, note: reportData.kpi.yield < 97 ? "관리 하한 확인" : "정상 범위" },
        { label: "공정 능력", value: formatCpk(qualityData.summary.cpk), note: isCpkWarning(qualityData.summary.cpk) ? "SPC 재확인" : (qualityData.summary.cpk === null ? "계산 불가" : "안정") },
        { label: "가동률", value: `${reportData.kpi.availability}%`, note: reportData.kpi.availability < 90 ? "Down 원인 추적" : "계획 대비 유지" },
        { label: "미조치", value: `${unresolvedCount}건`, note: unresolvedCount > 0 ? "교대 전 조치 필요" : "잔여 없음" },
    ];

    return (
        <div>
            <SectionTitle index="03" title="판단 근거 요약" />
            <div className="grid grid-cols-2 gap-2">
                {basisRows.map((row) => (
                    <div key={row.label} className="border border-zinc-200 bg-zinc-50 p-2.5 text-[10px]">
                        <div className="flex items-center justify-between">
                            <span className="font-black text-zinc-500">{row.label}</span>
                            <span className="font-black text-zinc-900">{row.value}</span>
                        </div>
                        <p className="mt-1 text-zinc-600">{row.note}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DailyReviewBox({ reportData, criticalCount }: { reportData: ReportSummary; criticalCount: number }) {
    const rows = [
        { label: "품질", value: reportData.kpi.yield < 97 || isCpkWarning(reportData.kpi.cpk) ? "확인 필요" : "정상" },
        { label: "설비", value: reportData.kpi.availability < 90 ? "가동 이슈" : "안정" },
        { label: "알람", value: criticalCount > 0 ? `${criticalCount}건 Critical` : "Critical 없음" },
    ];

    return (
        <div className="border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-[10px] font-black text-zinc-500 mb-2">Review Sign-off</p>
            <div className="space-y-2">
                {rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between border-b border-zinc-200 pb-1.5 text-[10px] last:border-0 last:pb-0">
                        <span className="font-bold text-zinc-500">{row.label}</span>
                        <span className="font-black text-zinc-800">{row.value}</span>
                    </div>
                ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                <div className="h-12 border border-dashed border-zinc-300 bg-white p-2 text-zinc-400">작성 확인</div>
                <div className="h-12 border border-dashed border-zinc-300 bg-white p-2 text-zinc-400">검토 확인</div>
            </div>
        </div>
    );
}
