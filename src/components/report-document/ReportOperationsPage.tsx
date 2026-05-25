import type { EquipmentStatus } from "@/type/equipmentType";
import type { QualityDistribution, ReportAlarm, ReportSummary } from "@/type/reportType";
import { ChecklistItem, KpiTile, ReportFooter, ReportSectionHeader, ReportSheet, SectionTitle, Timeline } from "@/components/report-document/ReportLayout";

interface ReportOperationsPageProps {
    isLoading: boolean;
    isEquipmentReport: boolean;
    reportData: ReportSummary;
    qualityData: QualityDistribution;
    alarmData: ReportAlarm[];
    criticalAlarms: ReportAlarm[];
    riskEquipments: EquipmentStatus[];
    topActions: ReportSummary["actionPlans"];
}

export function ReportOperationsPage({
    isLoading,
    isEquipmentReport,
    reportData,
    qualityData,
    alarmData,
    criticalAlarms,
    riskEquipments,
    topActions,
}: ReportOperationsPageProps) {
    return (
        <ReportSheet isLoading={isLoading} className="mt-8">
            <ReportSectionHeader index="03" title="가동 이력, 알람 및 조치 현황" />

            <section className="mb-6 z-10">
                <SectionTitle index="01" title={isEquipmentReport ? "대상 장비 가동 요약" : "라인 가동 요약"} />
                <div className="grid grid-cols-4 gap-3 mb-4">
                    <KpiTile label="Run" value={reportData.operationTimeline.runHour} unit="hr" />
                    <KpiTile label="Down" value={reportData.operationTimeline.downHour} unit="hr" danger={reportData.operationTimeline.downHour > 0} />
                    <KpiTile label="MTBF" value={reportData.operationTimeline.mtbf} unit="hr" />
                    <KpiTile label="UPH" value={reportData.operationTimeline.uph.toLocaleString()} unit="ea" />
                </div>
                <Timeline segments={reportData.operationTimeline.timeline} />
            </section>

            <section className="grid grid-cols-[1.15fr_0.85fr] gap-5 flex-1 z-10">
                <div>
                    <SectionTitle index="02" title={`알람 및 조치 이력 (${alarmData.length}건)`} />
                    <table className="w-full text-[10px] border-collapse bg-white">
                        <thead>
                            <tr className="border-y-2 border-zinc-900 bg-zinc-50 text-left text-zinc-600">
                                <th className="py-2 px-2">등급</th>
                                <th className="py-2 px-2">시간</th>
                                <th className="py-2 px-2">장비</th>
                                <th className="py-2 px-2">내용</th>
                                <th className="py-2 px-2">상태</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {alarmData.length > 0 ? alarmData.slice(0, 8).map((alarm) => (
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
                        <ChecklistItem text="미조치 Critical 알람 해당 여부" active={criticalAlarms.length > 0} />
                        <ChecklistItem text="수율 하위 장비 Recipe/LOT 확인" active={riskEquipments.length > 0} />
                        <ChecklistItem text="Cpk Warning 항목 SPC 재확인" active={qualityData.summary.cpk < 1.33} />
                        <ChecklistItem text="다음 근무조 Action Plan 공유" active={topActions.length > 0} />
                    </div>

                    <div className="mt-5 border border-zinc-200 rounded-sm p-4 bg-zinc-50">
                        <p className="text-[10px] font-black text-zinc-500 mb-2">자동 생성 의견</p>
                        <p className="text-[11px] leading-relaxed text-zinc-700">
                            본 리포트는 생산/품질/가동 데이터를 기반으로 생성된 초안입니다. 최종 조치 여부는 MES/EAP 조치 이력 기준으로 확인하십시오.
                        </p>
                    </div>
                </div>
            </section>

            <ReportFooter pageLabel="Page 03" />
        </ReportSheet>
    );
}
