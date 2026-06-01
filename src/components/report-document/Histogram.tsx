import type { QualityDistribution } from "@/type/reportType";
import { getEstimatedMean } from "@/components/report-document/utils";

export function Histogram({ quality }: { quality: QualityDistribution }) {
    const histogram = quality.distributionChart.histogram;
    if (!histogram || histogram.length === 0) {
        return (
            <div className="h-40 border border-zinc-200 bg-white p-3 flex items-center justify-center text-[10px] text-zinc-400">
                분포 데이터가 없습니다.
            </div>
        );
    }
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
