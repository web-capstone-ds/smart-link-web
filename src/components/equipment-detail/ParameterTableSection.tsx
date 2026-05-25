import { Settings2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { EquipmentParameter, EquipmentSummary } from "@/type/equipmentDetailType";

interface ParameterTableSectionProps {
    summaryData: EquipmentSummary;
    isLoading: boolean;
}

export function ParameterTableSection({ summaryData, isLoading }: ParameterTableSectionProps) {
    return (
        <div>
            <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-muted-foreground" /> 주요 파라미터 측정 결과
                </h3>
                <span className="text-xs text-muted-foreground">단위: μm (Z-Score &gt; 3.0 경보)</span>
            </div>

            {isLoading ? (
                <ParameterSkeleton />
            ) : (
                <Card className="border-border shadow-sm overflow-hidden animate-in fade-in duration-500">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="border-border/50 hover:bg-transparent">
                                <TableHead className="h-9 py-2 text-xs font-semibold">파라미터명</TableHead>
                                <TableHead className="h-9 py-2 text-xs font-semibold text-right">평균값(Avg)</TableHead>
                                <TableHead className="h-9 py-2 text-xs font-semibold text-right">최대치(Max)</TableHead>
                                <TableHead className="h-9 py-2 text-xs font-semibold text-right">관리 상한(USL)</TableHead>
                                <TableHead className="h-9 py-2 text-xs font-semibold text-right">Z-Score</TableHead>
                                <TableHead className="h-9 py-2 text-xs font-semibold pl-6">판정</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!summaryData.parameters || summaryData.parameters.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground text-xs">
                                        측정된 파라미터 데이터가 없습니다.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                summaryData.parameters.map((param, index) => (
                                    <ParameterRow key={`${param.name}-${index}`} param={param} />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
}

function ParameterSkeleton() {
    return (
        <Card className="border-border shadow-sm overflow-hidden animate-pulse bg-muted/5">
            <div className="h-9 bg-muted/20 border-b border-border/50 flex items-center px-4 justify-between">
                <div className="h-3 w-16 bg-muted/30 rounded" />
                <div className="flex gap-16 pr-8">
                    {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="h-3 w-12 bg-muted/30 rounded" />
                    ))}
                </div>
            </div>
            {[1, 2, 3].map((index) => (
                <div key={`table-row-skeleton-${index}`} className="h-10 border-b border-border/50 flex items-center px-4 justify-between last:border-none">
                    <div className="h-3 w-28 bg-muted/20 rounded" />
                    <div className="flex gap-16 pr-8">
                        {[0, 1, 2, 3].map((cellIndex) => (
                            <div key={cellIndex} className="h-3 w-12 bg-muted/10 rounded" />
                        ))}
                    </div>
                </div>
            ))}
        </Card>
    );
}

function ParameterRow({ param }: { param: EquipmentParameter }) {
    const isWarn = param.zScore >= 2.5 && param.zScore < 3.0;
    const rowBg = param.isError ? "bg-destructive/5" : isWarn ? "bg-amber-500/5" : "";

    return (
        <TableRow className={cn("border-border/50 transition-colors", rowBg)}>
            <TableCell className="py-2.5 font-medium text-xs">{param.name}</TableCell>
            <TableCell className="py-2.5 text-right text-xs">{param.avg}</TableCell>
            <TableCell className={cn("py-2.5 text-right font-medium text-xs", param.isError && "font-bold text-destructive")}>
                {param.max}
            </TableCell>
            <TableCell className="py-2.5 text-right text-xs text-muted-foreground">{param.usl}</TableCell>
            <TableCell className={cn("py-2.5 text-right text-xs", param.isError && "font-bold text-destructive", isWarn && "text-amber-500 font-semibold")}>
                {param.zScore}
            </TableCell>
            <TableCell className="py-2.5 pl-6">
                {param.isError ? (
                    <Badge variant="destructive" className="bg-destructive text-destructive-foreground text-[10px] h-4 py-0">
                        초과 (Error)
                    </Badge>
                ) : isWarn ? (
                    <Badge variant="outline" className="text-amber-500 border-amber-500/30 bg-amber-500/10 text-[10px] h-4 py-0 font-normal">
                        근접 (Warn)
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 text-[10px] h-4 py-0 font-normal">
                        정상 (OK)
                    </Badge>
                )}
            </TableCell>
        </TableRow>
    );
}
