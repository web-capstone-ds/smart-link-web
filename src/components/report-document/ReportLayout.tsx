import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

import type { EquipmentStatus } from "@/type/equipmentType";
import type { ReportHeatmap, ReportSummary } from "@/type/reportType";
import { getRiskGrade, toMinutes } from "@/components/report-document/utils";

export function ReportSheet({ children, isLoading, className = "" }: { children: ReactNode; isLoading: boolean; className?: string }) {
    return (
        <div className={`report-page-sheet w-[210mm] min-h-[297mm] bg-white text-zinc-950 p-12 shadow-xl flex flex-col font-sans border border-zinc-200 shrink-0 relative overflow-hidden transition-all ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="animate-pulse font-bold text-zinc-400 text-xl tracking-widest">UPDATING REPORT...</div>
                </div>
            )}
            <div className="absolute top-[42%] left-[-10%] w-[120%] -rotate-45 text-[96px] font-black text-zinc-100/40 pointer-events-none select-none flex justify-center items-center z-0">
                DRAFT SUMMARY
            </div>
            {children}
        </div>
    );
}

export function ReportMasthead({
    title,
    subtitle,
    issueDateTime,
    periodText,
    targetText,
    pageLabel,
}: {
    title: ReactNode;
    subtitle: ReactNode;
    issueDateTime: string;
    periodText: string;
    targetText: ReactNode;
    pageLabel: string;
}) {
    return (
        <header className="flex justify-between items-start mb-5 relative z-10">
            <div className="min-w-0 max-w-[35rem]">
                <h1 className="text-3xl font-black tracking-tight text-zinc-900">{title}</h1>
                <p className="text-sm font-bold text-zinc-500 mt-1">{subtitle}</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs text-zinc-600 mt-4">
                    <p><span className="font-bold text-zinc-400 mr-2">발행 일시</span>{issueDateTime}</p>
                    <p><span className="font-bold text-zinc-400 mr-2">작성자</span>Smart Link AI</p>
                    <p><span className="font-bold text-zinc-400 mr-2">집계 기간</span>{periodText}</p>
                    <p className="min-w-0"><span className="font-bold text-zinc-400 mr-2">대상</span>{targetText}</p>
                </div>
            </div>
            <div className="flex border border-zinc-300 text-center text-[10px] bg-white">
                <div className="w-18 border-r border-zinc-300">
                    <div className="bg-zinc-100 border-b border-zinc-300 py-1 font-bold text-zinc-600">초안 생성</div>
                    <div className="h-14 flex items-center justify-center font-bold text-zinc-400">System</div>
                </div>
                <div className="w-18">
                    <div className="bg-zinc-100 border-b border-zinc-300 py-1 font-bold text-zinc-600">검토</div>
                    <div className="h-14" />
                </div>
            </div>
            <span className="absolute right-0 -bottom-5 text-[10px] font-bold text-zinc-400">{pageLabel}</span>
        </header>
    );
}

export function ReportSectionHeader({ index, title }: { index: string; title: ReactNode }) {
    return (
        <div className="mb-4 z-10">
            <h2 className="text-2xl font-black text-zinc-900 border-b-2 border-zinc-900 pb-2 flex items-center gap-2">
                <span className="text-zinc-400 font-normal">{index}.</span>
                {title}
            </h2>
        </div>
    );
}

export function SectionTitle({ index, title }: { index: string; title: string }) {
    return (
        <h3 className="text-xs font-black text-zinc-900 mb-3 flex items-center gap-2">
            <span className="w-1 h-3 bg-zinc-900" />
            <span className="text-zinc-400">{index}</span>
            {title}
        </h3>
    );
}

export function KpiTile({ label, value, unit, danger = false }: { label: string; value: string | number; unit: string; danger?: boolean }) {
    return (
        <div className={`border p-2.5 rounded-sm ${danger ? "border-red-200 bg-red-50" : "border-zinc-200 bg-zinc-50"}`}>
            <p className={`text-[10px] font-bold mb-1 ${danger ? "text-red-600" : "text-zinc-500"}`}>{label}</p>
            <p className={`text-base font-black ${danger ? "text-red-700" : "text-zinc-900"}`}>
                {value}<span className="text-[10px] font-medium text-zinc-500 ml-1">{unit}</span>
            </p>
        </div>
    );
}

export function PriorityLine({ label, value, danger }: { label: string; value: string; danger: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-zinc-500">{label}</span>
            <span className={`font-black ${danger ? "text-red-600" : "text-emerald-600"}`}>{value}</span>
        </div>
    );
}

export function RiskBadge({ eq }: { eq: EquipmentStatus }) {
    const grade = getRiskGrade(eq);
    const className = grade === "Critical"
        ? "bg-red-100 text-red-700 border-red-200"
        : grade === "Warning"
            ? "bg-amber-100 text-amber-700 border-amber-200"
            : "bg-emerald-50 text-emerald-700 border-emerald-200";

    return <span className={`inline-flex px-2 py-0.5 rounded-sm border text-[9px] font-black ${className}`}>{grade}</span>;
}

export function QualityTile({ label, value, danger = false }: { label: string; value: string | number; danger?: boolean }) {
    return (
        <div className={`border p-2.5 rounded-sm bg-white ${danger ? "border-red-200" : "border-zinc-200"}`}>
            <p className="text-[10px] font-bold text-zinc-500">{label}</p>
            <p className={`text-xl font-black mt-1 ${danger ? "text-red-600" : "text-zinc-900"}`}>{value}</p>
        </div>
    );
}

export function SlotCell({ index, slot }: { index: number; slot?: ReportHeatmap["slots"][number] }) {
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

export function Timeline({ segments }: { segments: ReportSummary["operationTimeline"]["timeline"] }) {
    const dayStart = "08:00";
    const dayEnd = "17:00";
    const startMinutes = toMinutes(segments[0]?.start || dayStart);
    const endMinutes = toMinutes(segments[segments.length - 1]?.end || dayEnd);
    const totalMinutes = Math.max(endMinutes - startMinutes, 1);

    return (
        <div className="border border-zinc-200 p-3 rounded-sm bg-white">
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

export function ChecklistItem({ text, active }: { text: string; active: boolean }) {
    return (
        <div className="flex items-center gap-3 text-xs">
            {active ? <AlertTriangle className="w-4 h-4 text-red-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            <span className={active ? "font-bold text-zinc-900" : "text-zinc-500"}>{text}</span>
        </div>
    );
}

export function EmptyBox({ text }: { text: string }) {
    return <div className="border border-dashed border-zinc-300 bg-zinc-50 py-8 text-center text-xs font-bold text-zinc-400">{text}</div>;
}

export function ReportFooter({ pageLabel }: { pageLabel: string }) {
    return (
        <div className="mt-auto pt-6 flex justify-between items-center text-[10px] text-zinc-400 border-t border-zinc-200 z-10">
            <p>CONFIDENTIAL © 2026 SMART LINK Vision Inspection Systems</p>
            <p className="font-bold text-zinc-500">{pageLabel}</p>
        </div>
    );
}
