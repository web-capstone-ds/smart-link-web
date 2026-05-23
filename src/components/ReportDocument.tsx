import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import type { EquipmentStatus } from "@/type/equipmentType";
import type { ReportAlarm, ReportHeatmap, ReportSummary, QualityDistribution } from "@/type/reportType";

export interface ReportDocumentProps {
    reportMode: "daily" | "weekly" | "equipment";
    targetEq: string;
    safeReportData: ReportSummary;
    safeQualityData: QualityDistribution;
    safeHeatmapData: ReportHeatmap;
    safeDefectData: any[];
    safeAlarmData: ReportAlarm[];
    safeEquipmentData: EquipmentStatus[];
    appliedDate: DateRange | undefined;
    isLoading: boolean;
}

export function ReportDocument({
    reportMode,
    targetEq,
    safeReportData,
    safeQualityData,
    safeHeatmapData,
    safeDefectData,
    safeAlarmData,
    safeEquipmentData,
    appliedDate,
    isLoading
}: ReportDocumentProps) {
    const isEquipmentReport = reportMode === "equipment";
    const reportTitle = isEquipmentReport ? "EQUIPMENT DAILY REVIEW" : reportMode === "weekly" ? "PERIOD OPERATIONS REVIEW" : "DAILY OPERATIONS REVIEW";
    const reportSubtitle = isEquipmentReport ? `${targetEq} 장비 일일 리뷰` : "일일 생산, 품질, 가동 및 조치 인수인계";
    const periodText = formatPeriod(appliedDate);
    const issueDateTime = format(new Date(), "yyyy.MM.dd HH:mm");
    const targetText = isEquipmentReport ? targetEq : "전체 설비";

    const equipmentRows = isEquipmentReport
        ? safeEquipmentData.filter((eq) => eq.id === targetEq || safeEquipmentData.length === 1)
        : safeEquipmentData;
    const riskEquipments = [...equipmentRows]
        .sort((a, b) => riskScore(b) - riskScore(a))
        .slice(0, 5);
    const criticalAlarms = safeAlarmData.filter((alarm) => alarm.severity === "critical");
    const unresolvedAlarms = safeAlarmData.filter((alarm) => isUnresolved(alarm.status));
    const topDefects = safeDefectData.slice(0, 5);
    const topActions = [...safeReportData.actionPlans]
        .sort((a, b) => a.priority - b.priority)
        .slice(0, 4);
    const shiftVerdict = getShiftVerdict(safeReportData, safeQualityData, unresolvedAlarms.length);

    return (
        <>
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
                        <p className="text-sm leading-relaxed font-medium">{safeReportData.aiMessage}</p>
                    </div>

                    <div className="border border-zinc-200 rounded-sm p-4 bg-zinc-50">
                        <h3 className="text-xs font-black text-zinc-900 mb-3">오늘 우선 확인</h3>
                        <div className="space-y-3 text-xs">
                            <PriorityLine label="미조치 경보" value={`${unresolvedAlarms.length}건`} danger={unresolvedAlarms.length > 0} />
                            <PriorityLine label="Critical Alarm" value={`${criticalAlarms.length}건`} danger={criticalAlarms.length > 0} />
                            <PriorityLine label="수율" value={`${safeReportData.kpi.yield}%`} danger={safeReportData.kpi.yield < 97} />
                            <PriorityLine label="Cpk" value={String(safeReportData.kpi.cpk)} danger={safeReportData.kpi.cpk < 1.33} />
                            <PriorityLine label="가동률" value={`${safeReportData.kpi.availability}%`} danger={safeReportData.kpi.availability < 90} />
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-6 gap-3 mb-6 z-10">
                    <KpiTile label="총 생산" value={safeReportData.kpi.totalProduction.toLocaleString()} unit="EA" />
                    <KpiTile label="수율" value={safeReportData.kpi.yield} unit="%" danger={safeReportData.kpi.yield < 97} />
                    <KpiTile label="Cpk" value={safeReportData.kpi.cpk} unit="" danger={safeReportData.kpi.cpk < 1.33} />
                    <KpiTile label="가동률" value={safeReportData.kpi.availability} unit="%" danger={safeReportData.kpi.availability < 90} />
                    <KpiTile label="미조치 경보" value={safeReportData.kpi.activeAlerts} unit="건" danger={safeReportData.kpi.activeAlerts > 0} />
                    <KpiTile label="MTBF" value={safeReportData.kpi.mtbf} unit="hr" />
                </section>

                <section className="grid grid-cols-[1fr_0.9fr] gap-5 flex-1 z-10">
                    <div>
                        <SectionTitle index="01" title={isEquipmentReport ? "대상 장비 상태" : "Risk 설비 Top 5"} />
                        <table className="w-full text-[10px] border-collapse bg-white">
                            <thead>
                                <tr className="border-y-2 border-zinc-900 bg-zinc-50 text-zinc-600">
                                    <th className="py-2 px-2 text-left">설비</th>
                                    <th className="py-2 px-2 text-center">Risk</th>
                                    <th className="py-2 px-2 text-right">가동률</th>
                                    <th className="py-2 px-2 text-right">수율</th>
                                    <th className="py-2 px-2 text-left">주요 불량</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {riskEquipments.map((eq) => (
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
                </section>
            </ReportSheet>

            <ReportSheet isLoading={isLoading} className="mt-8">
                <ReportSectionHeader index="02" title={isEquipmentReport ? `${targetEq} 품질 손실 분석` : "품질 및 수율 손실 분석"} />

                <section className="grid grid-cols-[0.9fr_1.1fr] gap-5 mb-6 z-10">
                    <div className="border border-zinc-200 rounded-sm p-4 bg-zinc-50">
                        <SectionTitle index="01" title="공정 능력 상태" />
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <QualityTile label="Pass Rate" value={`${safeQualityData.summary.passRate}%`} />
                            <QualityTile label="Cpk" value={safeQualityData.summary.cpk} danger={safeQualityData.summary.cpk < 1.33} />
                        </div>
                        <p className="text-[10px] leading-relaxed text-zinc-600 mb-3">{safeQualityData.summary.cpkSub}</p>
                        <Histogram quality={safeQualityData} />
                    </div>

                    <div className="border border-zinc-200 rounded-sm p-4 bg-white">
                        <SectionTitle index="02" title="주요 불량 Pareto" />
                        <div className="space-y-3">
                            {topDefects.map((defect, index) => (
                                <div key={defect.code || defect.name} className="grid grid-cols-[5rem_1fr_3rem] items-center gap-3">
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-900">{defect.code}</p>
                                        <p className="text-[9px] text-zinc-500 truncate">{defect.name}</p>
                                    </div>
                                    <div className="h-4 bg-zinc-100 rounded-sm overflow-hidden">
                                        <div
                                            className={`h-full ${index === 0 ? "bg-zinc-900" : "bg-zinc-400"}`}
                                            style={{ width: normalizeRatio(defect.ratio) }}
                                        />
                                    </div>
                                    <p className="text-[10px] font-bold text-right text-zinc-700">{defect.count}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 border-t border-zinc-200 pt-4">
                            <p className="text-[10px] font-black text-zinc-500 mb-2">품질 영향 메모</p>
                            <p className="text-[11px] leading-relaxed text-zinc-700">{topDefects[0]?.impact || "주요 불량 영향 정보가 없습니다."}</p>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-[1fr_1fr] gap-5 flex-1 z-10">
                    {isEquipmentReport ? (
                        <div className="border border-zinc-200 rounded-sm p-4 bg-white">
                            <SectionTitle index="03" title="8 Slot 결함 집중도" />
                            <div className="grid grid-cols-4 gap-2 h-44">
                                {Array.from({ length: 8 }).map((_, index) => {
                                    const slot = safeHeatmapData.slots.find((item) => item.zAxisNum === index);
                                    return <SlotCell key={index} index={index} slot={slot} />;
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="border border-zinc-200 rounded-sm p-4 bg-white">
                            <SectionTitle index="03" title="하위 설비 Recipe 영향" />
                            <div className="space-y-3">
                                {riskEquipments.slice(0, 4).map((eq) => (
                                    <div key={eq.id} className="flex items-center justify-between border-b border-zinc-100 pb-2 last:border-0">
                                        <div>
                                            <p className="text-xs font-bold">{eq.id}</p>
                                            <p className="text-[9px] text-zinc-500">{eq.recipe}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-red-600">{eq.yield}%</p>
                                            <p className="text-[9px] text-zinc-500">{eq.majorDefect}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-sm">
                        <SectionTitle index="04" title="원인 추정 및 확인 포인트" />
                        <p className="text-xs font-bold text-amber-900 mb-2">
                            {isEquipmentReport ? safeHeatmapData.aiAnalysis.title : safeQualityData.aiInference.title}
                        </p>
                        <p className="text-[11px] leading-relaxed text-amber-950">
                            {isEquipmentReport ? safeHeatmapData.aiAnalysis.description : safeQualityData.aiInference.description}
                        </p>
                    </div>
                </section>

                <ReportFooter pageLabel="Page 02" />
            </ReportSheet>

            <ReportSheet isLoading={isLoading} className="mt-8">
                <ReportSectionHeader index="03" title="가동 이력, 알람 및 조치 현황" />

                <section className="mb-6 z-10">
                    <SectionTitle index="01" title={isEquipmentReport ? "대상 장비 가동 요약" : "라인 가동 요약"} />
                    <div className="grid grid-cols-4 gap-3 mb-4">
                        <KpiTile label="Run" value={safeReportData.operationTimeline.runHour} unit="hr" />
                        <KpiTile label="Down" value={safeReportData.operationTimeline.downHour} unit="hr" danger={safeReportData.operationTimeline.downHour > 0} />
                        <KpiTile label="MTBF" value={safeReportData.operationTimeline.mtbf} unit="hr" />
                        <KpiTile label="UPH" value={safeReportData.operationTimeline.uph.toLocaleString()} unit="ea" />
                    </div>
                    <Timeline segments={safeReportData.operationTimeline.timeline} />
                </section>

                <section className="grid grid-cols-[1.15fr_0.85fr] gap-5 flex-1 z-10">
                    <div>
                        <SectionTitle index="02" title={`알람 및 조치 이력 (${safeAlarmData.length}건)`} />
                        <table className="w-full text-[10px] border-collapse bg-white">
                            <thead>
                                <tr className="border-y-2 border-zinc-900 bg-zinc-50 text-left text-zinc-600">
                                    <th className="py-2 px-2">등급</th>
                                    <th className="py-2 px-2">시간</th>
                                    <th className="py-2 px-2">설비</th>
                                    <th className="py-2 px-2">내용</th>
                                    <th className="py-2 px-2">상태</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {safeAlarmData.length > 0 ? safeAlarmData.slice(0, 8).map((alarm) => (
                                    <tr key={alarm.id} className={alarm.severity === "critical" ? "bg-red-50/50" : ""}>
                                        <td className={`py-2 px-2 font-black uppercase ${alarm.severity === "critical" ? "text-red-600" : "text-amber-600"}`}>{alarm.severity}</td>
                                        <td className="py-2 px-2 text-zinc-500">{alarm.time}</td>
                                        <td className="py-2 px-2 font-bold">{alarm.eq}</td>
                                        <td className="py-2 px-2 text-zinc-700">{alarm.message}</td>
                                        <td className="py-2 px-2">{alarm.status}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-zinc-400 bg-zinc-50">알람 이력이 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <SectionTitle index="03" title="교대 인수인계 체크" />
                        <div className="border-2 border-zinc-900 bg-white p-4 space-y-3">
                            <ChecklistItem text="미조치 Critical 알람 담당자 지정" active={criticalAlarms.length > 0} />
                            <ChecklistItem text="수율 하위 설비 Recipe/LOT 확인" active={riskEquipments.length > 0} />
                            <ChecklistItem text="Cpk Warning 항목 SPC 재확인" active={safeQualityData.summary.cpk < 1.33} />
                            <ChecklistItem text="다음 근무조 Action Plan 공유" active={topActions.length > 0} />
                        </div>

                        <div className="mt-5 border border-zinc-200 rounded-sm p-4 bg-zinc-50">
                            <p className="text-[10px] font-black text-zinc-500 mb-2">자동 생성 의견</p>
                            <p className="text-[11px] leading-relaxed text-zinc-700">
                                본 리포트는 생산/품질/가동 데이터를 기반으로 생성된 초안입니다. 최종 조치 여부와 담당자는 MES/EAP 조치 이력 기준으로 확인하십시오.
                            </p>
                        </div>
                    </div>
                </section>

                <ReportFooter pageLabel="Page 03" />
            </ReportSheet>
        </>
    );
}

function ReportSheet({ children, isLoading, className = "" }: { children: React.ReactNode; isLoading: boolean; className?: string }) {
    return (
        <div className={`report-page-sheet w-[210mm] min-h-[297mm] bg-white text-zinc-950 p-12 shadow-xl flex flex-col font-sans border border-zinc-200 shrink-0 relative overflow-hidden transition-all ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="animate-pulse font-bold text-zinc-400 text-xl tracking-widest">UPDATING REPORT...</div>
                </div>
            )}
            <div className="absolute top-[42%] left-[-10%] w-[120%] -rotate-45 text-[110px] font-black text-zinc-100/50 pointer-events-none select-none flex justify-center items-center z-0">
                DRAFT SUMMARY
            </div>
            {children}
        </div>
    );
}

function ReportMasthead({
    title,
    subtitle,
    issueDateTime,
    periodText,
    targetText,
    pageLabel
}: {
    title: string;
    subtitle: string;
    issueDateTime: string;
    periodText: string;
    targetText: string;
    pageLabel: string;
}) {
    return (
        <header className="flex justify-between items-start mb-7 relative z-10">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900">{title}</h1>
                <p className="text-sm font-bold text-zinc-500 mt-1">{subtitle}</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs text-zinc-600 mt-5">
                    <p><span className="font-bold text-zinc-400 mr-2">발행 일시</span>{issueDateTime}</p>
                    <p><span className="font-bold text-zinc-400 mr-2">작성자</span>Smart Link AI</p>
                    <p><span className="font-bold text-zinc-400 mr-2">집계 기간</span>{periodText}</p>
                    <p><span className="font-bold text-zinc-400 mr-2">대상</span>{targetText}</p>
                </div>
            </div>
            <div className="flex border border-zinc-300 text-center text-[10px] bg-white">
                <div className="w-18 border-r border-zinc-300">
                    <div className="bg-zinc-100 border-b border-zinc-300 py-1 font-bold text-zinc-600">초안 생성</div>
                    <div className="h-14 flex items-center justify-center font-bold text-zinc-400">System</div>
                </div>
                <div className="w-18">
                    <div className="bg-zinc-100 border-b border-zinc-300 py-1 font-bold text-zinc-600">검토</div>
                    <div className="h-14"></div>
                </div>
            </div>
            <span className="absolute right-0 -bottom-5 text-[10px] font-bold text-zinc-400">{pageLabel}</span>
        </header>
    );
}

function ReportSectionHeader({ index, title }: { index: string; title: string }) {
    return (
        <div className="mb-6 z-10">
            <h2 className="text-2xl font-black text-zinc-900 border-b-2 border-zinc-900 pb-2 flex items-center gap-2">
                <span className="text-zinc-400 font-normal">{index}.</span>
                {title}
            </h2>
        </div>
    );
}

function SectionTitle({ index, title }: { index: string; title: string }) {
    return (
        <h3 className="text-xs font-black text-zinc-900 mb-3 flex items-center gap-2">
            <span className="w-1 h-3 bg-zinc-900" />
            <span className="text-zinc-400">{index}</span>
            {title}
        </h3>
    );
}

function KpiTile({ label, value, unit, danger = false }: { label: string; value: string | number; unit: string; danger?: boolean }) {
    return (
        <div className={`border p-3 rounded-sm ${danger ? "border-red-200 bg-red-50" : "border-zinc-200 bg-zinc-50"}`}>
            <p className={`text-[10px] font-bold mb-1 ${danger ? "text-red-600" : "text-zinc-500"}`}>{label}</p>
            <p className={`text-lg font-black ${danger ? "text-red-700" : "text-zinc-900"}`}>
                {value}<span className="text-[10px] font-medium text-zinc-500 ml-1">{unit}</span>
            </p>
        </div>
    );
}

function QualityTile({ label, value, danger = false }: { label: string; value: string | number; danger?: boolean }) {
    return (
        <div className={`border p-3 rounded-sm bg-white ${danger ? "border-red-200" : "border-zinc-200"}`}>
            <p className="text-[10px] font-bold text-zinc-500">{label}</p>
            <p className={`text-2xl font-black mt-1 ${danger ? "text-red-600" : "text-zinc-900"}`}>{value}</p>
        </div>
    );
}

function PriorityLine({ label, value, danger }: { label: string; value: string; danger: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-zinc-500">{label}</span>
            <span className={`font-black ${danger ? "text-red-600" : "text-emerald-600"}`}>{value}</span>
        </div>
    );
}

function RiskBadge({ eq }: { eq: EquipmentStatus }) {
    const grade = getRiskGrade(eq);
    const className = grade === "Critical"
        ? "bg-red-100 text-red-700 border-red-200"
        : grade === "Warning"
            ? "bg-amber-100 text-amber-700 border-amber-200"
            : "bg-emerald-50 text-emerald-700 border-emerald-200";

    return <span className={`inline-flex px-2 py-0.5 rounded-sm border text-[9px] font-black ${className}`}>{grade}</span>;
}

function Histogram({ quality }: { quality: QualityDistribution }) {
    const histogram = quality.distributionChart.histogram;
    const maxCount = Math.max(...histogram.map((bar) => bar.count), 1);
    const chartPadding = { left: 8, right: 8, top: 10, bottom: 14 };
    const chartWidth = 100 - chartPadding.left - chartPadding.right;
    const chartHeight = 100 - chartPadding.top - chartPadding.bottom;
    const points = histogram.map((bar, index) => {
        const x = chartPadding.left + (histogram.length <= 1 ? chartWidth / 2 : (index / (histogram.length - 1)) * chartWidth);
        const y = chartPadding.top + chartHeight - (bar.count / maxCount) * chartHeight;
        return { x, y, ...bar };
    });
    const trendPath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
    const estimatedMean = getEstimatedMean(histogram);
    const { lsl, usl } = quality.distributionChart.guidelines;
    const meanPosition = estimatedMean === null
        ? null
        : Math.min(Math.max(((estimatedMean - lsl) / Math.max(usl - lsl, 0.001)) * 100, 0), 100);

    return (
        <div className="h-40 border border-zinc-200 bg-white p-3 overflow-hidden">
            <div className="h-28 flex items-end gap-1 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 border-l border-dashed border-red-400">
                    <span className="absolute -top-3 left-0 text-[8px] font-bold text-red-500">LSL</span>
                </div>
                <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-zinc-400">
                    <span className="absolute -top-3 -translate-x-1/2 text-[8px] font-bold text-zinc-500">Target</span>
                </div>
                <div className="absolute inset-y-0 right-0 border-l border-dashed border-red-400">
                    <span className="absolute -top-3 right-0 text-[8px] font-bold text-red-500">USL</span>
                </div>
                {meanPosition !== null && (
                    <div className="absolute inset-y-0 border-l-2 border-blue-500 print:border-zinc-700 z-20" style={{ left: `${meanPosition}%` }}>
                        <span className="absolute top-1 left-1 max-w-16 truncate text-[8px] font-black text-blue-600 print:text-zinc-700 whitespace-nowrap">
                            Mean {estimatedMean?.toFixed(3)}
                        </span>
                    </div>
                )}
                <svg className="absolute inset-0 z-20 pointer-events-none" style={{ overflow: "hidden" }} viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <clipPath id="histogram-trend-clip">
                            <rect x="0" y="0" width="100" height="100" />
                        </clipPath>
                    </defs>
                    <g clipPath="url(#histogram-trend-clip)">
                        <path d={trendPath} fill="none" stroke="#2563eb" strokeWidth="1" vectorEffect="non-scaling-stroke" className="print:stroke-zinc-700" />
                    {points.map((point) => (
                        <circle key={`${point.range}-${point.count}`} cx={point.x} cy={point.y} r="1.3" fill={point.isWarning ? "#f59e0b" : "#2563eb"} vectorEffect="non-scaling-stroke" className="print:fill-zinc-700" />
                    ))}
                    </g>
                </svg>
                {histogram.map((bar) => (
                    <div key={bar.range} className="flex-1 flex flex-col items-center justify-end z-10">
                        <div
                            className={`w-full rounded-t-sm opacity-85 ${bar.isWarning ? "bg-amber-500 print:bg-zinc-500" : "bg-zinc-800"}`}
                            style={{ height: `${Math.max((bar.count / maxCount) * 100, 4)}%` }}
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-[8px] text-zinc-400 mt-2">
                <span>LSL {quality.distributionChart.guidelines.lsl}</span>
                <span>Target {quality.distributionChart.guidelines.target}</span>
                <span>USL {quality.distributionChart.guidelines.usl}</span>
            </div>
            <div className="mt-1 grid gap-1 text-[7px] text-zinc-400" style={{ gridTemplateColumns: `repeat(${Math.max(histogram.length, 1)}, minmax(0, 1fr))` }}>
                {histogram.map((bar) => (
                    <span key={bar.range} className="truncate text-center" title={bar.range}>{bar.range}</span>
                ))}
            </div>
        </div>
    );
}

function SlotCell({ index, slot }: { index: number; slot?: ReportHeatmap["slots"][number] }) {
    const severity = slot?.severity || "info";
    const className = severity === "critical"
        ? "border-red-300 bg-red-50 text-red-700"
        : severity === "warning"
            ? "border-amber-300 bg-amber-50 text-amber-700"
            : "border-zinc-200 bg-zinc-50 text-zinc-600";

    return (
        <div className={`border rounded-sm p-2 flex flex-col justify-between ${className}`}>
            <div className="flex justify-between items-start">
                <span className="text-[10px] font-black">Z-{index}</span>
                <span className="text-[9px] font-bold">F:{slot?.failCount || 0}</span>
            </div>
            <div className="text-right">
                <p className="text-[9px] font-bold">{slot?.dominantError || "OK"}</p>
                <p className="text-[8px] opacity-70">P:{slot?.passCount || 0}</p>
            </div>
        </div>
    );
}

function Timeline({ segments }: { segments: ReportSummary["operationTimeline"]["timeline"] }) {
    const dayStart = "08:00";
    const dayEnd = "17:00";
    const startMinutes = toMinutes(segments[0]?.start || dayStart);
    const endMinutes = toMinutes(segments[segments.length - 1]?.end || dayEnd);
    const totalMinutes = Math.max(endMinutes - startMinutes, 1);

    return (
        <div className="border border-zinc-200 p-4 rounded-sm bg-white">
            <div className="h-7 flex rounded-sm overflow-hidden bg-zinc-100">
                {segments.map((segment, index) => {
                    const color = segment.status === "run" ? "bg-emerald-500 print:bg-zinc-700" : segment.status === "error" ? "bg-red-500 print:bg-zinc-900" : "bg-amber-400 print:bg-zinc-400";
                    const width = ((toMinutes(segment.end) - toMinutes(segment.start)) / totalMinutes) * 100;

                    return (
                        <div
                            key={`${segment.start}-${index}`}
                            className={color}
                            style={{ width: `${Math.max(width, 0)}%` }}
                            title={`${segment.status}: ${segment.start}~${segment.end}`}
                        />
                    );
                })}
            </div>
            <div className="flex justify-between text-[9px] text-zinc-400 font-bold mt-2">
                <span>{segments[0]?.start || dayStart}</span>
                <span>{segments[segments.length - 1]?.end || dayEnd}</span>
            </div>
        </div>
    );
}

function ChecklistItem({ text, active }: { text: string; active: boolean }) {
    return (
        <div className="flex items-center gap-3 text-xs">
            {active ? <AlertTriangle className="w-4 h-4 text-red-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            <span className={active ? "font-bold text-zinc-900" : "text-zinc-500"}>{text}</span>
        </div>
    );
}

function EmptyBox({ text }: { text: string }) {
    return <div className="border border-dashed border-zinc-300 bg-zinc-50 py-8 text-center text-xs font-bold text-zinc-400">{text}</div>;
}

function ReportFooter({ pageLabel }: { pageLabel: string }) {
    return (
        <div className="mt-auto pt-6 flex justify-between items-center text-[10px] text-zinc-400 border-t border-zinc-200 z-10">
            <p>CONFIDENTIAL © 2026 SMART LINK Vision Inspection Systems</p>
            <p className="font-bold text-zinc-500">{pageLabel}</p>
        </div>
    );
}

function formatPeriod(appliedDate: DateRange | undefined) {
    if (!appliedDate?.from) return "기간 미지정";
    if (appliedDate.to) {
        return `${format(appliedDate.from, "yyyy.MM.dd")} ~ ${format(appliedDate.to, "yyyy.MM.dd")}`;
    }
    return format(appliedDate.from, "yyyy.MM.dd");
}

function getRiskGrade(eq: EquipmentStatus) {
    if (eq.unresolvedAlert || eq.uptime < 90 || eq.yield < 97) return "Critical";
    if (eq.uptime < 95 || eq.yield < 98) return "Warning";
    return "Stable";
}

function riskScore(eq: EquipmentStatus) {
    return (eq.unresolvedAlert ? 100 : 0) + Math.max(0, 100 - eq.uptime) + Math.max(0, 100 - eq.yield) * 2 + eq.fail / Math.max(eq.total, 1) * 100;
}

function normalizeRatio(ratio: string | number | undefined) {
    if (typeof ratio === "number") return `${Math.min(Math.max(ratio, 0), 100)}%`;
    if (!ratio) return "0%";
    return ratio.endsWith("%") ? ratio : `${ratio}%`;
}

function getEstimatedMean(histogram: QualityDistribution["distributionChart"]["histogram"]) {
    let weightedSum = 0;
    let totalCount = 0;

    for (const bar of histogram) {
        const midpoint = getRangeMidpoint(bar.range);
        if (midpoint === null) continue;

        weightedSum += midpoint * bar.count;
        totalCount += bar.count;
    }

    return totalCount > 0 ? weightedSum / totalCount : null;
}

function getRangeMidpoint(range: string) {
    const numbers = range.match(/\d+(?:\.\d+)?/g)?.map(Number) || [];
    if (numbers.length >= 2) return (numbers[0] + numbers[1]) / 2;
    if (numbers.length === 1) return numbers[0];
    return null;
}

function toMinutes(time: string) {
    const [hour = "0", minute = "0"] = time.split(":");
    return Number(hour) * 60 + Number(minute);
}

function isUnresolved(status: string) {
    return status.includes("미조치") || status.toLowerCase().includes("unresolved");
}

function getShiftVerdict(report: ReportSummary, quality: QualityDistribution, unresolvedCount: number) {
    if (unresolvedCount > 0 || report.kpi.activeAlerts > 0 || report.kpi.yield < 97 || quality.summary.cpk < 1.33) {
        return {
            label: "Attention Required",
            className: "border-red-200 bg-red-50 text-red-950"
        };
    }

    if (report.kpi.availability < 90 || report.operationTimeline.downHour > 0) {
        return {
            label: "Watch",
            className: "border-amber-200 bg-amber-50 text-amber-950"
        };
    }

    return {
        label: "Stable",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950"
    };
}
