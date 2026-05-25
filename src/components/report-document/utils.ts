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

export function getShiftVerdict(report: ReportSummary, quality: QualityDistribution, unresolvedCount: number) {
    if (unresolvedCount > 0 || report.kpi.activeAlerts > 0 || report.kpi.yield < 97 || quality.summary.cpk < 1.33) {
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
    const numbers = range.match(/\d+(?:\.\d)?/g)?.map(Number) || [];
    if (numbers.length >= 2) return (numbers[0] + numbers[1]) / 2;
    if (numbers.length === 1) return numbers[0];
    return null;
}
