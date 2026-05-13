import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface DefectStat {
    code: string;
    name: string;
    type: string;
    count: number;
    ratio: string;
    impact: string;
}

interface DefectCodeTableProps {
    data: DefectStat[];
    className?: string;
}

export function DefectCodeTable({ data, className }: DefectCodeTableProps) {
    return (
        <Card className={cn("flex flex-col gap-0 shadow-sm border-border min-w-0", className)}>
            <CardHeader className="py-3 px-4 border-b border-border">
                <CardTitle className="text-sm font-bold">주요 불량 코드 분석</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="h-9 px-4 py-2 text-xs">코드명</TableHead>
                            <TableHead className="h-9 py-2 text-xs">구분</TableHead>
                            <TableHead className="h-9 py-2 text-xs text-right">발생 (비율)</TableHead>
                            <TableHead className="h-9 py-2 text-xs pl-6">문제 현상 요약</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((defect) => (
                            <TableRow key={defect.code} className="border-border/50">
                                <TableCell className="px-4 py-2 font-medium">
                                    <div className="flex flex-col">
                                        <span className="text-sm">{defect.code}</span>
                                        <span className="text-[10px] text-muted-foreground">{defect.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-2">
                                    <Badge variant="outline" className={`text-[9px] font-normal px-1.5 py-0 h-4 ${defect.type === '공통 불량' ? 'border-amber-500/50 text-amber-500' : 'border-blue-500/50 text-blue-500'}`}>
                                        {defect.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-2 text-right font-bold text-sm">
                                    {defect.count} <span className="text-[10px] text-muted-foreground font-normal">({defect.ratio})</span>
                                </TableCell>
                                <TableCell className="py-2 text-[11px] text-muted-foreground pl-6">
                                    {defect.impact}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}