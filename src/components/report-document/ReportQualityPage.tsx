import type { DefectStat, EquipmentStatus } from "@/type/equipmentType";
import type { QualityDistribution, ReportHeatmap } from "@/type/reportType";
import { Histogram } from "@/components/report-document/Histogram";
import { QualityTile, ReportFooter, ReportSectionHeader, ReportSheet, SectionTitle, SlotCell } from "@/components/report-document/ReportLayout";
import { normalizeRatio } from "@/components/report-document/utils";

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
            <ReportSectionHeader index="02" title={isEquipmentReport ? `${targetEq} 품질 원인 분석` : "품질 및 수율 원인 분석"} />

            <section className="grid grid-cols-[0.9fr_1.1fr] gap-5 mb-6 z-10">
                <div className="border border-zinc-200 rounded-sm p-4 bg-zinc-50">
                    <SectionTitle index="01" title="공정 능력 상태" />
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <QualityTile label="Pass Rate" value={`${qualityData.summary.passRate}%`} />
                        <QualityTile label="Cpk" value={qualityData.summary.cpk} danger={qualityData.summary.cpk < 1.33} />
                    </div>
                    <p className="text-[10px] leading-relaxed text-zinc-600 mb-3">{qualityData.summary.cpkSub}</p>
                    <Histogram quality={qualityData} />
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
                                const slot = heatmapData.slots.find((item) => item.zAxisNum === index);
                                return <SlotCell key={index} index={index} slot={slot} />;
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="border border-zinc-200 rounded-sm p-4 bg-white">
                        <SectionTitle index="03" title="하위 장비 Recipe 영향" />
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
                        {isEquipmentReport ? heatmapData.aiAnalysis.title : qualityData.aiInference.title}
                    </p>
                    <p className="text-[11px] leading-relaxed text-amber-950">
                        {isEquipmentReport ? heatmapData.aiAnalysis.description : qualityData.aiInference.description}
                    </p>
                </div>
            </section>

            <ReportFooter pageLabel="Page 02" />
        </ReportSheet>
    );
}
