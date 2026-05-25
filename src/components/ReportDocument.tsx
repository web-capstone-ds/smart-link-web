import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { ReportOperationsPage } from "@/components/report-document/ReportOperationsPage";
import { ReportOverviewPage } from "@/components/report-document/ReportOverviewPage";
import { ReportQualityPage } from "@/components/report-document/ReportQualityPage";
import { formatPeriod, isUnresolved, riskScore } from "@/components/report-document/utils";
import type { DefectStat, EquipmentStatus } from "@/type/equipmentType";
import type { QualityDistribution, ReportAlarm, ReportHeatmap, ReportSummary } from "@/type/reportType";

export interface ReportDocumentProps {
    reportMode: "daily" | "weekly" | "equipment";
    targetEq: string;
    safeReportData: ReportSummary;
    safeQualityData: QualityDistribution;
    safeHeatmapData: ReportHeatmap;
    safeDefectData: DefectStat[];
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
    isLoading,
}: ReportDocumentProps) {
    const isEquipmentReport = reportMode === "equipment";
    const reportTitle = isEquipmentReport
        ? "EQUIPMENT DAILY REVIEW"
        : reportMode === "weekly"
            ? "PERIOD OPERATIONS REVIEW"
            : "DAILY OPERATIONS REVIEW";
    const reportSubtitle = isEquipmentReport
        ? `${targetEq} 장비 일일 리뷰`
        : "일일 생산, 품질, 가동 및 조치 인수인계";
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

    return (
        <>
            <ReportOverviewPage
                isLoading={isLoading}
                reportTitle={reportTitle}
                reportSubtitle={reportSubtitle}
                issueDateTime={issueDateTime}
                periodText={periodText}
                targetText={targetText}
                isEquipmentReport={isEquipmentReport}
                reportData={safeReportData}
                qualityData={safeQualityData}
                riskEquipments={riskEquipments}
                topActions={topActions}
                criticalAlarms={criticalAlarms}
                unresolvedAlarms={unresolvedAlarms}
            />

            <ReportQualityPage
                isLoading={isLoading}
                isEquipmentReport={isEquipmentReport}
                targetEq={targetEq}
                qualityData={safeQualityData}
                heatmapData={safeHeatmapData}
                topDefects={topDefects}
                riskEquipments={riskEquipments}
            />

            <ReportOperationsPage
                isLoading={isLoading}
                isEquipmentReport={isEquipmentReport}
                reportData={safeReportData}
                qualityData={safeQualityData}
                alarmData={safeAlarmData}
                criticalAlarms={criticalAlarms}
                riskEquipments={riskEquipments}
                topActions={topActions}
            />
        </>
    );
}
