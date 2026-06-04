import type { DefectStat, EquipmentStatus } from "@/type/equipmentType";
import type { QualityDistribution, ReportHeatmap } from "@/type/reportType";
import { Histogram } from "@/components/report-document/Histogram";
import { QualityTile, ReportFooter, ReportSectionHeader, ReportSheet, SectionTitle, SlotCell } from "@/components/report-document/ReportLayout";
import { formatCpk, formatEquipmentIdLines, isCpkWarning, normalizeRatio } from "@/components/report-document/utils";

interface ReportQualityPageProps {
    isLoading: boolean;
    isEquipmentReport: boolean;
    targetEq: string;
    qualityData: QualityDistribution;
    heatmapData: ReportHeatmap;
    topDefects: DefectStat[];
    riskEquipments: EquipmentStatus[];
}

export function ReportQualityPage({
    isLoading,
    isEquipmentReport,
    targetEq,
    qualityData,
    heatmapData,
    topDefects,
    riskEquipments,
}: ReportQualityPageProps) {
    return (
        <ReportSheet isLoading={isLoading} className="mt-8">
            <ReportSectionHeader
                index="02"
                title={isEquipmentReport ? (
                    <span className="inline-flex max-w-full flex-wrap items-baseline gap-x-2">
                        <EquipmentIdText value={targetEq} className="text-zinc-900" />
                        <span>품질 원인 분석</span>
                    </span>
                ) : "품질 및 수율 원인 분석"}
            />

            <section className="grid grid-cols-[0.88fr_1.12fr] gap-4 mb-5 z-10">
                <div className="border border-zinc-200 rounded-sm p-3 bg-zinc-50">
                    <SectionTitle index="01" title="공정 능력 상태" />
                    <div className="grid grid-cols-2 gap-2.5 mb-3">
                        <QualityTile label="Pass Rate" value={`${qualityData.summary.passRate}%`} />
                        <QualityTile label="Cpk" value={formatCpk(qualityData.summary.cpk)} danger={isCpkWarning(qualityData.summary.cpk)} />
                    </div>
                    <p className="text-[10px] leading-relaxed text-zinc-600 mb-3">{qualityData.summary.cpkSub}</p>
                    <Histogram quality={qualityData} />
                </div>

                <div className="border border-zinc-200 rounded-sm p-3 bg-white">
                    <SectionTitle index="02" title="주요 불량 Pareto" />
                    <div className="space-y-2.5">
                        {topDefects.map((defect, index) => (
                            <div key={defect.code || defect.name} className="grid min-w-0 grid-cols-[5rem_minmax(0,1fr)_3rem] items-center gap-3">
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-zinc-900 truncate">{defect.code}</p>
                                    <p className="text-[9px] text-zinc-500 leading-snug break-words min-w-0">{defect.name}</p>
                                </div>
                                <div className="min-w-0 h-4 bg-zinc-100 rounded-sm overflow-hidden">
                                    <div
                                        className={`h-full ${index === 0 ? "bg-zinc-900" : "bg-zinc-400"}`}
                                        style={{ width: normalizeRatio(defect.ratio) }}
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-right text-zinc-700 min-w-0">{defect.count}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 border-t border-zinc-200 pt-3">
                        <p className="text-[10px] font-black text-zinc-500 mb-2">품질 영향 메모</p>
                        <p className="text-[11px] leading-relaxed text-zinc-700">{topDefects[0]?.impact || "주요 불량 영향 정보가 없습니다."}</p>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-[1.05fr_0.95fr] gap-4 flex-1 z-10">
                {isEquipmentReport ? (
                    <div className="border border-zinc-200 rounded-sm p-3 bg-white flex flex-col">
                        <SectionTitle index="03" title="8 Slot 결함 집중도" />
                        <div className="grid grid-cols-4 gap-2 h-48">
                            {Array.from({ length: 8 }).map((_, index) => {
                                const slot = heatmapData.slots.find((item) => item.zAxisNum === index);
                                return <SlotCell key={index} index={index} slot={slot} />;
                            })}
                        </div>
                        <SlotSummary heatmapData={heatmapData} />
                    </div>
                ) : (
                    <div className="border border-zinc-200 rounded-sm p-3 bg-white flex flex-col">
                        <SectionTitle index="03" title="하위 장비 Recipe 영향" />
                        <div className="space-y-2.5">
                            {riskEquipments.slice(0, 4).map((eq) => (
                                <div key={eq.id} className="grid grid-cols-[minmax(0,1fr)_3.75rem] items-center gap-2 border-b border-zinc-100 pb-2 last:border-0">
                                    <div className="min-w-0">
                                        <EquipmentIdText value={eq.id} className="text-[10px] font-bold text-zinc-900" />
                                        <p className="text-[9px] text-zinc-500">{eq.recipe}</p>
                                    </div>
                                    <div className="min-w-0 text-right">
                                        <p className="text-xs font-black text-red-600">{eq.yield}%</p>
                                        <p className="text-[9px] text-zinc-500">{eq.majorDefect}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <EquipmentQualitySummary riskEquipments={riskEquipments} />
                    </div>
                )}

                <div className="border border-amber-200 border-l-4 border-l-amber-500 bg-amber-50 p-3 rounded-sm flex flex-col">
                    <SectionTitle index="04" title="원인 추정 및 확인 포인트" />
                    <p className="text-xs font-bold text-amber-900 mb-2">
                        {isEquipmentReport ? heatmapData.aiAnalysis.title : qualityData.aiInference.title}
                    </p>
                    <p className="text-[11px] leading-relaxed text-amber-950">
                        {isEquipmentReport ? heatmapData.aiAnalysis.description : qualityData.aiInference.description}
                    </p>
                    <QualityInspectionQueue topDefects={topDefects} isEquipmentReport={isEquipmentReport} />
                    <div className="mt-auto pt-4 grid grid-cols-2 gap-2 text-[10px]">
                        <div className="border border-amber-200 bg-white/60 p-2">
                            <p className="font-black text-amber-900">Pass Rate</p>
                            <p className="font-bold text-zinc-800">{qualityData.summary.passRate}%</p>
                        </div>
                        <div className="border border-amber-200 bg-white/60 p-2">
                            <p className="font-black text-amber-900">Cpk</p>
                            <p className="font-bold text-zinc-800">{formatCpk(qualityData.summary.cpk)}</p>
                        </div>
                    </div>
                </div>
            </section>

            <ReportFooter pageLabel="Page 02" />
        </ReportSheet>
    );
}

function EquipmentIdText({ value, className = "" }: { value: string; className?: string }) {
    return (
        <span className={`inline-flex max-w-full flex-col leading-[1.05] ${className}`} title={value}>
            {formatEquipmentIdLines(value).map((line) => (
                <span key={line} className="whitespace-nowrap">{line}</span>
            ))}
        </span>
    );
}

function SlotSummary({ heatmapData }: { heatmapData: ReportHeatmap }) {
    const failTotal = heatmapData.slots.reduce((sum, slot) => sum + slot.failCount, 0);
    const criticalSlots = heatmapData.slots.filter((slot) => slot.severity === "critical").length;
    const warningSlots = heatmapData.slots.filter((slot) => slot.severity === "warning").length;

    return (
        <div className="mt-auto pt-3 grid grid-cols-3 gap-2 text-[10px]">
            <SummaryCell label="Fail Total" value={`${failTotal}`} />
            <SummaryCell label="Critical Slot" value={`${criticalSlots}`} danger={criticalSlots > 0} />
            <SummaryCell label="Warning Slot" value={`${warningSlots}`} danger={warningSlots > 0} />
        </div>
    );
}

function EquipmentQualitySummary({ riskEquipments }: { riskEquipments: EquipmentStatus[] }) {
    const avgYield = riskEquipments.length
        ? (riskEquipments.reduce((sum, eq) => sum + eq.yield, 0) / riskEquipments.length).toFixed(1)
        : "-";
    const avgUptime = riskEquipments.length
        ? (riskEquipments.reduce((sum, eq) => sum + eq.uptime, 0) / riskEquipments.length).toFixed(1)
        : "-";

    return (
        <div className="mt-auto pt-3 grid grid-cols-3 gap-2 text-[10px]">
            <SummaryCell label="대상 장비" value={`${riskEquipments.length}`} />
            <SummaryCell label="평균 수율" value={`${avgYield}%`} />
            <SummaryCell label="평균 가동률" value={`${avgUptime}%`} />
        </div>
    );
}

function QualityInspectionQueue({
    topDefects,
    isEquipmentReport,
}: {
    topDefects: DefectStat[];
    isEquipmentReport: boolean;
}) {
    const rows = [
        topDefects[0]?.code ? `${topDefects[0].code} 재현 LOT 확인` : "주요 불량 LOT 확인",
        isEquipmentReport ? "Slot별 조명/초점 조건 확인" : "하위 장비 Recipe 조건 비교",
        "SPC 이탈 지점 원본 이미지 샘플링",
    ];

    return (
        <div className="mt-4 border-t border-amber-200 pt-3">
            <p className="text-[10px] font-black text-amber-900 mb-2">확인 큐</p>
            <div className="space-y-1.5">
                {rows.map((row, index) => (
                    <div key={row} className="grid grid-cols-[1.4rem_1fr] gap-2 text-[10px] text-amber-950">
                        <span className="font-black">Q{index + 1}</span>
                        <span>{row}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SummaryCell({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
    return (
        <div className={`border p-2 ${danger ? "border-red-200 bg-red-50" : "border-zinc-200 bg-zinc-50"}`}>
            <p className={`font-black ${danger ? "text-red-600" : "text-zinc-500"}`}>{label}</p>
            <p className="mt-1 font-black text-zinc-900">{value}</p>
        </div>
    );
}
