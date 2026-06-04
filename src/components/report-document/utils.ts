import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import type { EquipmentStatus } from "@/type/equipmentType";
import type { QualityDistribution, ReportSummary } from "@/type/reportType";

export function formatPeriod(appliedDate: DateRange | undefined) {
    if (!appliedDate?.from) return "기간 미지정";
    if (appliedDate.to) {
        return `${format(appliedDate.from, "yyyy.MM.dd")} ~ ${format(appliedDate.to, "yyyy.MM.dd")}`;
    }
    return format(appliedDate.from, "yyyy.MM.dd");
}

export function getRiskGrade(eq: EquipmentStatus) {
    if (eq.unresolvedAlert || eq.uptime < 90 || eq.yield < 97) return "Critical";
    if (eq.uptime < 95 || eq.yield < 98) return "Warning";
    return "Stable";
}

export function riskScore(eq: EquipmentStatus) {
    return (eq.unresolvedAlert ? 100 : 0) + Math.max(0, 100 - eq.uptime) + Math.max(0, 100 - eq.yield) * 2 + (eq.fail / Math.max(eq.total, 1)) * 100;
}

export function normalizeRatio(ratio: string | number | undefined) {
    if (typeof ratio === "number") return `${Math.min(Math.max(ratio, 0), 100)}%`;
    if (!ratio) return "0%";
    return ratio.endsWith("%") ? ratio : `${ratio}%`;
}

export function toMinutes(time: string) {
    const [hour = "0", minute = "0"] = time.split(":");
    return Number(hour) * 60 + Number(minute);
}

export function isUnresolved(status: string) {
    return status.includes("미조치") || status.toLowerCase().includes("unresolved");
}

export function formatCpk(cpk: number | null | undefined) {
    return typeof cpk === "number" ? cpk.toFixed(2) : "N/A";
}

export function formatEquipmentIdLines(value: string) {
    const equipmentId = value.trim();
    if (equipmentId.length <= 14) return [equipmentId];

    if (/^[a-f0-9]{24,}$/i.test(equipmentId)) {
        return [
            equipmentId.slice(0, 12),
            `...${equipmentId.slice(-10)}`,
        ];
    }

    const midpoint = Math.floor(equipmentId.length / 2);
    const candidates = Array.from(equipmentId.matchAll(/[-_\s]/g))
        .map((match) => match.index ?? -1)
        .filter((index) => index > 0 && index < equipmentId.length - 1);

    const splitIndex = candidates.length > 0
        ? candidates.reduce((best, index) => Math.abs(index - midpoint) < Math.abs(best - midpoint) ? index : best)
        : midpoint;

    return [
        equipmentId.slice(0, splitIndex + 1).trim(),
        equipmentId.slice(splitIndex + 1).trim(),
    ].filter(Boolean).slice(0, 2);
}

export function isCpkWarning(cpk: number | null | undefined) {
    return typeof cpk === "number" && cpk < 1.33;
}

// 공정능력지수(Cpk) 산업 표준 4단계 등급 (AIAG / SPC 통용 기준)
//  Cpk < 1.00        : 부적합 (Incapable)  — 규격 이탈 다수
//  1.00 ≤ Cpk < 1.33 : 경고 (Marginal)     — 개선 필요
//  1.33 ≤ Cpk < 1.67 : 안정 (Capable)      — 양산 합격 기준
//  Cpk ≥ 1.67        : 우수 (Excellent)
export type CpkGradeTone = "danger" | "warn" | "good" | "great";
export interface CpkGrade {
    key: "incapable" | "marginal" | "capable" | "excellent";
    label: string;
    tone: CpkGradeTone;
    /** tailwind 텍스트 색상 클래스 */
    textClass: string;
}

export function getCpkGrade(cpk: number | null | undefined): CpkGrade | null {
    if (typeof cpk !== "number" || Number.isNaN(cpk)) return null;
    if (cpk < 1.0) return { key: "incapable", label: "부적합 (Incapable)", tone: "danger", textClass: "text-destructive" };
    if (cpk < 1.33) return { key: "marginal", label: "경고 (Marginal)", tone: "warn", textClass: "text-amber-500" };
    if (cpk < 1.67) return { key: "capable", label: "안정 (Capable)", tone: "good", textClass: "text-emerald-500" };
    return { key: "excellent", label: "우수 (Excellent)", tone: "great", textClass: "text-emerald-400" };
}

export function getShiftVerdict(report: ReportSummary, quality: QualityDistribution, unresolvedCount: number) {
    if (unresolvedCount > 0 || report.kpi.activeAlerts > 0 || report.kpi.yield < 97 || isCpkWarning(quality.summary.cpk)) {
        return {
            label: "Attention Required",
            className: "border-red-200 bg-red-50 text-red-950",
        };
    }

    if (report.kpi.availability < 90 || report.operationTimeline.downHour > 0) {
        return {
            label: "Watch",
            className: "border-amber-200 bg-amber-50 text-amber-950",
        };
    }

    return {
        label: "Stable",
        className: "border-emerald-200 bg-emerald-50 text-emerald-950",
    };
}

export function getEstimatedMean(histogram: QualityDistribution["distributionChart"]["histogram"]) {
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
