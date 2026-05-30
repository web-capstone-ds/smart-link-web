import { ArrowUpDown, Download, BellRing, CheckCircle2, Filter, Loader2 } from "lucide-react"
import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import type { EquipmentStatus } from "@/type/equipmentType"

interface EquipmentDetailTableProps {
    data: EquipmentStatus[];
    sortBy: string;
    onSortChange: (value: string) => void;
    onRowClick: (id: string) => void;
    className?: string;
    isLoading?: boolean;
    appliedDate?: DateRange;
    selectedEquipmentIds?: string[];
}

export function EquipmentDetailTable({ 
    data = [], 
    sortBy, 
    onSortChange, 
    onRowClick,
    className,
    isLoading,
    appliedDate,
    selectedEquipmentIds = []
}: EquipmentDetailTableProps) {
    const periodText = formatPeriod(appliedDate);
    const selectedEquipmentText = selectedEquipmentIds.length > 0 ? selectedEquipmentIds.join(", ") : "ALL";

    const handleExportExcel = () => {
        exportEquipmentStatusExcel(data, {
            periodText,
            selectedEquipmentText,
            sortBy,
        });
    };

    return (
        <Card className={cn(
            "sticky top-22", 
            "h-[calc(100vh-7rem)]", 
            
            "flex flex-col gap-0 shadow-sm border-border mt-6 pt-0",
            className
        )}>
            <CardHeader className="flex-none py-3 px-4 border-b border-border flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                    장비 개별 수율 및 가동 상세
                    <Badge variant="secondary" className="font-normal text-[10px] ml-2">
                        총 {data.length}대
                    </Badge>
                </CardTitle>
                
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-muted/50 rounded-md p-1 border border-border">
                        <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
                        <Select value={sortBy} onValueChange={onSortChange}>
                            <SelectTrigger className="h-7 text-xs border-0 bg-transparent shadow-none focus:ring-0 w-35">
                                <SelectValue placeholder="정렬 기준" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="risk-desc" className="text-xs">위험도 높은 순</SelectItem>
                                <SelectItem value="yield-delta-asc" className="text-xs">수율 하락 큰 순</SelectItem>
                                <SelectItem value="yield-asc" className="text-xs">수율 낮은 순 (위험)</SelectItem>
                                <SelectItem value="yield-desc" className="text-xs">수율 높은 순</SelectItem>
                                <SelectItem value="uptime-asc" className="text-xs">가동률 낮은 순 (위험)</SelectItem>
                                <SelectItem value="uptime-desc" className="text-xs">가동률 높은 순</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5 ml-2"
                        onClick={handleExportExcel}
                        disabled={isLoading || data.length === 0}
                    >
                        <Download className="w-3.5 h-3.5" /> 엑셀 내보내기
                    </Button>
                </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-0 overflow-hidden">
                <div className="h-full relative [&>div]:h-full [&>div]:overflow-auto [&>div]:custom-scrollbar">
                    <Table>
                        <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm shadow-sm">
                            <TableRow className="hover:bg-transparent border-border/50">
                                <TableHead className="h-10 px-4 py-2 text-xs">우선순위</TableHead>
                                <TableHead className="h-10 py-2 text-xs">장비 ID (레시피)</TableHead>
                                <TableHead className="h-10 py-2 text-xs">상태 및 경보</TableHead>
                                <TableHead className="h-10 py-2 text-xs">가동률 (Uptime)</TableHead>
                                <TableHead className="h-10 py-2 text-xs text-center">최근 수율 추이</TableHead>
                                <TableHead className="h-10 py-2 text-xs text-right">수율 변화</TableHead>
                                <TableHead className="h-10 py-2 text-xs text-right">종합 수율</TableHead>
                                <TableHead className="h-10 py-2 text-xs pl-8">주요 불량 현상</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-80 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Loader2 className="w-6 h-6 mb-2 animate-spin text-primary/50" />
                                            <span className="text-xs">장비 리스트를 불러오는 중입니다...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : data.map(
                                (eq) => {
                                    const risk = getRiskMeta(eq);
                                    const yieldDelta = getYieldDelta(eq);

                                    return (
                                    <TableRow 
                                        key={eq.id} 
                                        onClick={() => onRowClick(eq.id)} 
                                        className="cursor-pointer hover:bg-muted/50 transition-colors border-border/50"
                                    >
                                        {/* 1. 우선순위 */}
                                        <TableCell className="px-4 py-2.5">
                                            <div className="flex flex-col gap-1">
                                                <Badge variant="outline" className={cn("w-fit gap-1 border text-[10px] font-bold", risk.className)}>
                                                    <span className={cn("size-1.5 rounded-full", risk.dotClassName)} />
                                                    {risk.label}
                                                </Badge>
                                                <span className="max-w-28 truncate text-[10px] text-muted-foreground" title={risk.reason}>
                                                    {risk.reason}
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* 2. 장비 ID & 레시피 */}
                                        <TableCell className="py-2.5 font-semibold text-foreground text-sm">
                                            <div className="flex flex-col gap-0.5">
                                                <span>{eq.id}</span>
                                                <Badge variant="secondary" className="w-fit text-[9px] px-1 py-0 h-3.5 font-normal bg-secondary/50">
                                                    {eq.recipe}
                                                </Badge>
                                            </div>
                                        </TableCell>

                                        {/* 2. 미조치 경보 유무 */}
                                        <TableCell className="py-2.5">
                                            {eq.unresolvedAlert ? (
                                                <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 gap-1 text-[10px] py-0 h-5">
                                                    <BellRing className="w-3 h-3 animate-pulse" />
                                                    미조치 경보
                                                    {eq.unresolvedAlertCount ? (
                                                        <span className="ml-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full border border-destructive/30 bg-destructive/20 px-1 text-[9px] leading-none font-black text-red-200">
                                                            {eq.unresolvedAlertCount}
                                                        </span>
                                                    ) : null}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1 text-[10px] py-0 h-5 font-normal">
                                                    <CheckCircle2 className="w-3 h-3" /> 정상
                                                </Badge>
                                            )}
                                        </TableCell>

                                        {/* 3. 가동률 */}
                                        <TableCell className="py-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${eq.uptime < 90 ? 'bg-destructive' : eq.uptime < 95 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                                        style={{ width: `${eq.uptime}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-[11px] font-bold ${eq.uptime < 90 ? 'text-destructive' : 'text-foreground'}`}>
                                                    {eq.uptime}%
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* 4. 미니 수율 추이 차트 */}
                                        <TableCell className="py-2.5">
                                            <div className="w-20 h-6 mx-auto">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={eq.yieldTrend.map(val => ({ value: val }))}>
                                                        <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                                                        <Line 
                                                            type="monotone" 
                                                            dataKey="value" 
                                                            stroke={eq.yield < 95 ? "#ef4444" : "#10b981"} 
                                                            strokeWidth={2} 
                                                            dot={false} 
                                                            isAnimationActive={false} 
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </TableCell>

                                        {/* 6. 수율 변화 */}
                                        <TableCell className="py-2.5 text-right">
                                            <span className={cn(
                                                "font-bold text-xs",
                                                yieldDelta < -0.3 ? "text-destructive" : yieldDelta > 0.3 ? "text-emerald-500" : "text-muted-foreground"
                                            )}>
                                                {yieldDelta > 0 ? "+" : ""}{yieldDelta.toFixed(1)}%p
                                            </span>
                                        </TableCell>

                                        {/* 7. 종합 수율 */}
                                        <TableCell className="py-2.5 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className={`font-bold text-sm ${eq.yield < 97 ? 'text-destructive' : 'text-emerald-500'}`}>
                                                    {eq.yield.toFixed(1)}%
                                                </span>
                                                
                                                <span className="text-[10px]">
                                                    <span className="text-destructive font-medium" title="Fail">F:{eq.fail}</span>
                                                    <span className="text-muted-foreground mx-0.5">/</span>
                                                    <span className="text-amber-500 font-medium" title="Marginal">M:{eq.marginal}</span>
                                                    <span className="text-muted-foreground ml-1">({(eq.total / 1000).toFixed(1)}k)</span>
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* 6. 주요 불량 현상 */}
                                        <TableCell className="py-2.5 text-[11px] text-muted-foreground pl-8">
                                            {eq.majorDefect !== "-" ? (
                                                <Badge variant="outline" className="border-border bg-muted/30 text-muted-foreground font-normal">
                                                    {eq.majorDefect}
                                                </Badge>
                                            ) : "-"}
                                        </TableCell>
                                    </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </div>
                
                {data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                        <Filter className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-sm">선택한 조건에 해당하는 장비가 없습니다.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function formatPeriod(date: DateRange | undefined) {
    if (!date?.from) return "전체 기간";
    if (date.to && date.to.getTime() !== date.from.getTime()) {
        return `${format(date.from, "yyyy-MM-dd")} ~ ${format(date.to, "yyyy-MM-dd")}`;
    }
    return format(date.from, "yyyy-MM-dd");
}

function getYieldDelta(eq: EquipmentStatus) {
    const firstTrend = eq.yieldTrend[0] ?? eq.yield;
    const lastTrend = eq.yieldTrend[eq.yieldTrend.length - 1] ?? eq.yield;
    return lastTrend - firstTrend;
}

function getRiskGrade(eq: EquipmentStatus) {
    const failRate = eq.total > 0 ? (eq.fail / eq.total) * 100 : 0;

    if (eq.unresolvedAlert || eq.uptime < 90 || eq.yield < 97) {
        return "Critical";
    }

    if (eq.uptime < 95 || eq.yield < 98 || failRate >= 2) {
        return "Warning";
    }

    return "Stable";
}

function getRiskMeta(eq: EquipmentStatus) {
    const grade = getRiskGrade(eq);
    const failRate = eq.total > 0 ? (eq.fail / eq.total) * 100 : 0;
    const yieldDelta = getYieldDelta(eq);

    if (grade === "Critical") {
        return {
            label: "Critical",
            reason: eq.unresolvedAlert
                ? "미조치 경보"
                : eq.uptime < 90
                    ? "가동률 90% 미만"
                    : eq.yield < 97
                        ? "수율 97% 미만"
                        : "즉시 확인 필요",
            className: "border-destructive/30 bg-destructive/10 text-destructive",
            dotClassName: "bg-destructive",
        };
    }

    if (grade === "Warning") {
        return {
            label: "Warning",
            reason: eq.uptime < 95
                ? "가동률 95% 미만"
                : eq.yield < 98
                    ? "수율 98% 미만"
                    : failRate >= 2
                        ? "Fail 2% 이상"
                        : yieldDelta < -0.3
                            ? "수율 하락"
                            : "주의 관찰",
            className: "border-amber-500/30 bg-amber-500/10 text-amber-600",
            dotClassName: "bg-amber-500",
        };
    }

    return {
        label: "Stable",
        reason: "정상 범위",
        className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
        dotClassName: "bg-emerald-500",
    };
}

function getRecommendedAction(eq: EquipmentStatus) {
    if (eq.unresolvedAlert) return "미조치 경보 우선 확인 및 조치 이력 등록";
    if (eq.uptime < 90) return "비가동 원인 분석, 점검 일정 우선 배정";
    if (eq.yield < 97) return "주요 불량 유형 기준 공정 조건 및 검사 파라미터 점검";
    if (eq.uptime < 95) return "가동률 저하 구간 확인 및 예방 정비 검토";
    if (eq.majorDefect !== "-") return "주요 불량 추이 모니터링 및 재발 방지 항목 등록";
    return "정상 범위 유지, 정기 모니터링";
}

function escapeHtml(value: unknown) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function numberCell(value: number, decimals = 0) {
    return Number.isFinite(value) ? Number(value.toFixed(decimals)) : "-";
}

function exportEquipmentStatusExcel(
    rows: EquipmentStatus[],
    meta: {
        periodText: string;
        selectedEquipmentText: string;
        sortBy: string;
    }
) {
    const generatedAt = format(new Date(), "yyyy-MM-dd HH:mm");
    const totalProduction = rows.reduce((sum, eq) => sum + eq.total, 0);
    const totalFail = rows.reduce((sum, eq) => sum + eq.fail, 0);
    const totalMarginal = rows.reduce((sum, eq) => sum + eq.marginal, 0);
    const weightedYield = totalProduction > 0
        ? rows.reduce((sum, eq) => sum + eq.yield * eq.total, 0) / totalProduction
        : 0;
    const avgUptime = rows.length > 0
        ? rows.reduce((sum, eq) => sum + eq.uptime, 0) / rows.length
        : 0;
    const criticalCount = rows.filter((eq) => getRiskGrade(eq) === "Critical").length;
    const warningCount = rows.filter((eq) => getRiskGrade(eq) === "Warning").length;
    const alertCount = rows.filter((eq) => eq.unresolvedAlert).length;

    const summaryRows = [
        ["조회 기간", meta.periodText],
        ["대상 설비", meta.selectedEquipmentText],
        ["정렬 기준", meta.sortBy],
        ["생성 일시", `${generatedAt} KST`],
        ["설비 수", rows.length],
        ["총 생산수", totalProduction],
        ["Fail 합계", totalFail],
        ["Marginal 합계", totalMarginal],
        ["가중 평균 수율(%)", numberCell(weightedYield, 2)],
        ["평균 가동률(%)", numberCell(avgUptime, 2)],
        ["미조치 경보 설비", alertCount],
        ["Critical 설비", criticalCount],
        ["Warning 설비", warningCount],
    ];

    const detailHeader = [
        "Risk",
        "설비 ID",
        "Recipe",
        "가동률(%)",
        "종합 수율(%)",
        "총 생산수",
        "Fail",
        "Fail Rate(%)",
        "Marginal",
        "Marginal Rate(%)",
        "양품 추정",
        "미조치 경보",
        "주요 불량",
        "최근 수율 시작(%)",
        "최근 수율 마지막(%)",
        "수율 변화(%p)",
        "최근 수율 추세",
        "권장 조치",
    ];

    const detailRows = rows.map((eq) => {
        const firstTrend = eq.yieldTrend[0] ?? eq.yield;
        const lastTrend = eq.yieldTrend[eq.yieldTrend.length - 1] ?? eq.yield;
        const trendDelta = lastTrend - firstTrend;
        const failRate = eq.total > 0 ? (eq.fail / eq.total) * 100 : 0;
        const marginalRate = eq.total > 0 ? (eq.marginal / eq.total) * 100 : 0;
        const goodCount = Math.max(eq.total - eq.fail - eq.marginal, 0);
        const trendText = trendDelta < -0.3 ? "하락" : trendDelta > 0.3 ? "상승" : "유지";

        return [
            getRiskGrade(eq),
            eq.id,
            eq.recipe,
            numberCell(eq.uptime, 1),
            numberCell(eq.yield, 1),
            eq.total,
            eq.fail,
            numberCell(failRate, 2),
            eq.marginal,
            numberCell(marginalRate, 2),
            goodCount,
            eq.unresolvedAlert ? "Y" : "N",
            eq.majorDefect,
            numberCell(firstTrend, 1),
            numberCell(lastTrend, 1),
            numberCell(trendDelta, 2),
            trendText,
            getRecommendedAction(eq),
        ];
    });

    const html = `
        <html>
            <head>
                <meta charset="UTF-8" />
                <style>
                    table { border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11pt; }
                    th { background: #27272a; color: #fff; font-weight: 700; }
                    th, td { border: 1px solid #d4d4d8; padding: 6px 8px; }
                    .title { font-size: 16pt; font-weight: 700; background: #f4f4f5; }
                    .section { font-weight: 700; background: #e4e4e7; }
                    .number { mso-number-format: "0.00"; }
                    .integer { mso-number-format: "0"; }
                    .critical { background: #fee2e2; color: #991b1b; font-weight: 700; }
                    .warning { background: #fef3c7; color: #92400e; font-weight: 700; }
                    .stable { background: #dcfce7; color: #166534; font-weight: 700; }
                </style>
            </head>
            <body>
                <table>
                    <tr><td class="title" colspan="18">설비별 수율 및 가동 현황</td></tr>
                    <tr><td class="section" colspan="18">조회 조건 및 요약</td></tr>
                    ${summaryRows.map(([label, value]) => `
                        <tr>
                            <td colspan="3">${escapeHtml(label)}</td>
                            <td colspan="15">${escapeHtml(value)}</td>
                        </tr>
                    `).join("")}
                    <tr><td colspan="18"></td></tr>
                    <tr>${detailHeader.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
                    ${detailRows.map((row) => {
                        const riskClass = row[0] === "Critical" ? "critical" : row[0] === "Warning" ? "warning" : "stable";
                        const decimalColumnIndexes = new Set([3, 4, 7, 9, 13, 14, 15]);
                        return `
                            <tr>
                                ${row.map((cell, index) => {
                                    const className = index === 0
                                        ? riskClass
                                        : typeof cell === "number"
                                            ? decimalColumnIndexes.has(index) ? "number" : "integer"
                                            : "";
                                    return `<td class="${className}">${escapeHtml(cell)}</td>`;
                                }).join("")}
                            </tr>
                        `;
                    }).join("")}
                </table>
            </body>
        </html>
    `;

    const blob = new Blob(["\ufeff", html], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `equipment-status-${format(new Date(), "yyyyMMdd-HHmm")}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
